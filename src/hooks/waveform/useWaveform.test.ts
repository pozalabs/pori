import { renderHook } from '@testing-library/react';
import { OfflineAudioContext } from 'standardized-audio-context-mock';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import 'vitest-canvas-mock';

import useWaveform from './useWaveform';
import { FILE_SRC, MOCK_PEAKS } from '../../mocks/constants';

describe('useWaveform test', () => {
  let offlineAudioContext: typeof window.OfflineAudioContext;

  beforeEach(() => {
    offlineAudioContext = window.OfflineAudioContext;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.OfflineAudioContext = OfflineAudioContext as any;
    window.HTMLMediaElement.prototype.play = vi.fn();
    window.HTMLMediaElement.prototype.pause = vi.fn();
    window.HTMLMediaElement.prototype.load = vi.fn();
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
    window.OfflineAudioContext = offlineAudioContext;
    (window.HTMLMediaElement.prototype.play as ReturnType<typeof vi.fn>).mockClear();
    (window.HTMLMediaElement.prototype.pause as ReturnType<typeof vi.fn>).mockClear();
    (window.HTMLMediaElement.prototype.load as ReturnType<typeof vi.fn>).mockClear();
    (window.OffscreenCanvas as ReturnType<typeof vi.fn>).mockClear();
  });

  describe('Testing the return value.', () => {
    it('When the type is canvas, useWaveform returns a waveform element drawn on a canvas.', () => {
      const { result } = renderHook(() =>
        useWaveform({ type: 'canvas', src: FILE_SRC['30'], peaks: MOCK_PEAKS }),
      );

      expect(result.current.waveform).toBeDefined();
      expect(result.current.waveform instanceof HTMLCanvasElement).toBeTruthy();
    });

    it('When the type is svg, useWaveform returns a waveform element drawn as an SVG.', () => {
      const { result } = renderHook(() =>
        useWaveform({ type: 'svg', src: FILE_SRC['30'], peaks: MOCK_PEAKS }),
      );

      expect(result.current.waveform).toBeDefined();
      expect(result.current.waveform instanceof SVGSVGElement).toBeTruthy();
    });
  });

  describe('UI customization test', () => {
    it('useWaveform allows custom sizing of the waveform drawn on the canvas.', () => {
      const { result } = renderHook(() =>
        useWaveform({
          type: 'canvas',
          src: FILE_SRC['30'],
          peaks: MOCK_PEAKS,
          width: 500,
          height: 200,
        }),
      );
      const canvasElement = result.current.waveform as HTMLCanvasElement;
      const scaleFactor = 4;

      expect(canvasElement).toBeDefined();
      expect(canvasElement.width).toEqual(500 * scaleFactor);
      expect(canvasElement.height).toEqual(200 * scaleFactor);
    });

    it('useWaveform allows custom sizing of the waveform drawn as an SVG.', () => {
      const { result } = renderHook(() =>
        useWaveform({
          type: 'svg',
          src: FILE_SRC['30'],
          peaks: MOCK_PEAKS,
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
