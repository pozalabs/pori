import { useCallback, useContext, useMemo } from 'react';

import AudioPlayerButtonIcon from './AudioPlayerButtonIcon';
import AudioPlayerButtonWrapper from './AudioPlayerButtonWrapper';
import type { AudioPlayerPlayPauseButtonProps } from '../../../../types';
import {
  AUDIO_PLAYER_BUTTON_DEFAULT_ICON,
  AUDIO_PLAYER_BUTTON_DEFAULT_SIZE,
} from '../../_constants';
import { AudioPlayerContext } from '../AudioPlayerProvider';

const AudioPlayerPlayPauseButton = ({
  audioId,
  playSrc = AUDIO_PLAYER_BUTTON_DEFAULT_ICON.play,
  pauseSrc = AUDIO_PLAYER_BUTTON_DEFAULT_ICON.pause,
  width = AUDIO_PLAYER_BUTTON_DEFAULT_SIZE,
  height = AUDIO_PLAYER_BUTTON_DEFAULT_SIZE,
  className,
}: AudioPlayerPlayPauseButtonProps) => {
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
    <AudioPlayerButtonWrapper onClick={onButtonClick}>
      <AudioPlayerButtonIcon
        src={isAudioPlaying ? pauseSrc : playSrc}
        alt={isAudioPlaying ? 'pause button' : 'play button'}
        width={width}
        height={height}
        className={className}
      />
    </AudioPlayerButtonWrapper>
  );
};

export default AudioPlayerPlayPauseButton;
