import { RefObject, useEffect, useState } from 'react';
import { GLYPH_HEIGHT } from './glyph';

interface CssStyle {
  glyphHeight: number;
  color: string;
  strokeWidth: number;
}

export function useCssStyle(ref: RefObject<HTMLElement | null>) {
  const [style, setStyle] = useState<CssStyle>({
    glyphHeight: 24,
    color: 'black',
    strokeWidth: 2,
  });

  useEffect(() => {
    if (ref.current) {
      const style = window.getComputedStyle(ref.current);
      const glyphHeight = parseInt(style.fontSize);
      const glyphScale = glyphHeight / GLYPH_HEIGHT;
      setStyle({
        glyphHeight,
        color: style.color,
        strokeWidth: 48 * glyphScale,
      });
    }
  }, [ref]);

  return style;
}

export function getCSSVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}
