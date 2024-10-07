import { useContext } from 'react';

import AudioPlayerButtonWrapper from './AudioPlayerButtonWrapper';
import { AUDIO_PLAYER_BUTTON_DEFAULT_SIZE, AUDIO_PLAYER_BUTTON_DEFAULT_URL } from '../_constants';
import type { AudioPlayerButtonProps } from '../_types';
import { AudioPlayerContext } from '../AudioPlayerProvider';

export interface AudioPlayerShiftBackwardButtonProps extends AudioPlayerButtonProps {
  src?: string;
}

const AudioPlayerShiftBackwardButton = ({
  src = AUDIO_PLAYER_BUTTON_DEFAULT_URL.shiftBackward,
  width = AUDIO_PLAYER_BUTTON_DEFAULT_SIZE,
  height = AUDIO_PLAYER_BUTTON_DEFAULT_SIZE,
  className,
}: AudioPlayerShiftBackwardButtonProps) => {
  const { shiftTimeBackward } = useContext(AudioPlayerContext);

  return (
    <AudioPlayerButtonWrapper onClick={shiftTimeBackward}>
      <img
        src={src}
        alt="shift time to backward button"
        width={width}
        height={height}
        className={className}
      />
    </AudioPlayerButtonWrapper>
  );
};

export default AudioPlayerShiftBackwardButton;
