import type { ReactNode } from 'react';

interface AudioPlayerButtonIconProps {
  src: ReactNode;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

const AudioPlayerButtonIcon = ({
  src,
  alt,
  width,
  height,
  className,
}: AudioPlayerButtonIconProps) => {
  if (typeof src === 'string') {
    return <img src={src} alt={alt} width={width} height={height} className={className} />;
  }

  return <>{src}</>;
};

export default AudioPlayerButtonIcon;
