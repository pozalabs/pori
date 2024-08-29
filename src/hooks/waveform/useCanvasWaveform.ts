import { useCallback, useEffect, useMemo, useState } from 'react';

import { BAR_WIDTH } from './_constants';
import type { UseTypeWaveformParams } from './_types';
import { createCanvasElement, createOffscreenCanvas } from './_utils/createElement';
import useUpdateCurrentTimeEvent from './useUpdateCurrentTimeEvent';
import useWaveformSize from './useWaveformSize';

const createCanvas = (
  width: number,
  height: number,
  dpr: number,
): HTMLCanvasElement | OffscreenCanvas => {
  if (typeof window.OffscreenCanvas === 'undefined') {
    return createCanvasElement(width, height, dpr);
  }

  return createOffscreenCanvas(width, height, dpr);
};

const useCanvasWaveform = ({
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
  enabled,
  changeCurrentTime,
}: UseTypeWaveformParams<'canvas'>) => {
  const [waveform, setWaveform] = useState<HTMLCanvasElement>();
  const [initWaveform, setInitWaveform] = useState<HTMLCanvasElement | OffscreenCanvas>();
  const [playedWaveform, setPlayedWaveform] = useState<HTMLCanvasElement | OffscreenCanvas>();
  const [hoveredWaveform, setHoveredWaveform] = useState<HTMLCanvasElement | OffscreenCanvas>();

  const dpr = useMemo(() => Math.max(window.devicePixelRatio, 1), []);

  const { addEventListeners, removeEventListeners } = useUpdateCurrentTimeEvent({
    duration,
    showHoveredWaveform,
    hideHoveredWaveform,
    changeCurrentTime,
  });
  const { halfHeight, maxHeight, halfBarOffset, playedWidth } = useWaveformSize({
    width,
    height,
    currentTime,
    duration,
  });

  const drawWaveform = useCallback(
    (ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D): void => {
      ctx.beginPath();

      peaks.forEach((peak, index) => {
        const x = (index * (gap + BAR_WIDTH) + halfBarOffset) / dpr;
        const barHeight = Math.round((peak * maxHeight) / 2);
        const yTop = (halfHeight - barHeight) / dpr;
        const yBottom = (halfHeight + barHeight) / dpr;

        if (variant === 'line') {
          ctx.lineTo(x, yTop);
        }
        ctx.moveTo(x, yTop);

        if (variant === 'bar' && barHeight <= 0) {
          ctx.moveTo(x, yTop - BAR_WIDTH / 2);
          ctx.lineTo(x, yTop + BAR_WIDTH / 2);
        }
        ctx.lineTo(x, yBottom);
      });

      ctx.stroke();
      ctx.closePath();
    },
    [peaks, gap, halfBarOffset, dpr, maxHeight, halfHeight, variant],
  );

  const configureWaveform = useCallback((): void => {
    const mainCanvas = createCanvasElement(width, height, dpr);

    const waveformCtx = mainCanvas.getContext('2d');

    if (!waveformCtx) return;

    waveformCtx.imageSmoothingQuality = 'high';

    mainCanvas.setAttribute('class', className);
    if (controls) addEventListeners(mainCanvas);

    setWaveform(mainCanvas);
  }, [width, height, dpr, className, controls, addEventListeners]);

  const initCanvasWaveform = useCallback((): void => {
    const initCanvas = createCanvas(width, height, dpr);
    const playedCanvas = createCanvas(width, height, dpr);
    const hoveredCanvas = createCanvas(width, height, dpr);

    const initCtx = initCanvas.getContext('2d') as
      | OffscreenCanvasRenderingContext2D
      | CanvasRenderingContext2D
      | null;
    const playedCtx = playedCanvas.getContext('2d') as
      | OffscreenCanvasRenderingContext2D
      | CanvasRenderingContext2D
      | null;
    const hoveredCtx = hoveredCanvas.getContext('2d') as
      | OffscreenCanvasRenderingContext2D
      | CanvasRenderingContext2D
      | null;

    if (!initCtx || !playedCtx || !hoveredCtx) return;

    initCtx.fillStyle = bgColor;
    initCtx.clearRect(0, 0, width, height);
    initCtx.fillRect(0, 0, width, height);
    initCtx.fill();

    initCtx.lineWidth = BAR_WIDTH / dpr;
    initCtx.strokeStyle = waveColor;

    drawWaveform(initCtx);

    playedCtx.lineWidth = BAR_WIDTH / dpr;
    playedCtx.clearRect(0, 0, width, height);

    playedCtx.strokeStyle = progressColor;

    drawWaveform(playedCtx);

    hoveredCtx.lineWidth = BAR_WIDTH / dpr;
    hoveredCtx.clearRect(0, 0, width, height);

    hoveredCtx.strokeStyle = hoveredColor;

    drawWaveform(hoveredCtx);

    setInitWaveform(initCanvas);
    setPlayedWaveform(playedCanvas);
    setHoveredWaveform(hoveredCanvas);
  }, [width, height, dpr, bgColor, waveColor, drawWaveform, progressColor, hoveredColor]);

  const updateCanvasWaveform = useCallback((): void => {
    if (!waveform || !initWaveform || !playedWaveform || !hoveredWaveform) return;

    const waveformCtx = waveform.getContext('2d');

    if (!waveformCtx) return;

    waveformCtx.clearRect(0, 0, width, height);
    waveformCtx.drawImage(initWaveform, 0, 0);
    if (isHovering)
      waveformCtx.drawImage(
        hoveredWaveform,
        0,
        0,
        hoveredWidth,
        height,
        0,
        0,
        hoveredWidth,
        height,
      );
    waveformCtx.drawImage(playedWaveform, 0, 0, playedWidth, height, 0, 0, playedWidth, height);
  }, [
    width,
    height,
    playedWidth,
    waveform,
    isHovering,
    initWaveform,
    playedWaveform,
    hoveredWaveform,
    hoveredWidth,
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

    initCanvasWaveform();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    peaks,
    variant,
    width,
    height,
    waveColor,
    bgColor,
    progressColor,
    hoveredColor,
    duration,
    enabled,
  ]);

  useEffect(() => {
    if (!enabled) return;

    updateCanvasWaveform();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    initWaveform,
    progressColor,
    hoveredWidth,
    isHovering,
    playedWaveform,
    hoveredWaveform,
    currentTime,
    enabled,
  ]);

  return waveform;
};

export default useCanvasWaveform;
