import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import useAudio from './useAudio';

describe('useAudio 테스트', () => {
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

  describe('The testing return value', () => {
    it('useAudio returns a ref of the audio element type.', () => {
      const {
        result: {
          current: { audioRef },
        },
      } = renderHook(() => useAudio({}));

      expect(audioRef.current instanceof HTMLAudioElement).toBeTruthy();
    });

    it('useAudio returns the states of currentSrc, currentTime, duration, isPlaying, playbackRate, progressTime, and volume.', () => {
      const {
        result: {
          current: {
            currentSrc,
            currentTime,
            duration,
            isPlaying,
            playbackRate,
            playbackRange,
            volume,
          },
        },
      } = renderHook(() => useAudio({}));

      expect(currentSrc).toBeTypeOf('string');
      expect(currentTime).toBeTypeOf('number');
      expect(duration).toBeTypeOf('number');
      expect(isPlaying).toBeTypeOf('boolean');
      expect(playbackRate).toBeTypeOf('number');
      expect(playbackRange).toBeTypeOf('number');
      expect(volume).toBeTypeOf('number');
    });

    it('useAudio returns the functions changeCurrentSrc, changeCurrentTime, changeMuted, changePlaybackRate, changePlaybackRange, changeVolume, play, pause, resetAudio, resetAudioTime, shiftTimeBackward, shiftTimeForward, stop, toggleMuted, and togglePlayPause.', () => {
      const {
        result: {
          current: {
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
      } = renderHook(() => useAudio({}));

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
  });

  describe('Testing the functionality.', () => {
    it("When the autoplay parameter is passed to useAudio, the audio element's autoplay behavior is set accordingly.", () => {
      const { result } = renderHook(() => useAudio({ autoplay: true }));

      expect(result.current.audioRef.current!.autoplay).toBeTruthy();
    });

    it('Calling the changeCurrentSrc function of useAudio will change the currentSrc.', () => {
      const newSrc = 'hello.mp3';

      const { result } = renderHook(() => useAudio({ src: 'hi.mp3' }));
      const audio = result.current.audioRef.current!;

      act(() => {
        result.current.changeCurrentSrc(newSrc);
        Object.defineProperty(audio, 'currentSrc', {
          value: audio.src,
          writable: false,
        });
        audio.dispatchEvent(new Event('loadedmetadata'));
      });

      expect(result.current.currentSrc).toContain(newSrc);
    });

    it('Calling the changeCurrentTime function of useAudio will change the currentTime.', () => {
      const newCurrentTime = 12;

      const { result } = renderHook(() => useAudio({ src: 'hi.mp3' }));
      const audio = result.current.audioRef.current!;

      act(() => {
        result.current.changeCurrentTime(newCurrentTime);
        audio.dispatchEvent(new Event('seeked'));
      });

      expect(result.current.currentTime).toEqual(newCurrentTime);
    });

    it('Calling the changeMuted function of useAudio will change the volume by muting or unmuting the audio.', () => {
      const { result } = renderHook(() => useAudio({ src: 'hi.mp3' }));
      const audio = result.current.audioRef.current!;

      const prevVolume = result.current.volume;

      act(() => {
        result.current.changeMuted(true);
        audio.dispatchEvent(new Event('volumeupdate'));
      });

      expect(result.current.volume).toEqual(0);

      act(() => {
        result.current.changeMuted(false);
        audio.dispatchEvent(new Event('volumeupdate'));
      });

      expect(result.current.volume).toEqual(prevVolume);
    });

    it('Calling the changePlaybackRate function of useAudio will change the audio playback speed.', () => {
      const { result } = renderHook(() => useAudio({ src: 'hi.mp3' }));

      const newPlaybackRate = 2;

      act(() => {
        result.current.changePlaybackRate(newPlaybackRate);
        result.current.audioRef.current!.dispatchEvent(new Event('ratechange'));
      });

      expect(result.current.playbackRate).toEqual(newPlaybackRate);
    });

    it('Calling the changeVolume function of useAudio will change the volume.', () => {
      const maxVolume = 1;
      const newVolume = 0.5;

      const { result } = renderHook(() => useAudio({ src: 'hi.mp3', maxVolume }));

      act(() => {
        result.current.changeVolume(newVolume);
      });

      expect(result.current.volume).toEqual(newVolume);
    });

    it('Calling the play function of useAudio will start the audio playback and set isPlaying to true.', () => {
      const { result } = renderHook(() => useAudio({ src: 'hi.mp3' }));

      act(() => {
        result.current.play();
        result.current.audioRef.current!.dispatchEvent(new Event('play'));
      });

      expect(window.HTMLMediaElement.prototype.play).toBeCalled();
      expect(result.current.isPlaying).toBeTruthy();
    });

    it('Calling the pause function of useAudio will pause the audio playback and set isPlaying to false.', () => {
      const { result } = renderHook(() => useAudio({ src: 'hi.mp3' }));

      act(() => {
        result.current.play();
        result.current.audioRef.current!.dispatchEvent(new Event('play'));
        result.current.pause();
        result.current.audioRef.current!.dispatchEvent(new Event('pause'));
      });

      expect(window.HTMLMediaElement.prototype.pause).toBeCalled();
      expect(result.current.isPlaying).toBeFalsy();
    });

    it('Calling the resetAudio function of useAudio will reset all the audio states to their initial values.', () => {
      const maxVolume = 100;

      const { result } = renderHook(() => useAudio({ src: 'hi.mp3', maxVolume }));

      act(() => {
        result.current.resetAudio();
        result.current.audioRef.current!.dispatchEvent(new Event('emptied'));
      });

      expect(result.current.currentSrc).toBe('');
      expect(result.current.currentTime).toEqual(0);
      expect(result.current.duration).toEqual(0);
      expect(result.current.isPlaying).toBeFalsy();
      expect(result.current.playbackRange).toEqual(0);
      expect(result.current.volume).toEqual(maxVolume);
      expect(result.current.playbackRate).toEqual(1);
    });

    it('Calling the resetAudioTime function of useAudio will reset the currentTime to 0.', () => {
      const currentTime = 12;

      const { result } = renderHook(() => useAudio({ src: 'hi.mp3' }));
      const audio = result.current.audioRef.current!;

      act(() => {
        result.current.changeCurrentTime(currentTime);
        audio.dispatchEvent(new Event('seeked'));
      });

      expect(result.current.currentTime).toEqual(currentTime);

      act(() => {
        result.current.resetAudioTime();
        audio.dispatchEvent(new Event('seeked'));
      });

      expect(result.current.currentTime).toEqual(0);
    });

    it('Calling the stop function of useAudio will pause the audio playback and reset the currentTime to 0.', () => {
      const { result } = renderHook(() => useAudio({ src: 'hi.mp3' }));
      const audio = result.current.audioRef.current!;

      act(() => {
        result.current.play();
        result.current.changeCurrentTime(100);
        audio.dispatchEvent(new Event('play'));
        audio.dispatchEvent(new Event('seeked'));
      });

      expect(result.current.isPlaying).toBeTruthy();
      expect(result.current.currentTime).toBeGreaterThan(0);

      act(() => {
        result.current.stop();
        audio.dispatchEvent(new Event('pause'));
        audio.dispatchEvent(new Event('seeked'));
      });

      expect(result.current.isPlaying).toBeFalsy();
      expect(result.current.currentTime).toEqual(0);
    });

    it('Calling the toggleMuted function of useAudio will toggle the mute state, changing the volume based on whether the audio is muted or not.', () => {
      const { result } = renderHook(() => useAudio({ src: 'hi.mp3' }));
      const audio = result.current.audioRef.current!;

      const prevVolume = result.current.volume;

      act(() => {
        result.current.toggleMuted();
        audio.dispatchEvent(new Event('volumeupdate'));
      });

      expect(result.current.volume).toEqual(0);

      act(() => {
        result.current.toggleMuted();
        audio.dispatchEvent(new Event('volumeupdate'));
      });

      expect(result.current.volume).toEqual(prevVolume);
    });

    it('Calling the togglePlayPause function of useAudio will toggle the audio playback based on its current state, either playing or pausing the audio.', () => {
      const { result } = renderHook(() => useAudio({ src: 'hi.mp3' }));

      act(() => {
        const eventType = result.current.isPlaying ? 'pause' : 'play';

        result.current.togglePlayPause();
        result.current.audioRef.current!.dispatchEvent(new Event(eventType));
      });

      expect(result.current.isPlaying).toBeTruthy();

      act(() => {
        const eventType = result.current.isPlaying ? 'pause' : 'play';

        result.current.togglePlayPause();
        result.current.audioRef.current!.dispatchEvent(new Event(eventType));
      });

      expect(result.current.isPlaying).toBeFalsy();
    });

    it('When the togglePlayPause function of useAudio is called with the src parameter, it will change the currently playing audio to the new src.', () => {
      const src = 'hi.mp3';
      const newSrc = 'hello.mp3';

      const { result } = renderHook(() => useAudio({ src }));
      const audio = result.current.audioRef.current!;

      act(() => {
        result.current.togglePlayPause(newSrc);
        Object.defineProperty(audio, 'currentSrc', {
          value: audio.src,
          writable: false,
        });
        audio.dispatchEvent(new Event('loadedmetadata'));
      });

      expect(result.current.currentSrc).toContain(newSrc);
    });
  });
});
