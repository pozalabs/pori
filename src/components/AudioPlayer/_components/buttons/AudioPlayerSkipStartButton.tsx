import { useCallback, useContext } from 'react';

import AudioPlayerButtonWrapper from './AudioPlayerButtonWrapper';
import {
  AUDIO_PLAYER_BUTTON_DEFAULT_SIZE,
  AUDIO_PLAYER_BUTTON_DEFAULT_URL,
  AUDIO_PLAYER_SKIP_START_BUTTON_DEFAULT_VALUE,
} from '../../_constants';
import type { AudioPlayerButtonProps } from '../../_types';
import { AudioPlayerContext } from '../AudioPlayerProvider';

export interface AudioPlayerSkipStartButtonProps extends AudioPlayerButtonProps {
  src?: string;
  shiftThreshold?: number;
}

const AudioPlayerSkipStartButton = ({
  src = AUDIO_PLAYER_BUTTON_DEFAULT_URL.skipToStart,
  shiftThreshold = AUDIO_PLAYER_SKIP_START_BUTTON_DEFAULT_VALUE.shiftThreshold,
  width = AUDIO_PLAYER_BUTTON_DEFAULT_SIZE,
  height = AUDIO_PLAYER_BUTTON_DEFAULT_SIZE,
  className,
}: AudioPlayerSkipStartButtonProps) => {
  const { currentTime, isPlaying, changeCurrentTime, playPrevAudio } =
    useContext(AudioPlayerContext);

  const onButtonClick = useCallback((): void => {
    if (currentTime >= shiftThreshold) {
      changeCurrentTime(0);
      return;
    }

    playPrevAudio(isPlaying);
  }, [changeCurrentTime, currentTime, isPlaying, playPrevAudio, shiftThreshold]);

  return (
    <AudioPlayerButtonWrapper onClick={onButtonClick}>
      <img
        src={src}
        alt="skip to start button"
        width={width}
        height={height}
        className={className}
      />
    </AudioPlayerButtonWrapper>
  );
};

export default AudioPlayerSkipStartButton;
