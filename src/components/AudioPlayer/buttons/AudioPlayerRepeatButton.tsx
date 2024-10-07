import { useCallback, useContext, useMemo } from 'react';

import AudioPlayerButtonWrapper from './AudioPlayerButtonWrapper';
import { AUDIO_PLAYER_BUTTON_DEFAULT_SIZE, AUDIO_PLAYER_BUTTON_DEFAULT_URL } from '../_constants';
import type { AudioPlayerButtonProps } from '../_types';
import { AudioPlayerContext } from '../AudioPlayerProvider';

export interface AudioPlayerRepeatButtonProps extends AudioPlayerButtonProps {
  repeatAllSrc?: string;
  repeatOneSrc?: string;
  repeatNoneSrc?: string;
}

const AudioPlayerRepeatButton = ({
  repeatAllSrc = AUDIO_PLAYER_BUTTON_DEFAULT_URL.repeatAll,
  repeatOneSrc = AUDIO_PLAYER_BUTTON_DEFAULT_URL.repeatOne,
  repeatNoneSrc = AUDIO_PLAYER_BUTTON_DEFAULT_URL.repeatNone,
  width = AUDIO_PLAYER_BUTTON_DEFAULT_SIZE,
  height = AUDIO_PLAYER_BUTTON_DEFAULT_SIZE,
  className,
}: AudioPlayerRepeatButtonProps) => {
  const { repeatMode, changeRepeatMode } = useContext(AudioPlayerContext);

  const src = useMemo((): string => {
    switch (repeatMode) {
      case 'all':
        return repeatAllSrc;
      case 'one':
        return repeatOneSrc;
      case 'none':
        return repeatNoneSrc;
    }
  }, [repeatAllSrc, repeatMode, repeatNoneSrc, repeatOneSrc]);

  const onButtonClick = useCallback((): void => {
    switch (repeatMode) {
      case 'all':
        changeRepeatMode('one');
        return;
      case 'one':
        changeRepeatMode('none');
        return;
      case 'none':
        changeRepeatMode('all');
    }
  }, [changeRepeatMode, repeatMode]);

  return (
    <AudioPlayerButtonWrapper onClick={onButtonClick}>
      <img src={src} alt="repeat button" width={width} height={height} className={className} />
    </AudioPlayerButtonWrapper>
  );
};

export default AudioPlayerRepeatButton;
