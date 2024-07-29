import { useCallback, useEffect, useMemo, useState } from 'react';
import { UseTypeWaveformParams } from './_types';
import useUpdateCurrentTimeEvent from './useUpdateCurrentTimeEvent';

const useCanvasWaveform = ({
  width,
  height,
  waveColor,
  progressColor,
  bgColor,
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
        const formattedHeight = (height / 10) * 8;
        const barHeight = Math.round(peak * (formattedHeight / 2));
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
      ctx.strokeStyle = 'black';

      const x = Math.round(playedIndex * barIndexScale);

      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);

      ctx.stroke();
      ctx.closePath();
    },
    [playedIndex, barIndexScale, height],
  );

  const initCanvasWaveform = useCallback((): void => {
    const initWaveformCanvas = document.createElement('canvas');
    initWaveformCanvas.width = width;
    initWaveformCanvas.height = height;
    const waveformCanvas = document.createElement('canvas');
    waveformCanvas.width = width;
    waveformCanvas.height = height;

    const initCtx = initWaveformCanvas.getContext('2d');
    const waveformCtx = waveformCanvas.getContext('2d');

    if (!initCtx || !waveformCtx) return;

    initCtx.fillStyle = bgColor;
    initCtx.clearRect(0, 0, width, height);
    initCtx.fillRect(0, 0, width, height);
    initCtx.fill();

    initCtx.lineWidth = 1;
    initCtx.lineCap = 'round';
    initCtx.strokeStyle = waveColor;

    drawWaveform(initCtx, peaks);

    waveformCanvas.setAttribute('class', className);
    controls && addEventListeners(waveformCanvas);

    setInitWaveform(initWaveformCanvas);
    setWaveform(waveformCanvas);
  }, [
    width,
    height,
    bgColor,
    waveColor,
    peaks,
    className,
    controls,
    addEventListeners,
    drawWaveform,
  ]);

  const updateCanvasWaveform = useCallback((): void => {
    if (!waveform || !initWaveform) return;

    const playedWaveformCanvas = document.createElement('canvas');
    playedWaveformCanvas.width = width;
    playedWaveformCanvas.height = height;

    const waveformCtx = waveform.getContext('2d');
    const playedCtx = playedWaveformCanvas.getContext('2d');

    if (!waveformCtx || !playedCtx) return;

    playedCtx.lineWidth = 1;
    playedCtx.lineCap = 'round';
    playedCtx.clearRect(0, 0, width, height);

    playedCtx.strokeStyle = progressColor;

    drawWaveform(playedCtx, peaks.slice(0, playedIndex));
    if (playhead) drawPlayhead(playedCtx);

    waveformCtx.clearRect(0, 0, width, height);
    waveformCtx.drawImage(initWaveform, 0, 0);
    waveformCtx.drawImage(playedWaveformCanvas, 0, 0);
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

    initCanvasWaveform();

    return () => {
      if (!waveform || !controls) return;

      removeEventListeners(waveform);
    };
  }, [peaks, width, height, waveColor, bgColor, enabled]);

  useEffect(() => {
    if (!enabled) return;

    updateCanvasWaveform();
  }, [initWaveform, progressColor, currentTime, enabled]);

  return waveform;
};

export default useCanvasWaveform;
