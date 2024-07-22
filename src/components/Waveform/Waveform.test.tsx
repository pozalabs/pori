import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { AudioContext } from 'standardized-audio-context-mock';

import { FILE_SRC } from '../../mocks/constants';
import Waveform from './Waveform';

describe('Waveform 렌더링 테스트', () => {
  let windowAudioContext: typeof window.AudioContext;

  beforeEach(() => {
    windowAudioContext = window.AudioContext;
    window.AudioContext = AudioContext as any;
    HTMLCanvasElement.prototype.getContext = vi.fn();
  });

  afterEach(() => {
    window.AudioContext = windowAudioContext;
    (HTMLCanvasElement.prototype.getContext as ReturnType<typeof vi.fn>).mockClear();
    cleanup();
  });

  it('Waveform은 type prop이 canvas일 때 canvas element를 그린다.', () => {
    const { container } = render(<Waveform src={FILE_SRC['30']} type="canvas" />);

    expect(container.querySelector('canvas')).toBeTruthy();
  });

  it('Waveform은 type prop이 svg일 때 svg element를 그린다.', () => {
    const { container } = render(<Waveform src={FILE_SRC['30']} type="svg" />);

    expect(container.querySelector('svg')).toBeTruthy();
  });
});
