import { useContext } from 'react';

import { AudioPlayerContext } from './AudioPlayerProvider';
import type { AudioPlayerCurrentTimeProps } from '../../../types';
import cn from '../../../utils/cn';
import { AUDIO_PLAYER_CURRENT_TIME_DURATION_DEFAULT_VALUE } from '../_constants';
import formatTime from '../_utils/formatTime';

const AudioPlayerCurrentTime = ({
  className,
  format = AUDIO_PLAYER_CURRENT_TIME_DURATION_DEFAULT_VALUE.format,
}: AudioPlayerCurrentTimeProps) => {
  const { currentTime } = useContext(AudioPlayerContext);

  return (
    <span className={cn('font-light', className)}>
      {formatTime(Math.round(currentTime), format)}
    </span>
  );
};

export default AudioPlayerCurrentTime;
