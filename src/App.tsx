import { GlyphEditor } from './GlyphEditor';
import styles from './App.module.css';

function App() {
  return (
    <>
      <header>
        <h1>Tunic Runes Editor</h1>
        <p>
          Draw Tunic runes by clicking and dragging between the dots on the grid.
          Click the same line again to erase it.
        </p>
        <p className={styles.attribution}>
          A fan project inspired by{' '}
          <a
            href="https://tunicgame.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Tunic
          </a>
          . All rights to the original game and its design elements belong to their
          respective owners.
        </p>
      </header>
      <GlyphEditor className={styles.editor} />
      <footer>
        Made with love ❤️ by{' '}
        <a
          href="https://github.com/wmmiii/tunic-runes"
          target="_blank"
          rel="noopener noreferrer"
        >
          wmmiii
        </a>
      </footer>
    </>
  );
}

export default App;
