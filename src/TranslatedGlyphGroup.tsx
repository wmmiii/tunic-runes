import { useState, useRef, useEffect } from 'react';
import { Glyph } from './glyph';
import { GlyphGroup } from './GlyphGroup';
import styles from './TranslatedGlyphGroup.module.css';

interface TranslatedGlyphGroupProps {
  glyphs: Glyph[];
  translations: string[];
  onUpdateTranslations: (translations: string[]) => void;
  style?: React.CSSProperties;
}

export function TranslatedGlyphGroup({
  glyphs,
  translations,
  onUpdateTranslations,
  style,
}: TranslatedGlyphGroupProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const displayText = translations.length > 0 ? translations.join(', ') : undefined;

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleStartEdit = () => {
    setDraft(translations.join(', '));
    setEditing(true);
  };

  const handleCommit = () => {
    setEditing(false);
    const trimmed = draft.trim();
    if (trimmed === '') {
      onUpdateTranslations([]);
    } else {
      onUpdateTranslations([trimmed]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommit();
    } else if (e.key === 'Escape') {
      setEditing(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <GlyphGroup style={style}>{glyphs}</GlyphGroup>
      {editing ? (
        <input
          ref={inputRef}
          className={styles.translationInput}
          type="text"
          value={draft}
          placeholder="Translation..."
          onChange={(e) => setDraft(e.target.value)}
          onBlur={handleCommit}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <button
          className={styles.translationLabel}
          onClick={handleStartEdit}
          title="Click to edit translation"
        >
          {displayText ?? '...'}
        </button>
      )}
    </div>
  );
}
