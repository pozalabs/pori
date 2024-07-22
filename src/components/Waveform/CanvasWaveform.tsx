import { useCallback, useEffect, useRef } from 'react';

interface CanvasWaveformProps {
  peaks: number[];
}

const CanvasWaveform = ({ peaks }: CanvasWaveformProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const setCanvasSize = useCallback((): void => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!ctx || !canvas || !canvas.parentElement) return;

    const { clientWidth, clientHeight } = canvas.parentElement;

    ctx.canvas.width = clientWidth;
    ctx.canvas.height = clientHeight;
  }, []);

  const drawWaveform = useCallback((peaks: number[]): void => {
    const ctx = canvasRef.current?.getContext('2d');

    if (!ctx) return;

    const { width, height } = ctx.canvas;

    const halfHeight = height / 2;
    const barIndexScale = width / peaks.length;

    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    ctx.beginPath();

    peaks.forEach((peak, index) => {
      const x = Math.round(index * barIndexScale);
      const barHeight = Math.round(peak * halfHeight);
      const yTop = halfHeight - barHeight;
      const yBottom = halfHeight + barHeight;

      ctx.lineTo(x, yTop);
      ctx.lineTo(x, yBottom);
    });

    ctx.stroke();
    ctx.closePath();
  }, []);

  useEffect(() => {
    setCanvasSize();
    drawWaveform(peaks);
  }, [drawWaveform, peaks, setCanvasSize]);

  return <canvas ref={canvasRef} className="bg-transparent" />;
};

export default CanvasWaveform;
