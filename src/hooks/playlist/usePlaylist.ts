import { useCallback, useState } from 'react';

import type { ArrayElementType } from '@pozalabs/pokit/types';

import { PLAYLIST_DEFAULT_VALUE } from './_constants';
import type { Playlist, RepeatModeType } from './_types';
import findArrayElementById from './_utils/findArrayElementById';
import usePlayingAudio from './usePlayingAudio';
import usePlaylistEndedEvent from './usePlaylistEndedEvent';
import useAudio from '../audio/useAudio';

interface UsePlaylistParams extends Omit<Parameters<typeof useAudio>[0], 'src' | 'loop'> {
  playlist?: Playlist;
  repeatMode?: RepeatModeType;
}

interface UsePlaylistReturns
  extends ReturnType<typeof useAudio>,
    ReturnType<typeof usePlayingAudio> {
  playlist: Playlist;
  addAudio: (audio: ArrayElementType<Playlist>, autoplay?: boolean) => void;
  removeAudio: (id: ArrayElementType<Playlist>['id'], autoplay?: boolean) => void;
  clearPlaylist: () => void;
}

/**
 * 플레이리스트를 관리할 수 있는 훅입니다. useAudio 훅에서 플레이리스트 개념을 확장하고 있습니다.
 * @param UsePlaylistParams
 * ```
 * interface UsePlaylistParams extends Omit<Parameters<typeof useAudio>[0], 'src' | 'loop'> {
 *    playlist?: Playlist;
 *    repeatMode?: RepeatModeType;
 * }
 * ```
 * - playlist : 초기 플레이리스트 배열 (default : [])
 * - repeatMode : 반복 모드 (none | one | all) (default : none)
 * @returns
 * `UsePlaylistReturns`
 * ```
 * interface UsePlaylistReturns extends ReturnType<typeof useAudio> {
 *    playingId: ArrayElementType<Playlist>['id'];
 *    playlist: Playlist;
 *    addAudio: (audio: ArrayElementType<Playlist>, autoplay?: boolean) => void;
 *    clearPlaylist: () => void;
 *    changePlayingAudio: (id: ArrayElementType<Playlist>['id'], autoplay?: boolean) => void;
 *    playNextAudio: (autoplay?: boolean) => void;
 *    playPrevAudio: (autoplay?: boolean) => void;
 *    removeAudio: (id: ArrayElementType<Playlist>['id'], autoplay?: boolean) => void;
 * }
 * ```
 * - addAudio, removeAudio, changePlayingAudio, playNextAudio, playPrevAudio는 자동 재생 여부를 옵셔널로 입력 받습니다.
 *   - 단, 이 값은 usePlaylist 훅에 전달하는 autoplay 파라미터와 충돌되는 값으로, 만약 usePlaylist 훅에 전달한 autoplay가 true라면 위 함수에 autoplay 값으로 false를 전달해도 오디오가 자동으로 재생될 수 있습니다.
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

  const clearPlaylist = useCallback((): void => {
    setPlaylist([]);
  }, []);

  return {
    audioRef,
    playingId,
    playlist,
    addAudio,
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
