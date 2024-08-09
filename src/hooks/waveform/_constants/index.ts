import { UseWaveformParams } from '../useWaveform';

export const WAVEFORM_DEFAULT_VALUE: Required<
  Pick<
    UseWaveformParams,
    | 'type'
    | 'variant'
    | 'sampleRate'
    | 'width'
    | 'height'
    | 'gap'
    | 'playheadWidth'
    | 'waveColor'
    | 'bgColor'
    | 'progressColor'
    | 'playheadBgColor'
    | 'playheadTextColor'
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
  playheadWidth: 1,
  waveColor: 'black',
  progressColor: '#0873ff',
  bgColor: 'transparent',
  playheadBgColor: 'black',
  playheadTextColor: 'white',
  className: '',
  controls: true,
  autoplay: false,
} as const;

export const PLAYHEAD_TIME = {
  fontSize: 10,
  padding: 2,
};
export const WAVEFORM_HEIGHT_RATIO = 0.9;
export const BAR_WIDTH = 1;
