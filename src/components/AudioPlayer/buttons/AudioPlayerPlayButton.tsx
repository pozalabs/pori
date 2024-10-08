import { useContext } from 'react';

import AudioPlayerButtonWrapper from './AudioPlayerButtonWrapper';
import { AUDIO_PLAYER_BUTTON_DEFAULT_SIZE, AUDIO_PLAYER_BUTTON_DEFAULT_URL } from '../_constants';
import type { AudioPlayerButtonProps } from '../_types';
import { AudioPlayerContext } from '../AudioPlayerProvider';

export interface AudioPlayerPlayButtonProps extends AudioPlayerButtonProps {
  src?: string;
}

const AudioPlayerPlayButton = ({
  src = AUDIO_PLAYER_BUTTON_DEFAULT_URL.play,
  width = AUDIO_PLAYER_BUTTON_DEFAULT_SIZE,
  height = AUDIO_PLAYER_BUTTON_DEFAULT_SIZE,
  className,
}: AudioPlayerPlayButtonProps) => {
  const { play } = useContext(AudioPlayerContext);

  return (
    <AudioPlayerButtonWrapper onClick={play}>
      <img src={src} alt="play button" width={width} height={height} className={className} />
    </AudioPlayerButtonWrapper>
  );
};

export default AudioPlayerPlayButton;
