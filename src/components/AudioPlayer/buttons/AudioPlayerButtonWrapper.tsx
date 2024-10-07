import type { MouseEvent, ReactNode } from 'react';

interface AudioPlayerButtonWrapperProps {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
}

const AudioPlayerButtonWrapper = ({ onClick, children }: AudioPlayerButtonWrapperProps) => {
  return (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  );
};

export default AudioPlayerButtonWrapper;
