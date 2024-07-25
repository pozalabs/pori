import { useEffect, useState } from 'react';
import { UseTypeWaveformParams } from './_types';
import useUpdateCurrentTimeEvent from './useUpdateCurrentTimeEvent';

const useSvgWaveform = ({
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
  const [waveform, setWaveform] = useState<HTMLImageElement>();
  const [initWaveform, setInitWaveform] = useState<SVGSVGElement>();
  const { addEventListeners, removeEventListeners } = useUpdateCurrentTimeEvent(
    { duration, changeCurrentTime },
  );

  const halfHeight = height / 2;
  const barIndexScale = width / peaks.length;
  const playedWidth = (currentTime / duration) * width;
  const playedIndex = Math.floor(playedWidth / barIndexScale);

  const drawWaveform = (
    svgElement: SVGSVGElement,
    peaks: number[],
    bgColor: string,
    waveColor: string,
  ): void => {
    const polylineElement = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'polyline',
    );

    const points = peaks
      .map((peak, index) => {
        const x = Math.round(index * barIndexScale);
        const formattedHeight = (height / 10) * 8;
        const barHeight = Math.round((peak * formattedHeight) / 2);
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
  };

  const drawPlayhead = (svgElement: SVGSVGElement): void => {
    const polylineElement = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'polyline',
    );

    const x = Math.round(playedIndex * barIndexScale);
    const formattedX = isNaN(x) ? 0 : x;

    polylineElement.setAttribute(
      'points',
      `${formattedX},0 ${formattedX},${height}`,
    );
    polylineElement.style.strokeWidth = '0.5';
    polylineElement.style.stroke = 'black';
    polylineElement.style.fill = 'none';

    svgElement.appendChild(polylineElement);
  };

  const initSvgWaveform = (): void => {
    const waveformImage = document.createElement('img');
    const initWaveformSvg = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg',
    );
    const waveformSvg = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg',
    );

    waveformSvg.style.background = bgColor;
    waveformSvg.setAttribute('width', width.toString());
    waveformSvg.setAttribute('height', height.toString());
    initWaveformSvg.setAttribute('width', width.toString());
    initWaveformSvg.setAttribute('height', height.toString());

    drawWaveform(initWaveformSvg, peaks, bgColor, waveColor);

    waveformSvg.appendChild(initWaveformSvg);
    if (playhead) drawPlayhead(waveformSvg);

    waveformImage.src =
      'data:image/svg+xml;charset=utf-8,' +
      encodeURIComponent(new XMLSerializer().serializeToString(waveformSvg));

    className && waveformImage.setAttribute('class', className);
    addEventListeners(waveformImage);

    setWaveform(waveformImage);
    setInitWaveform(initWaveformSvg);
  };

  const updateSvgWaveform = (): void => {
    if (!waveform || !initWaveform) return;

    const playedWaveformSvg = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg',
    );
    const newWaveformSvg = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg',
    );

    newWaveformSvg.style.background = bgColor;
    newWaveformSvg.setAttribute('width', width.toString());
    newWaveformSvg.setAttribute('height', height.toString());
    playedWaveformSvg.setAttribute('width', width.toString());
    playedWaveformSvg.setAttribute('height', height.toString());

    drawWaveform(
      playedWaveformSvg,
      peaks.slice(0, playedIndex),
      'transparent',
      progressColor,
    );
    if (playhead) drawPlayhead(playedWaveformSvg);

    newWaveformSvg.appendChild(initWaveform);
    newWaveformSvg.appendChild(playedWaveformSvg);

    waveform.src =
      'data:image/svg+xml;charset=utf-8,' +
      encodeURIComponent(new XMLSerializer().serializeToString(newWaveformSvg));
  };

  useEffect(() => {
    if (!enabled) return;

    initSvgWaveform();

    return () => {
      if (!waveform) return;

      removeEventListeners(waveform);
    };
  }, [peaks, width, height, waveColor, bgColor, enabled]);

  useEffect(() => {
    if (!enabled) return;

    updateSvgWaveform();
  }, [progressColor, duration, currentTime, enabled]);

  return waveform;
};

export default useSvgWaveform;
