/**
 * Params for the fetchAudio function.
 */
export interface FetchAudioParams {
  src: string;
  chunkSize?: number;
  limit?: number;
  retry?: number;
}

/**
 * Return type of the fetchAudio function.
 */
export interface FetchAudioReturns {
  url: string;
  blob: Blob;
  arrayBuffer: ArrayBuffer;
}

/**
 * Return type of the getAudioFileInformation function.
 */
export type GetAudioFileInformationReturns = Promise<{
  audioType: string;
  audioSize: number;
}>;

export type ArrayElementType<T extends readonly unknown[]> = T[number];
export type WithArray<T> = T | T[];
