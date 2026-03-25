import { useState, useRef, useEffect } from 'react';
import { Glyph, isValidGlyphGroup } from './glyph';
import { GlyphGroup } from './GlyphGroup';
import {
  GlyphDictionary,
  compareGlyphGroupKeys,
  keyToGlyphGroup,
  isSubgroupMatch,
} from './dictionary';
import { SpoilerLevel } from './spoilers';
import styles from './DictionarySidebar.module.css';

interface DictionaryProps {
  dictionary: GlyphDictionary;
  sequenceGroups: Glyph[][];
  spoilerLevel: SpoilerLevel;
  onUpdateTranslation: (key: string, translations: string[]) => void;
  onDeleteEntry: (key: string) => void;
}

type SortMode = 'glyph' | 'guess';

function compareByGuess(dictionary: GlyphDictionary) {
  return (a: string, b: string): number => {
    const aText = (dictionary[a]?.[0] ?? '').toLowerCase();
    const bText = (dictionary[b]?.[0] ?? '').toLowerCase();
    if (aText === bText) return compareGlyphGroupKeys(a, b);
    // Empty translations sort last
    if (aText === '' && bText !== '') return 1;
    if (aText !== '' && bText === '') return -1;
    return aText.localeCompare(bText);
  };
}

export function Dictionary({
  dictionary,
  sequenceGroups,
  spoilerLevel,
  onUpdateTranslation,
  onDeleteEntry,
}: DictionaryProps) {
  const canSortByGlyph = spoilerLevel >= SpoilerLevel.PAGE_54;
  const [sortMode, setSortMode] = useState<SortMode>('glyph');

  // When glyph sorting is not available, force guess sort
  const effectiveSortMode = canSortByGlyph ? sortMode : 'guess';

  const sortedKeys = Object.keys(dictionary).sort(
    effectiveSortMode === 'glyph' ? compareGlyphGroupKeys : compareByGuess(dictionary)
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Dictionary</h2>
        {canSortByGlyph && sortedKeys.length > 0 && (
          <button
            className={styles.sortToggle}
            onClick={() => setSortMode((m) => (m === 'glyph' ? 'guess' : 'glyph'))}
            title={`Sorted by ${sortMode}`}
          >
            {sortMode === 'glyph' ? 'A\u2193 glyph' : 'A\u2193 guess'}
          </button>
        )}
      </div>
      {sortedKeys.length === 0 ? (
        <p className={styles.empty}>
          Click the &ldquo;...&rdquo; label beneath a glyph group to add a translation.
        </p>
      ) : (
        <div className={styles.entries}>
          {sortedKeys.map((key) => (
            <DictionaryEntry
              key={key}
              dictKey={key}
              glyphs={keyToGlyphGroup(key)}
              translations={dictionary[key]}
              inSequence={isSubgroupMatch(key, sequenceGroups)}
              showValidation={spoilerLevel >= SpoilerLevel.PAGE_54}
              onUpdateTranslations={(t) => onUpdateTranslation(key, t)}
              onDelete={() => onDeleteEntry(key)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface DictionaryEntryProps {
  dictKey: string;
  glyphs: Glyph[];
  translations: string[];
  inSequence: boolean;
  showValidation: boolean;
  onUpdateTranslations: (translations: string[]) => void;
  onDelete: () => void;
}

function DictionaryEntry({
  glyphs,
  translations,
  inSequence,
  showValidation,
  onUpdateTranslations,
  onDelete,
}: DictionaryEntryProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

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

  const displayText = translations.length > 0 ? translations.join(', ') : '(no translation)';

  return (
    <div className={`${styles.entry} ${inSequence ? styles.entryActive : ''}`}>
      <div className={styles.entryGlyph}>
        <GlyphGroup>{glyphs}</GlyphGroup>
      </div>
      <div className={styles.entryContent}>
        {showValidation && !isValidGlyphGroup(glyphs) && (
          <span className={styles.badgeWarning}>invalid glyph</span>
        )}
        {inSequence && <span className={styles.badge}>in sequence</span>}
        {editing ? (
          <input
            ref={inputRef}
            className={styles.entryInput}
            type="text"
            value={draft}
            placeholder="Translation..."
            onChange={(e) => setDraft(e.target.value)}
            onBlur={handleCommit}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <span
            className={`${styles.entryText} ${translations.length === 0 ? styles.entryTextEmpty : ''}`}
            onClick={handleStartEdit}
            title="Click to edit"
          >
            {displayText}
          </span>
        )}
      </div>
      <button
        className={styles.deleteButton}
        onClick={onDelete}
        title="Remove entry"
        aria-label="Remove dictionary entry"
      >
        &times;
      </button>
    </div>
  );
}
