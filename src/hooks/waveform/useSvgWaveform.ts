import { useCallback, useEffect, useState, useMemo } from 'react';

import { BAR_WIDTH } from './_constants';
import type { UseTypeWaveformParams } from './_types';
import {
  createDescElement,
  createPolylineElement,
  createRectElement,
  createSvgElement,
  createTitleElement,
  createSymbolElement,
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
  hoveredPosition,
  showHoveredWaveform,
  hideHoveredWaveform,
  changeCurrentTime,
  enabled,
}: UseTypeWaveformParams<'svg'>) => {
  const [waveform, setWaveform] = useState<SVGSVGElement>();
  const [isInitialized, setIsInitialized] = useState(false);

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
    (element: SVGSymbolElement): void => {
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
      polylineElement.setAttribute('stroke', 'inherit');
      polylineElement.setAttribute('fill', 'none');

      element.appendChild(polylineElement);
    },
    [peaks, halfHeight, maxHeight, gap],
  );

  const drawBarWaveform = useCallback(
    (element: SVGSymbolElement): void => {
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
        rectElement.setAttribute('fill', 'inherit');
        rectElement.setAttribute('stroke', 'none');

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
    const mainSvg = createSvgElement(width, height);

    mainSvg.setAttribute('class', className);
    mainSvg.setAttribute('role', 'img');
    mainSvg.setAttribute('aria-label', 'waveform');
    mainSvg.style.backgroundColor = bgColor;
    if (controls) addEventListeners(mainSvg);

    setWaveform(mainSvg);
  }, [width, height, className, bgColor, controls, addEventListeners]);

  const initSvgWaveform = useCallback((): void => {
    if (!waveform) return;

    const titleEl = createTitleElement();
    const descEl = createDescElement();
    titleEl.textContent = 'SVG Waveform';
    descEl.textContent = 'Audio Waveform using SVG Elements.';

    const symbolElement = createSymbolElement();
    drawWaveform(symbolElement);
    symbolElement.id = 'waveform';

    const initUseSvg = createUseElement();
    const playedUseSvg = createUseElement();
    const hoveredUseSvg = createUseElement();
    initUseSvg.setAttribute('href', '#waveform');
    playedUseSvg.setAttribute('href', '#waveform');
    hoveredUseSvg.setAttribute('href', '#waveform');

    initUseSvg.setAttribute('fill', waveColor);
    playedUseSvg.setAttribute('fill', progressColor);
    hoveredUseSvg.setAttribute('fill', hoveredColor);
    initUseSvg.setAttribute('stroke', waveColor);
    playedUseSvg.setAttribute('stroke', progressColor);
    hoveredUseSvg.setAttribute('stroke', hoveredColor);

    const initSvg = createSvgElement(width, height);
    const playedSvg = createSvgElement(width, height);
    const hoveredSvg = createSvgElement(width, height);

    initSvg.id = 'init';
    playedSvg.id = 'played';
    hoveredSvg.id = 'hovered';
    initSvg.appendChild(initUseSvg);
    playedSvg.appendChild(playedUseSvg);
    hoveredSvg.appendChild(hoveredUseSvg);

    waveform.replaceChildren();
    waveform.appendChild(titleEl);
    waveform.appendChild(descEl);
    waveform.appendChild(symbolElement);
    waveform.appendChild(initSvg);
    waveform.appendChild(hoveredSvg);
    waveform.appendChild(playedSvg);

    setIsInitialized(true);
  }, [waveform, drawWaveform, width, height, waveColor, progressColor, hoveredColor]);

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

    setIsInitialized(false);

    if (isHovering && hoveredPosition > playedPosition) {
      hoveredWaveform.setAttribute('viewBox', `${playedPosition} 0 ${hoveredPosition} ${height}`);
      hoveredWaveform.setAttribute('x', `${playedPosition}`);
      hoveredWaveform.setAttribute('width', `${hoveredPosition}`);
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
    waveform,
    waveColor,
    progressColor,
    hoveredColor,
    bgColor,
    enabled,
  ]);

  useEffect(() => {
    if (!enabled || !waveform) return;

    waveform.setAttribute('width', width.toString());
    waveform.setAttribute('height', height.toString());
  }, [width, height, enabled, waveform]);

  useEffect(() => {
    if (!enabled) return;

    updateSvgWaveform();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovering, isInitialized, waveform, playedPosition, hoveredPosition, enabled]);

  return waveform;
};

export default useSvgWaveform;
