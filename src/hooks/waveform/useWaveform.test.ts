import { renderHook } from '@testing-library/react';
import { AudioContext } from 'standardized-audio-context-mock';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import 'vitest-canvas-mock';

import useWaveform from './useWaveform';
import { FILE_SRC } from '../../mocks/constants';

describe('useWaveform 테스트', () => {
  let windowAudioContext: typeof window.AudioContext;

  beforeEach(() => {
    windowAudioContext = window.AudioContext;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.AudioContext = AudioContext as any;
    window.HTMLMediaElement.prototype.play = vi.fn();
    window.HTMLMediaElement.prototype.pause = vi.fn();
    window.OffscreenCanvas = vi.fn().mockImplementation((width: number, height: number) => {
      return {
        height,
        width,
        oncontextlost: vi.fn(),
        oncontextrestored: vi.fn(),
        getContext: vi.fn(() => undefined),
        convertToBlob: vi.fn(),
        transferToImageBitmap: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      } as unknown as OffscreenCanvas;
    });
  });

  afterEach(() => {
    window.AudioContext = windowAudioContext;
    (window.HTMLMediaElement.prototype.play as ReturnType<typeof vi.fn>).mockClear();
    (window.HTMLMediaElement.prototype.pause as ReturnType<typeof vi.fn>).mockClear();
    (window.OffscreenCanvas as ReturnType<typeof vi.fn>).mockClear();
  });

  describe('반환 값 테스트', () => {
    it('useWaveform은 type이 canvas일 때 canvas로 그려진 waveform 엘리먼트를 반환한다.', () => {
      const { result } = renderHook(() => useWaveform({ type: 'canvas', src: FILE_SRC['30'] }));

      expect(result.current.waveform).toBeDefined();
      expect(result.current.waveform instanceof HTMLCanvasElement).toBeTruthy();
    });

    it('useWaveform은 type이 svg일 때 svg로 그려진 waveform 엘리먼트를 반환한다.', () => {
      const { result } = renderHook(() => useWaveform({ type: 'svg', src: FILE_SRC['30'] }));

      expect(result.current.waveform).toBeDefined();
      expect(result.current.waveform instanceof SVGSVGElement).toBeTruthy();
    });
  });

  describe('UI 커스텀 테스트', () => {
    it('useWaveform은 canvas로 그려진 waveform의 크기를 커스텀할 수 있다.', () => {
      const { result } = renderHook(() =>
        useWaveform({
          type: 'canvas',
          src: FILE_SRC['30'],
          width: 500,
          height: 200,
        }),
      );
      const canvasElement = result.current.waveform as HTMLCanvasElement;

      expect(canvasElement).toBeDefined();
      expect(canvasElement.width).toEqual(500);
      expect(canvasElement.height).toEqual(200);
    });

    it('useWaveform은 svg로 그려진 waveform의 크기를 커스텀할 수 있다.', () => {
      const { result } = renderHook(() =>
        useWaveform({
          type: 'svg',
          src: FILE_SRC['30'],
          width: 500,
          height: 200,
        }),
      );
      const svgElement = result.current.waveform as SVGSVGElement;

      expect(svgElement).toBeDefined();
      expect(svgElement.getAttribute('width')).toEqual('500');
      expect(svgElement.getAttribute('height')).toEqual('200');
    });
  });
});
