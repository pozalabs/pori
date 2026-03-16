import { useCallback, useContext } from 'react';

import AudioPlayerButtonIcon from './AudioPlayerButtonIcon';
import AudioPlayerButtonWrapper from './AudioPlayerButtonWrapper';
import type { AudioPlayerSkipEndButtonProps } from '../../../../types';
import {
  AUDIO_PLAYER_BUTTON_DEFAULT_ICON,
  AUDIO_PLAYER_BUTTON_DEFAULT_SIZE,
} from '../../_constants';
import { AudioPlayerContext } from '../AudioPlayerProvider';

/** Skips to the next audio in the playlist. */
const AudioPlayerSkipEndButton = ({
  src = AUDIO_PLAYER_BUTTON_DEFAULT_ICON.skipToEnd,
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
      <AudioPlayerButtonIcon
        src={src}
        alt="skip to end button"
        width={width}
        height={height}
        className={className}
      />
    </AudioPlayerButtonWrapper>
  );
};

export default AudioPlayerSkipEndButton;
