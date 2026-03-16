import type { ReactNode } from 'react';
import { useCallback, useContext, useMemo } from 'react';

import AudioPlayerButtonIcon from './AudioPlayerButtonIcon';
import AudioPlayerButtonWrapper from './AudioPlayerButtonWrapper';
import type { AudioPlayerRepeatButtonProps } from '../../../../types';
import {
  AUDIO_PLAYER_BUTTON_DEFAULT_ICON,
  AUDIO_PLAYER_BUTTON_DEFAULT_SIZE,
} from '../../_constants';
import { AudioPlayerContext } from '../AudioPlayerProvider';

const AudioPlayerRepeatButton = ({
  repeatAllSrc = AUDIO_PLAYER_BUTTON_DEFAULT_ICON.repeatAll,
  repeatOneSrc = AUDIO_PLAYER_BUTTON_DEFAULT_ICON.repeatOne,
  repeatNoneSrc = AUDIO_PLAYER_BUTTON_DEFAULT_ICON.repeatNone,
  width = AUDIO_PLAYER_BUTTON_DEFAULT_SIZE,
  height = AUDIO_PLAYER_BUTTON_DEFAULT_SIZE,
  className,
}: AudioPlayerRepeatButtonProps) => {
  const { repeatMode, changeRepeatMode } = useContext(AudioPlayerContext);

  const src = useMemo((): ReactNode => {
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
      <AudioPlayerButtonIcon src={src} alt="repeat button" width={width} height={height} className={className} />
    </AudioPlayerButtonWrapper>
  );
};

export default AudioPlayerRepeatButton;
