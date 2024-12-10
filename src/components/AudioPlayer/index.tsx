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
 * 원하는 UI로 커스텀할 수 있는 오디오 플레이어입니다.
 * 제공하는 컴포넌트는 다음과 같습니다.
 * - Provider
 * - Playlist
 * - CurrentTime
 * - Duration
 * - ProgressBar
 * - VolumeProgressBar
 * - (이미지 기반) 버튼
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
   * 오디오 플레이어의 로직을 포함한 컴포넌트입니다.
   * 이 컴포넌트로 다른 오디오 플레이어 컴포넌트를 감싸주지 않으면 정상적으로 동작하지 않으니, 주의해주세요.
   */
  Provider: AudioPlayerProvider,
  /**
   * 오디오 플레이어의 플레이리스트 목록을 그리는 컴포넌트입니다.
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
   * 오디오 플레이어의 현재 재생 시간을 그리는 컴포넌트입니다.
   * 전달하는 포맷에 따라 시간 문자열이 바뀝니다.
   * @param AudioPlayerCurrentTimeProps
   * ```
   * interface AudioPlayerCurrentTimeProps {
   *    className?: string;
   *    format?: 'SS' | 'S' | 'MM:SS' | 'M:S' | 'HH:MM:SS' | 'H:M:S';
   * }
   * ```
   * - format : 시간 포맷입니다. (default : `'MM:SS'`)
   */
  CurrentTime: AudioPlayerCurrentTime,
  /**
   * 현재 재생 중인 오디오의 전체 재생 시간을 그리는 컴포넌트입니다.
   * 전달하는 포맷에 따라 시간 문자열이 바뀝니다.
   * @param AudioPlayerDurationProps
   * ```
   * interface AudioPlayerDurationProps {
   *    className?: string;
   *    format?: 'SS' | 'S' | 'MM:SS' | 'M:S' | 'HH:MM:SS' | 'H:M:S';
   * }
   * ```
   * - format : 시간 포맷입니다. (default : `'MM:SS'`)
   */
  Duration: AudioPlayerDuration,
  /**
   * 오디오 플레이어의 재생 바입니다.
   * Slider 컴포넌트의 기능을 상속합니다.
   * @param AudioPlayerProgressBarProps
   * ```
   * interface AudioPlayerProgressBarProps extends Omit<Parameters<typeof Slider>[0], 'max' | 'min' | 'value' | 'onChange' | 'onDrag' | 'onDragStart' | 'onDragEnd'> {
   *    draggable?: boolean;
   * }
   * ```
   * - draggable : 드래그 가능 여부입니다. (default : `true`)
   */
  ProgressBar: AudioPlayerProgressBar,
  /**
   * 오디오 플레이어의 볼륨 제어 바입니다.
   * Slider 컴포넌트의 기능을 상속합니다.
   * @param AudioPlayerVolumeProgressBarProps
   * ```
   * interface AudioPlayerVolumeProgressBarProps extends Omit<Parameters<typeof Slider>[0], 'max' | 'min' | 'value' | 'onChange' | 'onDrag' | 'onDragStart' | 'onDragEnd'> {
   *    draggable?: boolean;
   * }
   * ```
   * - draggable : 드래그 가능 여부입니다. (default : `true`)
   */
  VolumeProgressBar: AudioPlayerVolumeProgressBar,
  /**
   * 오디오 플레이어 재생 버튼입니다.
   * 이미지 기반으로 동작합니다.
   * @param AudioPlayerPlayButton
   * ```
   * interface AudioPlayerPlayButton {
   *    src?: string;
   *    width?: number;
   *    height?: number;
   *    className?: number;
   * }
   * ```
   * - width : 이미지의 너비입니다. (default : `32`)
   * - height : 이미지의 높이입니다. (default : `32`)
   */
  PlayButton: AudioPlayerPlayButton,
  /**
   * 오디오 플레이어 일시정지 버튼입니다.
   * 이미지 기반으로 동작합니다.
   * @param AudioPlayerPauseButton
   * ```
   * interface AudioPlayerPauseButton {
   *    src?: string;
   *    width?: number;
   *    height?: number;
   *    className?: number;
   * }
   * ```
   * - width : 이미지의 너비입니다. (default : `32`)
   * - height : 이미지의 높이입니다. (default : `32`)
   */
  PauseButton: AudioPlayerPauseButton,
  /**
   * 현재 재생 상태에 따라 재생 또는 일시정지로 동작하는 버튼입니다.
   * 이미지 기반으로 동작합니다.
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
   * - width : 이미지의 너비입니다. (default : `32`)
   * - height : 이미지의 높이입니다. (default : `32`)
   */
  PlayPauseButton: AudioPlayerPlayPauseButton,
  /**
   * 오디오 플레이어 정지 버튼입니다.
   * 이미지 기반으로 동작합니다.
   * @param AudioPlayerStopButton
   * ```
   * interface AudioPlayerStopButton {
   *    src?: string;
   *    width?: number;
   *    height?: number;
   *    className?: number;
   * }
   * ```
   * - width : 이미지의 너비입니다. (default : `32`)
   * - height : 이미지의 높이입니다. (default : `32`)
   */
  StopButton: AudioPlayerStopButton,
  /**
   * timeShift초 이전으로 재생 시간을 바꾸는 버튼입니다. (timeShift는 Provider에 전달하는 값입니다.)
   * 이미지 기반으로 동작합니다.
   * @param AudioPlayerShiftForwardButton
   * ```
   * interface AudioPlayerShiftForwardButton {
   *    src?: string;
   *    width?: number;
   *    height?: number;
   *    className?: number;
   * }
   * ```
   * - width : 이미지의 너비입니다. (default : `32`)
   * - height : 이미지의 높이입니다. (default : `32`)
   */
  ShiftForwardButton: AudioPlayerShiftForwardButton,
  /**
   * timeShift초 이후로 재생 시간을 바꾸는 버튼입니다. (timeShift는 Provider에 전달하는 값입니다.)
   * 이미지 기반으로 동작합니다.
   * @param AudioPlayerShiftBackwardButton
   * ```
   * interface AudioPlayerShiftBackwardButton {
   *    src?: string;
   *    width?: number;
   *    height?: number;
   *    className?: number;
   * }
   * ```
   * - width : 이미지의 너비입니다. (default : `32`)
   * - height : 이미지의 높이입니다. (default : `32`)
   */
  ShiftBackwardButton: AudioPlayerShiftBackwardButton,
  /**
   * 현재 재생 시간이 shiftThreshold초 이상이면 곡의 처음으로, 미만이면 이전 곡을 재생하는 버튼입니다.
   * (shiftThreshold는 prop으로 전달하는 값입니다.)
   * 이미지 기반으로 동작합니다.
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
   * - shiftThreshold : 곡의 처음 또는 이전 곡 재생 판단의 기준이 되는 값입니다. 초 단위입니다. (default : `2`)
   * - width : 이미지의 너비입니다. (default : `32`)
   * - height : 이미지의 높이입니다. (default : `32`)
   */
  SkipStartButton: AudioPlayerSkipStartButton,
  /**
   * 다음 곡을 재생하는 버튼입니다.
   * 이미지 기반으로 동작합니다.
   * @param AudioPlayerSkipEndButton
   * ```
   * interface AudioPlayerSkipEndButton {
   *    src?: string;
   *    width?: number;
   *    height?: number;
   *    className?: number;
   * }
   * ```
   * - width : 이미지의 너비입니다. (default : `32`)
   * - height : 이미지의 높이입니다. (default : `32`)
   */
  SkipEndButton: AudioPlayerSkipEndButton,
  /**
   * 반복 재생 모드를 토글하는 버튼입니다. (반복 없음 -> 전체 반복 -> 한곡 반복 -> 반복 없음)
   * 이미지 기반으로 동작합니다.
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
   * - width : 이미지의 너비입니다. (default : `32`)
   * - height : 이미지의 높이입니다. (default : `32`)
   */
  RepeatButton: AudioPlayerRepeatButton,
  /**
   * 볼륨 버튼입니다.
   * 이미지 기반으로 동작합니다.
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
   * - width : 이미지의 너비입니다. (default : `32`)
   * - height : 이미지의 높이입니다. (default : `32`)
   */
  VolumeButton: AudioPlayerVolumeButton,
};

export default AudioPlayer;
