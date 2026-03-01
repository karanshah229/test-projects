import { AllHTMLAttributes, ReactNode } from 'react';

import { CarouselContextProvider } from './CarouselContextProvider';

type Props1 =
  | { autoSlide: true; autoSlideInterval?: number; pauseOnHover?: boolean }
  | { autoSlide?: false; autoSlideInterval?: never; pauseOnHover?: never };

type Props2 =
  | { fullWidth: boolean; carouselWidthInPixels?: never }
  | { carouselWidthInPixels: number; fullWidth?: never };

type RootProps = Props1 &
  Props2 & {
    children: ReactNode;
    className?: string;
    rollOverEnabled?: boolean;
    startingIndex?: number;
    autoSlide?: boolean;
    style?: object;
  } & AllHTMLAttributes<HTMLDivElement>;

export function Root({
  children,
  fullWidth = false,
  carouselWidthInPixels,
  className,
  rollOverEnabled = false,
  startingIndex = 0,
  style = {},
  autoSlide,
  autoSlideInterval,
  pauseOnHover,
  ...rest
}: RootProps) {
  const rootWidth = carouselWidthInPixels > 0 ? carouselWidthInPixels : '100%';

  return (
    <CarouselContextProvider
      rollOverEnabled={rollOverEnabled}
      startingIndex={startingIndex}
      carouselWidthInPixels={carouselWidthInPixels}
      autoSlide={autoSlide}
      autoSlideInterval={autoSlideInterval}
      pauseOnHover={pauseOnHover}
      fullWidth={fullWidth}
    >
      <div
        style={{
          ...style,
          position: 'relative',
          width: rootWidth,
          overflow: 'hidden',
        }}
        className={className}
        {...rest}
      >
        {children}
      </div>
    </CarouselContextProvider>
  );
}
