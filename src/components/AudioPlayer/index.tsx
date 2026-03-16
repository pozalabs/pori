import AudioPlayerCurrentTime from './_components/AudioPlayerCurrentTime';
import AudioPlayerDuration from './_components/AudioPlayerDuration';
import AudioPlayerPlaylist from './_components/AudioPlayerPlaylist';
import AudioPlayerProgressBar from './_components/AudioPlayerProgressBar';
import AudioPlayerProvider from './_components/AudioPlayerProvider';
import AudioPlayerVolumeProgressBar from './_components/AudioPlayerVolumeProgressBar';
import AudioPlayerPauseButton from './_components/buttons/AudioPlayerPauseButton';
import AudioPlayerPlayButton from './_components/buttons/AudioPlayerPlayButton';
import AudioPlayerPlayPauseButton from './_components/buttons/AudioPlayerPlayPauseButton';
import AudioPlayerRepeatButton from './_components/buttons/AudioPlayerRepeatButton';
import AudioPlayerShiftBackwardButton from './_components/buttons/AudioPlayerShiftBackwardButton';
import AudioPlayerShiftForwardButton from './_components/buttons/AudioPlayerShiftForwardButton';
import AudioPlayerSkipEndButton from './_components/buttons/AudioPlayerSkipEndButton';
import AudioPlayerSkipStartButton from './_components/buttons/AudioPlayerSkipStartButton';
import AudioPlayerStopButton from './_components/buttons/AudioPlayerStopButton';
import AudioPlayerVolumeButton from './_components/buttons/AudioPlayerVolumeButton';

/**
 * Customizable audio player with compound components.
 *
 * All sub-components must be wrapped with `AudioPlayer.Provider`.
 * Button components render a custom image as the button icon.
 * - Provider
 * - Playlist
 * - CurrentTime
 * - Duration
 * - ProgressBar
 * - VolumeProgressBar
 * - PlayButton
 * - PauseButton
 * - PlayPauseButton
 * - StopButton
 * - ShiftForwardButton
 * - ShiftBackwardButton
 * - SkipStartButton
 * - SkipEndButton
 * - RepeatButton
 * - VolumeButton
 */
