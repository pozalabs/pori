import { useCallback, useEffect, useMemo, useState } from 'react';

import useUpdateCurrentTimeEvent from './useUpdateCurrentTimeEvent';
import useWaveformSize from './useWaveformSize';

import { UseTypeWaveformParams } from './_types';
import { BAR_WIDTH, PLAYHEAD_TIME } from './_constants';
import { createCanvasElement, createOffscreenCanvas } from './_utils/createElement';
import formatTime from './_utils/formatTime';

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
  enabled,
  changeCurrentTime,
}: UseTypeWaveformParams) => {
  const [waveform, setWaveform] = useState<HTMLCanvasElement>();
  const [initWaveform, setInitWaveform] = useState<HTMLCanvasElement | OffscreenCanvas>();
  const [playedWaveform, setPlayedWaveform] = useState<HTMLCanvasElement | OffscreenCanvas>();

  const dpr = useMemo(() => window.devicePixelRatio ?? 1, []);

  const { addEventListeners, removeEventListeners } = useUpdateCurrentTimeEvent({
    duration,
    showPlayhead,
    hidePlayhead,
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

        variant === 'line' ? ctx.lineTo(x, yTop) : ctx.moveTo(x, yTop);
        if (variant === 'bar' && barHeight <= 0) {
          ctx.moveTo(x, yTop - BAR_WIDTH / 2);
          ctx.lineTo(x, yTop + BAR_WIDTH / 2);
        }
        ctx.lineTo(x, yBottom);
      });

      ctx.stroke();
      ctx.closePath();
    },
    [variant, peaks, halfHeight, maxHeight, gap],
  );

  const drawPlayhead = useCallback(
    (ctx: CanvasRenderingContext2D): void => {
      ctx.beginPath();
      ctx.lineWidth = playheadWidth;
      ctx.lineCap = 'round';
      ctx.strokeStyle = playheadBgColor;

      ctx.moveTo(playheadPosition, 0);
      ctx.lineTo(playheadPosition, height);

      ctx.stroke();
      ctx.closePath();

      const percent = (playheadPosition / width) * 100;
      const playheadTime = (percent * duration) / 100;
      const formattedPlayheadTime = formatTime(playheadTime > 0 ? playheadTime : 0);
      const playheadTimeWidth =
        ctx.measureText(formattedPlayheadTime).width + PLAYHEAD_TIME.padding * 2;
      const playheadTimeHeight = PLAYHEAD_TIME.fontSize + PLAYHEAD_TIME.padding * 2;

      ctx.beginPath();

      const playheadTimePosition =
        playheadPosition > playheadTimeWidth
          ? playheadPosition - playheadTimeWidth
          : playheadPosition;

      ctx.fillStyle = playheadBgColor;
      ctx.roundRect(playheadTimePosition, 0, playheadTimeWidth, playheadTimeHeight, [3]);
      ctx.fill();

      ctx.font = `${PLAYHEAD_TIME.fontSize}px Arial`;
      ctx.letterSpacing = '-0.2px';
      ctx.strokeStyle = playheadTextColor;
      ctx.lineWidth = 0.7;
      ctx.strokeText(
        `${formattedPlayheadTime}`,
        playheadTimePosition + PLAYHEAD_TIME.padding,
        PLAYHEAD_TIME.fontSize,
      );

      ctx.closePath();
    },
    [
      width,
      height,
      height,
      playheadWidth,
      playheadBgColor,
      playheadTextColor,
      playheadPosition,
      duration,
    ],
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
    const initCanvas = createCanvas(width, height, dpr);
    const playedCanvas = createCanvas(width, height, dpr);

    const initCtx = initCanvas.getContext('2d') as
      | OffscreenCanvasRenderingContext2D
      | CanvasRenderingContext2D
      | null;
    const playedCtx = playedCanvas.getContext('2d') as
      | OffscreenCanvasRenderingContext2D
      | CanvasRenderingContext2D
      | null;

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

    waveformCtx.imageSmoothingEnabled = false;
    waveformCtx.clearRect(0, 0, width, height);
    waveformCtx.drawImage(initWaveform, 0, 0);
    waveformCtx.drawImage(playedWaveform, 0, 0, playedWidth, height, 0, 0, playedWidth, height);
    isPlayheadShowing && drawPlayhead(waveformCtx);
  }, [
    width,
    height,
    playedWidth,
    isPlayheadShowing,
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
  }, [peaks, variant, width, height, waveColor, bgColor, progressColor, duration, enabled]);

  useEffect(() => {
    if (!enabled) return;

    updateCanvasWaveform();
  }, [
    initWaveform,
    progressColor,
    playheadWidth,
    playheadBgColor,
    playheadTextColor,
    playheadPosition,
    isPlayheadShowing,
    playedWaveform,
    playheadWidth,
    currentTime,
    enabled,
  ]);

  return waveform;
};

export default useCanvasWaveform;
