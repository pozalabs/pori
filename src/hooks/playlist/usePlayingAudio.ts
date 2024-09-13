import { useCallback, useEffect, useState } from 'react';

import type { ArrayElementType } from '@pozalabs/pokit/types';

import type { Playlist } from './_types';
import findArrayElementById from './_utils/findArrayElementById';

interface UsePlayingAudioParams {
  playlist: Playlist;
  resetAudio: () => void;
  togglePlayPause: (src?: string) => void;
}

interface UsePlayingAudioReturns {
  playingId: ArrayElementType<Playlist>['id'];
  changePlayingAudio: (id: ArrayElementType<Playlist>['id']) => void;
}

const usePlayingAudio = ({
  playlist,
  resetAudio,
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
    const playingAudio = findArrayElementById({
      array: playlist,
      id: playingId,
      returnIndex: false,
    });

    if (!playingAudio) {
      resetAudio();
      setPlayingId('');
      return;
    }

    togglePlayPause(playingAudio.src);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playingId]);

  return {
    playingId,
    changePlayingAudio,
  };
};

export default usePlayingAudio;
