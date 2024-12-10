import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';

import fetchAudio from './fetchAudio';
import { FILE_SRC } from '../mocks/constants';

describe('Testing the chunk download functionality of fetchAudio.', () => {
  beforeEach(() => {
    vi.spyOn(global, 'fetch');
  });
  afterEach(() => {
    (fetch as ReturnType<typeof vi.fn>).mockClear();
  });

  it('For a 30MB file, chunk downloads are performed in 1MB increments.', async () => {
    await fetchAudio({ src: FILE_SRC['30'], retry: 1 });

    expect(fetch).toBeCalledTimes(30 / 1 + 1);
  });

  it('For a 75MB file, chunk downloads are performed in 5MB increments.', async () => {
    await fetchAudio({ src: FILE_SRC['75'], retry: 1 });

    expect(fetch).toBeCalledTimes(75 / 5 + 1);
  });

  it('For a 100MB file, chunk downloads are performed in 10MB increments.', async () => {
    await fetchAudio({ src: FILE_SRC['100'], retry: 1 });

    expect(fetch).toBeCalledTimes(100 / 10 + 1);
  });
});
