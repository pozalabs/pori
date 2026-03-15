import { useCallback, useEffect, useRef, useState } from 'react';

import findArrayElementById from './_utils/findArrayElementById';
import type { ArrayElementType } from '../../types';
import type { Playlist } from '../../types';

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

  const getPlayingAudioIndex = useCallback((): number => {
    const playingAudioIndex = findArrayElementById({
      array: playlist,
      id: playingId,
      returnIndex: true,
    });

    if (playingAudioIndex === undefined) return -1;

    return playingAudioIndex;
  }, [playingId, playlist]);

  const playNextAudio = useCallback(
    (autoplay = true): void => {
      const playingAudioIndex = getPlayingAudioIndex();

      if (playingAudioIndex < 0) return;

      const targetAudioIndex = playingAudioIndex >= playlist.length - 1 ? 0 : playingAudioIndex + 1;

      changePlayingAudio(playlist[targetAudioIndex].id, autoplay);
    },
    [changePlayingAudio, getPlayingAudioIndex, playlist],
  );

  const playPrevAudio = useCallback(
    (autoplay = true): void => {
      const playingAudioIndex = getPlayingAudioIndex();

      if (playingAudioIndex < 0) return;

      const targetAudioIndex = playingAudioIndex <= 0 ? playlist.length - 1 : playingAudioIndex - 1;

      changePlayingAudio(playlist[targetAudioIndex].id, autoplay);
    },
    [changePlayingAudio, getPlayingAudioIndex, playlist],
  );

  useEffect(() => {
    if (playlist.length > 0) return;

    resetAudio();
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
