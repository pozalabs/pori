import { useContext } from 'react';

import { AudioPlayerContext } from './AudioPlayerProvider';
import type { AudioPlayerDurationProps } from '../../../types';
import cn from '../../../utils/cn';
import { AUDIO_PLAYER_CURRENT_TIME_DURATION_DEFAULT_VALUE } from '../_constants';
import formatTime from '../_utils/formatTime';

const AudioPlayerDuration = ({
  className,
  format = AUDIO_PLAYER_CURRENT_TIME_DURATION_DEFAULT_VALUE.format,
}: AudioPlayerDurationProps) => {
  const { duration } = useContext(AudioPlayerContext);

  return (
    <span className={cn('font-light', className)}>{formatTime(Math.round(duration), format)}</span>
  );
};

export default AudioPlayerDuration;
