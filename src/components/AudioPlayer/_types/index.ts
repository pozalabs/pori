import type { ArrayElementType } from '@pozalabs/pokit/types';

import type { Playlist, RepeatModeType } from '../../../types';

/**
 * Type for the audio player context value.
 */
export interface AudioPlayerContextType {
  currentSrc: string;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  playbackRate: number;
  playlist: Playlist;
  playingId: string;
  repeatMode: RepeatModeType;
  volume: number;
  changeCurrentSrc: (currentSrc: string) => void;
  changeCurrentTime: (currentTime: number) => void;
  changePlaybackRate: (playbackRate: number) => void;
  changePlayingAudio: (id: ArrayElementType<Playlist>['id'], autoplay?: boolean) => void;
  changeRepeatMode: (repeatMode: RepeatModeType) => void;
  changeVolume: (volume: number) => void;
  play: () => void;
  pause: () => void;
  shiftTimeBackward: () => void;
  shiftTimeForward: () => void;
  playNextAudio: (autoplay?: boolean) => void;
  playPrevAudio: (autoplay?: boolean) => void;
  stop: () => void;
  toggleMuted: () => void;
  togglePlayPause: () => void;
}
