import useAudioData from './useAudioData';
import useWaveformAudio from './useWaveformAudio';
import useCanvasWaveform from './useCanvasWaveform';
import useSvgWaveform from './useSvgWaveform';

import { WAVEFORM_DEFAULT_VALUE } from './_constants';
import { HTMLAudioElementEventType } from './_types';

export interface UseWaveformParams extends HTMLAudioElementEventType {
  src: string;
  type?: 'canvas' | 'svg';
  sampleRate?: number;
  peakLength?: number;
  width?: number;
  height?: number;
  playheadWidth?: number;
  waveColor?: string;
  progressColor?: string;
  bgColor?: string;
  playheadColor?: string;
  className?: string;
  controls?: boolean;
  playhead?: boolean;
  autoplay?: boolean;
}

export interface UseWaveformReturns {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  play: () => void;
  pause: () => void;
  changeCurrentTime: (currentTime: number) => void;
  waveform?: CanvasImageSource;
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
 *    playheadWidth?: number;
 *    waveColor?: string;
 *    progressColor?: string;
 *    bgColor?: string;
 *    playheadColor?: string;
 *    className?: string;
 *    controls?: boolean;
 *    playhead?: boolean;
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
 *    waveform?: CanvasImageSource;
 * }
 * ```
 */
const useWaveform = ({
  src,
  type = WAVEFORM_DEFAULT_VALUE['type'],
  sampleRate = WAVEFORM_DEFAULT_VALUE['sampleRate'],
  peakLength = WAVEFORM_DEFAULT_VALUE['peakLength'],
  width = WAVEFORM_DEFAULT_VALUE['width'],
  height = WAVEFORM_DEFAULT_VALUE['height'],
  playheadWidth = WAVEFORM_DEFAULT_VALUE['playheadWidth'],
  waveColor = WAVEFORM_DEFAULT_VALUE['waveColor'],
  progressColor = WAVEFORM_DEFAULT_VALUE['progressColor'],
  bgColor = WAVEFORM_DEFAULT_VALUE['bgColor'],
  playheadColor = WAVEFORM_DEFAULT_VALUE['playheadColor'],
  className = WAVEFORM_DEFAULT_VALUE['className'],
  controls = WAVEFORM_DEFAULT_VALUE['controls'],
  playhead = WAVEFORM_DEFAULT_VALUE['playhead'],
  autoplay = WAVEFORM_DEFAULT_VALUE['autoplay'],
  ...eventHandlers
}: UseWaveformParams): UseWaveformReturns => {
  const { audioUrl, peaks } = useAudioData({ src, sampleRate, peakLength });
  const { isPlaying, currentTime, duration, play, pause, changeCurrentTime } = useWaveformAudio({
    src: audioUrl,
    autoplay,
    ...eventHandlers,
  });

  const waveformParams = {
    width,
    height,
    playheadWidth,
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
    waveform: type === 'svg' ? svgWaveform : canvasWaveform,
  };
};

export default useWaveform;
