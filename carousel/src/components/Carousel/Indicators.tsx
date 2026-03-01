import { useContext } from 'react';

import { CarouselContext } from './CarouselContextProvider';

export function Indicators({
  children,
  showIndicatorIfOneSlide = true,
}: {
  children: (
    index: number,
    isActiveSlideIndicator: boolean,
    onClick: () => void,
  ) => React.ReactNode;
  showIndicatorIfOneSlide?: boolean;
}) {
  const { totalSlides, setCurrentSlideIndex, currentSlideIndex } = useContext(CarouselContext);

  if (totalSlides === 1 && !showIndicatorIfOneSlide) return null;
  return (
    <>
      {Array.from({ length: totalSlides }, (_, index) => index).map((_, index) =>
        children(index, currentSlideIndex === index, () => setCurrentSlideIndex(index)),
      )}
    </>
  );
}
