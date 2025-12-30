/**
 * Tunic-inspired color palette and theme constants
 * These values mirror the CSS variables in style.css for use in canvas rendering
 */

export const colors = {
  // Canvas/Glyph colors
  glyphActive: '#5C4A2F',
  glyphSequence: '#8B6F47',
  glyphTemplate: '#D4CCBE',
  glyphHighlight: '#D9A865',
} as const;

export const opacity = {
  highlightFill: 0x80,      // 50% opacity for fill
  highlightStroke: 0xb8,     // 72% opacity for stroke outline
} as const;

export const lineWidth = {
  glyphEditor: 24,
  glyphSequence: 16,
  template: 16,
  highlightOutline: 4,
} as const;
