import type { GetAudioFileInformationReturns } from '../types';

/**
 * Retrieves metadata (type, size) from an audio file via a HEAD request.
 * @param src - Audio source URL
 * @returns
 * `Promise<IAudioInformation>`
 * ```
 * interface IAudioInformation {
 *    audioType: string;
 *    audioSize: number;
 * }
 * ```
 */
const getAudioFileInformation = async (src: string): GetAudioFileInformationReturns => {
  const response = await fetch(src, {
    method: 'HEAD',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch audio with HEAD method');
  }

  const contentType = response.headers.get('Content-Type');
  const contentLength = response.headers.get('Content-Length');

  if (!contentType || !contentType.startsWith('audio/')) {
    throw new Error('The file is not an audio file');
  }

  return {
    audioType: contentType,
    audioSize: Number(contentLength),
  };
};

export default getAudioFileInformation;
