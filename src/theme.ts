/**
 * Tunic-inspired color palette and theme constants
 * Dark theme with glowing magical runes
 * These values mirror the CSS variables in style.css for use in canvas rendering
 */

export const colors = {
  // Canvas/Glyph colors - glowing cyan magic
  glyphActive: '#4DD4E8',      // Bright glowing cyan
  glyphSequence: '#5BE3F7',    // Ethereal cyan glow
  glyphTemplate: '#2A4A5C',    // Dark subtle template
  glyphHighlight: '#6FFFE9',   // Intense magical highlight
} as const;

export const opacity = {
  highlightFill: 0xa0,      // 63% opacity for visible glow
  highlightStroke: 0xe0,     // 88% opacity for bright outline
} as const;

export const lineWidth = {
  glyphEditor: 24,
  glyphSequence: 16,
  template: 16,
  highlightOutline: 5,
} as const;

// Glow effect settings
export const glow = {
  blur: 15,                  // Glow blur radius
  color: 'rgba(77, 212, 232, 0.6)',  // Cyan glow color
  colorIntense: 'rgba(111, 255, 233, 0.8)',  // Intense highlight glow
} as const;
