import { ReactNode } from 'react';

export function Slide({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        ...style,
        flexShrink: 0,
      }}
    >
      {children}
    </div>
  );
}
