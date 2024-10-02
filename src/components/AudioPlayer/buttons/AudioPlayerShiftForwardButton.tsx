import { useContext } from 'react';

import { AUDIO_PLAYER_BUTTON_DEFAULT_URL } from '../_constants';
import { AudioPlayerContext } from '../AudioPlayerProvider';

interface AudioPlayerShiftForwardButtonProps {
  src?: string;
  width?: number;
  height?: number;
  className?: string;
}

const AudioPlayerShiftForwardButton = ({
  src = AUDIO_PLAYER_BUTTON_DEFAULT_URL.shiftForward,
  width = 32,
  height = 32,
  className,
}: AudioPlayerShiftForwardButtonProps) => {
  const { shiftTimeForward } = useContext(AudioPlayerContext);

  return (
    <button type="button" onClick={shiftTimeForward}>
      <img
        src={src}
        alt="shift time to forward button"
        width={width}
        height={height}
        className={className}
      />
    </button>
  );
};

export default AudioPlayerShiftForwardButton;
