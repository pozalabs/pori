import { useContext } from 'react';

import AudioPlayerButtonWrapper from './AudioPlayerButtonWrapper';
import { AUDIO_PLAYER_BUTTON_DEFAULT_SIZE, AUDIO_PLAYER_BUTTON_DEFAULT_URL } from '../_constants';
import { AudioPlayerContext } from '../AudioPlayerProvider';

export interface AudioPlayerShiftForwardButtonProps {
  src?: string;
  width?: number;
  height?: number;
  className?: string;
}

const AudioPlayerShiftForwardButton = ({
  src = AUDIO_PLAYER_BUTTON_DEFAULT_URL.shiftForward,
  width = AUDIO_PLAYER_BUTTON_DEFAULT_SIZE,
  height = AUDIO_PLAYER_BUTTON_DEFAULT_SIZE,
  className,
}: AudioPlayerShiftForwardButtonProps) => {
  const { shiftTimeForward } = useContext(AudioPlayerContext);

  return (
    <AudioPlayerButtonWrapper onClick={shiftTimeForward}>
      <img
        src={src}
        alt="shift time to forward button"
        width={width}
        height={height}
        className={className}
      />
    </AudioPlayerButtonWrapper>
  );
};

export default AudioPlayerShiftForwardButton;
