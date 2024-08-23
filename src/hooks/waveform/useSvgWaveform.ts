import { useCallback, useEffect, useState, useMemo } from 'react';

import { BAR_WIDTH } from './_constants';
import type { UseTypeWaveformParams } from './_types';
import {
  createGElement,
  createPolylineElement,
  createRectElement,
  createSvgElement,
  createUseElement,
} from './_utils/createElement';
import useUpdateCurrentTimeEvent from './useUpdateCurrentTimeEvent';
import useWaveformSize from './useWaveformSize';

const useSvgWaveform = ({
  variant,
  width,
  height,
  gap,
  waveColor,
  progressColor,
  hoveredColor,
  bgColor,
  className,
  controls,
  peaks,
  currentTime,
  duration,
  isHovering,
  hoveredWidth,
  showHoveredWaveform,
  hideHoveredWaveform,
  changeCurrentTime,
  enabled,
}: UseTypeWaveformParams) => {
  const [waveform, setWaveform] = useState<HTMLImageElement>();
  const [waveformSvg, setWaveformSvg] = useState<SVGSVGElement>();

  const { addEventListeners, removeEventListeners } = useUpdateCurrentTimeEvent({
    duration,
    showHoveredWaveform,
    hideHoveredWaveform,
    changeCurrentTime,
  });
  const { halfHeight, maxHeight, playedWidth } = useWaveformSize({
    width,
    height,
    currentTime,
    duration,
  });

  const drawLineWaveform = useCallback(
    (element: SVGGElement): void => {
      const polylineElement = createPolylineElement();

      const points = peaks
        .map((peak, index) => {
          const x = index * (gap + BAR_WIDTH);
          const barHeight = Math.round((peak * maxHeight) / 2);
          const yTop = halfHeight - barHeight;
          const yBottom = halfHeight + barHeight;

          return `${x},${yTop} ${x},${yBottom}`;
        })
        .join(' ');

      polylineElement.setAttribute('points', points);
      polylineElement.style.strokeWidth = `${BAR_WIDTH}`;
      polylineElement.setAttribute('stroke', 'currentColor');
      polylineElement.setAttribute('fill', 'none');

      element.appendChild(polylineElement);
    },
    [peaks, halfHeight, maxHeight, gap],
  );

  const drawBarWaveform = useCallback(
    (element: SVGGElement): void => {
      peaks.forEach((peak, index) => {
        const rectElement = createRectElement();
        const x = index * (gap + BAR_WIDTH);
        const barHeight = Math.round((peak * maxHeight) / 2);
        const formattedBarHeight = barHeight > 0 ? barHeight : BAR_WIDTH / 2;
        const yTop = halfHeight - formattedBarHeight;

        rectElement.setAttribute('x', `${x}`);
        rectElement.setAttribute('y', `${yTop}`);
        rectElement.setAttribute('width', `${BAR_WIDTH}`);
        rectElement.setAttribute('height', `${2 * formattedBarHeight}`);
        rectElement.setAttribute('fill', 'currentColor');

        element.appendChild(rectElement);
      });
    },
    [peaks, halfHeight, maxHeight, gap],
  );

  const drawWaveform = useMemo(
    () => (variant === 'line' ? drawLineWaveform : drawBarWaveform),
    [variant, drawLineWaveform, drawBarWaveform],
  );

  const configureWaveform = useCallback((): void => {
    const mainImage = document.createElement('img');
    const mainSvg = createSvgElement(width, height);

    mainImage.setAttribute('class', className);
    if (controls) addEventListeners(mainImage);

    setWaveform(mainImage);
    setWaveformSvg(mainSvg);
  }, [width, height, className, controls, addEventListeners]);

  const initSvgWaveform = useCallback((): void => {
    if (!waveformSvg) return;

    const gElement = createGElement();

    drawWaveform(gElement);
    gElement.id = 'waveform';

    const initUseSvg = createUseElement();
    const playedUseSvg = createUseElement();
    const hoveredUseSvg = createUseElement();
    initUseSvg.setAttribute('href', '#waveform');
    playedUseSvg.setAttribute('href', '#waveform');
    hoveredUseSvg.setAttribute('href', '#waveform');

    const initSvg = createSvgElement(width, height);
    const playedSvg = createSvgElement(width, height);
    const hoveredSvg = createSvgElement(width, height);

    initSvg.id = 'init';
    playedSvg.id = 'played';
    hoveredSvg.id = 'hovered';
    initSvg.appendChild(initUseSvg);
    playedSvg.appendChild(playedUseSvg);
    hoveredSvg.appendChild(hoveredUseSvg);

    initSvg.style.color = waveColor;
    playedSvg.style.color = progressColor;
    hoveredSvg.style.color = hoveredColor;

    waveformSvg.replaceChildren();
    waveformSvg.appendChild(gElement);
    waveformSvg.appendChild(initSvg);
    waveformSvg.appendChild(hoveredSvg);
    waveformSvg.appendChild(playedSvg);
  }, [waveformSvg, drawWaveform, width, height, waveColor, progressColor, hoveredColor]);

  const updateSvgWaveform = useCallback((): void => {
    const initWaveform = waveformSvg?.getElementById('init') as SVGSVGElement;
    const playedWaveform = waveformSvg?.getElementById('played') as SVGSVGElement;
    const hoveredWaveform = waveformSvg?.getElementById('hovered') as SVGSVGElement;

    if (!initWaveform || !playedWaveform || !hoveredWaveform || !waveform || !waveformSvg) return;

    playedWaveform.setAttribute('width', `${playedWidth}`);
    hoveredWaveform.setAttribute('width', `${hoveredWidth}`);

    hoveredWaveform.style.display = isHovering ? 'block' : 'none';

    waveform.src =
      'data:image/svg+xml;charset=utf-8,' +
      encodeURIComponent(new XMLSerializer().serializeToString(waveformSvg));
  }, [waveformSvg, waveform, playedWidth, hoveredWidth, isHovering]);

  useEffect(() => {
    if (!enabled) return;

    configureWaveform();

    return () => {
      if (!waveform || !controls) return;

      removeEventListeners(waveform);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addEventListeners, removeEventListeners, enabled]);

  useEffect(() => {
    if (!enabled) return;

    initSvgWaveform();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    peaks,
    variant,
    width,
    height,
    waveColor,
    progressColor,
    hoveredColor,
    bgColor,
    waveformSvg,
    duration,
    enabled,
  ]);

  useEffect(() => {
    if (!enabled || !waveformSvg) return;

    waveformSvg.setAttribute('width', width.toString());
    waveformSvg.setAttribute('height', height.toString());
  }, [width, height, enabled, waveformSvg]);

  useEffect(() => {
    if (!enabled) return;

    updateSvgWaveform();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovering, waveformSvg, playedWidth, hoveredWidth, enabled]);

  return waveform;
};

export default useSvgWaveform;
