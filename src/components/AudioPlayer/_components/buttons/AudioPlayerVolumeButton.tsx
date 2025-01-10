import { useContext } from 'react';

import AudioPlayerButtonWrapper from './AudioPlayerButtonWrapper';
import type { AudioPlayerVolumeButtonProps } from '../../../../types';
import {
  AUDIO_PLAYER_BUTTON_DEFAULT_SIZE,
  AUDIO_PLAYER_BUTTON_DEFAULT_URL,
} from '../../_constants';
import { AudioPlayerContext } from '../AudioPlayerProvider';

const AudioPlayerVolumeButton = ({
  volumeSrc = AUDIO_PLAYER_BUTTON_DEFAULT_URL.volume,
  mutedSrc = AUDIO_PLAYER_BUTTON_DEFAULT_URL.muted,
  width = AUDIO_PLAYER_BUTTON_DEFAULT_SIZE,
  height = AUDIO_PLAYER_BUTTON_DEFAULT_SIZE,
  className,
}: AudioPlayerVolumeButtonProps) => {
  const { volume, toggleMuted } = useContext(AudioPlayerContext);

  return (
    <AudioPlayerButtonWrapper onClick={toggleMuted}>
      <img
        src={volume <= 0 ? mutedSrc : volumeSrc}
        alt="volume button"
        width={width}
        height={height}
        className={className}
      />
    </AudioPlayerButtonWrapper>
  );
};

export default AudioPlayerVolumeButton;
