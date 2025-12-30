import { useEffect, useRef, useState } from 'react';
import { encodedLine, Glyph, hitTarget, Point, DOT } from './glyph';
import { drawTemplate, highlightTarget, strokeGlyph } from './glyph-renderer';
import { colors, lineWidth } from './theme';
import styles from './GlyphEditor.module.css';

interface GlyphEditorProps {
  glyph: Glyph;
  setGlyph: (compute: (glyph: Glyph) => Glyph) => void;
}

const CANVAS_WIDTH = 256;
const CANVAS_HEIGHT = 360;

export function GlyphEditor({ glyph, setGlyph }: GlyphEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [highlightedTarget, setHighlightedTarget] = useState<Point | null>(null);
  const [lastTarget, setLastTarget] = useState<Point | null>(null);
  const [mouseDown, setMouseDown] = useState(false);

  const scale = 0.5;

  const getCanvasCoordinates = (clientX: number, clientY: number): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const x = (clientX - rect.left - 64) / scale;
    const y = (clientY - rect.top - 64) / scale;

    return { x, y };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    ctx.reset();
    ctx.setTransform(scale, 0, 0, scale, 64, 64);
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawTemplate(ctx);

    ctx.lineWidth = lineWidth.glyphEditor;
    ctx.strokeStyle = colors.glyphActive;
    ctx.beginPath();
    strokeGlyph(ctx, glyph);
    ctx.stroke();
    ctx.closePath();

    if (highlightedTarget) {
      highlightTarget(ctx, highlightedTarget);
    }
    if (lastTarget) {
      highlightTarget(ctx, lastTarget);
    }
  }, [glyph, highlightedTarget, lastTarget]);

  const handleMove = (clientX: number, clientY: number) => {
    const coords = getCanvasCoordinates(clientX, clientY);
    if (!coords) return;

    const target = hitTarget(coords.x, coords.y);
    setHighlightedTarget(target);

    if (lastTarget != null && target != null && lastTarget !== target) {
      setGlyph(prev => prev ^ encodedLine(target, lastTarget));
    }
    if (mouseDown && target != null) {
      setLastTarget(target);
    }
  };

  const handleStart = (clientX: number, clientY: number) => {
    const coords = getCanvasCoordinates(clientX, clientY);
    if (!coords) return;

    const target = hitTarget(coords.x, coords.y);

    // Handle DOT target
    if (target === DOT) {
      setGlyph(prev => prev ^ (2 ** 5));
    }

    setMouseDown(true);
  };

  const handleEnd = () => {
    setMouseDown(false);
    setLastTarget(null);
    setHighlightedTarget(null);
  };

  return (
    <canvas
      ref={canvasRef}
      className={styles.canvas}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      style={{ width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px` }}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onMouseUp={handleEnd}
      onTouchMove={(e) => {
        e.preventDefault();
        const touch = e.touches[0];
        if (touch) handleMove(touch.clientX, touch.clientY);
      }}
      onTouchStart={(e) => {
        e.preventDefault();
        const touch = e.touches[0];
        if (touch) handleStart(touch.clientX, touch.clientY);
      }}
      onTouchEnd={(e) => {
        e.preventDefault();
        handleEnd();
      }}
    />
  );
}
