import { useCallback, useContext } from 'react';

import AudioPlayerButtonWrapper from './AudioPlayerButtonWrapper';
import { AUDIO_PLAYER_BUTTON_DEFAULT_SIZE, AUDIO_PLAYER_BUTTON_DEFAULT_URL } from '../_constants';
import { AudioPlayerContext } from '../AudioPlayerProvider';

interface AudioPlayerSkipEndButtonProps {
  src?: string;
  width?: number;
  height?: number;
  className?: string;
}

const AudioPlayerSkipEndButton = ({
  src = AUDIO_PLAYER_BUTTON_DEFAULT_URL.skipToEnd,
  width = AUDIO_PLAYER_BUTTON_DEFAULT_SIZE,
  height = AUDIO_PLAYER_BUTTON_DEFAULT_SIZE,
  className,
}: AudioPlayerSkipEndButtonProps) => {
  const { isPlaying, playNextAudio } = useContext(AudioPlayerContext);

  const onButtonClick = useCallback((): void => {
    playNextAudio(isPlaying);
  }, [isPlaying, playNextAudio]);

  return (
    <AudioPlayerButtonWrapper onClick={onButtonClick}>
      <img src={src} alt="skip to end button" width={width} height={height} className={className} />
    </AudioPlayerButtonWrapper>
  );
};

export default AudioPlayerSkipEndButton;
