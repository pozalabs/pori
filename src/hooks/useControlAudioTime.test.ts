import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";

import useAudio from "./useAudio";
import useControlAudioTime from "./useControlAudioTime";

describe('useControlAudioTime 테스트', () => {
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

  it('useControlAudioTime은 currentTime, progress, dragTime 값을 반환한다.', () => {
    const { result: { current: audioRef } } = renderHook(() => useAudio());
    const { result } = renderHook(() => useControlAudioTime({ audioRef, progressMaxValue: 100 }));

    expect(result.current.currentTime).toBeTypeOf('number');
    expect(result.current.progress).toBeTypeOf('number');
    expect(result.current.dragTime).toBeTypeOf('number');
  });

  it('useControlAudioTime은 onProgressChange, changeProgressByValue, setDragModeRef, resetAudioTime 함수를 반환한다.', () => {
    const { result: { current: audioRef } } = renderHook(() => useAudio());
    const { result } = renderHook(() => useControlAudioTime({ audioRef, progressMaxValue: 100 }));

    expect(result.current.onProgressChange).toBeTypeOf('function');
    expect(result.current.changeProgressByValue).toBeTypeOf('function');
    expect(result.current.setDragModeRef).toBeTypeOf('function');
    expect(result.current.resetAudioTime).toBeTypeOf('function');
  });

  it('useControlAudio의 resetAudioTime 함수를 호출하면 currentTime과 progress가 초기화된다.', () => {
    const { result: { current: audioRef } } = renderHook(() => useAudio());
    const { result } = renderHook(() => useControlAudioTime({ audioRef, progressMaxValue: 100 }));

    act(() => {
      result.current.changeProgressByValue(50);
      result.current.resetAudioTime();
    });

    expect(result.current.currentTime).toEqual(0);
    expect(result.current.progress).toEqual(0);
  });
});
