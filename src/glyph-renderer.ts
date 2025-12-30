import {
  Glyph,
  Point,
  TT, TL, TR, TC,
  BC, BL, BR, BB,
  OTR, OR, OBR, OBL, OL, OTL,
  IT, ITR, IBR, IB, IBL, ITL,
  HIT_RADIUS,
  CC,
  CL,
  CR
} from "./glyph";
import { colors, lineWidth, opacity } from "./theme";

export function strokeGlyph(ctx: CanvasRenderingContext2D, glyph: Glyph) {
  if (glyph & 2 ** 0) {
    strokeLine(ctx, OTR);
  };
  if (glyph & 2 ** 1) {
    strokeLine(ctx, OR);
  };
  if (glyph & 2 ** 2) {
    strokeLine(ctx, OBR);
  };
  if (glyph & 2 ** 3) {
    strokeLine(ctx, OBL);
  };
  if (glyph & 2 ** 4) {
    strokeLine(ctx, OL);
  };
  if (glyph & 2 ** 5) {
    strokeLine(ctx, OTL);
  };
  if (glyph & 2 ** 6) {
    strokeLine(ctx, IT);
  };
  if (glyph & 2 ** 7) {
    strokeLine(ctx, ITR);
  };
  if (glyph & 2 ** 8) {
    strokeLine(ctx, IBR);
  };
  if (glyph & 2 ** 9) {
    strokeLine(ctx, IB);
  };
  if (glyph & 2 ** 10) {
    strokeLine(ctx, IBL);
  };
  if (glyph & 2 ** 11) {
    strokeLine(ctx, ITL);
  };
  strokeGuide(ctx);
}

export function drawTemplate(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = colors.glyphTemplate;
  ctx.lineWidth = lineWidth.template;
  ctx.lineCap = 'round';
  strokeLine(ctx, OTR);
  strokeLine(ctx, OR);
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
  ctx.stroke();

  ctx.strokeStyle = `${colors.glyphHighlight}${opacity.highlightStroke.toString(16)}`;
  ctx.lineWidth = lineWidth.highlightOutline;
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
  ctx.arc(TC.x, TC.y, HIT_RADIUS, Math.PI, 0);
  ctx.lineTo(BC.x + HIT_RADIUS, BC.y);
  ctx.arc(BC.x, BC.y, HIT_RADIUS, 0, Math.PI);
  ctx.closePath();
  ctx.stroke();
}

export function highlightTarget(ctx: CanvasRenderingContext2D, p: Point) {
  ctx.beginPath();
  if (p === TT || p === TR || p === BR || p === BB || p === BL || p === TL) {
    ctx.arc(p.x, p.y, HIT_RADIUS, 0, 2 * Math.PI);
    ctx.closePath();
  } else if (p === CC) {
    ctx.arc(TC.x, TC.y, HIT_RADIUS, Math.PI, 0);
    ctx.lineTo(BC.x + HIT_RADIUS, BC.y);
    ctx.arc(BC.x, BC.y, HIT_RADIUS, 0, Math.PI);
    ctx.closePath();
  }
  ctx.fillStyle = `${colors.glyphHighlight}${opacity.highlightFill.toString(16)}`;
  ctx.fill();
}

function strokeLine(ctx: CanvasRenderingContext2D, segs: Point[]) {
  for (let i = 0; i < segs.length; i += 2) {
    ctx.moveTo(segs[i].x, segs[i].y);
    ctx.lineTo(segs[i + 1].x, segs[i + 1].y);
  }
}

function strokeGuide(ctx: CanvasRenderingContext2D) {
  ctx.moveTo(CL.x, CL.y);
  ctx.lineTo(CR.x, CR.y);
}
