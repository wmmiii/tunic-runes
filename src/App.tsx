import { useEffect, useRef, useState } from 'react';
import { GlyphEditor } from './GlyphEditor';
import { GlyphSequence } from './GlyphSequence';
import { Glyph, SPACE } from './glyph';
import styles from './App.module.css';

const STORAGE_KEY = 'tunic-runes-sequence';

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

  // Save sequence to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(glyphSequence));
    } catch (error) {
      console.error('Failed to save sequence to localStorage:', error);
    }
  }, [glyphSequence]);

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
    setGlyphSequence(prev => [...prev, currentGlyph]);
    setCurrentGlyph(0);
  };

  const handleAddSpace = () => {
    setGlyphSequence(prev => {
      // Don't add space if sequence is empty or last glyph is already a space
      if (prev.length === 0 || prev[prev.length - 1] === SPACE) {
        return prev;
      }
      return [...prev, SPACE];
    });
  };

  return (
    <div className={styles.container}>
      <header>
        <div className={styles.headerLeft}>
          <h1>Tunic Runes Editor</h1>
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
            <a
              href="https://tunicgame.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Tunic
            </a>
          </p>
        </div>
      </header>
      <main className={styles.content}>
        <div className={styles.editor}>
          <GlyphEditor glyph={currentGlyph} setGlyph={setCurrentGlyph} />
          <button onClick={handleAddGlyph} disabled={currentGlyph === 0}>
            Add to Sequence
          </button>
          <button
            onClick={handleAddSpace}
            disabled={glyphSequence.length === 0 || glyphSequence[glyphSequence.length - 1] === SPACE}
          >
            Add Space
          </button>
          <button
            onClick={() => setGlyphSequence([])}
            disabled={glyphSequence.length === 0}
          >
            Clear Sequence
          </button>
        </div>
        <div ref={sequenceContainerRef} className={styles.sequenceContainer}>
          {sequenceWidth > 0 && (
            <GlyphSequence glyphs={glyphSequence} previewGlyph={currentGlyph} scale={0.18} width={sequenceWidth} height={120} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
