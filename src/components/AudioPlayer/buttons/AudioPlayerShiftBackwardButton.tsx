import { useContext } from 'react';

import { AUDIO_PLAYER_BUTTON_DEFAULT_URL } from '../_constants';
import { AudioPlayerContext } from '../AudioPlayerProvider';

interface AudioPlayerShiftBackwardButtonProps {
  src?: string;
  width?: number;
  height?: number;
  className?: string;
}

const AudioPlayerShiftBackwardButton = ({
  src = AUDIO_PLAYER_BUTTON_DEFAULT_URL.shiftBackward,
  width = 32,
  height = 32,
  className,
}: AudioPlayerShiftBackwardButtonProps) => {
  const { shiftTimeBackward } = useContext(AudioPlayerContext);

  return (
    <button type="button" onClick={shiftTimeBackward}>
      <img
        src={src}
        alt="shift time to backward button"
        width={width}
        height={height}
        className={className}
      />
    </button>
  );
};

export default AudioPlayerShiftBackwardButton;
