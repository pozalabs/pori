import { useCallback, useState } from 'react';

import { WAVEFORM_DEFAULT_VALUE } from './_constants';
import type { HTMLAudioElementEventType, WaveformType } from './_types';
import getPeakLength from './_utils/getPeakLength';
import useAudioData from './useAudioData';
import useCanvasWaveform from './useCanvasWaveform';
import useSvgWaveform from './useSvgWaveform';
import useWaveformAudio from './useWaveformAudio';

export interface UseWaveformParams<T extends WaveformType> extends HTMLAudioElementEventType {
  src: string;
  type?: T;
  variant?: 'line' | 'bar';
  peaks?: number[];
  sampleRate?: number;
  width?: number;
  height?: number;
  gap?: number;
  waveColor?: string;
  progressColor?: string;
  hoveredColor?: string;
  bgColor?: string;
  className?: string;
  controls?: boolean;
  autoplay?: boolean;
}

export interface UseWaveformReturns<T extends WaveformType> {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  play: () => void;
  pause: () => void;
  changeCurrentTime: (currentTime: number) => void;
  showHoveredWaveform: (e: Event, positionX?: number) => void;
  hideHoveredWaveform: () => void;
  waveform?: T extends 'svg' ? SVGSVGElement : HTMLCanvasElement;
}

/**
 * type에 따라 웨이브폼을 그려 반환하는 훅입니다.
 * @param `UseWaveformParams`
 * ```ts
 * interface UseWaveformParams {
 *    src: string;
 *    type?: 'canvas' | 'svg';
 *    variant?: 'line' | 'bar';
 *    peaks?: number[];
 *    sampleRate?: number;
 *    width?: number;
 *    height?: number;
 *    gap?: number;
 *    waveColor?: string;
 *    progressColor?: string;
 *    hoveredColor?: string;
 *    bgColor?: string;
 *    className?: string;
 *    controls?: boolean;
 *    autoplay?: boolean;
 * }
 * ```
 * @returns
 * `UseWaveformReturns`
 * ```ts
 * interface UseWaveformReturns {
 *    isPlaying: boolean;
 *    currentTime: number;
 *    duration: number;
 *    play: () => void;
 *    pause: () => void;
 *    changeCurrentTime: (currentTime: number) => void;
 *    showHoveredWaveform: (e: Event, positionX?: number) => void;
 *    hideHoveredWaveform: () => void;
 *    waveform?: T extends 'canvas' ? HTMLCanvasElement : T extends 'svg' ? SVGSVGElement : undefined;
 * }
 * ```
 */
const useWaveform = <T extends WaveformType = 'canvas'>({
  src,
  type = WAVEFORM_DEFAULT_VALUE['type'] as T,
  variant = WAVEFORM_DEFAULT_VALUE['variant'],
  peaks: initPeaks,
  sampleRate = WAVEFORM_DEFAULT_VALUE['sampleRate'],
  width = WAVEFORM_DEFAULT_VALUE['width'],
  height = WAVEFORM_DEFAULT_VALUE['height'],
  gap = WAVEFORM_DEFAULT_VALUE['gap'],
  waveColor = WAVEFORM_DEFAULT_VALUE['waveColor'],
  progressColor = WAVEFORM_DEFAULT_VALUE['progressColor'],
  hoveredColor = WAVEFORM_DEFAULT_VALUE['hoveredColor'],
  bgColor = WAVEFORM_DEFAULT_VALUE['bgColor'],
  className = WAVEFORM_DEFAULT_VALUE['className'],
  controls = WAVEFORM_DEFAULT_VALUE['controls'],
  autoplay = WAVEFORM_DEFAULT_VALUE['autoplay'],
  ...eventHandlers
}: UseWaveformParams<T>): UseWaveformReturns<T> => {
  const { audioUrl, peaks } = useAudioData({
    src,
    sampleRate,
    peakLength: getPeakLength(width, gap),
    initPeaks,
  });
  const { isPlaying, currentTime, duration, play, pause, changeCurrentTime } = useWaveformAudio({
    src: audioUrl,
    autoplay,
    ...eventHandlers,
  });

  const [isHovering, setIsHovering] = useState(false);
  const [hoveredPosition, setHoveredPosition] = useState(0);

  const showHoveredWaveform = useCallback(
    (e: Event, positionX?: number): void => {
      const element = e.target as HTMLCanvasElement | SVGSVGElement;
      if (!(e instanceof MouseEvent) || !element) return;

      const rect = element.getBoundingClientRect();

      const hoveredX = e.clientX - rect.left;
      const percent = (hoveredX / rect.width) * 100;
      const hoveredTime = (percent * duration) / 100;
      const hoveredPosition = (hoveredTime / duration) * width;

      setHoveredPosition(isNaN(hoveredPosition) ? 0 : Math.max(0, positionX ?? hoveredPosition));
      setIsHovering(true);
    },
    [duration, width],
  );

  const hideHoveredWaveform = useCallback((): void => {
    setIsHovering(false);
  }, []);

  const waveformParams = {
    variant,
    width,
    height,
    gap,
    waveColor,
    progressColor,
    hoveredColor,
    bgColor,
    className,
    controls,
    peaks,
    currentTime,
    duration,
    changeCurrentTime,
    isHovering,
    hoveredPosition,
    showHoveredWaveform,
    hideHoveredWaveform,
  };

  const canvasWaveform = useCanvasWaveform({
    ...waveformParams,
    enabled: type === 'canvas',
  }) as UseWaveformReturns<T>['waveform'];

  const svgWaveform = useSvgWaveform({
    ...waveformParams,
    enabled: type === 'svg',
  }) as UseWaveformReturns<T>['waveform'];

  return {
    isPlaying,
    currentTime,
    duration,
    play,
    pause,
    changeCurrentTime,
    showHoveredWaveform,
    hideHoveredWaveform,
    waveform: type === 'svg' ? svgWaveform : canvasWaveform,
  };
};

export default useWaveform;
