import { useCallback, useEffect, useState } from 'react';

import useUpdateCurrentTimeEvent from './useUpdateCurrentTimeEvent';
import useWaveformSize from './useWaveformSize';

import { UseTypeWaveformParams } from './_types';
import { BAR_WIDTH, WAVEFORM_HEIGHT_PERCENT } from './_constants';
import {
  createPolylineElement,
  createSvgElement,
} from './_utils/createElement';

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
  const [playedWaveform, setPlayedWaveform] = useState<SVGSVGElement>();

  const { addEventListeners, removeEventListeners } = useUpdateCurrentTimeEvent(
    {
      duration,
      changeCurrentTime,
    },
  );
  const { halfHeight, barIndexScale, playedWidth } = useWaveformSize({
    width,
    height,
    peakLength: peaks.length,
    currentTime,
    duration,
  });

  const drawWaveform = useCallback(
    (svgElement: SVGSVGElement, bgColor: string, waveColor: string): void => {
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
      polylineElement.style.strokeWidth = `${BAR_WIDTH}`;
      polylineElement.style.stroke = waveColor;
      polylineElement.style.fill = 'none';

      svgElement.appendChild(polylineElement);
    },
    [peaks, halfHeight, barIndexScale, height],
  );

  const drawPlayhead = useCallback(
    (svgElement: SVGSVGElement): void => {
      const polylineElement = createPolylineElement();

      polylineElement.setAttribute(
        'points',
        `${playedWidth},0 ${playedWidth},${height}`,
      );
      polylineElement.style.strokeWidth = `${playheadWidth}`;
      polylineElement.style.stroke = playheadColor;
      polylineElement.style.fill = 'none';

      svgElement.appendChild(polylineElement);
    },
    [playedWidth, barIndexScale, height, playheadWidth, playheadColor],
  );

  const configureWaveform = useCallback((): void => {
    const mainImage = document.createElement('img');

    mainImage.setAttribute('class', className);
    controls && addEventListeners(mainImage);

    setWaveform(mainImage);
  }, [width, height, className, controls, addEventListeners]);

  const initSvgWaveform = useCallback((): void => {
    const initSvg = createSvgElement(width, height);
    const playedSvg = createSvgElement(width, height);

    drawWaveform(initSvg, bgColor, waveColor);
    drawWaveform(playedSvg, 'transparent', progressColor);

    setInitWaveform(initSvg);
    setPlayedWaveform(playedSvg);
  }, [width, height, bgColor, waveColor, progressColor, drawWaveform]);

  const updateSvgWaveform = useCallback((): void => {
    if (!waveform || !initWaveform || !playedWaveform) return;

    const newMainSvg = createSvgElement(width, height);

    newMainSvg.style.background = bgColor;
    playedWaveform.setAttribute('width', `${playedWidth}`);

    newMainSvg.appendChild(initWaveform);
    newMainSvg.appendChild(playedWaveform);
    playhead && drawPlayhead(newMainSvg);

    waveform.src =
      'data:image/svg+xml;charset=utf-8,' +
      encodeURIComponent(new XMLSerializer().serializeToString(newMainSvg));
  }, [
    width,
    height,
    playedWidth,
    playhead,
    waveform,
    initWaveform,
    playedWaveform,
    drawPlayhead,
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
  }, [
    peaks,
    width,
    height,
    waveColor,
    progressColor,
    bgColor,
    duration,
    enabled,
  ]);

  useEffect(() => {
    if (!enabled) return;

    updateSvgWaveform();
  }, [
    initWaveform,
    playedWaveform,
    playheadWidth,
    playheadColor,
    currentTime,
    enabled,
  ]);

  return waveform;
};

export default useSvgWaveform;
