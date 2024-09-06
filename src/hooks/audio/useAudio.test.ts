import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import useAudio from './useAudio';

describe('useAudio 테스트', () => {
  describe('반환값 테스트', () => {
    it('useAudio는 audio element 타입의 ref를 반환한다.', () => {
      const {
        result: {
          current: { audioRef },
        },
      } = renderHook(() => useAudio({}));

      expect(audioRef.current instanceof HTMLAudioElement).toBeTruthy();
    });

    it('useAudio는 currentSrc, currentTime, duration, isPlaying, playbackRate, progressTime, volume 상태를 반환한다.', () => {
      const {
        result: {
          current: {
            currentSrc,
            currentTime,
            duration,
            isPlaying,
            playbackRate,
            progressTime,
            volume,
          },
        },
      } = renderHook(() => useAudio({}));

      expect(currentSrc).toBeTypeOf('string');
      expect(currentTime).toBeTypeOf('number');
      expect(duration).toBeTypeOf('number');
      expect(isPlaying).toBeTypeOf('boolean');
      expect(playbackRate).toBeTypeOf('number');
      expect(progressTime).toBeTypeOf('number');
      expect(volume).toBeTypeOf('number');
    });

    it('useAudio는 changeCurrentSrc, changeCurrentTime, changeMuted, changePlaybackRate, changeProgressTime, changeVolume, play, pause, resetAudio, resetAudioTime, shiftTimeBackward, shiftTimeForward, stop, toggleMuted, togglePlayPause 함수를 반환한다.', () => {
      const {
        result: {
          current: {
            changeCurrentSrc,
            changeCurrentTime,
            changeMuted,
            changePlaybackRate,
            changeProgressTime,
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
      expect(changeProgressTime).toBeTypeOf('function');
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

  describe('동작 테스트', () => {
    beforeEach(() => {
      window.HTMLMediaElement.prototype.play = vi.fn(() => Promise.resolve());
      window.HTMLMediaElement.prototype.pause = vi.fn();
    });

    afterEach(() => {
      (window.HTMLMediaElement.prototype.play as ReturnType<typeof vi.fn>).mockClear();
      (window.HTMLMediaElement.prototype.pause as ReturnType<typeof vi.fn>).mockClear();
    });

    it('useAudio에 src 파라미터를 전달하면 그에 대응하는 값으로 currentSrc가 설정된다.', () => {
      const src = 'hi.mp3';

      const { result } = renderHook(() => useAudio({ src }));
      const audio = result.current.audioRef.current;

      act(() => {
        Object.defineProperty(audio, 'currentSrc', {
          value: audio.src,
          writable: false,
        });
        audio.dispatchEvent(new Event('loadedmetadata'));
      });

      expect(result.current.currentSrc).toContain(src);
    });

    it('useAudio에 autoplay 파라미터를 전달하면 그와 동일하게 오디오 엘리먼트의 자동재생 여부가 설정된다.', () => {
      const { result } = renderHook(() => useAudio({ autoplay: true }));

      expect(result.current.audioRef.current.autoplay).toBeTruthy();
    });

    it('useAudio의 changeCurrentSrc 함수를 호출하면 currentSrc가 변경된다.', () => {
      const newSrc = 'hello.mp3';

      const { result } = renderHook(() => useAudio({ src: 'hi.mp3' }));
      const audio = result.current.audioRef.current;

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

    it('useAudio의 changeCurrentTime 함수를 호출하면 currentTime이 변경된다.', () => {
      const newCurrentTime = 12;

      const { result } = renderHook(() => useAudio({ src: 'hi.mp3' }));
      const audio = result.current.audioRef.current;

      act(() => {
        result.current.changeCurrentTime(newCurrentTime);
        audio.dispatchEvent(new Event('seeked'));
      });

      expect(result.current.currentTime).toEqual(newCurrentTime);
    });

    it('useAudio의 changeMuted 함수를 호출하면 볼륨이 변경된다.', () => {
      const { result } = renderHook(() => useAudio({ src: 'hi.mp3' }));
      const audio = result.current.audioRef.current;

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

    it('useAudio의 changePlaybackRate 함수를 호출하면 오디오 재생 속도가 변경된다.', () => {
      const { result } = renderHook(() => useAudio({ src: 'hi.mp3' }));

      const newPlaybackRate = 2;

      act(() => {
        result.current.changePlaybackRate(newPlaybackRate);
        result.current.audioRef.current.dispatchEvent(new Event('ratechange'));
      });

      expect(result.current.playbackRate).toEqual(newPlaybackRate);
    });

    it('useAudio의 changeVolume 함수를 호출하면 볼륨이 변경된다.', () => {
      const maxProgressVolume = 1;
      const newVolume = 0.5;

      const { result } = renderHook(() => useAudio({ src: 'hi.mp3', maxProgressVolume }));

      act(() => {
        result.current.changeVolume(newVolume);
      });

      expect(result.current.volume).toEqual(newVolume);
    });

    it('useAudio의 play 함수를 호출하면 오디오가 재생되며 isPlaying이 true로 변경된다.', () => {
      const { result } = renderHook(() => useAudio({ src: 'hi.mp3' }));

      act(() => {
        result.current.play();
        result.current.audioRef.current.dispatchEvent(new Event('play'));
      });

      expect(window.HTMLMediaElement.prototype.play).toBeCalled();
      expect(result.current.isPlaying).toBeTruthy();
    });

    it('useAudio의 pause 함수를 호출하면 오디오가 일시정지되며 isPlaying이 false로 변경된다.', () => {
      const { result } = renderHook(() => useAudio({ src: 'hi.mp3' }));

      act(() => {
        result.current.play();
        result.current.audioRef.current.dispatchEvent(new Event('play'));
        result.current.pause();
        result.current.audioRef.current.dispatchEvent(new Event('pause'));
      });

      expect(window.HTMLMediaElement.prototype.pause).toBeCalled();
      expect(result.current.isPlaying).toBeFalsy();
    });

    it('useAudio의 resetAudio 함수를 호출하면 오디오의 상태가 모두 초기화된다.', () => {
      const maxProgressVolume = 100;

      const { result } = renderHook(() => useAudio({ src: 'hi.mp3', maxProgressVolume }));

      act(() => {
        result.current.resetAudio();
        result.current.audioRef.current.dispatchEvent(new Event('emptied'));
      });

      expect(result.current.currentSrc).toBe('');
      expect(result.current.currentTime).toEqual(0);
      expect(result.current.duration).toEqual(0);
      expect(result.current.isPlaying).toBeFalsy();
      expect(result.current.progressTime).toEqual(0);
      expect(result.current.volume).toEqual(maxProgressVolume);
      expect(result.current.playbackRate).toEqual(1);
    });

    it('useAudio의 resetAudioTime 함수를 호출하면 currentTime이 0으로 초기화된다.', () => {
      const currentTime = 12;

      const { result } = renderHook(() => useAudio({ src: 'hi.mp3' }));
      const audio = result.current.audioRef.current;

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

    it('useAudio의 stop 함수를 호출하면 음원이 일시정지되며 currentTime이 초기화된다.', () => {
      const { result } = renderHook(() => useAudio({ src: 'hi.mp3' }));
      const audio = result.current.audioRef.current;

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

    it('useAudio의 toggleMuted 함수를 호출하면 음소거 상태에 따라 볼륨이 변경된다.', () => {
      const { result } = renderHook(() => useAudio({ src: 'hi.mp3' }));
      const audio = result.current.audioRef.current;

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

    it('useAudio의 togglePlayPause 함수를 호출하면 현재 재생 여부에 따라 음원이 재생 또는 일시정지된다.', () => {
      const { result } = renderHook(() => useAudio({ src: 'hi.mp3' }));

      act(() => {
        const eventType = result.current.isPlaying ? 'pause' : 'play';

        result.current.togglePlayPause();
        result.current.audioRef.current.dispatchEvent(new Event(eventType));
      });

      expect(result.current.isPlaying).toBeTruthy();

      act(() => {
        const eventType = result.current.isPlaying ? 'pause' : 'play';

        result.current.togglePlayPause();
        result.current.audioRef.current.dispatchEvent(new Event(eventType));
      });

      expect(result.current.isPlaying).toBeFalsy();
    });

    it('useAudio의 togglePlayPause 함수를 호출할 때 파라미터로 src를 전달하면 현재 재생 중인 음원을 바꿀 수 있다.', () => {
      const src = 'hi.mp3';
      const newSrc = 'hello.mp3';

      const { result } = renderHook(() => useAudio({ src }));
      const audio = result.current.audioRef.current;

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
