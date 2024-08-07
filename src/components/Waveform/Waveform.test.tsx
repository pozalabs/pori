import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { AudioContext } from 'standardized-audio-context-mock';
import 'vitest-canvas-mock';

import { FILE_SRC } from '../../mocks/constants';
import Waveform from './Waveform';

const getSVGElement = (imageElement: HTMLImageElement): HTMLElement => {
  const parser = new DOMParser();
  const document = parser.parseFromString(
    decodeURIComponent(imageElement.src.split(',')[1]),
    'image/svg+xml',
  );
  const svgElement = document.documentElement;

  return svgElement;
};

describe('Waveform 컴포넌트 렌더링 테스트', () => {
  let windowAudioContext: typeof window.AudioContext;

  beforeEach(() => {
    windowAudioContext = window.AudioContext;
    window.AudioContext = AudioContext as any;
    window.HTMLMediaElement.prototype.pause = vi.fn();
    window.OffscreenCanvas = vi
      .fn()
      .mockImplementation((width: number, height: number) => {
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
    (
      window.HTMLMediaElement.prototype.pause as ReturnType<typeof vi.fn>
    ).mockClear();
    (window.OffscreenCanvas as ReturnType<typeof vi.fn>).mockClear();
  });

  it('Waveform 컴포넌트는 type이 canvas일 때 canvas로 그려진 waveform을 렌더링한다.', async () => {
    const { container } = render(
      <Waveform type="canvas" src={FILE_SRC['30']} />,
    );

    const waveformElement = container.querySelector('canvas');

    expect(waveformElement).toBeDefined();
    expect(waveformElement instanceof HTMLCanvasElement).toBeTruthy();
  });

  it('Waveform 컴포넌트는 type이 svg일 때 svg로 그려진 waveform을 렌더링한다.', async () => {
    const { container } = render(<Waveform type="svg" src={FILE_SRC['30']} />);

    const waveformElement = container.querySelector('img');
    const svgElement = getSVGElement(waveformElement as HTMLImageElement);

    expect(svgElement).toBeDefined();
    expect(svgElement instanceof SVGSVGElement).toBeTruthy();
  });
});
