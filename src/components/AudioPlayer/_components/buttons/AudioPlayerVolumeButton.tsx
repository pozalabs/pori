import { useContext } from 'react';

import AudioPlayerButtonIcon from './AudioPlayerButtonIcon';
import AudioPlayerButtonWrapper from './AudioPlayerButtonWrapper';
import type { AudioPlayerVolumeButtonProps } from '../../../../types';
import {
  AUDIO_PLAYER_BUTTON_DEFAULT_ICON,
  AUDIO_PLAYER_BUTTON_DEFAULT_SIZE,
} from '../../_constants';
import { AudioPlayerContext } from '../AudioPlayerProvider';

/** Toggles audio mute. */
const AudioPlayerVolumeButton = ({
  volumeSrc = AUDIO_PLAYER_BUTTON_DEFAULT_ICON.volume,
  mutedSrc = AUDIO_PLAYER_BUTTON_DEFAULT_ICON.muted,
  width = AUDIO_PLAYER_BUTTON_DEFAULT_SIZE,
  height = AUDIO_PLAYER_BUTTON_DEFAULT_SIZE,
  className,
}: AudioPlayerVolumeButtonProps) => {
  const { volume, toggleMuted } = useContext(AudioPlayerContext);

  return (
    <AudioPlayerButtonWrapper onClick={toggleMuted}>
      <AudioPlayerButtonIcon
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
