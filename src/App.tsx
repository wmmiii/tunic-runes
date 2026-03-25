import { useCallback, useEffect, useRef, useState } from 'react';
import { GlyphEditor } from './GlyphEditor';
import { Glyph, SPACE } from './glyph';
import { GlyphDictionary, glyphGroupKey, loadDictionary, saveDictionary } from './dictionary';
import { SpoilerLevel } from './spoilers';
import styles from './App.module.css';
import { GlyphSequence } from './GlyphSequence';
import { Dictionary } from './DictionarySidebar';

const STORAGE_KEY = 'tunic-runes-sequence';
const SPOILER_STORAGE_KEY = 'tunic-runes-spoiler-level';

function App() {
  const sequenceContainerRef = useRef<HTMLDivElement>(null);
  const [sequenceWidth, setSequenceWidth] = useState(0);
  const [currentGlyph, setCurrentGlyph] = useState<Glyph>(0);
  const [glyphSequence, setGlyphSequence] = useState<Glyph[]>(() => {
    // Load sequence from localStorage on initial load
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.error('Failed to load sequence from localStorage:', error);
    }
    return [];
  });

  const [dictionary, setDictionary] = useState<GlyphDictionary>(loadDictionary);

  const [spoilerLevel, setSpoilerLevel] = useState<SpoilerLevel>(() => {
    try {
      const stored = localStorage.getItem(SPOILER_STORAGE_KEY);
      if (stored != null) {
        const parsed = Number(stored);
        if (parsed in SpoilerLevel) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return SpoilerLevel.NONE;
  });

  // Save sequence to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(glyphSequence));
    } catch (error) {
      console.error('Failed to save sequence to localStorage:', error);
    }
  }, [glyphSequence]);

  // Save spoiler level to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(SPOILER_STORAGE_KEY, String(spoilerLevel));
    } catch {
      // No-op
    }
  }, [spoilerLevel]);

  // Save dictionary to localStorage whenever it changes
  useEffect(() => {
    saveDictionary(dictionary);
  }, [dictionary]);

  useEffect(() => {
    const updateWidth = () => {
      if (sequenceContainerRef.current) {
        setSequenceWidth(sequenceContainerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleAddGlyph = () => {
    setGlyphSequence((prev) => [...prev, currentGlyph]);
    setCurrentGlyph(0);
  };

  // Extract sequence groups for the sidebar's "in sequence" matching
  const sequenceGroups: Glyph[][] = [];
  {
    let group: Glyph[] = [];
    for (const g of glyphSequence) {
      if (g === SPACE) {
        if (group.length > 0) {
          sequenceGroups.push(group);
          group = [];
        }
      } else {
        group.push(g);
      }
    }
    if (group.length > 0) {
      sequenceGroups.push(group);
    }
  }

  const handleUpdateTranslation = useCallback((key: string, translations: string[]) => {
    setDictionary((prev) => {
      const next = { ...prev };
      if (translations.length === 0) {
        // Keep the entry but with empty translations (user cleared it)
        // The entry persists so it still shows in the dictionary
        next[key] = [];
      } else {
        next[key] = translations;
      }
      return next;
    });
  }, []);

  const handleDeleteEntry = useCallback((key: string) => {
    setDictionary((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  // Ensure every completed sequence group has a dictionary entry.
  // A group is "complete" only if it's followed by a SPACE (or the sequence is empty after it).
  // The last group is still being built if the sequence doesn't end with a SPACE,
  // so we skip it to avoid registering partial groups like [1], [1,2], [1,2,3] while typing.
  useEffect(() => {
    const lastGlyph = glyphSequence[glyphSequence.length - 1];
    const allGroupsComplete = glyphSequence.length === 0 || lastGlyph === SPACE;
    const completedGroups = allGroupsComplete ? sequenceGroups : sequenceGroups.slice(0, -1);

    let needsUpdate = false;
    const additions: Record<string, string[]> = {};
    for (const group of completedGroups) {
      const key = glyphGroupKey(group);
      if (!(key in dictionary)) {
        additions[key] = [];
        needsUpdate = true;
      }
    }
    if (needsUpdate) {
      setDictionary((prev) => ({ ...prev, ...additions }));
    }
    // We only want this to run when the sequence groups actually change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [glyphSequence]);

  return (
    <div className={styles.container}>
      <header>
        <div className={styles.headerLeft}>
          <h1>Tunic Runes Editor</h1>
          <select
            className={styles.spoilerSelect}
            value={spoilerLevel}
            onChange={(e) => setSpoilerLevel(Number(e.target.value) as SpoilerLevel)}
          >
            <option value={SpoilerLevel.NONE}>No spoilers</option>
            <option value={SpoilerLevel.PAGE_54}>Page 54</option>
          </select>
        </div>
        <div className={styles.headerRight}>
          <p className={styles.madeWith}>
            Made with ❤️ by{' '}
            <a
              href="https://github.com/wmmiii/tunic-runes"
              target="_blank"
              rel="noopener noreferrer"
            >
              wmmiii
            </a>
          </p>
          <p className={styles.attribution}>
            Inspired by the game{' '}
            <a href="https://tunicgame.com/" target="_blank" rel="noopener noreferrer">
              Tunic
            </a>
          </p>
        </div>
      </header>
      <div className={styles.body}>
        <main className={styles.content}>
          <div className={styles.topButtons}>
            <button onClick={() => setGlyphSequence([])} disabled={glyphSequence.length === 0}>
              Clear Sequence
            </button>
          </div>
          <div className={styles.editor}>
            <GlyphEditor
              glyph={currentGlyph}
              setGlyph={setCurrentGlyph}
              spoilerLevel={spoilerLevel}
            />
            <button
              onClick={handleAddGlyph}
              disabled={
                currentGlyph === SPACE &&
                (glyphSequence.length === 0 || glyphSequence[glyphSequence.length - 1] === SPACE)
              }
            >
              Add {currentGlyph === SPACE ? 'space' : 'rune'}
            </button>
          </div>
          <div ref={sequenceContainerRef} className={styles.sequenceContainer}>
            {sequenceWidth > 0 && (
              <GlyphSequence
                previewGlyph={currentGlyph}
                dictionary={dictionary}
                onUpdateTranslation={handleUpdateTranslation}
              >
                {glyphSequence}
              </GlyphSequence>
            )}
          </div>
        </main>
        <Dictionary
          dictionary={dictionary}
          sequenceGroups={sequenceGroups}
          spoilerLevel={spoilerLevel}
          onUpdateTranslation={handleUpdateTranslation}
          onDeleteEntry={handleDeleteEntry}
        />
      </div>
    </div>
  );
}

export default App;
