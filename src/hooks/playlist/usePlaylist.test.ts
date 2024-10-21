import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import usePlaylist from './usePlaylist';

describe('usePlaylist 테스트', () => {
  beforeEach(() => {
    window.HTMLMediaElement.prototype.play = vi.fn(() => Promise.resolve());
    window.HTMLMediaElement.prototype.pause = vi.fn();
    window.HTMLMediaElement.prototype.load = vi.fn();
  });

  afterEach(() => {
    (window.HTMLMediaElement.prototype.play as ReturnType<typeof vi.fn>).mockClear();
    (window.HTMLMediaElement.prototype.pause as ReturnType<typeof vi.fn>).mockClear();
    (window.HTMLMediaElement.prototype.load as ReturnType<typeof vi.fn>).mockClear();
  });

  describe('반환값 테스트', () => {
    it('usePlaylist는 useAudio의 반환값을 모두 반환한다.', () => {
      const {
        result: {
          current: {
            audioRef,
            currentSrc,
            currentTime,
            duration,
            isPlaying,
            playbackRate,
            playbackRange,
            volume,
            changeCurrentSrc,
            changeCurrentTime,
            changeMuted,
            changePlaybackRate,
            changePlaybackRange,
            changeVolume,
            play,
            pause,
            resetAudio,
            resetAudioTime,
            shiftTimeBackward,
            shiftTimeForward,
            stop,
            toggleMuted,
            togglePlayPause,
          },
        },
      } = renderHook(() => usePlaylist({}));

      expect(audioRef.current instanceof HTMLAudioElement).toBeTruthy();
      expect(currentSrc).toBeTypeOf('string');
      expect(currentTime).toBeTypeOf('number');
      expect(duration).toBeTypeOf('number');
      expect(isPlaying).toBeTypeOf('boolean');
      expect(playbackRate).toBeTypeOf('number');
      expect(playbackRange).toBeTypeOf('number');
      expect(volume).toBeTypeOf('number');
      expect(changeCurrentSrc).toBeTypeOf('function');
      expect(changeCurrentTime).toBeTypeOf('function');
      expect(changeMuted).toBeTypeOf('function');
      expect(changePlaybackRate).toBeTypeOf('function');
      expect(changePlaybackRange).toBeTypeOf('function');
      expect(changeVolume).toBeTypeOf('function');
      expect(play).toBeTypeOf('function');
      expect(pause).toBeTypeOf('function');
      expect(resetAudio).toBeTypeOf('function');
      expect(resetAudioTime).toBeTypeOf('function');
      expect(shiftTimeBackward).toBeTypeOf('function');
      expect(shiftTimeForward).toBeTypeOf('function');
      expect(stop).toBeTypeOf('function');
      expect(toggleMuted).toBeTypeOf('function');
      expect(togglePlayPause).toBeTypeOf('function');
    });

    it('usePlaylist는 hasNextAudio, hasPrevAudio, playingId, playlist 상태를 반환한다.', () => {
      const {
        result: {
          current: { hasNextAudio, hasPrevAudio, playingId, playlist },
        },
      } = renderHook(() =>
        usePlaylist({
          playlist: [{ id: '0', src: 'hi.mp3' }],
        }),
      );

      expect(hasNextAudio).toBeTypeOf('boolean');
      expect(hasPrevAudio).toBeTypeOf('boolean');
      expect(playingId).toBeTypeOf('string');
      expect(playlist).toHaveLength(1);
    });

    it('usePlaylist는 addAudio, clearPlaylist, changePlayingAudio, playNextAudio, playPrevAudio, removeAudio 함수를 반환한다.', () => {
      const {
        result: {
          current: {
            addAudio,
            clearPlaylist,
            changePlayingAudio,
            playNextAudio,
            playPrevAudio,
            removeAudio,
          },
        },
      } = renderHook(() => usePlaylist({}));

      expect(addAudio).toBeTypeOf('function');
      expect(clearPlaylist).toBeTypeOf('function');
      expect(changePlayingAudio).toBeTypeOf('function');
      expect(playNextAudio).toBeTypeOf('function');
      expect(playPrevAudio).toBeTypeOf('function');
      expect(removeAudio).toBeTypeOf('function');
    });
  });

  describe('동작 테스트', () => {
    it('usePlaylist는 repeatMode와 관계 없이 현재 재생 중인 곡의 다음 또는 이전 곡이 있는지 여부를 알 수 있다.', () => {
      const {
        result: {
          current: { hasNextAudio, hasPrevAudio, playingId },
        },
      } = renderHook(() =>
        usePlaylist({
          playlist: [
            { id: '0', src: 'hi.mp3' },
            { id: '1', src: 'hello.mp3' },
          ],
          repeatMode: 'all',
        }),
      );

      expect(playingId).toBe('0');
      expect(hasNextAudio).toBeTruthy();
      expect(hasPrevAudio).toBeFalsy();
    });

    it('usePlaylist의 clearPlaylist 함수를 호출하면 플레이리스트가 초기화된다.', () => {
      const initPlaylist = [
        { id: '0', src: 'hi.mp3' },
        { id: '1', src: 'hello.mp3' },
      ];

      const { result } = renderHook(() =>
        usePlaylist({
          playlist: initPlaylist,
        }),
      );

      expect(result.current.playlist).toHaveLength(initPlaylist.length);

      act(() => {
        result.current.clearPlaylist();
      });

      expect(result.current.playlist).toHaveLength(0);
    });

    it('usePlaylist의 addAudio 함수를 호출하면 플레이리스트에 곡이 추가된다.', () => {
      const initPlaylist = [{ id: '0', src: 'hi.mp3' }];
      const newAudio = { id: '1', src: 'hello.mp3' };

      const { result } = renderHook(() =>
        usePlaylist({
          playlist: initPlaylist,
        }),
      );

      expect(result.current.playlist).toHaveLength(initPlaylist.length);

      act(() => {
        result.current.addAudio(newAudio);
      });

      expect(result.current.playlist).toHaveLength(initPlaylist.length + 1);
    });

    it('usePlaylist의 removeAudio 함수를 호출하면 플레이리스트에서 곡이 제거된다.', () => {
      const initPlaylist = [{ id: '0', src: 'hi.mp3' }];
      const removedAudioId = '0';

      const { result } = renderHook(() =>
        usePlaylist({
          playlist: initPlaylist,
        }),
      );

      expect(result.current.playlist).toHaveLength(initPlaylist.length);

      act(() => {
        result.current.removeAudio(removedAudioId);
      });

      expect(result.current.playlist).toHaveLength(initPlaylist.length - 1);
    });

    describe('usePlaylist의 changePlayingAudio 함수를 호출했을 때', () => {
      const initPlaylist = [
        { id: '0', src: 'hi.mp3' },
        { id: '1', src: 'hello.mp3' },
      ];

      it('현재 재생 중인 오디오를 전달하면 오디오 재생 상태가 토글된다.', () => {
        const { result } = renderHook(() =>
          usePlaylist({
            playlist: initPlaylist,
          }),
        );

        expect(result.current.playingId).toBe(initPlaylist[0].id);
        expect(result.current.isPlaying).toBeFalsy();

        act(() => {
          result.current.changePlayingAudio(initPlaylist[0].id);
          result.current.audioRef.current!.dispatchEvent(new Event('play'));
        });

        expect(window.HTMLMediaElement.prototype.play).toBeCalled();
        expect(result.current.playingId).toBe(initPlaylist[0].id);
        expect(result.current.isPlaying).toBeTruthy();
      });

      it('현재 재생 중이지 않은 오디오를 전달하면 재생 중인 오디오가 변경된다.', () => {
        const { result } = renderHook(() =>
          usePlaylist({
            playlist: initPlaylist,
          }),
        );

        expect(result.current.playingId).toBe(initPlaylist[0].id);

        act(() => {
          result.current.changePlayingAudio(initPlaylist[1].id);
        });

        expect(result.current.playingId).toBe(initPlaylist[1].id);
      });
    });

    it('usePlaylist의 playNextAudio 함수를 호출하면 repeatMode와 관계 없이 다음 곡이 재생된다.', () => {
      const initPlaylist = [
        { id: '0', src: 'hi.mp3' },
        { id: '1', src: 'hello.mp3' },
      ];

      const { result } = renderHook(() =>
        usePlaylist({
          playlist: initPlaylist,
        }),
      );

      expect(result.current.playingId).toBe(initPlaylist[0].id);

      act(() => {
        result.current.playNextAudio();
      });

      expect(result.current.playingId).toBe(initPlaylist[1].id);
    });

    it('usePlaylist의 playPrevAudio 함수를 호출하면 repeatMode와 관계 없이 이전 곡이 재생된다.', () => {
      const initPlaylist = [
        { id: '0', src: 'hi.mp3' },
        { id: '1', src: 'hello.mp3' },
      ];

      const { result } = renderHook(() =>
        usePlaylist({
          playlist: initPlaylist,
        }),
      );

      expect(result.current.playingId).toBe(initPlaylist[0].id);

      act(() => {
        result.current.playPrevAudio();
      });

      expect(result.current.playingId).toBe(initPlaylist[1].id);
    });
  });
});
