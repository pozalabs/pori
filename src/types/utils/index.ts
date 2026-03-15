/**
 * The parameter type for the fetchAudio function.
 */
export interface FetchAudioParams {
  src: string;
  chunkSize?: number;
  limit?: number;
  retry?: number;
}

/**
 * The return type for the fetchAudio function.
 */
export interface FetchAudioReturns {
  url: string;
  blob: Blob;
  arrayBuffer: ArrayBuffer;
}

/**
 * The return type for the getAudioFileInformation function.
 */
export type GetAudioFileInformationReturns = Promise<{
  audioType: string;
  audioSize: number;
}>;

export type ArrayElementType<T extends readonly unknown[]> = T[number];
export type WithArray<T> = T | T[];
