import { Glyph, compareGlyphGroups } from './glyph';

/**
 * A glyph dictionary maps serialized glyph group keys to arrays of translation strings.
 * The key is a comma-separated string of glyph numeric values.
 */
export type GlyphDictionary = Record<string, string[]>;

const STORAGE_KEY = 'tunic-runes-dictionary';

/** Serialize a glyph group into a stable dictionary key. */
export function glyphGroupKey(glyphs: Glyph[]): string {
  return glyphs.join(',');
}

/** Deserialize a dictionary key back into a glyph array. */
export function keyToGlyphGroup(key: string): Glyph[] {
  return key.split(',').map(Number);
}

/**
 * Compare two glyph group keys for sorting.
 * Uses glyph-level comparison: outer strokes first, then inner, then dot.
 */
export function compareGlyphGroupKeys(a: string, b: string): number {
  return compareGlyphGroups(keyToGlyphGroup(a), keyToGlyphGroup(b));
}

/** Check whether a glyph group key appears as a contiguous sub-group in the sequence groups. */
export function isSubgroupMatch(key: string, sequenceGroups: Glyph[][]): boolean {
  const target = keyToGlyphGroup(key);
  for (const group of sequenceGroups) {
    if (group.length < target.length) continue;
    for (let i = 0; i <= group.length - target.length; i++) {
      let match = true;
      for (let j = 0; j < target.length; j++) {
        if (group[i + j] !== target[j]) {
          match = false;
          break;
        }
      }
      if (match) return true;
    }
  }
  return false;
}

export function loadDictionary(): GlyphDictionary {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Failed to load dictionary from localStorage:', error);
  }
  return {};
}

export function saveDictionary(dict: GlyphDictionary): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dict));
  } catch (error) {
    console.error('Failed to save dictionary to localStorage:', error);
  }
}
