import { useCallback, useEffect, useRef, useState } from 'react';

import type { ArrayElementType } from '@pozalabs/pokit/types';

import type { Playlist } from './_types';
import findArrayElementById from './_utils/findArrayElementById';

interface UsePlayingAudioParams {
  playlist: Playlist;
  changeCurrentSrc: (currentSrc: string) => void;
  resetAudio: () => void;
  togglePlayPause: (src?: string) => void;
}

interface UsePlayingAudioReturns {
  playingId: ArrayElementType<Playlist>['id'];
  changePlayingAudio: (id: ArrayElementType<Playlist>['id'], autoplay?: boolean) => void;
  playNextAudio: (autoplay?: boolean) => void;
  playPrevAudio: (autoplay?: boolean) => void;
}

const usePlayingAudio = ({
  playlist,
  changeCurrentSrc,
  resetAudio,
  togglePlayPause,
}: UsePlayingAudioParams): UsePlayingAudioReturns => {
  const [playingId, setPlayingId] = useState(playlist.length > 0 ? playlist[0].id : '');

  const needToPlayRef = useRef(false);

  const changePlayingAudio = useCallback(
    (id: ArrayElementType<Playlist>['id'], autoplay = true): void => {
      if (id === playingId) {
        togglePlayPause();
        return;
      }

      setPlayingId(id);

      needToPlayRef.current = autoplay;
    },
    [playingId, togglePlayPause],
  );

  const playNextAudio = useCallback(
    (autoplay = true): void => {
      const playingAudioIndex = findArrayElementById({
        array: playlist,
        id: playingId,
        returnIndex: true,
      });

      if (playingAudioIndex === undefined || playingAudioIndex < 0) return;

      if (playingAudioIndex >= playlist.length - 1) {
        changePlayingAudio(playlist[0].id, autoplay);
        return;
      }

      changePlayingAudio(playlist[playingAudioIndex + 1].id, autoplay);
    },
    [changePlayingAudio, playingId, playlist],
  );

  const playPrevAudio = useCallback(
    (autoplay = true): void => {
      const playingAudioIndex = findArrayElementById({
        array: playlist,
        id: playingId,
        returnIndex: true,
      });

      if (playingAudioIndex === undefined || playingAudioIndex < 0) return;

      if (playingAudioIndex <= 0) {
        changePlayingAudio(playlist[playlist.length - 1].id, autoplay);
        return;
      }

      changePlayingAudio(playlist[playingAudioIndex - 1].id, autoplay);
    },
    [changePlayingAudio, playingId, playlist],
  );

  useEffect(() => {
    if (playlist.length <= 0) {
      resetAudio();
      return;
    }
  }, [playlist, resetAudio]);

  useEffect(() => {
    if (!playingId) {
      resetAudio();
      return;
    }

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

    if (needToPlayRef.current) {
      togglePlayPause(playingAudio.src);
      return;
    }

    changeCurrentSrc(playingAudio.src);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playingId]);

  return {
    playingId,
    changePlayingAudio,
    playNextAudio,
    playPrevAudio,
  };
};

export default usePlayingAudio;
