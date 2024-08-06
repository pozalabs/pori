export const WAVEFORM_DEFAULT_VALUE = {
  type: 'canvas',
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
