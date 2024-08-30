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
}: UseTypeWaveformParams<'svg'>) => {
  const [waveform, setWaveform] = useState<SVGSVGElement>();

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
    const mainSvg = createSvgElement(width, height);

    mainSvg.setAttribute('class', className);
    mainSvg.style.backgroundColor = bgColor;
    if (controls) addEventListeners(mainSvg);

    setWaveform(mainSvg);
  }, [width, height, className, bgColor, controls, addEventListeners]);

  const initSvgWaveform = useCallback((): void => {
    if (!waveform) return;

    const initSvg = createSvgElement(width, height);
    const playedSvg = createSvgElement(width, height);
    const hoveredSvg = createSvgElement(width, height);

    initSvg.id = 'init';
    playedSvg.id = 'played';
    hoveredSvg.id = 'hovered';

    drawWaveform(initSvg, bgColor, waveColor);
    drawWaveform(playedSvg, 'transparent', progressColor);
    drawWaveform(hoveredSvg, 'transparent', hoveredColor);

    playedSvg.setAttribute('width', `${playedPosition}`);
    hoveredSvg.setAttribute('width', `${hoveredPosition}`);

    waveform.replaceChildren();
    waveform.appendChild(initSvg);
    waveform.appendChild(hoveredSvg);
    waveform.appendChild(playedSvg);
  }, [
    waveform,
    width,
    height,
    drawWaveform,
    bgColor,
    waveColor,
    progressColor,
    hoveredColor,
    playedPosition,
    hoveredPosition,
  ]);

  const updateSvgWaveform = useCallback((): void => {
    const initWaveform = waveform?.getElementById('init') as SVGSVGElement;
    const playedWaveform = waveform?.getElementById('played') as SVGSVGElement;
    const hoveredWaveform = waveform?.getElementById('hovered') as SVGSVGElement;

    if (!initWaveform || !playedWaveform || !hoveredWaveform) return;

    const initStartPosition = isHovering
      ? Math.max(playedPosition, hoveredPosition)
      : playedPosition;

    initWaveform.setAttribute('viewBox', `${initStartPosition} 0 ${width} ${height}`);
    initWaveform.setAttribute('x', `${initStartPosition}`);
    playedWaveform.setAttribute('width', `${playedPosition}`);
    hoveredWaveform.setAttribute('width', `${hoveredPosition}`);

    if (isHovering) {
      hoveredWaveform.style.display = 'block';
      return;
    }

    hoveredWaveform.style.display = 'none';
  }, [waveform, isHovering, playedPosition, hoveredPosition, width, height]);

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
  }, [peaks, variant, waveform, waveColor, progressColor, hoveredColor, bgColor, enabled]);

  useEffect(() => {
    if (!enabled) return;

    updateSvgWaveform();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovering, waveform, playedPosition, hoveredPosition, enabled]);

  return waveform;
};

export default useSvgWaveform;
