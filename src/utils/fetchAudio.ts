import { FETCH_CONCURRENT_LIMIT_DEFAULT, FETCH_RETRY_DEFAULT } from './_constants';
import getAudioFileInformation from './getAudioFileInformation';

const getChunkSize = (fileSize: number): number => {
  if (fileSize >= 100 * 1024 * 1024) {
    return 10 * 1024 * 1024;
  }
  if (fileSize >= 50 * 1024 * 1024) {
    return 5 * 1024 * 1024;
  }
  return 1 * 1024 * 1024;
};

const fetchChunkFileToBlobWithRetries = async ({
  src,
  start,
  end,
  retry,
}: {
  src: string;
  start: number;
  end: number;
  retry: number;
}): Promise<Blob> => {
  const attempts = Array.from({ length: retry });

  return attempts.reduce(async (prev: Promise<Blob>, _, index): Promise<Blob> => {
    try {
      const blob = await prev;

      if (blob instanceof Blob && blob.size > 0) {
        return blob;
      }

      const response = await fetch(src, {
        method: 'GET',
        headers: {
          Range: `bytes=${start}-${end}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch chunk file');

      return await response.blob();
    } catch (error) {
      if (index === retry - 1) throw error;

      return new Blob();
    }
  }, Promise.resolve(new Blob()));
};

const waitForQueueAndFetchChunk = async ({
  executing,
  limit,
  src,
  range,
  retry,
}: {
  executing: Promise<Blob>[];
  limit: number;
  src: string;
  range: { start: number; end: number };
  retry: number;
}): Promise<Blob> => {
  while (executing.length >= limit) {
    await Promise.race(executing);
  }

  const fetchPromise = (async () => {
    const blob = await fetchChunkFileToBlobWithRetries({
      src,
      start: range.start,
      end: range.end,
      retry,
    });
    return blob;
  })();

  executing.push(fetchPromise);
  const blob = await fetchPromise;

  executing.splice(executing.indexOf(fetchPromise), 1);

  return blob;
};

const fetchChunksWithConcurrentLimit = async ({
  src,
  ranges,
  limit,
  retry,
}: {
  src: string;
  ranges: { start: number; end: number }[];
  limit: number;
  retry: number;
}): Promise<Blob[]> => {
  const results: Blob[] = new Array(ranges.length);
  const executing: Promise<Blob>[] = [];

  const allPromises = ranges.map(async (range, index) => {
    results[index] = await waitForQueueAndFetchChunk({ executing, limit, src, range, retry });
  });
  await Promise.all(allPromises);

  return results;
};

interface FetchAudioParams {
  src: string;
  chunkSize?: number;
  limit?: number;
  retry?: number;
}

interface FetchAudioReturns {
  url: string;
  blob: Blob;
  arrayBuffer: ArrayBuffer;
}

/**
 * 오디오 파일을 청크로 나누어 병렬 다운로드 후 반환하는 유틸 함수입니다.
 * url, blob, arrayBuffer 각각의 형태로 만들어 반환합니다.
 * @param FetchAudioParams
 * ```
 * interface FetchAudioParams {
 *    src: string;
 *    chunkSize?: number;
 *    limit?: number;
 *    retry?: number;
 * }
 * ```
 * @returns
 * `Promise<FetchAudioReturns>`
 * ```
 * interface FetchAudioReturns {
 *    url: string;
 *    blob: Blob;
 *    arrayBuffer: ArrayBuffer;
 * }
 * ```
 */
const fetchAudio = async ({
  src,
  chunkSize,
  limit = FETCH_CONCURRENT_LIMIT_DEFAULT,
  retry = FETCH_RETRY_DEFAULT,
}: FetchAudioParams): Promise<FetchAudioReturns> => {
  const { audioType, audioSize } = await getAudioFileInformation(src);

  const computedChunkSize = chunkSize ?? getChunkSize(audioSize);

  const totalChunks = Math.ceil(audioSize / computedChunkSize);

  const chunkRanges = Array.from({ length: totalChunks }, (_, i) => {
    const start = i * computedChunkSize;
    const end = Math.min(start + computedChunkSize - 1, audioSize - 1);
    return { start, end };
  });

  const chunkBlobs = await fetchChunksWithConcurrentLimit({
    src,
    ranges: chunkRanges,
    limit,
    retry,
  });

  const audioBlob = chunkBlobs.reduce(
    (blob, chunkBlob) => new Blob([blob, chunkBlob], { type: audioType }),
    new Blob(),
  );

  return {
    blob: audioBlob,
    arrayBuffer: await audioBlob.arrayBuffer(),
    url: URL.createObjectURL(audioBlob),
  };
};

export default fetchAudio;
