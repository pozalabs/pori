import { useContext } from 'react';

import AudioPlayerButtonIcon from './AudioPlayerButtonIcon';
import AudioPlayerButtonWrapper from './AudioPlayerButtonWrapper';
import type { AudioPlayerShiftBackwardButtonProps } from '../../../../types';
import {
  AUDIO_PLAYER_BUTTON_DEFAULT_ICON,
  AUDIO_PLAYER_BUTTON_DEFAULT_SIZE,
} from '../../_constants';
import { AudioPlayerContext } from '../AudioPlayerProvider';

/** Rewinds playback by the configured time shift. */
const AudioPlayerShiftBackwardButton = ({
  src = AUDIO_PLAYER_BUTTON_DEFAULT_ICON.shiftBackward,
  width = AUDIO_PLAYER_BUTTON_DEFAULT_SIZE,
  height = AUDIO_PLAYER_BUTTON_DEFAULT_SIZE,
  className,
}: AudioPlayerShiftBackwardButtonProps) => {
  const { shiftTimeBackward } = useContext(AudioPlayerContext);

  return (
    <AudioPlayerButtonWrapper onClick={shiftTimeBackward}>
      <AudioPlayerButtonIcon
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
