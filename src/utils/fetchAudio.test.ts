import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';

import fetchAudio from './fetchAudio';

import { FILE_SRC } from '../mocks/constants';

describe('fetchAudio 반환 타입 테스트', () => {
  it('type이 url일 때 string을 반환한다.', async () => {
    const audioUrl = await fetchAudio<string>({
      src: FILE_SRC['30'],
      type: 'url',
    });

    expect(typeof audioUrl).toBe('string');
  });

  it('type이 blob일 때 Blob을 반환한다.', async () => {
    const audioBlob = await fetchAudio<Blob>({
      src: FILE_SRC['30'],
      type: 'blob',
    });

    expect(audioBlob).toBeInstanceOf(Blob);
  });

  it('type이 arrayBuffer일 때 ArrayBuffer를 반환한다.', async () => {
    const audioArrayBuffer = await fetchAudio<Blob>({
      src: FILE_SRC['30'],
      type: 'arrayBuffer',
    });

    expect(audioArrayBuffer).toBeInstanceOf(ArrayBuffer);
  });
});

describe('fetchAudio 청크 다운로드 동작 테스트', () => {
  beforeEach(() => {
    vi.spyOn(global, 'fetch');
  });
  afterEach(() => {
    (fetch as ReturnType<typeof vi.fn>).mockClear();
  });

  it('30MB인 파일에 대해서 1MB 단위로 청크 다운로드를 진행한다.', async () => {
    const audioUrl = await fetchAudio<string>({ src: FILE_SRC['30'] });

    expect(fetch).toBeCalledTimes(30 / 1 + 1);
  });

  it('75MB인 파일에 대해서 5MB 단위로 청크 다운로드를 진행한다.', async () => {
    const audioUrl = await fetchAudio<string>({ src: FILE_SRC['75'] });

    expect(fetch).toBeCalledTimes(75 / 5 + 1);
  });

  it('100MB인 파일에 대해서 10MB 단위로 청크 다운로드를 진행한다.', async () => {
    const audioUrl = await fetchAudio<string>({ src: FILE_SRC['100'] });

    expect(fetch).toBeCalledTimes(100 / 10 + 1);
  });
});
