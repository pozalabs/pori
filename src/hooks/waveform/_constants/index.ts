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
    | 'progressColor'
    | 'hoveredColor'
    | 'bgColor'
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
  peakLength: 1024,
  width: 1000,
  height: 100,
  playheadWidth: 1,
  waveColor: 'black',
  progressColor: '#0873ff',
  hoveredColor: '#0873ff50',
  bgColor: 'transparent',
  playheadBgColor: 'black',
  playheadTextColor: 'white',
  className: '',
  controls: true,
  autoplay: false,
} as const;

export const WAVEFORM_HEIGHT_PERCENT = 90;
export const BAR_WIDTH = 1;
