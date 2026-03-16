import { useCallback, useContext } from 'react';

import AudioPlayerButtonIcon from './AudioPlayerButtonIcon';
import AudioPlayerButtonWrapper from './AudioPlayerButtonWrapper';
import type { AudioPlayerSkipStartButtonProps } from '../../../../types';
import {
  AUDIO_PLAYER_BUTTON_DEFAULT_ICON,
  AUDIO_PLAYER_BUTTON_DEFAULT_SIZE,
  AUDIO_PLAYER_SKIP_START_BUTTON_DEFAULT_VALUE,
} from '../../_constants';
import { AudioPlayerContext } from '../AudioPlayerProvider';

/** Restarts the current audio or skips to the previous one. */
const AudioPlayerSkipStartButton = ({
  src = AUDIO_PLAYER_BUTTON_DEFAULT_ICON.skipToStart,
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
      <AudioPlayerButtonIcon
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
