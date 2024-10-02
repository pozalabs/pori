import { useContext } from 'react';

import { AUDIO_PLAYER_BUTTON_DEFAULT_SIZE, AUDIO_PLAYER_BUTTON_DEFAULT_URL } from '../_constants';
import { AudioPlayerContext } from '../AudioPlayerProvider';

interface AudioPlayerPauseButtonProps {
  src?: string;
  width?: number;
  height?: number;
  className?: string;
}

const AudioPlayerPauseButton = ({
  src = AUDIO_PLAYER_BUTTON_DEFAULT_URL.pause,
  width = AUDIO_PLAYER_BUTTON_DEFAULT_SIZE,
  height = AUDIO_PLAYER_BUTTON_DEFAULT_SIZE,
  className,
}: AudioPlayerPauseButtonProps) => {
  const { pause } = useContext(AudioPlayerContext);

  return (
    <button type="button" onClick={pause}>
      <img src={src} alt="pause button" width={width} height={height} className={className} />
    </button>
  );
};

export default AudioPlayerPauseButton;
