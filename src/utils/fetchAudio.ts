const getFileSize = async (url: string): Promise<number> => {
  const response = await fetch(url, {
    method: 'HEAD',
  });
  return Number(response.headers.get('Content-Length'));
};

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
  return response.blob();
};

interface FetchAudioParams {
  src: string;
  type?: 'url' | 'blob' | 'arrayBuffer';
  chunkSize?: number;
}

/**
 * 오디오 파일을 청크로 나누어 병렬 다운로드 후 반환하는 유틸 함수입니다.
 * 반환 타입은 url, blob, arrayBuffer 중에서 선택할 수 있습니다.
 * @param FetchAudioParams
 * ```
 * interface FetchAudioParams {
 *    src: string;
 *    type?: 'url' | 'blob' | 'arrayBuffer';
 *    chunkSize?: number;
 * }
 * ```
 * - type default : `url`
 * @returns `Promise<T>`
 */
const fetchAudio = async <T extends string | Blob | ArrayBuffer>({
  src,
  type = 'url',
  chunkSize,
}: FetchAudioParams): Promise<T> => {
  const audioSize = await getFileSize(src);
  const computedChunkSize = chunkSize ?? getChunkSize(audioSize);

  const chunks = [...Array(Math.ceil(audioSize / computedChunkSize)).keys()];
  const chunkBlobPromises = chunks.map(chunk => {
    const start = chunk * computedChunkSize;
    const end = Math.min(start + computedChunkSize - 1, audioSize - 1);

    return fetchChunkFileToBlob({ src, start, end });
  });
  const chunkBlobs = await Promise.all(chunkBlobPromises);

  const audioBlob = chunkBlobs.reduce(
    (blob, chunkBlob) => new Blob([blob, chunkBlob], { type: 'audio/mpeg' }),
    new Blob(),
  );

  if (type === 'blob') {
    return audioBlob as T;
  }
  if (type === 'arrayBuffer') {
    return (await audioBlob.arrayBuffer()) as T;
  }

  return URL.createObjectURL(audioBlob) as T;
};

export default fetchAudio;
