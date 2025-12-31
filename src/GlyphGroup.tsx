import { useEffect, useRef } from 'react';
import { Glyph, GLYPH_HEIGHT } from './glyph';
import { strokeGlyph } from './glyph-renderer';
import styles from './GlyphGroup.module.css';
import { useCssStyle } from './browserUtils';

interface GlyphGroupProps {
  children: Glyph[];
  style?: React.CSSProperties;
}

export function GlyphGroup({ style, children: glyphs }: GlyphGroupProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {glyphHeight, strokeWidth, color} = useCssStyle(canvasRef);

  const glyphScale = glyphHeight / GLYPH_HEIGHT;

  const glyphWidth = 256 * glyphScale;
  const width = glyphs.length * glyphWidth + strokeWidth;
  const height = glyphHeight + strokeWidth;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    ctx.reset();
    ctx.clearRect(0, 0, width, height);

    // Set line properties for the glyphs
    ctx.strokeStyle = color;
    ctx.lineWidth = strokeWidth / glyphScale;
    ctx.lineCap = 'round';

    // Render glyphs from left to right, left justified
    for (let i = 0; i < glyphs.length; i++) {
      ctx.save();

      const x = i * glyphWidth + strokeWidth / 2;
      const y = strokeWidth / 2;

      ctx.translate(x, y);
      ctx.scale(glyphScale, glyphScale);

      ctx.beginPath();
      strokeGlyph(ctx, glyphs[i]);
      ctx.stroke();
      ctx.closePath();

      ctx.restore();
    }

  }, [glyphs, glyphScale, height, width, glyphWidth]);

  return (
    <canvas
      className={styles.group}
      ref={canvasRef}
      width={width}
      height={height}
      style={Object.assign({ width: `${width}px`, height: `${height}px` }, style)}
    />
  );
}
