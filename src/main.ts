import { CC, encodedLine, Glyph, hitTarget, Point } from "./glyph";
import { drawTemplate, highlightTarget, strokeGlyph } from "./glyph-renderer";

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

const scale = 0.5;

let redrawHandle: any;
let highlightedTarget: Point | null = null;
let lastTarget: Point | null = null;

let glyph: Glyph = 0;

function redraw() {
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }
  cancelAnimationFrame(redrawHandle);
  redrawHandle = requestAnimationFrame(() => {
    ctx.reset();
    ctx.setTransform(scale, 0, 0, scale, 64, 64);
    ctx.clearRect(0, 0, 256, 512);
    drawTemplate(ctx);

    ctx.lineWidth = 24;
    ctx.strokeStyle = '#333';
    ctx.beginPath();
    strokeGlyph(ctx, glyph);
    ctx.stroke();
    ctx.closePath();
    if (highlightedTarget) {
      highlightTarget(ctx, highlightedTarget);
    }
    if (lastTarget) {
      highlightTarget(ctx, lastTarget);
    }
  });
}

// Set canvas internal resolution to match display size
canvas.width = 256;
canvas.height = 512;

redraw();


let mouseDown = false;
canvas.addEventListener('mousemove', (e) => {
  const x = (e.offsetX - 64) / scale;
  const y = (e.offsetY - 64) / scale;

  highlightedTarget = hitTarget(x, y);
  if (lastTarget != null && highlightedTarget != null && lastTarget !== highlightedTarget) {
    glyph ^= encodedLine(highlightedTarget, lastTarget);
  }
  if (mouseDown && highlightedTarget != null) {
    lastTarget = highlightedTarget;
  }

  redraw();
});

canvas.addEventListener('mousedown', () => {
  mouseDown = true;
});

canvas.addEventListener('mouseup', () => {
  mouseDown = false;
  lastTarget = null;
});
