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
 * This is an audio player that can be customized with the desired UI.
 * The components provided are as follows:
 * - Provider
 * - Playlist
 * - CurrentTime
 * - Duration
 * - ProgressBar
 * - VolumeProgressBar
 * - Buttons based on images
 *    - PlayButton
 *    - PauseButton
 *    - PlayPauseButton
 *    - StopButton
 *    - ShiftForwardButton
 *    - ShiftBackwardButton
 *    - SkipStartButton
 *    - SkipEndButton
 *    - RepeatButton
 *    - VolumeButton
 */
const AudioPlayer = {
  /**
   * This is a component that contains the logic of the audio player.
   * Please note that it will not work properly if you do not wrap another audio player component with this component.
   */
  Provider: AudioPlayerProvider,
  /**
   * This is a component that draws the playlist list of the audio player.
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
   * This is a component that draws the current playback time of the audio player.
   * The time string changes depending on the format you pass in.
   * @param AudioPlayerCurrentTimeProps
   * ```
   * interface AudioPlayerCurrentTimeProps {
   *    className?: string;
   *    format?: 'SS' | 'S' | 'MM:SS' | 'M:S' | 'HH:MM:SS' | 'H:M:S';
   * }
   * ```
   * - format : Time format. (default : `'MM:SS'`)
   */
  CurrentTime: AudioPlayerCurrentTime,
  /**
   * This component plots the total playback time of the currently playing audio.
   * The time string changes depending on the format you pass in.
   * @param AudioPlayerDurationProps
   * ```
   * interface AudioPlayerDurationProps {
   *    className?: string;
   *    format?: 'SS' | 'S' | 'MM:SS' | 'M:S' | 'HH:MM:SS' | 'H:M:S';
   * }
   * ```
   * - format : Time format (default : `'MM:SS'`)
   */
  Duration: AudioPlayerDuration,
  /**
   * This is the playback bar of the audio player.
   * Inherits the functionality of the Slider component.
   * @param AudioPlayerProgressBarProps
   * ```
   * interface AudioPlayerProgressBarProps extends Omit<Parameters<typeof Slider>[0], 'max' | 'min' | 'value' | 'onChange' | 'onDrag' | 'onDragStart' | 'onDragEnd'> {
   *    draggable?: boolean;
   * }
   * ```
   * - draggable : Whether draggability is possible. (default : `true`)
   */
  ProgressBar: AudioPlayerProgressBar,
  /**
   * This is the audio player's volume control bar.
   * Inherits the functionality of the Slider component.
   * @param AudioPlayerVolumeProgressBarProps
   * ```
   * interface AudioPlayerVolumeProgressBarProps extends Omit<Parameters<typeof Slider>[0], 'max' | 'min' | 'value' | 'onChange' | 'onDrag' | 'onDragStart' | 'onDragEnd'> {
   *    draggable?: boolean;
   * }
   * ```
   * - draggable : Whether draggability is possible. (default : `true`)
   */
  VolumeProgressBar: AudioPlayerVolumeProgressBar,
  /**
   * Audio player play button.
   * It operates based on images.
   * @param AudioPlayerPlayButton
   * ```
   * interface AudioPlayerPlayButton {
   *    src?: string;
   *    width?: number;
   *    height?: number;
   *    className?: number;
   * }
   * ```
   * - width : width of image (default : `32`)
   * - height : height of image (default : `32`)
   */
  PlayButton: AudioPlayerPlayButton,
  /**
   * This is the audio player pause button.
   * It operates based on images.
   * @param AudioPlayerPauseButton
   * ```
   * interface AudioPlayerPauseButton {
   *    src?: string;
   *    width?: number;
   *    height?: number;
   *    className?: number;
   * }
   * ```
   * - width : width of image (default : `32`)
   * - height : height of image (default : `32`)
   */
  PauseButton: AudioPlayerPauseButton,
  /**
   * This button operates as play or pause depending on the current playback status.
   * It operates based on images.
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
   * - width : width of image (default : `32`)
   * - height : height of image (default : `32`)
   */
  PlayPauseButton: AudioPlayerPlayPauseButton,
  /**
   * This is the audio player stop button.
   * It operates based on images.
   * @param AudioPlayerStopButton
   * ```
   * interface AudioPlayerStopButton {
   *    src?: string;
   *    width?: number;
   *    height?: number;
   *    className?: number;
   * }
   * ```
   * - width : width of image (default : `32`)
   * - height : height of image (default : `32`)
   */
  StopButton: AudioPlayerStopButton,
  /**
   * This button changes the playback time to the previous timeShift seconds. (timeShift is the value passed to the Provider.)
   * It operates based on images.
   * @param AudioPlayerShiftForwardButton
   * ```
   * interface AudioPlayerShiftForwardButton {
   *    src?: string;
   *    width?: number;
   *    height?: number;
   *    className?: number;
   * }
   * ```
   * - width : width of image (default : `32`)
   * - height : height of image (default : `32`)
   */
  ShiftForwardButton: AudioPlayerShiftForwardButton,
  /**
   * This button changes the playback time by timeShift seconds. (timeShift is the value passed to the Provider.)
   * It operates based on images.
   * @param AudioPlayerShiftBackwardButton
   * ```
   * interface AudioPlayerShiftBackwardButton {
   *    src?: string;
   *    width?: number;
   *    height?: number;
   *    className?: number;
   * }
   * ```
   * - width : width of image (default : `32`)
   * - height : height of image (default : `32`)
   */
  ShiftBackwardButton: AudioPlayerShiftBackwardButton,
  /**
   * This button plays the beginning of the song if the current play time is more than shiftThreshold seconds, and the previous song if it is less than shiftThreshold seconds.
   * (shiftThreshold is a value passed as a prop.)
   * It operates based on images.
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
   * - shiftThreshold : This value is the standard for determining whether to play the first or previous song. It is in seconds. (default : `2`)
   * - width : width of image (default : `32`)
   * - height : height of image (default : `32`)
   */
  SkipStartButton: AudioPlayerSkipStartButton,
  /**
   * This button plays the next song.
   * It operates based on images.
   * @param AudioPlayerSkipEndButton
   * ```
   * interface AudioPlayerSkipEndButton {
   *    src?: string;
   *    width?: number;
   *    height?: number;
   *    className?: number;
   * }
   * ```
   * - width : width of image (default : `32`)
   * - height : height of image (default : `32`)
   */
  SkipEndButton: AudioPlayerSkipEndButton,
  /**
   * This button toggles repeat playback mode. (No repeat -> Repeat all -> Repeat one song -> No repeat)
   * It operates based on images.
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
   * - width : width of image (default : `32`)
   * - height : height of image (default : `32`)
   */
  RepeatButton: AudioPlayerRepeatButton,
  /**
   * This is the volume button.
   * It operates based on images.
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
   * - width : width of image (default : `32`)
   * - height : height of image (default : `32`)
   */
  VolumeButton: AudioPlayerVolumeButton,
};

export default AudioPlayer;
