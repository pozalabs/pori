import type { DOMAttributes } from 'react';

/**
 * Type for type prop of waveform.
 */
export type WaveformType = 'canvas' | 'svg';

/**
 * The event type of the audio element.
 */
export type HTMLAudioElementEventType = Omit<
  DOMAttributes<HTMLAudioElement>,
  'children' | 'dangerouslySetInnerHTML'
>;

/**
 * The parameter type for the useWaveform hook.
 */
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

/**
 * The return type for the useWaveform hook.
 */
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
