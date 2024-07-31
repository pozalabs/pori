import { useCallback, useEffect, useState } from 'react';

import useUpdateCurrentTimeEvent from './useUpdateCurrentTimeEvent';
import useWaveformSize from './useWaveformSize';

import { UseTypeWaveformParams } from './_types';
import { WAVEFORM_HEIGHT_PERCENT } from './_constants';

const createSvgElement = (width: number, height: number): SVGSVGElement => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  svg.setAttribute('width', width.toString());
  svg.setAttribute('height', height.toString());

  return svg;
};

const createPolylineElement = (): SVGPolylineElement => {
  const polyline = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'polyline',
  );

  return polyline;
};

const useSvgWaveform = ({
  width,
  height,
  playheadWidth,
  waveColor,
  progressColor,
  bgColor,
  playheadColor,
  className,
  controls,
  playhead,
  peaks,
  currentTime,
  duration,
  changeCurrentTime,
  enabled,
}: UseTypeWaveformParams) => {
  const [waveform, setWaveform] = useState<HTMLImageElement>();
  const [initWaveform, setInitWaveform] = useState<SVGSVGElement>();

  const { addEventListeners, removeEventListeners } = useUpdateCurrentTimeEvent(
    {
      duration,
      changeCurrentTime,
    },
  );
  const { halfHeight, barIndexScale, playedIndex } = useWaveformSize({
    width,
    height,
    peakLength: peaks.length,
    currentTime,
    duration,
  });

  const drawWaveform = useCallback(
    (
      svgElement: SVGSVGElement,
      peaks: number[],
      bgColor: string,
      waveColor: string,
    ): void => {
      const polylineElement = createPolylineElement();

      const points = peaks
        .map((peak, index) => {
          const x = Math.round(index * barIndexScale);
          const waveformMaxHeight = (height / 100) * WAVEFORM_HEIGHT_PERCENT;
          const barHeight = Math.round((peak * waveformMaxHeight) / 2);
          const yTop = halfHeight - barHeight;
          const yBottom = halfHeight + barHeight;

          return `${x},${yTop} ${x},${yBottom}`;
        })
        .join(' ');

      svgElement.style.background = bgColor;
      polylineElement.setAttribute('points', points);
      polylineElement.style.strokeWidth = '1';
      polylineElement.style.stroke = waveColor;
      polylineElement.style.fill = 'none';

      svgElement.appendChild(polylineElement);
    },
    [halfHeight, barIndexScale, height],
  );

  const drawPlayhead = useCallback(
    (svgElement: SVGSVGElement): void => {
      const polylineElement = createPolylineElement();

      const x = Math.round(playedIndex * barIndexScale);
      const formattedX = isNaN(x) ? 0 : x;

      polylineElement.setAttribute(
        'points',
        `${formattedX},0 ${formattedX},${height}`,
      );
      polylineElement.style.strokeWidth = `${playheadWidth}`;
      polylineElement.style.stroke = playheadColor;
      polylineElement.style.fill = 'none';

      svgElement.appendChild(polylineElement);
    },
    [playedIndex, barIndexScale, height, playheadWidth, playheadColor],
  );

  const configureWaveform = useCallback((): void => {
    const mainImage = document.createElement('img');

    mainImage.setAttribute('class', className);
    controls && addEventListeners(mainImage);

    setWaveform(mainImage);
  }, [width, height, className, controls, addEventListeners]);

  const initSvgWaveform = useCallback((): void => {
    const initSvg = createSvgElement(width, height);

    drawWaveform(initSvg, peaks, bgColor, waveColor);

    setInitWaveform(initSvg);
  }, [width, height, bgColor, waveColor, peaks, drawWaveform]);

  const updateSvgWaveform = useCallback((): void => {
    if (!waveform || !initWaveform) return;

    const playedSvg = createSvgElement(width, height);
    const newMainSvg = createSvgElement(width, height);

    newMainSvg.style.background = bgColor;

    drawWaveform(
      playedSvg,
      peaks.slice(0, playedIndex),
      'transparent',
      progressColor,
    );
    playhead && drawPlayhead(playedSvg);

    newMainSvg.appendChild(initWaveform);
    newMainSvg.appendChild(playedSvg);

    waveform.src =
      'data:image/svg+xml;charset=utf-8,' +
      encodeURIComponent(new XMLSerializer().serializeToString(newMainSvg));
  }, [
    width,
    height,
    peaks,
    progressColor,
    playhead,
    waveform,
    initWaveform,
    playedIndex,
    drawPlayhead,
    drawWaveform,
  ]);

  useEffect(() => {
    if (!enabled) return;

    configureWaveform();

    return () => {
      if (!waveform || !controls) return;

      removeEventListeners(waveform);
    };
  }, [width, height, addEventListeners, removeEventListeners, enabled]);

  useEffect(() => {
    if (!enabled) return;

    initSvgWaveform();
  }, [peaks, width, height, waveColor, bgColor, enabled]);

  useEffect(() => {
    if (!enabled) return;

    updateSvgWaveform();
  }, [
    initWaveform,
    progressColor,
    playheadWidth,
    playheadColor,
    currentTime,
    enabled,
  ]);

  return waveform;
};

export default useSvgWaveform;
