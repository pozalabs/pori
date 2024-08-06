import { useCallback, useEffect, useMemo, useState } from 'react';

import useUpdateCurrentTimeEvent from './useUpdateCurrentTimeEvent';
import useWaveformSize from './useWaveformSize';

import { UseTypeWaveformParams } from './_types';
import { BAR_WIDTH, WAVEFORM_HEIGHT_PERCENT } from './_constants';
import { createCanvasElement } from './_utils/createElement';

const useCanvasWaveform = ({
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
  const [playedWaveform, setPlayedWaveform] = useState<HTMLCanvasElement>();

  const dpr = useMemo(() => window.devicePixelRatio ?? 1, []);

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
    (ctx: CanvasRenderingContext2D): void => {
      ctx.beginPath();

      peaks.forEach((peak, index) => {
        const x = Math.round(index * barIndexScale) / dpr;
        const waveformMaxHeight = (height / 100) * WAVEFORM_HEIGHT_PERCENT;
        const barHeight = Math.round(peak * (waveformMaxHeight / 2));
        const yTop = (halfHeight - barHeight) / dpr;
        const yBottom = (halfHeight + barHeight) / dpr;

        ctx.lineTo(x, yTop);
        ctx.lineTo(x, yBottom);
      });

      ctx.stroke();
      ctx.closePath();
    },
    [peaks, halfHeight, barIndexScale, height],
  );

  const drawPlayhead = useCallback(
    (ctx: CanvasRenderingContext2D): void => {
      ctx.beginPath();
      ctx.lineWidth = playheadWidth;
      ctx.lineCap = 'round';
      ctx.strokeStyle = playheadColor;

      ctx.moveTo(playedWidth, 0);
      ctx.lineTo(playedWidth, height);

      ctx.stroke();
      ctx.closePath();
    },
    [playedWidth, barIndexScale, height, playheadWidth, playheadColor],
  );

  const configureWaveform = useCallback((): void => {
    const mainCanvas = createCanvasElement(width, height, dpr);

    const waveformCtx = mainCanvas.getContext('2d');

    if (!waveformCtx) return;

    mainCanvas.setAttribute('class', className);
    controls && addEventListeners(mainCanvas);

    setWaveform(mainCanvas);
  }, [width, height, className, controls, addEventListeners]);

  const initCanvasWaveform = useCallback((): void => {
    const initCanvas = createCanvasElement(width, height, dpr);
    const playedCanvas = createCanvasElement(width, height, dpr);

    const initCtx = initCanvas.getContext('2d');
    const playedCtx = playedCanvas.getContext('2d');

    if (!initCtx || !playedCtx) return;

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

    setInitWaveform(initCanvas);
    setPlayedWaveform(playedCanvas);
  }, [width, height, bgColor, waveColor, progressColor, drawWaveform]);

  const updateCanvasWaveform = useCallback((): void => {
    if (!waveform || !initWaveform || !playedWaveform) return;

    const waveformCtx = waveform.getContext('2d');

    if (!waveformCtx) return;

    waveformCtx.clearRect(0, 0, width, height);
    waveformCtx.drawImage(initWaveform, 0, 0);
    waveformCtx.drawImage(
      playedWaveform,
      0,
      0,
      playedWidth,
      height,
      0,
      0,
      playedWidth,
      height,
    );
    playhead && drawPlayhead(waveformCtx);
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

    initCanvasWaveform();
  }, [
    peaks,
    width,
    height,
    waveColor,
    bgColor,
    progressColor,
    duration,
    enabled,
  ]);

  useEffect(() => {
    if (!enabled) return;

    updateCanvasWaveform();
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

export default useCanvasWaveform;
