import { useCallback, useContext, useMemo } from 'react';

import { AUDIO_PLAYER_BUTTON_DEFAULT_SIZE, AUDIO_PLAYER_BUTTON_DEFAULT_URL } from '../_constants';
import { AudioPlayerContext } from '../AudioPlayerProvider';

interface AudioPlayerPauseButtonProps {
  audioId?: string;
  playSrc?: string;
  pauseSrc?: string;
  width?: number;
  height?: number;
  className?: string;
}

const AudioPlayerPauseButton = ({
  audioId,
  playSrc = AUDIO_PLAYER_BUTTON_DEFAULT_URL.play,
  pauseSrc = AUDIO_PLAYER_BUTTON_DEFAULT_URL.pause,
  width = AUDIO_PLAYER_BUTTON_DEFAULT_SIZE,
  height = AUDIO_PLAYER_BUTTON_DEFAULT_SIZE,
  className,
}: AudioPlayerPauseButtonProps) => {
  const { isPlaying, playingId, changePlayingAudio, togglePlayPause } =
    useContext(AudioPlayerContext);

  const onButtonClick = useCallback((): void => {
    if (audioId && playingId !== audioId) {
      changePlayingAudio(audioId, true);
    }

    togglePlayPause();
  }, [audioId, changePlayingAudio, playingId, togglePlayPause]);

  const isAudioPlaying = useMemo(
    () => isPlaying && (!audioId || audioId === playingId),
    [audioId, isPlaying, playingId],
  );

  return (
    <button type="button" onClick={onButtonClick}>
      <img
        src={isAudioPlaying ? pauseSrc : playSrc}
        alt={isAudioPlaying ? 'pause button' : 'play button'}
        width={width}
        height={height}
        className={className}
      />
    </button>
  );
};

export default AudioPlayerPauseButton;
