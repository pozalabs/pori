import AudioPlayerCurrentTime from './AudioPlayerCurrentTime';
import AudioPlayerDuration from './AudioPlayerDuration';
import AudioPlayerPlaylist from './AudioPlayerPlaylist';
import AudioPlayerProgressBar from './AudioPlayerProgressBar';
import AudioPlayerProvider from './AudioPlayerProvider';
import AudioPlayerVolumeProgressBar from './AudioPlayerVolumeProgressBar';
import AudioPlayerPauseButton from './buttons/AudioPlayerPauseButton';
import AudioPlayerPlayButton from './buttons/AudioPlayerPlayButton';
import AudioPlayerPlayPauseButton from './buttons/AudioPlayerPlayPauseButton';
import AudioPlayerRepeatButton from './buttons/AudioPlayerRepeatButton';
import AudioPlayerShiftBackwardButton from './buttons/AudioPlayerShiftBackwardButton';
import AudioPlayerShiftForwardButton from './buttons/AudioPlayerShiftForwardButton';
import AudioPlayerSkipEndButton from './buttons/AudioPlayerSkipEndButton';
import AudioPlayerSkipStartButton from './buttons/AudioPlayerSkipStartButton';
import AudioPlayerStopButton from './buttons/AudioPlayerStopButton';
import AudioPlayerVolumeButton from './buttons/AudioPlayerVolumeButton';

const AudioPlayer = {
  Provider: AudioPlayerProvider,
  Playlist: AudioPlayerPlaylist,
  CurrentTime: AudioPlayerCurrentTime,
  Duration: AudioPlayerDuration,
  ProgressBar: AudioPlayerProgressBar,
  PlayButton: AudioPlayerPlayButton,
  PauseButton: AudioPlayerPauseButton,
  PlayPauseButton: AudioPlayerPlayPauseButton,
  StopButton: AudioPlayerStopButton,
  ShiftForward: AudioPlayerShiftForwardButton,
  ShiftBackward: AudioPlayerShiftBackwardButton,
  SkipStartButton: AudioPlayerSkipStartButton,
  SkipEndButton: AudioPlayerSkipEndButton,
  RepeatButton: AudioPlayerRepeatButton,
  VolumeButton: AudioPlayerVolumeButton,
  VolumeProgressBar: AudioPlayerVolumeProgressBar,
};

export default AudioPlayer;
