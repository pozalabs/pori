import CanvasWaveform from './CanvasWaveform';
import SvgWaveform from './SvgWaveform';

import useAudioData from '../../hooks/useAudioData';

interface WaveformProps {
  src: string;
  type?: 'canvas' | 'svg';
}

const Waveform = ({ src, type = 'canvas' }: WaveformProps) => {
  const { peaks } = useAudioData(src);

  const renderWaveform = (): JSX.Element => {
    if (type === 'svg') {
      return <SvgWaveform peaks={peaks} />;
    }

    return <CanvasWaveform peaks={peaks} />;
  };

  return <div className="w-dvw h-[100px]">{renderWaveform()}</div>;
};

export default Waveform;
