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

/**
 * 오디오 플레이어 Provider에 전달하는 ref의 타입입니다. useAudio, usePlaylist에서 반환하는 모든 함수를 포함합니다. (src 조작 제외)
 * - addAudio
 * - changeCurrentTime
 * - changeMuted
 * - changePlaybackRate
 * - changePlaybackRange
 * - changePlayingAudio
 * - changeVolume
 * - clearPlaylist
 * - play
 * - pause
 * - playNextAudio
 * - playPrevAudio
 * - removeAudio
 * - resetAudio
 * - resetAudioTime
 * - shiftTimeBackward
 * - shiftTimeForward
 * - stop
 * - toggleMuted
 * - togglePlayPause
 */
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
