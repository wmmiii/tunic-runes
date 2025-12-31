import { useEffect, useRef, useState } from 'react';
import { GlyphEditor } from './GlyphEditor';
import { Glyph, SPACE } from './glyph';
import styles from './App.module.css';
import { GlyphSequence } from './GlyphSequence';

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

    console.log(glyphSequence);
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
        <button
          className={styles.clearButton}
          onClick={() => setGlyphSequence([])}
          disabled={glyphSequence.length === 0}
        >
          Clear Sequence
        </button>
        <div className={styles.editor}>
          <GlyphEditor glyph={currentGlyph} setGlyph={setCurrentGlyph} />
          <button onClick={handleAddGlyph} disabled={currentGlyph === SPACE && (glyphSequence.length === 0 || glyphSequence[glyphSequence.length - 1] === SPACE)}>
            Add {currentGlyph === SPACE ? 'space' : 'rune'}
          </button>
        </div>
        <div ref={sequenceContainerRef} className={styles.sequenceContainer}>
          {sequenceWidth > 0 && (
            <GlyphSequence previewGlyph={currentGlyph}>
              {glyphSequence}
            </GlyphSequence>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
