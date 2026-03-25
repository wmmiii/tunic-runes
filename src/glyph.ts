export type Glyph = number;

// Draw targets
export const HIT_RADIUS = 48;
export const DOT_HIT_RADIUS = HIT_RADIUS * 0.75;

// Special glyph values
export const SPACE = 0;

// Glyph points assuming a width of 256
export interface Point {
  x: number;
  y: number;
}

// Top
export const TT: Point = { x: 128, y: 0 };
export const TL: Point = { x: 0, y: 74 };
export const TR: Point = { x: 256, y: 74 };
export const TC: Point = { x: 128, y: 148 };

// Center line
const CENTER_MARGIN = (TC.y - TT.y) / 2;
export const CC: Point = { x: 128, y: TC.y + CENTER_MARGIN };
export const CL: Point = { x: 0, y: CC.y };
export const CR: Point = { x: 256, y: CC.y };

// Bottom
export const BC: Point = { x: 128, y: TC.y * 2.125 };
export const BTL: Point = { x: 0, y: BC.y };
export const BTR: Point = { x: 256, y: BC.y };
export const BL: Point = { x: 0, y: BC.y + TC.y - TL.y };
export const BR: Point = { x: 256, y: BC.y + TC.y - TR.y };
export const BB: Point = { x: 128, y: BC.y + TC.y - TT.y };

// Dot
export const DOT_RADIUS = 28;
export const DOT: Point = { x: 128, y: BB.y + DOT_RADIUS };
export const DOT_TARGET: Point = { x: 128, y: BB.y + HIT_RADIUS * 2 };

// Glyph dimensions
export const GLYPH_WIDTH = 256;
export const GLYPH_HEIGHT = DOT.y + DOT_RADIUS;

// Lines
export const OTR = [TT, TR];
export const OBR = [BR, BB];
export const OBL = [BL, BB];
export const OL = [BL, BTL, CL, TL];
export const OTL = [TL, TT];
export const IT = [TT, TC, TC, CC];
export const ITR = [TR, TC];
export const IBR = [BR, BC];
export const IB = [BB, BC, TC, CC];
export const IBL = [BL, BC];
export const ITL = [TL, TC];

export function hitTarget(x: number, y: number): Point | null {
  if (hit(x, y, TT)) {
    return TT;
  } else if (hit(x, y, TR)) {
    return TR;
  } else if (hit(x, y, BR)) {
    return BR;
  } else if (hit(x, y, BB)) {
    return BB;
  } else if (hit(x, y, BL)) {
    return BL;
  } else if (hit(x, y, TL)) {
    return TL;
  } else if ((x - DOT_TARGET.x) ** 2 + (y - DOT_TARGET.y) ** 2 < DOT_HIT_RADIUS ** 2) {
    return DOT;
  } else if (
    hit(x, y, TC) ||
    hit(x, y, BC) ||
    (Math.abs(x - 128) < HIT_RADIUS && y > TC.y && y < BC.y)
  ) {
    return CC;
  }
  return null;
}

function hit(x: number, y: number, p: Point) {
  return (x - p.x) ** 2 + (y - p.y) ** 2 < HIT_RADIUS ** 2;
}

// Returns a number with a binary "1" digit in the place of the encoded line.
export function encodedLine(a: Point, b: Point) {
  // Check if points are the same
  if (a === b) return 0;

  // Helper to check if two points match in either direction
  const matches = (p1: Point, p2: Point, line: Point[]): boolean => {
    return line.includes(p1) && line.includes(p2);
  };

  // Map to strokeGlyph bit positions
  if (matches(a, b, [BR, BB])) return 2 ** 0;
  if (matches(a, b, [BL, BB])) return 2 ** 1;
  if (matches(a, b, [BL, TL])) return 2 ** 2;
  if (matches(a, b, [TL, TT])) return 2 ** 3;
  if (matches(a, b, [TT, TR])) return 2 ** 4;
  // 2 ** 5 is dot
  if (matches(a, b, [TT, CC])) return 2 ** 6;
  if (matches(a, b, [TR, CC])) return 2 ** 7;
  if (matches(a, b, [BR, CC])) return 2 ** 8;
  if (matches(a, b, [BB, CC])) return 2 ** 9;
  if (matches(a, b, [BL, CC])) return 2 ** 10;
  if (matches(a, b, [TL, CC])) return 2 ** 11;

  // Points are not adjacent
  return 0;
}

