import type { ForwardedRef, ReactNode } from 'react';
import {
  createContext,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';

import type { WithArray } from '@pozalabs/pokit/types';

import { AUDIO_PLAYER_CONTEXT_DEFAULT_VALUE } from './_constants';
import type { AudioPlayerHandles } from './_types';
import type { RepeatModeType } from '../../hooks';
import { usePlaylist } from '../../hooks';
import findArrayElementById from '../../hooks/playlist/_utils/findArrayElementById';

export const AudioPlayerContext = createContext(AUDIO_PLAYER_CONTEXT_DEFAULT_VALUE);

export interface AudioPlayerProviderProps extends Omit<Parameters<typeof usePlaylist>[0], ''> {
  children?: WithArray<ReactNode>;
}

const AudioPlayerProvider = forwardRef(
  (
    { children, ...usePlaylistParams }: AudioPlayerProviderProps,
    ref: ForwardedRef<AudioPlayerHandles>,
  ) => {
    const [repeatMode, setRepeatMode] = useState<RepeatModeType>(
      usePlaylistParams.repeatMode ?? AUDIO_PLAYER_CONTEXT_DEFAULT_VALUE.repeatMode,
    );

    const {
      audioRef,
      currentSrc,
      currentTime,
      duration,
      isPlaying,
      playbackRate,
      playlist,
      playingId,
      volume,
      addAudio,
      changeAudioIndex,
      changeCurrentSrc,
      changeCurrentTime,
      changeMuted,
      changePlaybackRate,
      changePlaybackRange,
      changePlayingAudio,
      changeVolume,
      clearPlaylist,
      play,
      pause,
      playNextAudio,
      playPrevAudio,
      removeAudio,
      resetAudio,
      resetAudioTime,
      shiftTimeBackward,
      shiftTimeForward,
      stop,
      toggleMuted,
      togglePlayPause,
    } = usePlaylist({ ...usePlaylistParams, repeatMode });

    const changeRepeatMode = useCallback((repeatMode: RepeatModeType): void => {
      setRepeatMode(repeatMode);
    }, []);

    useEffect(() => {
      const audio = audioRef.current;

      if (!audio) return;

      const onAudioEnded = (): void => {
        const playingAudioIndex = findArrayElementById({
          array: playlist,
          id: playingId,
          returnIndex: true,
        });

        if (playingAudioIndex === undefined) return;

        if (playingAudioIndex >= playlist.length - 1 && repeatMode === 'none') {
          playNextAudio(false);
        }
      };

      audio.addEventListener('ended', onAudioEnded);

      return () => {
        audio.removeEventListener('ended', onAudioEnded);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [audioRef, playNextAudio, playingId, repeatMode]);

    useImperativeHandle(
      ref,
      () => ({
        addAudio,
        changeAudioIndex,
        changeCurrentTime,
        changeMuted,
        changePlaybackRate,
        changePlaybackRange,
        changePlayingAudio,
        changeVolume,
        clearPlaylist,
        play,
        pause,
        playNextAudio,
        playPrevAudio,
        removeAudio,
        resetAudio,
        resetAudioTime,
        shiftTimeBackward,
        shiftTimeForward,
        stop,
        toggleMuted,
        togglePlayPause,
      }),
      [
        addAudio,
        changeAudioIndex,
        changeCurrentTime,
        changeMuted,
        changePlaybackRange,
        changePlaybackRate,
        changePlayingAudio,
        changeVolume,
        clearPlaylist,
        pause,
        play,
        playNextAudio,
        playPrevAudio,
        removeAudio,
        resetAudio,
        resetAudioTime,
        shiftTimeBackward,
        shiftTimeForward,
        stop,
        toggleMuted,
        togglePlayPause,
      ],
    );

    return (
      <AudioPlayerContext.Provider
        value={{
          currentSrc,
          currentTime,
          duration,
          isPlaying,
          playbackRate,
          playlist,
          playingId,
          repeatMode,
          volume,
          changeCurrentSrc,
          changeCurrentTime,
          changePlaybackRate,
          changePlayingAudio,
          changeRepeatMode,
          changeVolume,
          play,
          pause,
          playNextAudio,
          playPrevAudio,
          shiftTimeBackward,
          shiftTimeForward,
          stop,
          toggleMuted,
          togglePlayPause,
        }}
      >
        {children}
      </AudioPlayerContext.Provider>
    );
  },
);

AudioPlayerProvider.displayName = 'AudioPlayerProvider';

export default AudioPlayerProvider;
