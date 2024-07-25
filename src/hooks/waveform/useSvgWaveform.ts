import { useCallback, useEffect, useMemo, useState } from 'react';
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

  const halfHeight = useMemo(() => height / 2, [height]);
  const barIndexScale = useMemo(
    () => width / peaks.length,
    [width, peaks.length],
  );
  const playedWidth = useMemo(
    () => (currentTime / duration) * width,
    [currentTime, duration, width],
  );
  const playedIndex = useMemo(
    () => Math.floor(playedWidth / barIndexScale),
    [playedWidth, barIndexScale],
  );

  const drawWaveform = useCallback(
    (
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
    },
    [halfHeight, barIndexScale, height],
  );

  const drawPlayhead = useCallback(
    (svgElement: SVGSVGElement): void => {
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
    },
    [playedIndex, barIndexScale, height],
  );

  const initSvgWaveform = useCallback((): void => {
    const waveformImage = document.createElement('img');
    const initWaveformSvg = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg',
    );

    initWaveformSvg.setAttribute('width', width.toString());
    initWaveformSvg.setAttribute('height', height.toString());

    drawWaveform(initWaveformSvg, peaks, bgColor, waveColor);

    waveformImage.setAttribute('class', className);
    addEventListeners(waveformImage);

    setInitWaveform(initWaveformSvg);
    setWaveform(waveformImage);
  }, [
    width,
    height,
    bgColor,
    waveColor,
    peaks,
    className,
    addEventListeners,
    drawWaveform,
  ]);

  const updateSvgWaveform = useCallback((): void => {
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

    initSvgWaveform();

    return () => {
      if (!waveform) return;

      removeEventListeners(waveform);
    };
  }, [peaks, width, height, waveColor, bgColor, enabled]);

  useEffect(() => {
    if (!enabled) return;

    updateSvgWaveform();
  }, [initWaveform, progressColor, currentTime, enabled]);

  return waveform;
};

export default useSvgWaveform;
