import { useRef } from 'react';
import { SPACE, Glyph, GLYPH_HEIGHT, GLYPH_WIDTH } from './glyph';
import { GlyphGroup } from './GlyphGroup';
import { TranslatedGlyphGroup } from './TranslatedGlyphGroup';
import { GlyphDictionary, glyphGroupKey } from './dictionary';
import styles from './GlyphSequence.module.css';
import { useCssStyle } from './browserUtils';

interface GlyphSequenceProps {
  children: Glyph[];
  previewGlyph?: Glyph;
  dictionary?: GlyphDictionary;
  onUpdateTranslation?: (key: string, translations: string[]) => void;
}

export function GlyphSequence({
  children,
  previewGlyph,
  dictionary,
  onUpdateTranslation,
}: GlyphSequenceProps) {
  let sequenceRef = useRef<HTMLDivElement>(null);
  const { glyphHeight, strokeWidth } = useCssStyle(sequenceRef);

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
    <div ref={sequenceRef} className={styles.container} style={{ gap: spaceWidth }}>
      {glyphGroups.map((group, index) => {
        const key = glyphGroupKey(group);
        const translations = dictionary?.[key] ?? [];

        if (dictionary && onUpdateTranslation) {
          return (
            <TranslatedGlyphGroup
              key={index}
              glyphs={group}
              translations={translations}
              onUpdateTranslations={(t) => onUpdateTranslation(key, t)}
            />
          );
        }

        return <GlyphGroup key={index}>{group}</GlyphGroup>;
      })}
      {previewGlyph != null && (
        <GlyphGroup
          style={{
            color: 'var(--color-glyph-preview)',
            marginLeft: currentGroup.length > 0 ? -(spaceWidth + strokeWidth) : 0,
          }}
        >
          {[previewGlyph]}
        </GlyphGroup>
      )}
    </div>
  );
}
