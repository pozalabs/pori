import { useCallback, useEffect, useState } from 'react';

import useUpdateCurrentTimeEvent from './useUpdateCurrentTimeEvent';
import useWaveformSize from './useWaveformSize';

import { UseTypeWaveformParams } from './_types';
import { PLAYHEAD_TIME, WAVEFORM_HEIGHT_PERCENT } from './_constants';
import formatTime from './_utils/formatTime';
import {
  createPolylineElement,
  createRectElement,
  createSvgElement,
  createTextElement,
} from './_utils/createElement';

const getTextWidth = (text: string, font: string): number => {
  const element = document.createElement('canvas');
  const ctx = element.getContext('2d');

  if (!ctx) return 0;

  ctx.font = font;
  return ctx.measureText(text).width;
};

const useSvgWaveform = ({
  width,
  height,
  playheadWidth,
  waveColor,
  progressColor,
  bgColor,
  playheadBgColor,
  playheadTextColor,
  className,
  controls,
  peaks,
  currentTime,
  duration,
  isPlayheadShowing,
  playheadPosition,
  showPlayhead,
  hidePlayhead,
  changeCurrentTime,
  enabled,
}: UseTypeWaveformParams) => {
  const [waveform, setWaveform] = useState<HTMLImageElement>();
  const [initWaveform, setInitWaveform] = useState<SVGSVGElement>();

  const { addEventListeners, removeEventListeners } = useUpdateCurrentTimeEvent({
    duration,
    showPlayhead,
    hidePlayhead,
    changeCurrentTime,
  });
  const { halfHeight, barIndexScale, playedIndex } = useWaveformSize({
    width,
    height,
    peakLength: peaks.length,
    currentTime,
    duration,
  });

  const drawWaveform = useCallback(
    (svgElement: SVGSVGElement, peaks: number[], bgColor: string, waveColor: string): void => {
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

      polylineElement.setAttribute('points', `${playheadPosition},0 ${playheadPosition},${height}`);
      polylineElement.style.strokeWidth = `${playheadWidth}`;
      polylineElement.style.stroke = playheadBgColor;
      polylineElement.style.fill = 'none';

      const rectElement = createRectElement();
      const textElement = createTextElement();

      const percent = (playheadPosition / width) * 100;
      const playheadTime = (percent * duration) / 100;
      const formattedPlayheadTime = formatTime(playheadTime > 0 ? playheadTime : 0);

      const textWidth =
        getTextWidth(formattedPlayheadTime, `${PLAYHEAD_TIME.fontSize}px Arial`) +
        PLAYHEAD_TIME.padding * 2;
      const textHeight = PLAYHEAD_TIME.fontSize + PLAYHEAD_TIME.padding * 2;

      const playheadTimePosition =
        playheadPosition > textWidth ? playheadPosition - textWidth : playheadPosition;

      textElement.setAttribute('x', `${playheadTimePosition + PLAYHEAD_TIME.padding}`);
      textElement.setAttribute('y', `${PLAYHEAD_TIME.fontSize}`);
      textElement.setAttribute('font-size', `${PLAYHEAD_TIME.fontSize}`);
      textElement.setAttribute('font-family', 'Arial');
      textElement.style.fill = playheadTextColor;
      textElement.textContent = formattedPlayheadTime;

      rectElement.setAttribute('x', `${playheadTimePosition}`);
      rectElement.setAttribute('y', '0');
      rectElement.setAttribute('width', `${textWidth}`);
      rectElement.setAttribute('height', `${textHeight}`);
      rectElement.setAttribute('letter-spacing', '-0.2');
      rectElement.setAttribute('rx', '3');
      rectElement.style.fill = playheadBgColor;

      svgElement.appendChild(polylineElement);
      svgElement.appendChild(rectElement);
      svgElement.appendChild(textElement);
    },
    [playheadPosition, height, playheadWidth, playheadBgColor, playheadTextColor],
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

    drawWaveform(playedSvg, peaks.slice(0, playedIndex), 'transparent', progressColor);
    isPlayheadShowing && drawPlayhead(playedSvg);

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
    isPlayheadShowing,
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
  }, [peaks, width, height, waveColor, bgColor, duration, enabled]);

  useEffect(() => {
    if (!enabled) return;

    updateSvgWaveform();
  }, [
    initWaveform,
    progressColor,
    playheadWidth,
    playheadBgColor,
    playheadTextColor,
    playheadPosition,
    isPlayheadShowing,
    currentTime,
    enabled,
  ]);

  return waveform;
};

export default useSvgWaveform;
