import type { AudioPlayerContextDefaultValue, TimeFormat } from '../_types';

export const AUDIO_PLAYER_CONTEXT_DEFAULT_VALUE: AudioPlayerContextDefaultValue = {
  currentSrc: '',
  currentTime: 0,
  duration: 0,
  isPlaying: false,
  playbackRate: 0,
  playingId: '',
  playlist: [],
  repeatMode: 'none',
  volume: 1,
  changeCurrentSrc: () => {},
  changeCurrentTime: () => {},
  changePlaybackRate: () => {},
  changePlayingAudio: () => {},
  changeRepeatMode: () => {},
  changeVolume: () => {},
  play: () => {},
  pause: () => {},
  playNextAudio: () => {},
  playPrevAudio: () => {},
  shiftTimeBackward: () => {},
  shiftTimeForward: () => {},
  stop: () => {},
  toggleMuted: () => {},
  togglePlayPause: () => {},
};

export const AUDIO_PLAYER_PROGRESS_BAR_DEFAULT_VALUE = {
  draggable: true,
  step: 0.01,
};

export const AUDIO_PLAYER_CURRENT_TIME_DURATION_DEFAULT_VALUE: { format: TimeFormat } = {
  format: 'MM:SS',
};

export const AUDIO_PLAYER_SKIP_START_BUTTON_DEFAULT_VALUE = {
  shiftThreshold: 2,
};

export const AUDIO_PLAYER_BUTTON_DEFAULT_URL = {
  play: 'https://img.icons8.com/ios-glyphs/100/play--v1.png',
  pause: 'https://img.icons8.com/ios-glyphs/100/pause--v1.png',
  stop: 'https://img.icons8.com/ios-glyphs/100/stop--v1.png',
  shiftForward: 'https://img.icons8.com/ios-glyphs/100/rewind.png',
  shiftBackward: 'https://img.icons8.com/ios-glyphs/100/fast-forward.png',
  skipToStart: 'https://img.icons8.com/ios-glyphs/100/skip-to-start--v1.png',
  skipToEnd: 'https://img.icons8.com/ios-glyphs/100/end--v1.png',
  repeatAll: 'https://img.icons8.com/ios-glyphs/100/repeat.png',
  repeatOne: 'https://img.icons8.com/ios-glyphs/100/repeat-one.png',
  repeatNone: 'https://img.icons8.com/ios-glyphs/100/BDBDBD/repeat.png',
  volume: 'https://img.icons8.com/ios-glyphs/100/medium-volume.png',
  muted: 'https://img.icons8.com/ios-glyphs/100/mute--v1.png',
};
