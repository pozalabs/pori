import type { GetAudioFileInformationReturns } from '../types';

/**
 * This is a utility function for retrieving information from an audio file.
 * @param src
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
    throw new Error('This file is not audio type');
  }

  return {
    audioType: contentType,
    audioSize: Number(contentLength),
  };
};

export default getAudioFileInformation;
