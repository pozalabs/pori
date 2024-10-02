import { useCallback, useContext } from 'react';

import { AUDIO_PLAYER_BUTTON_DEFAULT_URL } from '../_constants';
import { AudioPlayerContext } from '../AudioPlayerProvider';

interface AudioPlayerPauseButtonProps {
  playSrc?: string;
  pauseSrc?: string;
  width?: number;
  height?: number;
  className?: string;
}

const AudioPlayerPauseButton = ({
  playSrc = AUDIO_PLAYER_BUTTON_DEFAULT_URL.play,
  pauseSrc = AUDIO_PLAYER_BUTTON_DEFAULT_URL.pause,
  width = 32,
  height = 32,
  className,
}: AudioPlayerPauseButtonProps) => {
  const { isPlaying, togglePlayPause } = useContext(AudioPlayerContext);

  const onButtonClick = useCallback((): void => {
    togglePlayPause();
  }, [togglePlayPause]);

  return (
    <button type="button" onClick={onButtonClick}>
      <img
        src={isPlaying ? pauseSrc : playSrc}
        alt={isPlaying ? 'pause button' : 'play button'}
        width={width}
        height={height}
        className={className}
      />
    </button>
  );
};

export default AudioPlayerPauseButton;
