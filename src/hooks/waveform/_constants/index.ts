import type { UseWaveformParams } from '../useWaveform';

export const WAVEFORM_DEFAULT_VALUE: Required<
  Pick<
    UseWaveformParams<'canvas'>,
    | 'type'
    | 'variant'
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
