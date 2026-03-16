import { useContext } from 'react';

import AudioPlayerButtonIcon from './AudioPlayerButtonIcon';
import AudioPlayerButtonWrapper from './AudioPlayerButtonWrapper';
import type { AudioPlayerPlayButtonProps } from '../../../../types';
import {
  AUDIO_PLAYER_BUTTON_DEFAULT_ICON,
  AUDIO_PLAYER_BUTTON_DEFAULT_SIZE,
} from '../../_constants';
import { AudioPlayerContext } from '../AudioPlayerProvider';

const AudioPlayerPlayButton = ({
  src = AUDIO_PLAYER_BUTTON_DEFAULT_ICON.play,
  width = AUDIO_PLAYER_BUTTON_DEFAULT_SIZE,
  height = AUDIO_PLAYER_BUTTON_DEFAULT_SIZE,
  className,
}: AudioPlayerPlayButtonProps) => {
  const { play } = useContext(AudioPlayerContext);

  return (
    <AudioPlayerButtonWrapper onClick={play}>
      <AudioPlayerButtonIcon src={src} alt="play button" width={width} height={height} className={className} />
    </AudioPlayerButtonWrapper>
  );
};

export default AudioPlayerPlayButton;
