export type Glyph = number;

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
const CENTER_MARGIN = (TC.y - TT.y) / 3;
export const CC: Point = { x: 128, y: TC.y + CENTER_MARGIN };
export const CL: Point = { x: 0, y: CC.y };
export const CR: Point = { x: 256, y: CC.y };

// Bottom
export const BC: Point = { x: 128, y: CC.y + CENTER_MARGIN };
export const BTL: Point = { x: 0, y: BC.y };
export const BTR: Point = { x: 256, y: BC.y };
export const BL: Point = { x: 0, y: BC.y + TC.y - TL.y };
export const BR: Point = { x: 256, y: BC.y + TC.y - TR.y };
export const BB: Point = { x: 128, y: BC.y + TC.y - TT.y };

// Lines
export const OTR = [TT, TR];
export const OR = [TR, CR, BTR, BR];
export const OBR = [BR, BB];
export const OBL = [BL, BB];
export const OL = [BL, BTL, CL, TL];
export const OTL = [TL, TT];
export const IT = [TT, TC];
export const ITR = [TR, TC];
export const IBR = [BR, BC];
export const IB = [BB, BC, CC, TC];
export const IBL = [BL, BC];
export const ITL = [TL, TC];

// Draw targets
export const HIT_RADIUS = 32;

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
  } else if (hit(x, y, TC) || hit(x, y, BC) || (Math.abs(x - 128) < HIT_RADIUS && y > TC.y && y < BC.y)) {
    return CC;
  }
  return null;
}

function hit(x: number, y: number, p: Point) {
  return (x - p.x)**2 + (y - p.y)**2 < HIT_RADIUS**2;
}

// Returns a number with a binary "1" digit in the place of the encoded line.
export function encodedLine(a: Point, b: Point) {
  // Check if points are the same
  if (a === b) return 0;

  // Helper to check if two points match in either direction
  const matches = (p1: Point, p2: Point, line: Point[]): boolean => {
    return (line.includes(p1) && line.includes(p2));
  };

  // Map to strokeGlyph bit positions
  if (matches(a, b, [TT, TR])) return 2 ** 0;
  if (matches(a, b, [TR, CC])) return 2 ** 1;
  if (matches(a, b, [BR, BB])) return 2 ** 2;
  if (matches(a, b, [BL, BB])) return 2 ** 3;
  if (matches(a, b, [BL, TL])) return 2 ** 4;
  if (matches(a, b, [TL, TT])) return 2 ** 5;
  if (matches(a, b, [TT, CC])) return 2 ** 6;
  if (matches(a, b, [TR, CC])) return 2 ** 7;
  if (matches(a, b, [BR, CC])) return 2 ** 8;
  if (matches(a, b, [BB, CC])) return 2 ** 9;
  if (matches(a, b, [BL, CC])) return 2 ** 10;
  if (matches(a, b, [TL, CC])) return 2 ** 11;

  // Points are not adjacent
  return 0;
}