import { useContext } from 'react';

import AudioPlayerButtonIcon from './AudioPlayerButtonIcon';
import AudioPlayerButtonWrapper from './AudioPlayerButtonWrapper';
import type { AudioPlayerShiftForwardButtonProps } from '../../../../types';
import {
  AUDIO_PLAYER_BUTTON_DEFAULT_ICON,
  AUDIO_PLAYER_BUTTON_DEFAULT_SIZE,
} from '../../_constants';
import { AudioPlayerContext } from '../AudioPlayerProvider';

/** Advances playback by the configured time shift. */
const AudioPlayerShiftForwardButton = ({
  src = AUDIO_PLAYER_BUTTON_DEFAULT_ICON.shiftForward,
  width = AUDIO_PLAYER_BUTTON_DEFAULT_SIZE,
  height = AUDIO_PLAYER_BUTTON_DEFAULT_SIZE,
  className,
}: AudioPlayerShiftForwardButtonProps) => {
  const { shiftTimeForward } = useContext(AudioPlayerContext);

  return (
    <AudioPlayerButtonWrapper onClick={shiftTimeForward}>
      <AudioPlayerButtonIcon
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
