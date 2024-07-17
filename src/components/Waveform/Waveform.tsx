import { cn } from '@pozalabs/pokit/utils';

interface WaveformProps {
  className?: string;
}

const Waveform = ({ className }: WaveformProps) => {
  return <div className={cn('bg-red-500', className)}>Waveform</div>;
};

export default Waveform;
