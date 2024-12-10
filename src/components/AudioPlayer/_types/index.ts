import type { ArrayElementType } from '@pozalabs/pokit/types';

import type { Playlist, RepeatModeType } from '../../../hooks/playlist/_types';
import type Slider from '../../Slider';

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
 * This is the type of ref passed to the audio player provider. Contains all functions returned by useAudio and usePlaylist. (excluding src manipulation)
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
  changeAudioIndex: (id: ArrayElementType<Playlist>['id'], index: number) => void;
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

export interface AudioPlayerProgressBarProps
  extends Omit<
    Parameters<typeof Slider>[0],
    'max' | 'min' | 'value' | 'onChange' | 'onDrag' | 'onDragStart' | 'onDragEnd'
  > {
  draggable?: boolean;
}

export interface AudioPlayerButtonProps {
  width?: number;
  height?: number;
  className?: string;
}
