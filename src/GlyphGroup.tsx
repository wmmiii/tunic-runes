import { useMemo, useRef } from 'react';
import { Glyph, GLYPH_HEIGHT, GLYPH_WIDTH } from './glyph';
import { glyphToPathSegments, pathSegmentsToString } from './glyph-renderer';
import styles from './GlyphGroup.module.css';
import { useCssStyle } from './browserUtils';

interface GlyphGroupProps {
  children: Glyph[];
  style?: React.CSSProperties;
}

export function GlyphGroup({ style, children: glyphs }: GlyphGroupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { glyphHeight, strokeWidth } = useCssStyle(containerRef);

  const glyphScale = glyphHeight / GLYPH_HEIGHT;

  // Generate SVG combining all glyphs into a single path
  const svgContent = useMemo(() => {
    // Add a small gap between glyphs to prevent stroke overlap
    // The gap needs to be at least the stroke width to avoid overlap
    const glyphSpacing = GLYPH_WIDTH + strokeWidth / glyphScale;

    // Collect all path segments from all glyphs with proper offsets
    const allPathData = glyphs.map((glyph, index) => {
      const x = index * glyphSpacing;
      const segments = glyphToPathSegments(glyph);
      return pathSegmentsToString(segments, x, 0);
    });

    // Combine all paths into a single path data string
    const combinedPathData = allPathData.join(' ');

    // Calculate dimensions
    const padding = strokeWidth / 2;

    // Pixel dimensions for the SVG element
    const totalWidth =
      (glyphs.length * glyphSpacing - strokeWidth / glyphScale) * glyphScale + strokeWidth;
    const totalHeight = glyphHeight + strokeWidth;

    // ViewBox in unscaled glyph coordinates
    const viewBoxX = -padding / glyphScale;
    const viewBoxY = -padding / glyphScale;
    const viewBoxWidth =
      glyphs.length * glyphSpacing - strokeWidth / glyphScale + strokeWidth / glyphScale;
    const viewBoxHeight = GLYPH_HEIGHT + strokeWidth / glyphScale;

    return `<svg xmlns="http://www.w3.org/2000/svg" class="${styles.group}" width="${totalWidth}" height="${totalHeight}" viewBox="${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}">
  <g stroke="currentColor" stroke-width="${strokeWidth / glyphScale}" stroke-linecap="round" fill="none">
    <path d="${combinedPathData}" />
  </g>
</svg>`;
  }, [glyphs, glyphScale, strokeWidth, glyphHeight]);

  return <div ref={containerRef} dangerouslySetInnerHTML={{ __html: svgContent }} style={style} />;
}
