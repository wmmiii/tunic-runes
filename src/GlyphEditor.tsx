import { useEffect, useRef, useState } from 'react';
import { encodedLine, Glyph, hitTarget, Point } from './glyph';
import { drawTemplate, highlightTarget, strokeGlyph } from './glyph-renderer';
import styles from './GlyphEditor.module.css';

interface GlyphEditorProps {
  className: string;
}

export function GlyphEditor({ className }: GlyphEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [glyph, setGlyph] = useState<Glyph>(0);
  const [highlightedTarget, setHighlightedTarget] = useState<Point | null>(null);
  const [lastTarget, setLastTarget] = useState<Point | null>(null);
  const [mouseDown, setMouseDown] = useState(false);

  const scale = 0.5;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    ctx.reset();
    ctx.setTransform(scale, 0, 0, scale, 64, 64);
    ctx.clearRect(0, 0, 256, 512);
    drawTemplate(ctx);

    ctx.lineWidth = 24;
    ctx.strokeStyle = '#333';
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

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - 64) / scale;
    const y = (e.clientY - rect.top - 64) / scale;

    const target = hitTarget(x, y);
    setHighlightedTarget(target);

    if (lastTarget != null && target != null && lastTarget !== target) {
      setGlyph(prev => prev ^ encodedLine(target, lastTarget));
    }
    if (mouseDown && target != null) {
      setLastTarget(target);
    }
  };

  const handleMouseDown = () => {
    setMouseDown(true);
  };

  const handleMouseUp = () => {
    setMouseDown(false);
    setLastTarget(null);
  };

  return (
    <canvas
      ref={canvasRef}
      className={`${styles.canvas} ${className}`}
      width={256}
      height={512}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    />
  );
}
