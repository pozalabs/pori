export const WAVEFORM_DEFAULT_VALUE = {
  type: 'canvas',
  sampleRate: 8000,
  peakLength: 1024,
  width: 1000,
  height: 100,
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
export const WAVEFORM_HEIGHT_PERCENT = 90;
export const BAR_WIDTH = 1;
