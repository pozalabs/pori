import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';

import fetchAudio from './fetchAudio';
import { FILE_SRC } from '../mocks/constants';

describe('fetchAudio 청크 다운로드 동작 테스트', () => {
  beforeEach(() => {
    vi.spyOn(global, 'fetch');
  });
  afterEach(() => {
    (fetch as ReturnType<typeof vi.fn>).mockClear();
  });

  it('30MB인 파일에 대해서 1MB 단위로 청크 다운로드를 진행한다.', async () => {
    await fetchAudio({ src: FILE_SRC['30'], retry: 1 });

    expect(fetch).toBeCalledTimes(30 / 1 + 1);
  });

  it('75MB인 파일에 대해서 5MB 단위로 청크 다운로드를 진행한다.', async () => {
    await fetchAudio({ src: FILE_SRC['75'], retry: 1 });

    expect(fetch).toBeCalledTimes(75 / 5 + 1);
  });

  it('100MB인 파일에 대해서 10MB 단위로 청크 다운로드를 진행한다.', async () => {
    await fetchAudio({ src: FILE_SRC['100'], retry: 1 });

    expect(fetch).toBeCalledTimes(100 / 10 + 1);
  });
});
