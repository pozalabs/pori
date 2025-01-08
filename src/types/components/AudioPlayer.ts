import type { HTMLAttributes, ReactNode } from 'react';

import type { ArrayElementType, WithArray } from '@pozalabs/pokit/types';

import type Slider from '../../components/Slider';
import type { Playlist, usePlaylist } from '../../hooks';

/**
 * Type of time format used to export current time and duration.
 */
export type AudioPlayerTimeFormat = 'SS' | 'S' | 'MM:SS' | 'M:S' | 'HH:MM:SS' | 'H:M:S';

/**
 * This is the type of ref passed to `AudioPlayer.Provider`. Contains all functions returned by useAudio and usePlaylist. (excluding src manipulation)
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

/**
 * The prop type of `AudioPlayer.Provider`.
 */
export interface AudioPlayerProviderProps extends Omit<Parameters<typeof usePlaylist>[0], ''> {
  children?: WithArray<ReactNode>;
}

/**
 * The prop type of `AudioPlayer.ProgressBar` and `AudioPlayer.VolumeProgressBar`.
 */
export interface AudioPlayerProgressBarProps
  extends Omit<
    Parameters<typeof Slider>[0],
    'max' | 'min' | 'value' | 'onChange' | 'onDrag' | 'onDragStart' | 'onDragEnd'
  > {
  draggable?: boolean;
}

/**
 * The prop type of `AudioPlayer.VolumeProgressBar`.
 */
export type AudioPlayerVolumeProgressBarProps = AudioPlayerProgressBarProps;

/**
 * Common prop type of buttons provided by AudioPlayer.
 */
export interface AudioPlayerButtonProps {
  width?: number;
  height?: number;
  className?: string;
}

/**
 * Common prop type of src button provided by AudioPlayer.
 */
export interface AudioPlayerSrcButtonProps {
  src?: string;
}

/**
 * The prop type of `AudioPlayer.PauseButton`.
 */
export type AudioPlayerPauseButtonProps = AudioPlayerSrcButtonProps;

/**
 * The prop type of `AudioPlayer.PlayButton`.
 */
export type AudioPlayerPlayButtonProps = AudioPlayerSrcButtonProps;

/**
 * The prop type of `AudioPlayer.ShiftBackwardButton`.
 */
export type AudioPlayerShiftBackwardButtonProps = AudioPlayerSrcButtonProps;

/**
 * The prop type of `AudioPlayer.ShiftForwardButton`.
 */
export type AudioPlayerShiftForwardButtonProps = AudioPlayerSrcButtonProps;

/**
 * The prop type of `AudioPlayer.SkipEndButton`.
 */
export type AudioPlayerSkipEndButtonProps = AudioPlayerSrcButtonProps;

/**
 * The prop type of `AudioPlayer.StopButton`.
 */
export type AudioPlayerStopButtonProps = AudioPlayerSrcButtonProps;

/**
 * The prop type of `AudioPlayer.PlayPauseButton`.
 */
export interface AudioPlayerPlayPauseButtonProps extends AudioPlayerButtonProps {
  audioId?: ArrayElementType<Playlist>['id'];
  playSrc?: string;
  pauseSrc?: string;
}

/**
 * The prop type of `AudioPlayer.RepeatButton`.
 */
export interface AudioPlayerRepeatButtonProps extends AudioPlayerButtonProps {
  repeatAllSrc?: string;
  repeatOneSrc?: string;
  repeatNoneSrc?: string;
}

/**
 * The prop type of `AudioPlayer.SkipStartButton`.
 */
export interface AudioPlayerSkipStartButtonProps extends AudioPlayerSrcButtonProps {
  shiftThreshold?: number;
}

/**
 * The prop type of `AudioPlayer.VolumeButton`.
 */
export interface AudioPlayerVolumeButtonProps extends AudioPlayerButtonProps {
  volumeSrc?: string;
  mutedSrc?: string;
}

/**
 * The prop type of `AudioPlayer.CurrentTime` and `AudioPlayer.Duration`.
 */
export interface AudioPlayerTimeProps {
  className?: string;
  format?: AudioPlayerTimeFormat;
}

/**
 * The prop type of `AudioPlayer.CurrentTime`.
 */
export type AudioPlayerCurrentTimeProps = AudioPlayerTimeProps;

/**
 * The prop type of `AudioPlayer.Duration`.
 */
export type AudioPlayerDurationProps = AudioPlayerTimeProps;

/**
 * The prop type of `AudioPlayer.Playlist`.
 */
export interface AudioPlayerPlaylistProps extends HTMLAttributes<HTMLUListElement> {
  renderItem: (audio: ArrayElementType<Playlist>, index?: number) => ReactNode;
}
