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

const fetchChunkFileToBlob = async ({
  src,
  start,
  end,
}: {
  src: string;
  start: number;
  end: number;
}): Promise<Blob> => {
  const response = await fetch(src, {
    method: 'GET',
    headers: {
      Range: `bytes=${start}-${end}`,
    },
  });

  if (!response.ok) throw new Error('Failed to fetch chunk file');

  return response.blob();
};

interface FetchAudioParams {
  src: string;
  chunkSize?: number;
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
const fetchAudio = async ({ src, chunkSize }: FetchAudioParams): Promise<FetchAudioReturns> => {
  const { audioType, audioSize } = await getAudioFileInformation(src);

  const computedChunkSize = chunkSize ?? getChunkSize(audioSize);

  const chunks = [...Array(Math.ceil(audioSize / computedChunkSize)).keys()];
  const chunkBlobPromises = chunks.map(chunk => {
    const start = chunk * computedChunkSize;
    const end = Math.min(start + computedChunkSize - 1, audioSize - 1);

    return fetchChunkFileToBlob({ src, start, end });
  });
  const chunkBlobs = await Promise.all(chunkBlobPromises);

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
