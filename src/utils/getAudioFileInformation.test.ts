import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import getAudioFileInformation from './getAudioFileInformation';
import { FILE_SRC } from '../mocks/constants';

describe('getAudioFileInformation 반환 값 테스트', () => {
  beforeEach(() => {
    vi.spyOn(global, 'fetch');
  });
  afterEach(() => {
    (fetch as ReturnType<typeof vi.fn>).mockClear();
  });

  it('오디오 파일일 경우 오디오 MIME 타입과 파일 크기를 반환한다.', async () => {
    const { audioType, audioSize } = await getAudioFileInformation(FILE_SRC['30']);

    expect(audioType.startsWith('audio/')).toBeTruthy();
    expect(typeof audioSize).toBe('number');
  });

  it('오디오 파일이 아닌 경우 에러를 반환한다.', async () => {
    await expect(getAudioFileInformation(FILE_SRC.INVALID_AUDIO_TYPE)).rejects.toThrowError();
  });
});
