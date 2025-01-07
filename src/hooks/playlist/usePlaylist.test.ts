import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import usePlaylist from './usePlaylist';

describe('usePlaylist test', () => {
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

  describe('Testing the return value', () => {
    it('"usePlaylist" returns all the values returned by "useAudio".', () => {
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

    it('usePlaylist returns "hasNextAudio, hasPrevAudio, playingId, playlist" state', () => {
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

    it('usePlaylist returns functions "addAudio, clearPlaylist, changePlayingAudio, playNextAudio, playPrevAudio, removeAudio"', () => {
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

  describe('Testing the functionality.', () => {
    it('usePlaylist can determine whether there is a next or previous track, regardless of the repeatMode.', () => {
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

    it('Calling the clearPlaylist function of usePlaylist will reset the playlist.', () => {
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

    it('Calling the addAudio function of usePlaylist will add a track to the playlist.', () => {
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

    it('Calling the removeAudio function of usePlaylist will remove a track from the playlist.', () => {
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

    describe('When the changePlayingAudio function of usePlaylist is called,', () => {
      const initPlaylist = [
        { id: '0', src: 'hi.mp3' },
        { id: '1', src: 'hello.mp3' },
      ];

      it('the audio playback state will toggle (i.e., play if paused, pause if playing).', () => {
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

      it('the currently playing audio will be changed to the new audio.', () => {
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

    it('Calling the playNextAudio function of usePlaylist will play the next track, regardless of the repeatMode.', () => {
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

    it('Calling the playPrevAudio function of usePlaylist will play the previous track, regardless of the repeatMode.', () => {
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
