import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import useAudio from './useAudio';

describe('useAudio 테스트', () => {
  beforeEach(() => {
    window.HTMLMediaElement.prototype.play = vi.fn();
    window.HTMLMediaElement.prototype.pause = vi.fn();
  });

  afterEach(() => {
    (window.HTMLMediaElement.prototype.play as ReturnType<typeof vi.fn>).mockClear();
    (window.HTMLMediaElement.prototype.pause as ReturnType<typeof vi.fn>).mockClear();
  });

  it('useAudio는 audio element 또는 null 타입의 ref를 반환한다.', () => {
    const {
      result: { current: audioRef },
    } = renderHook(() => useAudio());

    expect(audioRef.current instanceof HTMLAudioElement).toBeTruthy();
  });
});
