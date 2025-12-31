import { useRef } from 'react';
import { SPACE, Glyph, GLYPH_HEIGHT, GLYPH_WIDTH } from './glyph';
import { GlyphGroup } from './GlyphGroup';
import styles from './GlyphSequence.module.css';
import { useCssStyle } from './browserUtils';

interface GlyphSequenceProps {
  children: Glyph[];
  previewGlyph?: Glyph;
}

export function GlyphSequence({ children, previewGlyph }: GlyphSequenceProps) {
  let sequenceRef = useRef<HTMLDivElement>(null);
  const {glyphHeight, strokeWidth} = useCssStyle(sequenceRef);

  // Split glyphs into groups separated by spaces
  const glyphGroups: Glyph[][] = [];
  let currentGroup: Glyph[] = [];

  for (const glyph of children) {
    if (glyph === SPACE) {
      if (currentGroup.length > 0) {
        glyphGroups.push(currentGroup);
        currentGroup = [];
      }
    } else {
      currentGroup.push(glyph);
    }
  }

  // Add the last group if it has glyphs
  if (currentGroup.length > 0) {
    glyphGroups.push(currentGroup);
  }

  const spaceWidth = ((glyphHeight / GLYPH_HEIGHT) * GLYPH_WIDTH) / 2;

  return (
    <div ref={sequenceRef} className={styles.container} style={{gap: spaceWidth}}>
      {glyphGroups.map((group, index) => (
        <GlyphGroup key={index}>
          {group}
        </GlyphGroup>
      ))}
      {previewGlyph != null && (
        <GlyphGroup
          style={{
            color: 'var(--color-glyph-preview)',
            marginLeft: currentGroup.length > 0 ? -(spaceWidth + strokeWidth) : 0,
          }}>
            {[previewGlyph]}
        </GlyphGroup>
      )}
    </div>
  );
}
