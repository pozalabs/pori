import type { AudioPlayerTimeFormat } from '../../../types';
import type { AudioPlayerContextType } from '../_types';

export const AUDIO_PLAYER_CONTEXT_DEFAULT_VALUE: AudioPlayerContextType = {
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

export const AUDIO_PLAYER_CURRENT_TIME_DURATION_DEFAULT_VALUE: { format: AudioPlayerTimeFormat } = {
  format: 'MM:SS',
};

export const AUDIO_PLAYER_SKIP_START_BUTTON_DEFAULT_VALUE = {
  shiftThreshold: 2,
};

export const AUDIO_PLAYER_BUTTON_DEFAULT_SIZE = 32;

const s = AUDIO_PLAYER_BUTTON_DEFAULT_SIZE;
const svgProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: s,
  height: s,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export const AUDIO_PLAYER_BUTTON_DEFAULT_ICON = {
  play: (
    <svg {...svgProps}>
      <polygon points="6 3 20 12 6 21 6 3" fill="currentColor" stroke="none" />
    </svg>
  ),
  pause: (
    <svg {...svgProps}>
      <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none" />
      <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  stop: (
    <svg {...svgProps}>
      <rect x="6" y="6" width="12" height="12" rx="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  shiftForward: (
    <svg {...svgProps}>
      <polygon points="13 19 22 12 13 5 13 19" />
      <polygon points="2 19 11 12 2 5 2 19" />
    </svg>
  ),
  shiftBackward: (
    <svg {...svgProps}>
      <polygon points="11 19 2 12 11 5 11 19" />
      <polygon points="22 19 13 12 22 5 22 19" />
    </svg>
  ),
  skipToStart: (
    <svg {...svgProps}>
      <polygon points="19 20 9 12 19 4 19 20" />
      <line x1="5" y1="19" x2="5" y2="5" />
    </svg>
  ),
  skipToEnd: (
    <svg {...svgProps}>
      <polygon points="5 4 15 12 5 20 5 4" />
      <line x1="19" y1="5" x2="19" y2="19" />
    </svg>
  ),
  repeatAll: (
    <svg {...svgProps}>
      <path d="m17 2 4 4-4 4" />
      <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
      <path d="m7 22-4-4 4-4" />
      <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    </svg>
  ),
  repeatOne: (
    <svg {...svgProps}>
      <path d="m17 2 4 4-4 4" />
      <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
      <path d="m7 22-4-4 4-4" />
      <path d="M21 13v1a4 4 0 0 1-4 4H3" />
      <path d="M11 10h1v4" />
    </svg>
  ),
  repeatNone: (
    <svg {...svgProps} style={{ opacity: 0.4 }}>
      <path d="m17 2 4 4-4 4" />
      <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
      <path d="m7 22-4-4 4-4" />
      <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    </svg>
  ),
  volume: (
    <svg {...svgProps}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  ),
  muted: (
    <svg {...svgProps}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
      <line x1="22" y1="9" x2="16" y2="15" />
      <line x1="16" y1="9" x2="22" y2="15" />
    </svg>
  ),
};