const VALID_OUTER = [28, 12, 3, 7, 6, 24, 15, 30, 23, 29, 27, 13, 8, 16, 2, 1, 31, 5];
const VALID_INNER = [
  1280, 3328, 4032, 640, 320, 2688, 1344, 448, 896, 1088, 2560, 1664, 2368, 2752, 1856, 1728, 2880,
  3968, 3520, 832, 704, 2624, 2176, 576,
];

const OUTER_MASK = 0b11111; // bits 0–4
const INNER_MASK = 0b111111000000; // bits 6–11
const DOT_BIT = 2 ** 5;

/** Extract the outer stroke component of a glyph. */
export function glyphOuter(glyph: Glyph): number {
  return glyph & OUTER_MASK;
}

/** Extract the inner stroke component of a glyph. */
export function glyphInner(glyph: Glyph): number {
  return glyph & INNER_MASK;
}

/** Check whether a glyph's outer strokes form a valid pattern (or are absent). */
export function hasValidOuter(glyph: Glyph): boolean {
  const outer = glyphOuter(glyph);
  return outer === 0 || VALID_OUTER.includes(outer);
}

/** Check whether a glyph's inner strokes form a valid pattern (or are absent). */
export function hasValidInner(glyph: Glyph): boolean {
  const inner = glyphInner(glyph);
  return inner === 0 || VALID_INNER.includes(inner);
}

/** A glyph is valid if it has at least one valid outer or inner component and both components are valid. */
export function isValidGlyph(glyph: Glyph): boolean {
  const outer = glyphOuter(glyph);
  const inner = glyphInner(glyph);
  // Must have at least one stroke component (dot alone is not valid)
  if (outer === 0 && inner === 0) return false;
  return hasValidOuter(glyph) && hasValidInner(glyph);
}

/** Check whether all glyphs in a group are valid. */
export function isValidGlyphGroup(glyphs: Glyph[]): boolean {
  return glyphs.every(isValidGlyph);
}

/**
 * Compare two individual glyphs for sorting.
 *
 * Order: absent strokes (0) < valid glyphs (by outer index, then inner index, then dot) < invalid glyphs (by numeric value).
 */
export function compareGlyphs(a: Glyph, b: Glyph): number {
  const aValid = isValidGlyph(a);
  const bValid = isValidGlyph(b);

  // Invalid glyphs are always "greater than" valid ones
  if (aValid && !bValid) return -1;
  if (!aValid && bValid) return 1;
  if (!aValid && !bValid) return a - b;

  // Both valid — compare outer first
  const aOuter = glyphOuter(a);
  const bOuter = glyphOuter(b);
  const aOuterIdx = aOuter === 0 ? -1 : VALID_OUTER.indexOf(aOuter);
  const bOuterIdx = bOuter === 0 ? -1 : VALID_OUTER.indexOf(bOuter);
  if (aOuterIdx !== bOuterIdx) return aOuterIdx - bOuterIdx;

  // Then compare inner
  const aInner = glyphInner(a);
  const bInner = glyphInner(b);
  const aInnerIdx = aInner === 0 ? -1 : VALID_INNER.indexOf(aInner);
  const bInnerIdx = bInner === 0 ? -1 : VALID_INNER.indexOf(bInner);
  if (aInnerIdx !== bInnerIdx) return aInnerIdx - bInnerIdx;

  // Finally compare dot
  const aDot = a & DOT_BIT;
  const bDot = b & DOT_BIT;
  return aDot - bDot;
}

/**
 * Compare two glyph groups for sorting (like comparing strings letter-by-letter).
 */
export function compareGlyphGroups(a: Glyph[], b: Glyph[]): number {
  const minLen = Math.min(a.length, b.length);
  for (let i = 0; i < minLen; i++) {
    const cmp = compareGlyphs(a[i], b[i]);
    if (cmp !== 0) return cmp;
  }
  return a.length - b.length;
}
