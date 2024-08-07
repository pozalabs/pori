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

export const createTextElement = (): SVGTextElement => {
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'text');

  return rect;
};
