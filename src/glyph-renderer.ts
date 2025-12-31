import { getCSSVar } from './browserUtils';
import {
  Glyph,
  Point,
  TT,
  TL,
  TR,
  TC,
  BC,
  BL,
  BR,
  BB,
  OTR,
  OBR,
  OBL,
  OL,
  OTL,
  IT,
  ITR,
  IBR,
  IB,
  IBL,
  ITL,
  HIT_RADIUS,
  CC,
  CL,
  CR,
  DOT,
  DOT_TARGET,
  DOT_HIT_RADIUS,
  DOT_RADIUS,
} from './glyph';

export function strokeGlyph(ctx: CanvasRenderingContext2D, glyph: Glyph) {
  if (glyph & (2 ** 0)) {
    strokeLine(ctx, OBR);
  }
  if (glyph & (2 ** 1)) {
    strokeLine(ctx, OBL);
  }
  if (glyph & (2 ** 2)) {
    strokeLine(ctx, OL);
  }
  if (glyph & (2 ** 3)) {
    strokeLine(ctx, OTL);
  }
  if (glyph & (2 ** 4)) {
    strokeLine(ctx, OTR);
  }

  if (glyph & (2 ** 5)) {
    strokeDot(ctx);
  }

  if (glyph & (2 ** 6)) {
    strokeLine(ctx, IT);
  }
  if (glyph & (2 ** 7)) {
    strokeLine(ctx, ITR);
  }
  if (glyph & (2 ** 8)) {
    strokeLine(ctx, IBR);
  }
  if (glyph & (2 ** 9)) {
    strokeLine(ctx, IB);
  }
  if (glyph & (2 ** 10)) {
    strokeLine(ctx, IBL);
  }
  if (glyph & (2 ** 11)) {
    strokeLine(ctx, ITL);
  }
  strokeGuide(ctx);
}

