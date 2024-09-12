import { useCallback, useEffect, useState } from 'react';

import type { ArrayElementType } from '@pozalabs/pokit/types';

import type { Playlist } from './_types';

interface UsePlayingAudioParams {
  getPlayingAudio: (id: ArrayElementType<Playlist>['id']) => ArrayElementType<Playlist> | undefined;
  togglePlayPause: (src?: string) => void;
}

interface UsePlayingAudioReturns {
  playingId: ArrayElementType<Playlist>['id'];
  changePlayingAudio: (id: ArrayElementType<Playlist>['id']) => void;
}

const usePlayingAudio = ({
  getPlayingAudio,
  togglePlayPause,
}: UsePlayingAudioParams): UsePlayingAudioReturns => {
  const [playingId, setPlayingId] = useState('');

  const changePlayingAudio = useCallback(
    (id: ArrayElementType<Playlist>['id']): void => {
      if (id === playingId) {
        togglePlayPause();
        return;
      }

      setPlayingId(id);
    },
    [playingId, togglePlayPause],
  );

  useEffect(() => {
    const playingAudio = getPlayingAudio(playingId);

    if (!playingAudio) {
      setPlayingId('');
      return;
    }

    togglePlayPause(playingAudio.src);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getPlayingAudio, playingId]);

  return {
    playingId,
    changePlayingAudio,
  };
};

export default usePlayingAudio;
