import type { UseWaveformParams } from '../../../types';

export const WAVEFORM_DEFAULT_VALUE: Required<
  Pick<
    UseWaveformParams<'canvas'>,
    | 'type'
    | 'variant'
    | 'sampleRate'
    | 'width'
    | 'height'
    | 'gap'
    | 'waveColor'
    | 'progressColor'
    | 'hoveredColor'
    | 'bgColor'
    | 'className'
    | 'controls'
    | 'autoplay'
  >
> = {
  type: 'canvas',
  variant: 'line',
  sampleRate: 8000,
  width: 1000,
  height: 100,
  gap: 1,
  waveColor: 'black',
  progressColor: '#0873ff',
  hoveredColor: '#0873ff50',
  bgColor: 'transparent',
  className: '',
  controls: true,
  autoplay: false,
} as const;

export const WAVEFORM_HEIGHT_RATIO = 0.9;
export const BAR_WIDTH = 1;

// NOTE: For operations other than decodeAudioData, set this to duration * sampleRate.
export const OFFLINE_AUDIO_CONTEXT_LENGTH = 1;
