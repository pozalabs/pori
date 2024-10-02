import type { ArrayElementType } from '@pozalabs/pokit/types';

import type { Playlist, RepeatModeType } from '../../../hooks/playlist/_types';

export interface AudioPlayerContextDefaultValue {
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

export type TimeFormat = 'SS' | 'S' | 'MM:SS' | 'M:S' | 'HH:MM:SS' | 'H:M:S';

export interface AudioPlayerHandles {
  addAudio: (audio: ArrayElementType<Playlist>, autoplay?: boolean) => void;
  changeCurrentTime: (currentTime: number) => void;
  changeMuted: (muted: boolean) => void;
  changePlaybackRate: (playbackRate: number) => void;
  changePlaybackRange: (progress: number) => void;
  changePlayingAudio: (id: ArrayElementType<Playlist>['id'], autoplay?: boolean) => void;
  changeVolume: (volume: number) => void;
  clearPlaylist: () => void;
  play: () => void;
  pause: () => void;
  playNextAudio: (autoplay?: boolean) => void;
  playPrevAudio: (autoplay?: boolean) => void;
  removeAudio: (id: ArrayElementType<Playlist>['id'], autoplay?: boolean) => void;
  resetAudio: () => void;
  resetAudioTime: () => void;
  shiftTimeBackward: () => void;
  shiftTimeForward: () => void;
  stop: () => void;
  toggleMuted: () => void;
  togglePlayPause: (src?: string) => void;
}
