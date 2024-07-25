import { useEffect, useState } from 'react';
import { UseTypeWaveformParams } from './_types';
import useUpdateCurrentTimeEvent from './useUpdateCurrentTimeEvent';

const useCanvasWaveform = ({
  width,
  height,
  waveColor,
  progressColor,
  bgColor,
  className,
  playhead,
  peaks,
  currentTime,
  duration,
  changeCurrentTime,
  enabled,
}: UseTypeWaveformParams) => {
  const [waveform, setWaveform] = useState<HTMLCanvasElement>();
  const [initWaveform, setInitWaveform] = useState<HTMLCanvasElement>();
  const { addEventListeners, removeEventListeners } = useUpdateCurrentTimeEvent(
    { duration, changeCurrentTime },
  );

  const halfHeight = height / 2;
  const barIndexScale = width / peaks.length;
  const playedWidth = (currentTime / duration) * width;
  const playedIndex = Math.floor(playedWidth / barIndexScale);

  const drawWaveform = (
    ctx: CanvasRenderingContext2D,
    peaks: number[],
  ): void => {
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
  };

  const drawPlayhead = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.lineWidth = 0.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';

    const x = Math.round(playedIndex * barIndexScale);

    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);

    ctx.stroke();
    ctx.closePath();
  };

  const initCanvasWaveform = (): void => {
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

    className && waveformCanvas.setAttribute('class', className);
    addEventListeners(waveformCanvas);
    waveformCtx.drawImage(initWaveformCanvas, 0, 0);
    if (playhead) drawPlayhead(waveformCtx);

    setInitWaveform(initWaveformCanvas);
    setWaveform(waveformCanvas);
  };

  const updateCanvasWaveform = (): void => {
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
  };

  useEffect(() => {
    if (!enabled) return;

    initCanvasWaveform();

    return () => {
      if (!waveform) return;

      removeEventListeners(waveform);
    };
  }, [peaks, width, height, waveColor, bgColor, enabled]);

  useEffect(() => {
    if (!enabled) return;

    updateCanvasWaveform();
  }, [progressColor, duration, currentTime, enabled]);

  return waveform;
};

export default useCanvasWaveform;