const AudioPlayer = {
  /**
   * Provides audio player state and logic to child components.
   */
  Provider: AudioPlayerProvider,
  /**
   * Renders the audio player's playlist.
   * @param AudioPlayerPlaylistProps
   * ```
   * interface AudioPlayerPlaylistProps {
   *    renderItem: (audio: ArrayElementType<Playlist>) => ReactNode;
   *    className?: string;
   * }
   * ```
   */
  Playlist: AudioPlayerPlaylist,
  /**
   * Displays the current playback time.
   * @param AudioPlayerCurrentTimeProps
   * ```
   * interface AudioPlayerCurrentTimeProps {
   *    className?: string;
   *    format?: 'SS' | 'S' | 'MM:SS' | 'M:S' | 'HH:MM:SS' | 'H:M:S';
   * }
   * ```
   * - `format` - Time display format (default: `'MM:SS'`)
   */
  CurrentTime: AudioPlayerCurrentTime,
  /**
   * Displays the total duration of the current audio.
   * @param AudioPlayerDurationProps
   * ```
   * interface AudioPlayerDurationProps {
   *    className?: string;
   *    format?: 'SS' | 'S' | 'MM:SS' | 'M:S' | 'HH:MM:SS' | 'H:M:S';
   * }
   * ```
   * - `format` - Time display format (default: `'MM:SS'`)
   */
  Duration: AudioPlayerDuration,
  /**
   * Playback progress bar. Extends the Slider component.
   * @param AudioPlayerProgressBarProps
   * ```
   * interface AudioPlayerProgressBarProps extends Omit<Parameters<typeof Slider>[0], 'max' | 'min' | 'value' | 'onChange' | 'onDrag' | 'onDragStart' | 'onDragEnd'> {
   *    draggable?: boolean;
   * }
   * ```
   * - `draggable` - Whether dragging is enabled (default: `true`)
   */
  ProgressBar: AudioPlayerProgressBar,
  /**
   * Volume control bar. Extends the Slider component.
   * @param AudioPlayerVolumeProgressBarProps
   * ```
   * interface AudioPlayerVolumeProgressBarProps extends Omit<Parameters<typeof Slider>[0], 'max' | 'min' | 'value' | 'onChange' | 'onDrag' | 'onDragStart' | 'onDragEnd'> {
   *    draggable?: boolean;
   * }
   * ```
   * - `draggable` - Whether dragging is enabled (default: `true`)
   */
  VolumeProgressBar: AudioPlayerVolumeProgressBar,
  /**
   * Plays the audio.
   * @param AudioPlayerPlayButton
   * ```
   * interface AudioPlayerPlayButton {
   *    src?: string;
   *    width?: number;
   *    height?: number;
   *    className?: number;
   * }
   * ```
   * - `width` - Icon width (default: `32`)
   * - `height` - Icon height (default: `32`)
   */
  PlayButton: AudioPlayerPlayButton,
  /**
   * Pauses the audio.
   * @param AudioPlayerPauseButton
   * ```
   * interface AudioPlayerPauseButton {
   *    src?: string;
   *    width?: number;
   *    height?: number;
   *    className?: number;
   * }
   * ```
   * - `width` - Icon width (default: `32`)
   * - `height` - Icon height (default: `32`)
   */
  PauseButton: AudioPlayerPauseButton,
  /**
   * Toggles between play and pause based on the current playback state.
   * @param AudioPlayerPlayPauseButton
   * ```
   * interface AudioPlayerPlayPauseButton {
   *    audioId?: string;
   *    playSrc?: string;
   *    pauseSrc?: string;
   *    width?: number;
   *    height?: number;
   *    className?: number;
   * }
   * ```
   * - `width` - Icon width (default: `32`)
   * - `height` - Icon height (default: `32`)
   */
  PlayPauseButton: AudioPlayerPlayPauseButton,
  /**
   * Stops the audio and resets playback.
   * @param AudioPlayerStopButton
   * ```
   * interface AudioPlayerStopButton {
   *    src?: string;
   *    width?: number;
   *    height?: number;
   *    className?: number;
   * }
   * ```
   * - `width` - Icon width (default: `32`)
   * - `height` - Icon height (default: `32`)
   */
  StopButton: AudioPlayerStopButton,
  /**
   * Shifts the playback time forward by timeShift seconds. (timeShift is configured via the Provider.)
   * @param AudioPlayerShiftForwardButton
   * ```
   * interface AudioPlayerShiftForwardButton {
   *    src?: string;
   *    width?: number;
   *    height?: number;
   *    className?: number;
   * }
   * ```
   * - `width` - Icon width (default: `32`)
   * - `height` - Icon height (default: `32`)
   */
  ShiftForwardButton: AudioPlayerShiftForwardButton,
  /**
   * Shifts the playback time backward by timeShift seconds. (timeShift is configured via the Provider.)
   * @param AudioPlayerShiftBackwardButton
   * ```
   * interface AudioPlayerShiftBackwardButton {
   *    src?: string;
   *    width?: number;
   *    height?: number;
   *    className?: number;
   * }
   * ```
   * - `width` - Icon width (default: `32`)
   * - `height` - Icon height (default: `32`)
   */
  ShiftBackwardButton: AudioPlayerShiftBackwardButton,
  /**
   * Restarts the current audio if playback exceeds shiftThreshold seconds; otherwise, skips to the previous audio.
   * @param AudioPlayerSkipStartButton
   * ```
   * interface AudioPlayerSkipStartButton {
   *    src?: string;
   *    shiftThreshold?: number
   *    width?: number;
   *    height?: number;
   *    className?: number;
   * }
   * ```
   * - `shiftThreshold` - Threshold in seconds to decide between restarting and skipping to the previous audio (default: `2`)
   * - `width` - Icon width (default: `32`)
   * - `height` - Icon height (default: `32`)
   */
  SkipStartButton: AudioPlayerSkipStartButton,
  /**
   * Skips to the next audio.
   * @param AudioPlayerSkipEndButton
   * ```
   * interface AudioPlayerSkipEndButton {
   *    src?: string;
   *    width?: number;
   *    height?: number;
   *    className?: number;
   * }
   * ```
   * - `width` - Icon width (default: `32`)
   * - `height` - Icon height (default: `32`)
   */
  SkipEndButton: AudioPlayerSkipEndButton,
  /**
   * Toggles repeat mode. (none -> all -> one -> none)
   * @param AudioPlayerRepeatButton
   * ```
   * interface AudioPlayerRepeatButton {
   *    repeatAllSrc?: string;
   *    repeatOneSrc?: string;
   *    repeatNoneSrc?: string;
   *    width?: number;
   *    height?: number;
   *    className?: number;
   * }
   * ```
   * - `width` - Icon width (default: `32`)
   * - `height` - Icon height (default: `32`)
   */
  RepeatButton: AudioPlayerRepeatButton,
  /**
   * Toggles mute.
   * @param AudioPlayerVolumeButton
   * ```
   * interface AudioPlayerVolumeButton {
   *    volumeSrc?: string;
   *    mutedSrc?: string;
   *    width?: number;
   *    height?: number;
   *    className?: number;
   * }
   * ```
   * - `width` - Icon width (default: `32`)
   * - `height` - Icon height (default: `32`)
   */
  VolumeButton: AudioPlayerVolumeButton,
};

export default AudioPlayer;
