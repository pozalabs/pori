import { useContext } from 'react';

import { AUDIO_PLAYER_BUTTON_DEFAULT_URL } from '../_constants';
import { AudioPlayerContext } from '../AudioPlayerProvider';

interface AudioPlayerVolumeButtonProps {
  volumeSrc?: string;
  mutedSrc?: string;
  width?: number;
  height?: number;
  className?: string;
}

const AudioPlayerVolumeButton = ({
  volumeSrc = AUDIO_PLAYER_BUTTON_DEFAULT_URL.volume,
  mutedSrc = AUDIO_PLAYER_BUTTON_DEFAULT_URL.muted,
  width = 32,
  height = 32,
  className,
}: AudioPlayerVolumeButtonProps) => {
  const { volume, toggleMuted } = useContext(AudioPlayerContext);

  return (
    <button type="button" onClick={toggleMuted}>
      <img
        src={volume <= 0 ? mutedSrc : volumeSrc}
        alt="volume button"
        width={width}
        height={height}
        className={className}
      />
    </button>
  );
};

export default AudioPlayerVolumeButton;
