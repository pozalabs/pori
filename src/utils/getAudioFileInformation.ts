interface IAudioInformation {
  audioType: string;
  audioSize: number;
}

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
const getAudioFileInformation = async (src: string): Promise<IAudioInformation> => {
  const response = await fetch(src, {
    method: 'HEAD',
  });

  if (!response.ok) throw new Error('Failed to fetch audio with HEAD method');

  const type = response.headers.get('Content-Type');

  if (!type || !type.startsWith('audio/')) throw new Error('This file is not audio type');

  return {
    audioType: response.headers.get('Content-Type') ?? '',
    audioSize: Number(response.headers.get('Content-Length')),
  };
};

export default getAudioFileInformation;
