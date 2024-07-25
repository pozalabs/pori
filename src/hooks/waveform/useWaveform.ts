import useAudioData from './useAudioData';
import useWaveformAudio from './useWaveformAudio';
import useCanvasWaveform from './useCanvasWaveform';
import useSvgWaveform from './useSvgWaveform';
import { WAVEFORM_DEFAULT_VALUE } from './_constants';

export interface UseWaveformParams {
  src: string;
  type?: 'canvas' | 'svg';
  sampleRate?: number;
  peakLength?: number;
  width?: number;
  height?: number;
  waveColor?: string;
  progressColor?: string;
  bgColor?: string;
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
 *    waveColor?: string;
 *    progressColor?: string;
 *    bgColor?: string;
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
  waveColor = WAVEFORM_DEFAULT_VALUE['waveColor'],
  progressColor = WAVEFORM_DEFAULT_VALUE['progressColor'],
  bgColor = WAVEFORM_DEFAULT_VALUE['bgColor'],
  className = WAVEFORM_DEFAULT_VALUE['className'],
  controls = WAVEFORM_DEFAULT_VALUE['controls'],
  playhead = WAVEFORM_DEFAULT_VALUE['playhead'],
  autoplay = WAVEFORM_DEFAULT_VALUE['autoplay'],
}: UseWaveformParams): UseWaveformReturns => {
  const { isPlaying, currentTime, duration, play, pause, changeCurrentTime } = useWaveformAudio({
    src,
    controls,
    autoplay,
  });

  const { peaks } = useAudioData({ src, sampleRate, peakLength });

  const canvasWaveform = useCanvasWaveform({
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
    enabled: type === 'canvas',
  });

  const svgWaveform = useSvgWaveform({
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
