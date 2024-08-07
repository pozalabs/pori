import { useCallback, useEffect, useState } from 'react';

import useUpdateCurrentTimeEvent from './useUpdateCurrentTimeEvent';
import useWaveformSize from './useWaveformSize';

import { UseTypeWaveformParams } from './_types';
import { WAVEFORM_HEIGHT_PERCENT } from './_constants';
import { createCanvasElement } from './_utils/createElement';

const useCanvasWaveform = ({
  variant,
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
  const [waveform, setWaveform] = useState<HTMLCanvasElement>();
  const [initWaveform, setInitWaveform] = useState<HTMLCanvasElement>();

  const { addEventListeners, removeEventListeners } = useUpdateCurrentTimeEvent({
    duration,
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
    (ctx: CanvasRenderingContext2D, peaks: number[]): void => {
      ctx.beginPath();

      peaks.forEach((peak, index) => {
        const x = Math.round(index * barIndexScale);
        const waveformMaxHeight = (height / 100) * WAVEFORM_HEIGHT_PERCENT;
        const barHeight = Math.round(peak * (waveformMaxHeight / 2));
        const yTop = halfHeight - barHeight;
        const yBottom = halfHeight + barHeight;

        variant === 'line' ? ctx.lineTo(x, yTop) : ctx.moveTo(x, yTop);
        ctx.lineTo(x, yBottom);
      });

      ctx.stroke();
      ctx.closePath();
    },
    [variant, halfHeight, barIndexScale, height],
  );

  const drawPlayhead = useCallback(
    (ctx: CanvasRenderingContext2D): void => {
      ctx.beginPath();
      ctx.lineWidth = playheadWidth;
      ctx.lineCap = 'round';
      ctx.strokeStyle = playheadColor;

      const x = Math.round(playedIndex * barIndexScale);

      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);

      ctx.stroke();
      ctx.closePath();
    },
    [playedIndex, barIndexScale, height, playheadWidth, playheadColor],
  );

  const configureWaveform = useCallback((): void => {
    const mainCanvas = createCanvasElement(width, height);

    const waveformCtx = mainCanvas.getContext('2d');

    if (!waveformCtx) return;

    mainCanvas.setAttribute('class', className);
    controls && addEventListeners(mainCanvas);

    setWaveform(mainCanvas);
  }, [width, height, className, controls, addEventListeners]);

  const initCanvasWaveform = useCallback((): void => {
    const initCanvas = createCanvasElement(width, height);

    const initCtx = initCanvas.getContext('2d');

    if (!initCtx) return;

    initCtx.fillStyle = bgColor;
    initCtx.clearRect(0, 0, width, height);
    initCtx.fillRect(0, 0, width, height);
    initCtx.fill();

    initCtx.lineWidth = 1;
    initCtx.lineCap = 'round';
    initCtx.strokeStyle = waveColor;

    drawWaveform(initCtx, peaks);

    setInitWaveform(initCanvas);
  }, [width, height, bgColor, waveColor, peaks, drawWaveform]);

  const updateCanvasWaveform = useCallback((): void => {
    if (!waveform || !initWaveform) return;

    const playedCanvas = createCanvasElement(width, height);

    const waveformCtx = waveform.getContext('2d');
    const playedCtx = playedCanvas.getContext('2d');

    if (!waveformCtx || !playedCtx) return;

    playedCtx.lineWidth = 1;
    playedCtx.lineCap = 'round';
    playedCtx.clearRect(0, 0, width, height);

    playedCtx.strokeStyle = progressColor;

    drawWaveform(playedCtx, peaks.slice(0, playedIndex));
    playhead && drawPlayhead(playedCtx);

    waveformCtx.clearRect(0, 0, width, height);
    waveformCtx.drawImage(initWaveform, 0, 0);
    waveformCtx.drawImage(playedCanvas, 0, 0);
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

    initCanvasWaveform();
  }, [peaks, variant, width, height, waveColor, bgColor, duration, enabled]);

  useEffect(() => {
    if (!enabled) return;

    updateCanvasWaveform();
  }, [initWaveform, progressColor, playheadWidth, playheadColor, currentTime, enabled]);

  return waveform;
};

export default useCanvasWaveform;
