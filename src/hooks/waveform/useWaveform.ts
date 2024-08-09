import { useCallback, useState } from 'react';

import useAudioData from './useAudioData';
import useWaveformAudio from './useWaveformAudio';
import useCanvasWaveform from './useCanvasWaveform';
import useSvgWaveform from './useSvgWaveform';

import { WAVEFORM_DEFAULT_VALUE } from './_constants';
import { HTMLAudioElementEventType } from './_types';
import getPeakLength from './_utils/getPeakLength';

export interface UseWaveformParams extends HTMLAudioElementEventType {
  src: string;
  type?: 'canvas' | 'svg';
  variant?: 'line' | 'bar';
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

export interface UseWaveformReturns {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  play: () => void;
  pause: () => void;
  changeCurrentTime: (currentTime: number) => void;
  showHoveredWaveform: (e: Event, positionX?: number) => void;
  hideHoveredWaveform: () => void;
  waveform?: CanvasImageSource;
}

/**
 * type에 따라 웨이브폼을 그려 반환하는 훅입니다.
 * @param `UseWaveformParams`
 * ```ts
 * interface UseWaveformParams {
 *    src: string;
 *    type?: 'canvas' | 'svg';
 *    variant?: 'line' | 'bar';
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
 *    waveform?: CanvasImageSource;
 * }
 * ```
 */
const useWaveform = ({
  src,
  type = WAVEFORM_DEFAULT_VALUE['type'],
  variant = WAVEFORM_DEFAULT_VALUE['variant'],
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
}: UseWaveformParams): UseWaveformReturns => {
  const { audioUrl, peaks } = useAudioData({
    src,
    sampleRate,
    peakLength: getPeakLength(width, gap),
  });
  const { isPlaying, currentTime, duration, play, pause, changeCurrentTime } = useWaveformAudio({
    src: audioUrl,
    autoplay,
    ...eventHandlers,
  });

  const [isHovering, setIsHovering] = useState(false);
  const [hoveredWidth, setHoveredWidth] = useState(0);

  const showHoveredWaveform = useCallback((e: Event, positionX?: number): void => {
    if (
      !(e instanceof MouseEvent) ||
      !(e.target instanceof HTMLCanvasElement || e.target instanceof HTMLImageElement)
    )
      return;

    const rect = e.target.getBoundingClientRect();

    const playheadPosition = e.clientX - rect.left;

    setHoveredWidth(Math.max(0, positionX ?? playheadPosition));
    setIsHovering(true);
  }, []);

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
    hoveredWidth,
    showHoveredWaveform,
    hideHoveredWaveform,
  };

  const canvasWaveform = useCanvasWaveform({
    ...waveformParams,
    enabled: type === 'canvas',
  });

  const svgWaveform = useSvgWaveform({
    ...waveformParams,
    enabled: type === 'svg',
  });

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
