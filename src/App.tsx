import { useEffect, useRef, useState } from 'react';
import { GlyphEditor } from './GlyphEditor';
import { GlyphSequence } from './GlyphSequence';
import { Glyph } from './glyph';
import styles from './App.module.css';

function App() {
  const sequenceContainerRef = useRef<HTMLDivElement>(null);
  const [sequenceWidth, setSequenceWidth] = useState(0);
  const [currentGlyph, setCurrentGlyph] = useState<Glyph>(0);
  const [glyphSequence, setGlyphSequence] = useState<Glyph[]>([]);

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
            Made with love ❤️ by{' '}
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
        </div>
        <div ref={sequenceContainerRef} className={styles.sequenceContainer}>
          {sequenceWidth > 0 && (
            <GlyphSequence glyphs={glyphSequence} scale={0.18} width={sequenceWidth} height={120} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
