import { useContext } from 'react';

import AudioPlayerButtonIcon from './AudioPlayerButtonIcon';
import AudioPlayerButtonWrapper from './AudioPlayerButtonWrapper';
import type { AudioPlayerPauseButtonProps } from '../../../../types';
import {
  AUDIO_PLAYER_BUTTON_DEFAULT_ICON,
  AUDIO_PLAYER_BUTTON_DEFAULT_SIZE,
} from '../../_constants';
import { AudioPlayerContext } from '../AudioPlayerProvider';

const AudioPlayerPauseButton = ({
  src = AUDIO_PLAYER_BUTTON_DEFAULT_ICON.pause,
  width = AUDIO_PLAYER_BUTTON_DEFAULT_SIZE,
  height = AUDIO_PLAYER_BUTTON_DEFAULT_SIZE,
  className,
}: AudioPlayerPauseButtonProps) => {
  const { pause } = useContext(AudioPlayerContext);

  return (
    <AudioPlayerButtonWrapper onClick={pause}>
      <AudioPlayerButtonIcon
        src={src}
        alt="pause button"
        width={width}
        height={height}
        className={className}
      />
    </AudioPlayerButtonWrapper>
  );
};

export default AudioPlayerPauseButton;