export function drawTemplate(ctx: CanvasRenderingContext2D) {
  const glyphTemplate = getCSSVar('--color-glyph-template');
  const glyphHighlight = getCSSVar('--color-glyph-highlight');
  const templateLineWidth = parseFloat(getCSSVar('--line-width-glyph-template'));
  const highlightOutlineWidth = parseFloat(getCSSVar('--line-width-glyph-highlight-outline'));
  const highlightStrokeOpacity = parseFloat(getCSSVar('--opacity-glyph-highlight-stroke'));

  ctx.strokeStyle = glyphTemplate;
  ctx.lineWidth = templateLineWidth;
  ctx.lineCap = 'round';
  strokeLine(ctx, OTR);
  strokeLine(ctx, OBR);
  strokeLine(ctx, OBL);
  strokeLine(ctx, OL);
  strokeLine(ctx, OTL);
  strokeLine(ctx, IT);
  strokeLine(ctx, ITR);
  strokeLine(ctx, IBR);
  strokeLine(ctx, IB);
  strokeLine(ctx, IBL);
  strokeLine(ctx, ITL);
  strokeDot(ctx);
  ctx.stroke();

  const hexOpacity = Math.round(highlightStrokeOpacity * 255)
    .toString(16)
    .padStart(2, '0');
  ctx.strokeStyle = `${glyphHighlight}${hexOpacity}`;
  ctx.lineWidth = highlightOutlineWidth;
  ctx.beginPath();
  ctx.arc(TT.x, TT.y, HIT_RADIUS, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(TL.x, TL.y, HIT_RADIUS, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(TR.x, TR.y, HIT_RADIUS, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(BL.x, BL.y, HIT_RADIUS, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(BR.x, BR.y, HIT_RADIUS, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(BB.x, BB.y, HIT_RADIUS, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(DOT_TARGET.x, DOT_TARGET.y, DOT_HIT_RADIUS, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(TC.x, TC.y, HIT_RADIUS, Math.PI, 0);
  ctx.lineTo(BC.x + HIT_RADIUS, BC.y);
  ctx.arc(BC.x, BC.y, HIT_RADIUS, 0, Math.PI);
  ctx.closePath();
  ctx.stroke();
}

export function highlightTarget(ctx: CanvasRenderingContext2D, p: Point) {
  const glyphHighlight = getCSSVar('--color-glyph-highlight');
  const highlightFillOpacity = parseFloat(getCSSVar('--opacity-glyph-highlight-fill'));

  ctx.beginPath();
  if (p === TT || p === TR || p === BR || p === BB || p === BL || p === TL) {
    ctx.arc(p.x, p.y, HIT_RADIUS, 0, 2 * Math.PI);
    ctx.closePath();
  } else if (p === DOT) {
    ctx.arc(DOT_TARGET.x, DOT_TARGET.y, DOT_HIT_RADIUS, 0, 2 * Math.PI);
    ctx.closePath();
  } else if (p === CC) {
    ctx.arc(TC.x, TC.y, HIT_RADIUS, Math.PI, 0);
    ctx.lineTo(BC.x + HIT_RADIUS, BC.y);
    ctx.arc(BC.x, BC.y, HIT_RADIUS, 0, Math.PI);
    ctx.closePath();
  }
  const hexOpacity = Math.round(highlightFillOpacity * 255)
    .toString(16)
    .padStart(2, '0');
  ctx.fillStyle = `${glyphHighlight}${hexOpacity}`;
  ctx.fill();
}

function strokeLine(ctx: CanvasRenderingContext2D, segs: Point[]) {
  for (let i = 0; i < segs.length; i += 2) {
    ctx.moveTo(segs[i].x, segs[i].y);
    ctx.lineTo(segs[i + 1].x, segs[i + 1].y);
  }
}

function strokeDot(ctx: CanvasRenderingContext2D) {
  ctx.moveTo(DOT.x + DOT_RADIUS, DOT.y);
  ctx.arc(DOT.x, DOT.y, DOT_RADIUS, 0, 2 * Math.PI);
}

function strokeGuide(ctx: CanvasRenderingContext2D) {
  ctx.moveTo(CL.x, CL.y);
  ctx.lineTo(CR.x, CR.y);
}

// SVG Generation Functions

interface PathSegment {
  type: 'line' | 'arc';
  points: Point[];
  arcParams?: {
    rx: number;
    ry: number;
    xRotation: number;
    largeArc: number;
    sweep: number;
  };
}

export function glyphToPathSegments(glyph: Glyph): PathSegment[] {
  const segments: PathSegment[] = [];

  // Add glyph strokes
  if (glyph & (2 ** 0)) {
    segments.push({ type: 'line', points: OBR });
  }
  if (glyph & (2 ** 1)) {
    segments.push({ type: 'line', points: OBL });
  }
  if (glyph & (2 ** 2)) {
    segments.push({ type: 'line', points: OL });
  }
  if (glyph & (2 ** 3)) {
    segments.push({ type: 'line', points: OTL });
  }
  if (glyph & (2 ** 4)) {
    segments.push({ type: 'line', points: OTR });
  }

  if (glyph & (2 ** 5)) {
    segments.push({
      type: 'arc',
      points: [
        { x: DOT.x + DOT_RADIUS, y: DOT.y },
        { x: DOT.x - DOT_RADIUS, y: DOT.y },
        { x: DOT.x + DOT_RADIUS, y: DOT.y },
      ],
      arcParams: {
        rx: DOT_RADIUS,
        ry: DOT_RADIUS,
        xRotation: 0,
        largeArc: 1,
        sweep: 0,
      },
    });
  }

  if (glyph & (2 ** 6)) {
    segments.push({ type: 'line', points: IT });
  }
  if (glyph & (2 ** 7)) {
    segments.push({ type: 'line', points: ITR });
  }
  if (glyph & (2 ** 8)) {
    segments.push({ type: 'line', points: IBR });
  }
  if (glyph & (2 ** 9)) {
    segments.push({ type: 'line', points: IB });
  }
  if (glyph & (2 ** 10)) {
    segments.push({ type: 'line', points: IBL });
  }
  if (glyph & (2 ** 11)) {
    segments.push({ type: 'line', points: ITL });
  }

  // Add guide line
  segments.push({ type: 'line', points: [CL, CR] });

  return segments;
}

export function glyphToPathData(glyph: Glyph): string {
  const segments = glyphToPathSegments(glyph);
  return pathSegmentsToString(segments);
}

export function pathSegmentsToString(segments: PathSegment[], offsetX = 0, offsetY = 0): string {
  const commands: string[] = [];

  for (const segment of segments) {
    if (segment.type === 'line') {
      for (let i = 0; i < segment.points.length; i += 2) {
        const p1 = segment.points[i];
        const p2 = segment.points[i + 1];
        commands.push(
          `M ${p1.x + offsetX},${p1.y + offsetY} L ${p2.x + offsetX},${p2.y + offsetY}`
        );
      }
    } else if (segment.type === 'arc' && segment.arcParams) {
      const [start, mid, end] = segment.points;
      const { rx, ry, xRotation, largeArc, sweep } = segment.arcParams;
      commands.push(
        `M ${start.x + offsetX},${start.y + offsetY} ` +
          `A ${rx},${ry} ${xRotation} ${largeArc},${sweep} ${mid.x + offsetX},${mid.y + offsetY} ` +
          `A ${rx},${ry} ${xRotation} ${largeArc},${sweep} ${end.x + offsetX},${end.y + offsetY}`
      );
    }
  }

  return commands.join(' ');
}
