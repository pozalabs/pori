import { useCallback, useEffect, useMemo, useState } from 'react';

import { BAR_WIDTH } from './_constants';
import type { UseTypeWaveformParams } from './_types';
import { createCanvasElement, createOffscreenCanvas } from './_utils/createElement';
import useUpdateCurrentTimeEvent from './useUpdateCurrentTimeEvent';
import useWaveformSize from './useWaveformSize';

const createCanvas = (
  width: number,
  height: number,
  scaleFactor: number,
): HTMLCanvasElement | OffscreenCanvas => {
  if (typeof window.OffscreenCanvas === 'undefined') {
    return createCanvasElement(width, height, scaleFactor);
  }

  return createOffscreenCanvas(width, height, scaleFactor);
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
  hoveredPosition,
  showHoveredWaveform,
  hideHoveredWaveform,
  enabled,
  changeCurrentTime,
}: UseTypeWaveformParams<'canvas'>) => {
  const [waveform, setWaveform] = useState<HTMLCanvasElement>();
  const [initWaveform, setInitWaveform] = useState<HTMLCanvasElement | OffscreenCanvas>();
  const [playedWaveform, setPlayedWaveform] = useState<HTMLCanvasElement | OffscreenCanvas>();
  const [hoveredWaveform, setHoveredWaveform] = useState<HTMLCanvasElement | OffscreenCanvas>();

  const scaleFactor = useMemo(() => Math.max(window.devicePixelRatio ?? 1, 4), []);

  const { addEventListeners, removeEventListeners } = useUpdateCurrentTimeEvent({
    duration,
    showHoveredWaveform,
    hideHoveredWaveform,
    changeCurrentTime,
  });
  const { halfHeight, maxHeight, halfBarOffset, playedPosition } = useWaveformSize({
    width,
    height,
    currentTime,
    duration,
  });

  const getWaveformPath = useCallback((): Path2D => {
    const path = new Path2D();

    peaks.forEach((peak, index) => {
      const x = (index * (gap + BAR_WIDTH) + halfBarOffset) / scaleFactor;
      const barHeight = Math.round((peak * maxHeight) / 2);
      const yTop = Math.round(((halfHeight - barHeight) / scaleFactor) * 4) / 4;
      const yBottom = Math.round(((halfHeight + barHeight) / scaleFactor) * 4) / 4;

      if (variant === 'line') {
        path.lineTo(x, yTop);
      }
      path.moveTo(x, yTop);

      if (variant === 'bar' && barHeight <= 0) {
        path.moveTo(x, yTop - BAR_WIDTH / 2);
        path.lineTo(x, yTop + BAR_WIDTH / 2);
      }
      path.lineTo(x, yBottom);
    });

    path.closePath();

    return path;
  }, [peaks, gap, halfBarOffset, scaleFactor, maxHeight, halfHeight, variant]);

  const configureWaveform = useCallback((): void => {
    const mainCanvas = createCanvasElement(width, height, scaleFactor);

    const waveformCtx = mainCanvas.getContext('2d');

    if (!waveformCtx) return;

    waveformCtx.imageSmoothingQuality = 'high';

    mainCanvas.setAttribute('class', className);
    mainCanvas.setAttribute('role', 'img');
    mainCanvas.setAttribute('aria-label', 'waveform');
    if (controls) addEventListeners(mainCanvas);

    setWaveform(mainCanvas);
  }, [width, height, scaleFactor, className, controls, addEventListeners]);

  const initCanvasWaveform = useCallback((): void => {
    const initCanvas = createCanvas(width, height, scaleFactor);
    const playedCanvas = createCanvas(width, height, scaleFactor);
    const hoveredCanvas = createCanvas(width, height, scaleFactor);

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
    playedCtx.fillStyle = bgColor;
    playedCtx.clearRect(0, 0, width, height);
    playedCtx.fillRect(0, 0, width, height);
    playedCtx.fill();
    hoveredCtx.fillStyle = bgColor;
    hoveredCtx.clearRect(0, 0, width, height);
    hoveredCtx.fillRect(0, 0, width, height);
    hoveredCtx.fill();

    const path = getWaveformPath();

    initCtx.lineWidth = BAR_WIDTH / scaleFactor;
    initCtx.strokeStyle = waveColor;
    initCtx.stroke(path);

    playedCtx.lineWidth = BAR_WIDTH / scaleFactor;
    playedCtx.strokeStyle = progressColor;
    playedCtx.stroke(path);

    hoveredCtx.lineWidth = BAR_WIDTH / scaleFactor;
    hoveredCtx.strokeStyle = hoveredColor;
    hoveredCtx.stroke(path);

    setInitWaveform(initCanvas);
    setPlayedWaveform(playedCanvas);
    setHoveredWaveform(hoveredCanvas);
  }, [
    width,
    height,
    scaleFactor,
    bgColor,
    getWaveformPath,
    waveColor,
    progressColor,
    hoveredColor,
  ]);

  const updateCanvasWaveform = useCallback((): void => {
    if (!waveform || !initWaveform || !playedWaveform || !hoveredWaveform) return;

    const waveformCtx = waveform.getContext('2d');

    if (!waveformCtx) return;

    waveformCtx.clearRect(0, 0, width, height);

    if (variant === 'line') waveformCtx.imageSmoothingQuality = 'high';
    if (variant === 'bar') waveformCtx.imageSmoothingEnabled = false;

    const initStartPosition = isHovering
      ? Math.max(playedPosition, hoveredPosition)
      : playedPosition;
    waveformCtx.drawImage(
      initWaveform,
      initStartPosition,
      0,
      width,
      height,
      initStartPosition,
      0,
      width,
      height,
    );
    if (isHovering && hoveredPosition > playedPosition) {
      waveformCtx.drawImage(
        hoveredWaveform,
        playedPosition,
        0,
        hoveredPosition - playedPosition,
        height,
        playedPosition,
        0,
        hoveredPosition - playedPosition,
        height,
      );
    }
    waveformCtx.drawImage(
      playedWaveform,
      0,
      0,
      playedPosition,
      height,
      0,
      0,
      playedPosition,
      height,
    );
  }, [
    waveform,
    initWaveform,
    playedWaveform,
    hoveredWaveform,
    width,
    height,
    variant,
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
  }, [addEventListeners, removeEventListeners, enabled]);

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
    if (!enabled || !waveform) return;

    const ctx = waveform.getContext('2d');

    waveform.width = width * scaleFactor;
    waveform.height = height * scaleFactor;
    waveform.style.width = `${width}px`;
    waveform.style.height = `${height}px`;

    ctx?.scale(scaleFactor, scaleFactor);
  }, [width, height, enabled, scaleFactor, waveform]);

  useEffect(() => {
    if (!enabled) return;

    updateCanvasWaveform();
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

export default useCanvasWaveform;
