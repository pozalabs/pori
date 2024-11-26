import { useEffect, useRef } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import type { WaveformHandles } from './Waveform';
import Waveform from './Waveform';
import { WAVEFORM_DEFAULT_VALUE } from '../../hooks/waveform/_constants';
import type { WaveformType } from '../../hooks/waveform/_types';
import type { UseWaveformParams } from '../../hooks/waveform/useWaveform';
import { MOCK_PEAKS } from '../../mocks/constants';

const WaveformWithControlButton = <T extends WaveformType>(props: UseWaveformParams<T>) => {
  const ref = useRef<WaveformHandles>(null);

  useEffect(() => {
    const waveformElement = ref.current?.waveformRef.current;

    if (!waveformElement) return;

    const { play } = ref.current;

    waveformElement.addEventListener('click', play);

    return () => {
      if (!waveformElement) return;

      waveformElement.removeEventListener('click', play);
    };
  }, []);

  return (
    <div className="flex w-fit flex-col gap-4">
      <Waveform ref={ref} {...props} />
      <div className="flex justify-between px-48">
        <button
          className="rounded-[8px] border border-blue-100 bg-blue-50 px-4 py-2 transition duration-100 ease-in-out hover:bg-blue-100"
          onClick={() => ref.current?.play()}
        >
          재생
        </button>
        <button
          className="rounded-[8px] border border-blue-100 bg-blue-50 px-4 py-2 transition duration-100 ease-in-out hover:bg-blue-100"
          onClick={() => ref.current?.pause()}
        >
          일시정지
        </button>
      </div>
    </div>
  );
};

const meta = {
  title: 'Waveform',
  component: WaveformWithControlButton,
} satisfies Meta<typeof Waveform>;

export default meta;
type Story = StoryObj<typeof meta>;

const src =
  'https://dev.cdn.eapy.io/boards/670884cb3d463893a0bd2f60/assets/670884dc3d463893a0bd2f66?format=mp3';

export const Canvas: Story = {
  args: { ...WAVEFORM_DEFAULT_VALUE, type: 'canvas', src, peaks: MOCK_PEAKS },
};
export const Svg: Story = {
  args: { ...WAVEFORM_DEFAULT_VALUE, type: 'svg', src, peaks: MOCK_PEAKS },
};
