import { useCallback, useEffect, useState, useMemo } from 'react';

import { BAR_WIDTH } from './_constants';
import type { UseTypeWaveformParams } from './_types';
import { createPolylineElement, createRectElement, createSvgElement } from './_utils/createElement';
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
  hoveredPosition,
  showHoveredWaveform,
  hideHoveredWaveform,
  changeCurrentTime,
  enabled,
}: UseTypeWaveformParams) => {
  const [waveform, setWaveform] = useState<HTMLImageElement>();
  const [initWaveform, setInitWaveform] = useState<SVGSVGElement>();
  const [playedWaveform, setPlayedWaveform] = useState<SVGSVGElement>();
  const [hoveredWaveform, setHoveredWaveform] = useState<SVGSVGElement>();

  const { addEventListeners, removeEventListeners } = useUpdateCurrentTimeEvent({
    duration,
    showHoveredWaveform,
    hideHoveredWaveform,
    changeCurrentTime,
  });
  const { halfHeight, maxHeight, playedPosition } = useWaveformSize({
    width,
    height,
    currentTime,
    duration,
  });

  const drawLineWaveform = useCallback(
    (svgElement: SVGSVGElement, bgColor: string, waveColor: string): void => {
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

      svgElement.style.background = bgColor;
      polylineElement.setAttribute('points', points);
      polylineElement.style.strokeWidth = `${BAR_WIDTH}`;
      polylineElement.style.stroke = waveColor;
      polylineElement.style.fill = 'none';

      svgElement.appendChild(polylineElement);
    },
    [peaks, halfHeight, maxHeight, gap],
  );

  const drawBarWaveform = useCallback(
    (svgElement: SVGSVGElement, bgColor: string, waveColor: string): void => {
      svgElement.style.background = bgColor;

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
        rectElement.style.fill = waveColor;

        svgElement.appendChild(rectElement);
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

    mainImage.setAttribute('class', className);
    if (controls) addEventListeners(mainImage);

    setWaveform(mainImage);
  }, [className, controls, addEventListeners]);

  const initSvgWaveform = useCallback((): void => {
    const initSvg = createSvgElement(width, height);
    const playedSvg = createSvgElement(width, height);
    const hoveredSvg = createSvgElement(width, height);

    drawWaveform(initSvg, bgColor, waveColor);
    drawWaveform(playedSvg, 'transparent', progressColor);
    drawWaveform(hoveredSvg, 'transparent', hoveredColor);

    setInitWaveform(initSvg);
    setPlayedWaveform(playedSvg);
    setHoveredWaveform(hoveredSvg);
  }, [width, height, bgColor, waveColor, progressColor, hoveredColor, drawWaveform]);

  const updateSvgWaveform = useCallback((): void => {
    if (!waveform || !initWaveform || !playedWaveform || !hoveredWaveform) return;

    const newMainSvg = createSvgElement(width, height);

    newMainSvg.style.background = bgColor;
    const initStartPosition = isHovering
      ? Math.max(playedPosition, hoveredPosition)
      : playedPosition;

    initWaveform.setAttribute('viewBox', `${initStartPosition} 0 ${width} ${height}`);
    initWaveform.setAttribute('x', `${initStartPosition}`);
    playedWaveform.setAttribute('width', `${playedPosition}`);
    hoveredWaveform.setAttribute('width', `${hoveredPosition}`);

    newMainSvg.appendChild(initWaveform);
    if (isHovering && hoveredPosition > playedPosition) newMainSvg.appendChild(hoveredWaveform);
    newMainSvg.appendChild(playedWaveform);

    waveform.src =
      'data:image/svg+xml;charset=utf-8,' +
      encodeURIComponent(new XMLSerializer().serializeToString(newMainSvg));
  }, [
    waveform,
    initWaveform,
    playedWaveform,
    hoveredWaveform,
    width,
    height,
    bgColor,
    isHovering,
    playedPosition,
    hoveredPosition,
  ]);

  useEffect(() => {
    if (!enabled) return;

    configureWaveform();

    return () => {
      if (!waveform || !controls) return;

      removeEventListeners(waveform);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height, addEventListeners, removeEventListeners, enabled]);

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
    duration,
    enabled,
  ]);

  useEffect(() => {
    if (!enabled) return;

    updateSvgWaveform();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    initWaveform,
    progressColor,
    hoveredPosition,
    isHovering,
    playedWaveform,
    hoveredWaveform,
    currentTime,
    enabled,
  ]);

  return waveform;
};

export default useSvgWaveform;
