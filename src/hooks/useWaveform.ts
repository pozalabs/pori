import { useCallback, useEffect, useState } from 'react';
import useAudioData from './useAudioData';

export interface UseWaveformParams {
  src: string;
  type?: 'canvas' | 'svg';
  sampleRate?: number;
  peakLength?: number;
  width?: number;
  height?: number;
  waveColor?: string;
  // TODO: 재생 컨트롤 기능 추가 시 적용 예정
  progressColor?: string;
  bgColor?: string;
  className?: string;
}

interface UseWaveformReturns {
  waveform?: CanvasImageSource;
  drawWaveform: () => void;
}

/**
 * type에 따라 웨이브폼을 그려 반환하는 훅입니다.
 * @param `UseWaveformParams`
 * ```ts
 * interface UseWaveformParams {
 *    src: string;
 *    type?: 'canvas' | 'svg';
 *    sampleRate?: number;
 *    peakLength?: number;
 *    width?: number;
 *    height?: number;
 *    waveColor?: string;
 *    progressColor?: string;
 *    bgColor?: string;
 *    className?: string;
 * }
 * ```
 * @returns
 * `UseWaveformReturns`
 * ```ts
 * interface UseWaveformReturns {
 *    waveform?: CanvasImageSource;
 *    drawWaveform: () => void;
 * }
 * ```
 */
const useWaveform = ({
  src,
  type = 'canvas',
  sampleRate = 8000,
  peakLength = 1024,
  width = 1000,
  height = 100,
  waveColor = 'black',
  progressColor = '#0873ff',
  bgColor = 'transparent',
  className,
}: UseWaveformParams): UseWaveformReturns => {
  const [waveform, setWaveform] = useState<CanvasImageSource>();

  const { peaks } = useAudioData({ src, sampleRate, peakLength });

  const drawCanvasWaveform = useCallback((): void => {
    const canvasElement = document.createElement('canvas');
    canvasElement.width = width;
    canvasElement.height = height;

    const ctx = canvasElement.getContext('2d');

    if (!ctx) return;

    const halfHeight = height / 2;
    const barIndexScale = width / peaks.length;

    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    ctx.strokeStyle = waveColor;
    ctx.fillStyle = bgColor;
    ctx.clearRect(0, 0, width, height);
    ctx.fillRect(0, 0, width, height);
    ctx.fill();
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

    className && canvasElement.setAttribute('class', className);

    setWaveform(canvasElement);
  }, [peaks, width, height, waveColor, progressColor, bgColor]);

  const drawSvgWaveform = useCallback((): void => {
    const imageElement = document.createElement('img');
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const polylineElement = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');

    svgElement.setAttribute('width', width.toString());
    svgElement.setAttribute('height', height.toString());

    const halfHeight = height / 2;
    const barIndexScale = width / peaks.length;

    const points = peaks
      .map((peak, index) => {
        const x = Math.round(index * barIndexScale);
        const barHeight = Math.round(peak * halfHeight);
        const yTop = halfHeight - barHeight;
        const yBottom = halfHeight + barHeight;

        return `${x},${yTop} ${x},${yBottom}`;
      })
      .join(' ');

    svgElement.style.background = bgColor;
    polylineElement.setAttribute('points', points);
    polylineElement.style.strokeWidth = '1';
    polylineElement.style.stroke = waveColor;
    polylineElement.style.fill = 'none';

    svgElement.appendChild(polylineElement);
    imageElement.src =
      'data:image/svg+xml;charset=utf-8,' +
      encodeURIComponent(new XMLSerializer().serializeToString(svgElement));

    className && imageElement.setAttribute('class', className);

    setWaveform(imageElement);
  }, [peaks, width, height, waveColor, progressColor, bgColor]);

  useEffect(() => {
    if (type === 'svg') {
      drawSvgWaveform();
      return;
    }

    drawCanvasWaveform();
  }, [peaks, width, height, waveColor, progressColor, bgColor]);

  return {
    waveform,
    drawWaveform: type === 'svg' ? drawSvgWaveform : drawCanvasWaveform,
  };
};

export default useWaveform;
