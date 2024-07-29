import { useCallback, useEffect, useMemo, useState } from 'react';
import { UseTypeWaveformParams } from './_types';
import useUpdateCurrentTimeEvent from './useUpdateCurrentTimeEvent';

const createCanvasElement = (width: number, height: number): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  return canvas;
};

const useCanvasWaveform = ({
  width,
  height,
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

  const halfHeight = useMemo(() => height / 2, [height]);
  const barIndexScale = useMemo(() => width / peaks.length, [width, peaks.length]);
  const playedWidth = useMemo(
    () => (currentTime / duration) * width,
    [currentTime, duration, width],
  );
  const playedIndex = useMemo(
    () => Math.floor(playedWidth / barIndexScale),
    [playedWidth, barIndexScale],
  );

  const drawWaveform = useCallback(
    (ctx: CanvasRenderingContext2D, peaks: number[]): void => {
      ctx.beginPath();

      peaks.forEach((peak, index) => {
        const x = Math.round(index * barIndexScale);
        const waveformMaxHeight = (height / 10) * 8;
        const barHeight = Math.round(peak * (waveformMaxHeight / 2));
        const yTop = halfHeight - barHeight;
        const yBottom = halfHeight + barHeight;

        ctx.lineTo(x, yTop);
        ctx.lineTo(x, yBottom);
      });

      ctx.stroke();
      ctx.closePath();
    },
    [halfHeight, barIndexScale, height],
  );

  const drawPlayhead = useCallback(
    (ctx: CanvasRenderingContext2D): void => {
      ctx.beginPath();
      ctx.lineWidth = 0.5;
      ctx.lineCap = 'round';
      ctx.strokeStyle = playheadColor;

      const x = Math.round(playedIndex * barIndexScale);

      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);

      ctx.stroke();
      ctx.closePath();
    },
    [playedIndex, barIndexScale, height, playheadColor],
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
  }, [peaks, width, height, waveColor, bgColor, enabled]);

  useEffect(() => {
    if (!enabled) return;

    updateCanvasWaveform();
  }, [initWaveform, progressColor, playheadColor, currentTime, enabled]);

  return waveform;
};

export default useCanvasWaveform;
