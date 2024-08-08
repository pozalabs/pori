import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";

import useAudio from "./useAudio";
import useControlAudio from "./useControlAudio";

describe('useControlAudio 테스트', () => {
  beforeEach(() => {
    window.HTMLMediaElement.prototype.play = vi.fn();
    window.HTMLMediaElement.prototype.pause = vi.fn();
  });

  afterEach(() => {
    (
      window.HTMLMediaElement.prototype.play as ReturnType<typeof vi.fn>
    ).mockClear();
    (
      window.HTMLMediaElement.prototype.pause as ReturnType<typeof vi.fn>
    ).mockClear();
  });

  it('useControlAudio는 isPlaying, duration, currentTime, currentSrc 값을 반환한다.', () => {
    const { result: { current: audioRef } } = renderHook(() => useAudio());
    const { result } = renderHook(() => useControlAudio({ audioRef, src: 'hi.mp3' }));

    expect(result.current.isPlaying).toBeTypeOf('boolean');
    expect(result.current.duration).toBeTypeOf('number');
    expect(result.current.currentTime).toBeTypeOf('number');
    expect(result.current.currentSrc).toBeTypeOf('string');
  });

  it('useControlAudio는 play, pause, togglePlay, changeCurrentSrc, changeCurrentTime 함수를 반환한다.', () => {
    const { result: { current: audioRef } } = renderHook(() => useAudio());
    const { result } = renderHook(() => useControlAudio({ audioRef, src: 'hi.mp3' }));

    expect(result.current.play).toBeTypeOf('function');
    expect(result.current.pause).toBeTypeOf('function');
    expect(result.current.togglePlay).toBeTypeOf('function');
    expect(result.current.changeCurrentSrc).toBeTypeOf('function');
    expect(result.current.changeCurrentTime).toBeTypeOf('function');
  });

  it('useControlAudio의 changeCurrentSrc 함수를 호출하면 currentSrc가 변경된다.', () => {
    const { result: { current: audioRef } } = renderHook(() => useAudio());
    const { result } = renderHook(() => useControlAudio({ audioRef, src: 'hi.mp3' }));

    const newSrc = 'hello.mp3';
    act(() => {
      result.current.changeCurrentSrc(newSrc);
    });

    expect(result.current.currentSrc).toEqual(newSrc);
  });

  it('useControlAudio의 changeCurrentTime 함수를 호출하면 currentTime이 변경된다.', () => {
    const { result: { current: audioRef } } = renderHook(() => useAudio());
    const { result } = renderHook(() => useControlAudio({ audioRef, src: 'hi.mp3' }));

    const newCurrentTime = 1000;
    act(() => {
      result.current.changeCurrentTime(newCurrentTime);
    });

    expect(result.current.currentTime).toEqual(newCurrentTime);
  });
});
