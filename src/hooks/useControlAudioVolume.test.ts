import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import useAudio from './useAudio';
import useControlAudio from './useControlAudio';
import useControlAudioVolume from './useControlAudioVolume';

describe('useControlAudioVolume 테스트', () => {
  beforeEach(() => {
    window.HTMLMediaElement.prototype.play = vi.fn();
    window.HTMLMediaElement.prototype.pause = vi.fn();
  });

  afterEach(() => {
    (window.HTMLMediaElement.prototype.play as ReturnType<typeof vi.fn>).mockClear();
    (window.HTMLMediaElement.prototype.pause as ReturnType<typeof vi.fn>).mockClear();
  });

  it('useControlAudioVolume은 currentVolume 값을 반환한다.', () => {
    const {
      result: { current: audioRef },
    } = renderHook(() => useAudio());
    const { result } = renderHook(() => useControlAudioVolume({ audioRef, progressMaxValue: 100 }));

    expect(result.current.currentVolume).toBeTypeOf('number');
  });

  it('useControlAudioVolume은 onVolumeChange, toggleMute 함수를 반환한다.', () => {
    const {
      result: { current: audioRef },
    } = renderHook(() => useAudio());
    const { result } = renderHook(() => useControlAudioVolume({ audioRef, progressMaxValue: 100 }));

    expect(result.current.onVolumeChange).toBeTypeOf('function');
    expect(result.current.toggleMute).toBeTypeOf('function');
  });

  it('currentVolume이 0보다 클 때, toggleMute 함수를 호출하면 currentVolume이 초기화된다.', () => {
    const {
      result: { current: audioRef },
    } = renderHook(() => useAudio());
    renderHook(() => useControlAudio({ audioRef, src: 'hi.mp3' }));
    const { result } = renderHook(() => useControlAudioVolume({ audioRef, progressMaxValue: 100 }));

    expect(result.current.currentVolume).toBeGreaterThan(0);
    act(() => {
      result.current.toggleMute();
    });

    expect(result.current.currentVolume).toEqual(0);
  });
});
