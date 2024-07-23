import { useCallback, useEffect, useState } from 'react';
import useAudioData from './useAudioData';

interface UseWaveformParams {
  src: string;
  type?: 'canvas' | 'svg';
  sampleRate?: number;
  peakLength?: number;
}

interface UseWaveformReturns {
  waveform?: CanvasImageSource;
  drawWaveform: () => void;
}

const width = 1000;
const height = 100;

/**
 * type에 따라 웨이브폼을 그려 반환하는 훅입니다.
 * @param `UseWaveformParams`
 * ```ts
 * interface UseWaveformParams {
 *    src: string;
 *    type?: 'canvas' | 'svg';
 *    sampleRate?: number;
 *    peakLength?: number;
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

    setWaveform(canvasElement);
  }, [peaks]);

  const drawSvgWaveform = useCallback((): void => {
    const imageElement = document.createElement('img');
    const svgElement = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg',
    );
    const polylineElement = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'polyline',
    );

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

    polylineElement.setAttribute('points', points);
    polylineElement.style.strokeWidth = '1';
    polylineElement.style.stroke = 'black';
    polylineElement.style.fill = 'none';

    svgElement.appendChild(polylineElement);
    imageElement.src =
      'data:image/svg+xml;charset=utf-8,' +
      encodeURIComponent(new XMLSerializer().serializeToString(svgElement));

    setWaveform(imageElement);
  }, [peaks]);

  useEffect(() => {
    if (type === 'svg') {
      drawSvgWaveform();
      return;
    }

    drawCanvasWaveform();
  }, [peaks]);

  return {
    waveform,
    drawWaveform: type === 'svg' ? drawSvgWaveform : drawCanvasWaveform,
  };
};

export default useWaveform;
