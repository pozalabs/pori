import type { HTMLAttributes, ReactNode } from 'react';

import type Slider from '../../components/Slider';
import type { usePlaylist } from '../../hooks';
import type { Playlist } from '../hooks';
import type { ArrayElementType, WithArray } from '../utils';

/**
 * Time format for displaying current time and duration.
 */
export type AudioPlayerTimeFormat = 'SS' | 'S' | 'MM:SS' | 'M:S' | 'HH:MM:SS' | 'H:M:S';

/**
 * Ref handle for `AudioPlayer.Provider`. Contains all controls from useAudio and usePlaylist, excluding source management.
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
 * Props for `AudioPlayer.Provider`.
 */
export interface AudioPlayerProviderProps extends Omit<Parameters<typeof usePlaylist>[0], ''> {
  children?: WithArray<ReactNode>;
}

/**
 * Props for `AudioPlayer.ProgressBar` and `AudioPlayer.VolumeProgressBar`.
 */
export interface AudioPlayerProgressBarProps extends Omit<
  Parameters<typeof Slider>[0],
  'max' | 'min' | 'value' | 'onChange' | 'onDrag' | 'onDragStart' | 'onDragEnd'
> {
  draggable?: boolean;
}

/**
 * Props for `AudioPlayer.VolumeProgressBar`.
 */
export type AudioPlayerVolumeProgressBarProps = AudioPlayerProgressBarProps;

/**
 * Common props for AudioPlayer buttons.
 */
export interface AudioPlayerButtonProps {
  width?: number;
  height?: number;
  className?: string;
}

/**
 * Common props for AudioPlayer buttons that accept a custom icon.
 */
export interface AudioPlayerSrcButtonProps extends AudioPlayerButtonProps {
  src?: ReactNode;
}

/**
 * Props for `AudioPlayer.PauseButton`.
 */
export type AudioPlayerPauseButtonProps = AudioPlayerSrcButtonProps;

/**
 * Props for `AudioPlayer.PlayButton`.
 */
export type AudioPlayerPlayButtonProps = AudioPlayerSrcButtonProps;

/**
 * Props for `AudioPlayer.ShiftBackwardButton`.
 */
export type AudioPlayerShiftBackwardButtonProps = AudioPlayerSrcButtonProps;

/**
 * Props for `AudioPlayer.ShiftForwardButton`.
 */
export type AudioPlayerShiftForwardButtonProps = AudioPlayerSrcButtonProps;

/**
 * Props for `AudioPlayer.SkipEndButton`.
 */
export type AudioPlayerSkipEndButtonProps = AudioPlayerSrcButtonProps;

/**
 * Props for `AudioPlayer.StopButton`.
 */
export type AudioPlayerStopButtonProps = AudioPlayerSrcButtonProps;

/**
 * Props for `AudioPlayer.PlayPauseButton`.
 */
export interface AudioPlayerPlayPauseButtonProps extends AudioPlayerButtonProps {
  audioId?: ArrayElementType<Playlist>['id'];
  playSrc?: ReactNode;
  pauseSrc?: ReactNode;
}

/**
 * Props for `AudioPlayer.RepeatButton`.
 */
export interface AudioPlayerRepeatButtonProps extends AudioPlayerButtonProps {
  repeatAllSrc?: ReactNode;
  repeatOneSrc?: ReactNode;
  repeatNoneSrc?: ReactNode;
}

/**
 * Props for `AudioPlayer.SkipStartButton`.
 */
export interface AudioPlayerSkipStartButtonProps extends AudioPlayerSrcButtonProps {
  shiftThreshold?: number;
}

/**
 * Props for `AudioPlayer.VolumeButton`.
 */
export interface AudioPlayerVolumeButtonProps extends AudioPlayerButtonProps {
  volumeSrc?: ReactNode;
  mutedSrc?: ReactNode;
}

/**
 * Props for `AudioPlayer.CurrentTime` and `AudioPlayer.Duration`.
 */
export interface AudioPlayerTimeProps {
  className?: string;
  format?: AudioPlayerTimeFormat;
}

/**
 * Props for `AudioPlayer.CurrentTime`.
 */
export type AudioPlayerCurrentTimeProps = AudioPlayerTimeProps;

/**
 * Props for `AudioPlayer.Duration`.
 */
export type AudioPlayerDurationProps = AudioPlayerTimeProps;

/**
 * Props for `AudioPlayer.Playlist`.
 */
export interface AudioPlayerPlaylistProps extends HTMLAttributes<HTMLUListElement> {
  renderItem: (audio: ArrayElementType<Playlist>, index?: number) => ReactNode;
}
