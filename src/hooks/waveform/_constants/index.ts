import { UseWaveformParams } from '../useWaveform';

export const WAVEFORM_DEFAULT_VALUE: Required<
  Pick<
    UseWaveformParams,
    | 'type'
    | 'variant'
    | 'sampleRate'
    | 'peakLength'
    | 'width'
    | 'height'
    | 'playheadWidth'
    | 'waveColor'
    | 'bgColor'
    | 'progressColor'
    | 'playheadColor'
    | 'className'
    | 'controls'
    | 'playhead'
    | 'autoplay'
  >
> = {
  type: 'canvas',
  variant: 'line',
  sampleRate: 8000,
  peakLength: 1024,
  width: 1000,
  height: 100,
  playheadWidth: 0.25,
  waveColor: 'black',
  progressColor: '#0873ff',
  bgColor: 'transparent',
  playheadColor: 'black',
  className: '',
  controls: true,
  playhead: true,
  autoplay: false,
} as const;

export const WAVEFORM_HEIGHT_PERCENT = 80;
export const BAR_WIDTH = 1;
