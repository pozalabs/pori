import { Children, isValidElement, type ReactNode } from 'react';

interface SwitchRendererProps {
  value: string;
  children: ReactNode[];
}

const SwitchRenderer = ({ value, children }: SwitchRendererProps) => {
  return Children.toArray(children).find(child => {
    if (!isValidElement(child)) return;

    return child.props['data-value'] === value;
  });
};

export default SwitchRenderer;
