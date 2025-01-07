import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import getAudioFileInformation from './getAudioFileInformation';
import { FILE_SRC } from '../mocks/constants';

describe('Testing the return value of getAudioFileInformation', () => {
  beforeEach(() => {
    vi.spyOn(global, 'fetch');
  });
  afterEach(() => {
    (fetch as ReturnType<typeof vi.fn>).mockClear();
  });

  it('If it is an audio file, it returns the audio MIME type and file size.', async () => {
    const { audioType, audioSize } = await getAudioFileInformation(FILE_SRC['30']);

    expect(audioType.startsWith('audio/')).toBeTruthy();
    expect(typeof audioSize).toBe('number');
  });

  it('If it is not an audio file, it returns an error.', async () => {
    await expect(getAudioFileInformation(FILE_SRC.INVALID_AUDIO_TYPE)).rejects.toThrowError();
  });
});
