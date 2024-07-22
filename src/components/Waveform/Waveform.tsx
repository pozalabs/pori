import CanvasWaveform from './CanvasWaveform';
import SvgWaveform from './SvgWaveform';

import useAudioData from '../../hooks/useAudioData';
import SwitchRenderer from '../SwitchRenderer/SwitchRenderer';

interface WaveformProps {
  src: string;
  type?: 'canvas' | 'svg';
  sampleRate?: number;
  peakLength?: number;
}

const Waveform = ({
  src,
  type = 'canvas',
  sampleRate = 8000,
  peakLength = 1024,
}: WaveformProps) => {
  const { peaks } = useAudioData({ src, sampleRate, peakLength });

  const renderWaveform = (): JSX.Element => {
    if (type === 'svg') {
      return <SvgWaveform peaks={peaks} />;
    }

    return <CanvasWaveform peaks={peaks} />;
  };

  return (
    <div className="w-dvw h-[100px]">
      <SwitchRenderer value={type}>
        <CanvasWaveform data-value="canvas" peaks={peaks} />
        <SvgWaveform data-value="svg" peaks={peaks} />
      </SwitchRenderer>
    </div>
  );
};

export default Waveform;
