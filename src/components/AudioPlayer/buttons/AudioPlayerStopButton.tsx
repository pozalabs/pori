import { useContext } from 'react';

import { AUDIO_PLAYER_BUTTON_DEFAULT_URL } from '../_constants';
import { AudioPlayerContext } from '../AudioPlayerProvider';

interface AudioPlayerStopButtonProps {
  src?: string;
  width?: number;
  height?: number;
  className?: string;
}

const AudioPlayerStopButton = ({
  src = AUDIO_PLAYER_BUTTON_DEFAULT_URL.stop,
  width = 32,
  height = 32,
  className,
}: AudioPlayerStopButtonProps) => {
  const { stop } = useContext(AudioPlayerContext);

  return (
    <button type="button" onClick={stop}>
      <img src={src} alt="stop button" width={width} height={height} className={className} />
    </button>
  );
};

export default AudioPlayerStopButton;
