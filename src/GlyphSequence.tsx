import { useEffect, useRef } from 'react';
import { Glyph, SPACE } from './glyph';
import { strokeGlyph } from './glyph-renderer';
import { colors, lineWidth } from './theme';
import styles from './GlyphSequence.module.css';

interface GlyphSequenceProps {
  glyphs: Glyph[];
  previewGlyph: Glyph;
  scale: number;
  width: number;
  height: number;
}

export function GlyphSequence({ glyphs, scale, width, height, previewGlyph }: GlyphSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    const renderGlyph = (glyph: Glyph) => {
      ctx.save();

      // Position: left justified, vertically centered
      const x = xOffset + scaledGlyphWidth / 2;
      const y = height / 2;

      ctx.translate(x, y);
      ctx.scale(scale, scale);
      ctx.translate(-128, -128);

      ctx.beginPath();
      strokeGlyph(ctx, glyph);
      ctx.stroke();
      ctx.closePath();

      ctx.restore();
    };

    ctx.reset();
    ctx.clearRect(0, 0, width, height);

    const scaledGlyphWidth = 256 * scale;

    // Set line properties for the glyphs
    ctx.strokeStyle = colors.glyphSequence;
    ctx.lineWidth = lineWidth.glyphSequence;
    ctx.lineCap = 'round';

    // Render glyphs from left to right, left justified
    let xOffset = scaledGlyphWidth;
    for (let i = 0; i < glyphs.length; i++) {
      // Handle space character - skip rendering but advance offset
      if (glyphs[i] === SPACE) {
        xOffset += scaledGlyphWidth * 0.5; // Space is half the width of a regular glyph
        continue;
      }

      renderGlyph(glyphs[i]);

      xOffset += scaledGlyphWidth;
    }

    ctx.strokeStyle = colors.glyphPreview;
    renderGlyph(previewGlyph);

  }, [glyphs, previewGlyph, scale, width, height]);

  return (
    <canvas
      ref={canvasRef}
      className={styles.canvas}
      width={width}
      height={height}
      style={{ width: `${width}px`, height: `${height}px` }}
    />
  );
}
