export const createCanvasElement = (
  width: number,
  height: number,
  dpr: number,
): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  ctx?.scale(dpr, dpr);

  return canvas;
};

export const createOffscreenCanvas = (
  width: number,
  height: number,
  dpr: number,
): OffscreenCanvas => {
  const canvas = new OffscreenCanvas(width * dpr, height * dpr);
  const ctx = canvas.getContext('2d');

  ctx?.scale(dpr, dpr);

  return canvas;
};

export const createSvgElement = (width: number, height: number): SVGSVGElement => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  svg.setAttribute('width', width.toString());
  svg.setAttribute('height', height.toString());

  return svg;
};

export const createPolylineElement = (): SVGPolylineElement => {
  const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');

  return polyline;
};

export const createRectElement = (): SVGRectElement => {
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

  return rect;
};

export const createDescElement = (): SVGDescElement => {
  const desc = document.createElementNS('http://www.w3.org/2000/svg', 'desc');

  return desc;
};

export const createSymbolElement = (): SVGSymbolElement => {
  const symbol = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');

  return symbol;
};

export const createUseElement = (): SVGUseElement => {
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');

  return use;
};
