import { render } from '@testing-library/react';
import { OfflineAudioContext } from 'standardized-audio-context-mock';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import 'vitest-canvas-mock';

import { FILE_SRC, MOCK_PEAKS } from '../../mocks/constants';

import Waveform from '.';

describe('Waveform 컴포넌트 렌더링 테스트', () => {
  let offlineAudioContext: typeof window.OfflineAudioContext;

  beforeEach(() => {
    offlineAudioContext = window.OfflineAudioContext;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.OfflineAudioContext = OfflineAudioContext as any;
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
    (window.HTMLMediaElement.prototype.pause as ReturnType<typeof vi.fn>).mockClear();
    (window.HTMLMediaElement.prototype.load as ReturnType<typeof vi.fn>).mockClear();
    (window.OffscreenCanvas as ReturnType<typeof vi.fn>).mockClear();
  });

  it('Waveform 컴포넌트는 type이 canvas일 때 canvas로 그려진 waveform을 렌더링한다.', async () => {
    const { container } = render(
      <Waveform type="canvas" src={FILE_SRC['30']} peaks={MOCK_PEAKS} />,
    );

    const waveformElement = container.querySelector('canvas');

    expect(waveformElement).toBeDefined();
    expect(waveformElement instanceof HTMLCanvasElement).toBeTruthy();
  });

  it('Waveform 컴포넌트는 type이 svg일 때 svg로 그려진 waveform을 렌더링한다.', async () => {
    const { container } = render(<Waveform type="svg" src={FILE_SRC['30']} peaks={MOCK_PEAKS} />);

    const waveformElement = container.querySelector('svg');

    expect(waveformElement).toBeDefined();
    expect(waveformElement instanceof SVGSVGElement).toBeTruthy();
  });
});
