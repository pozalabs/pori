import { useCallback, useMemo, useState } from 'react';

import { PLAYLIST_DEFAULT_VALUE } from './_constants';
import findArrayElementById from './_utils/findArrayElementById';
import usePlayingAudio from './usePlayingAudio';
import usePlaylistEndedEvent from './usePlaylistEndedEvent';
import type { ArrayElementType } from '../../types';
import type { Playlist, RepeatModeType } from '../../types';
import useAudio from '../audio/useAudio';

interface UsePlaylistParams extends Omit<Parameters<typeof useAudio>[0], 'src' | 'loop'> {
  playlist?: Playlist;
  repeatMode?: RepeatModeType;
}

interface UsePlaylistReturns
  extends ReturnType<typeof useAudio>,
    ReturnType<typeof usePlayingAudio> {
  hasNextAudio: boolean;
  hasPrevAudio: boolean;
  playlist: Playlist;
  addAudio: (audio: ArrayElementType<Playlist>, autoplay?: boolean) => void;
  removeAudio: (id: ArrayElementType<Playlist>['id'], autoplay?: boolean) => void;
  changeAudioIndex: (id: ArrayElementType<Playlist>['id'], index: number) => void;
  clearPlaylist: () => void;
}

/**
 * This is a hook that manages a playlist, extending the playlist concept from the useAudio hook.
 * @param UsePlaylistParams
 * ```
 * interface UsePlaylistParams extends Omit<Parameters<typeof useAudio>[0], 'src' | 'loop'> {
 *    playlist?: Playlist;
 *    repeatMode?: RepeatModeType;
 * }
 * ```
 * - playlist : initial playlist array (default : [])
 * - repeatMode : repeat mode (none | one | all) (default : none)
 * @returns
 * `UsePlaylistReturns`
 * ```
 * interface UsePlaylistReturns extends ReturnType<typeof useAudio> {
 *    hasNextAudio: boolean;
 *    hasPrevAudio: boolean;
 *    playingId: ArrayElementType<Playlist>['id'];
 *    playlist: Playlist;
 *    addAudio: (audio: ArrayElementType<Playlist>, autoplay?: boolean) => void;
 *    changeAudioIndex: (id: ArrayElementType<Playlist>['id'], index: number) => void;
 *    changePlayingAudio: (id: ArrayElementType<Playlist>['id'], autoplay?: boolean) => void;
 *    clearPlaylist: () => void;
 *    playNextAudio: (autoplay?: boolean) => void;
 *    playPrevAudio: (autoplay?: boolean) => void;
 *    removeAudio: (id: ArrayElementType<Playlist>['id'], autoplay?: boolean) => void;
 * }
 * ```
 * - addAudio, removeAudio, changePlayingAudio, playNextAudio, and playPrevAudio receive the autoplay option as an optional parameter.
 *   - However, this value conflicts with the autoplay parameter passed to the usePlaylist hook. If the autoplay parameter passed to the usePlaylist hook is true, the audio may automatically play even if autoplay: false is passed to the above function.
 * - addAudio, removeAudio의 autoplay default : `false`
 * - changePlayingAudio, playNextAudio, playPrevAudio의 autoplay default : `true`
 */
const usePlaylist = ({
  playlist: initPlaylist = PLAYLIST_DEFAULT_VALUE.playlist,
  repeatMode = PLAYLIST_DEFAULT_VALUE.repeatMode,
  ...useAudioParams
}: UsePlaylistParams): UsePlaylistReturns => {
  const [playlist, setPlaylist] = useState(initPlaylist);

  const { audioRef, changeCurrentSrc, resetAudio, togglePlayPause, ...useAudioReturns } = useAudio({
    ...useAudioParams,
    loop: repeatMode === 'one',
  });

  const { playingId, changePlayingAudio, ...usePlayingAudioReturns } = usePlayingAudio({
    playlist,
    changeCurrentSrc,
    resetAudio,
    togglePlayPause,
  });

  const hasNextAudio = useMemo(() => {
    const playingAudioIndex = findArrayElementById({
      array: playlist,
      id: playingId,
      returnIndex: true,
    });

    if (playingAudioIndex === undefined) return false;

    return playingAudioIndex < playlist.length - 1;
  }, [playingId, playlist]);

  const hasPrevAudio = useMemo(() => {
    const playingAudioIndex = findArrayElementById({
      array: playlist,
      id: playingId,
      returnIndex: true,
    });

    if (playingAudioIndex === undefined) return false;

    return playingAudioIndex > 0;
  }, [playingId, playlist]);

  usePlaylistEndedEvent({
    audioRef,
    playingId,
    playlist,
    repeatMode,
    changePlayingAudio,
  });

  const addAudio = useCallback(
    (audio: ArrayElementType<Playlist>, autoplay = false): void => {
      setPlaylist(prev => [...prev, audio]);

      if (autoplay) {
        changePlayingAudio(audio.id, autoplay);
      }
    },
    [changePlayingAudio],
  );

  const removeAudio = useCallback(
    (id: ArrayElementType<Playlist>['id'], autoplay = false): void => {
      setPlaylist(prev => prev.filter(audio => audio.id !== id));

      if (playingId !== id) return;

      const removedAudioIndex = findArrayElementById({ array: playlist, id, returnIndex: true });

      if (removedAudioIndex === undefined) return;

      if (!autoplay) {
        changePlayingAudio(playlist[playlist.length > 1 ? removedAudioIndex + 1 : 0].id, autoplay);
        return;
      }

      if (playlist.length > 1) {
        const targetAudio =
          playlist[removedAudioIndex >= playlist.length - 1 ? 0 : removedAudioIndex + 1];

        changePlayingAudio(targetAudio.id, autoplay);
        return;
      }

      changePlayingAudio('');
    },
    [changePlayingAudio, playingId, playlist],
  );

  const changeAudioIndex = useCallback(
    (id: ArrayElementType<Playlist>['id'], index: number): void => {
      const audio = findArrayElementById({ array: playlist, id, returnIndex: false });

      if (index < 0 || index >= playlist.length || audio === undefined) return;

      setPlaylist(prev => {
        const newPlaylist = prev.filter(audio => audio.id !== id);
        return [...newPlaylist.slice(0, index), audio, ...newPlaylist.slice(index)];
      });
    },
    [playlist],
  );

  const clearPlaylist = useCallback((): void => {
    setPlaylist([]);
  }, []);

  return {
    audioRef,
    hasNextAudio,
    hasPrevAudio,
    playingId,
    playlist,
    addAudio,
    changeAudioIndex,
    changeCurrentSrc,
    changePlayingAudio,
    clearPlaylist,
    removeAudio,
    resetAudio,
    togglePlayPause,
    ...useAudioReturns,
    ...usePlayingAudioReturns,
  };
};

export default usePlaylist;
