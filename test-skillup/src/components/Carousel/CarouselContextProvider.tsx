import { Dispatch, SetStateAction, createContext, useMemo, useState } from 'react';

type CarouselContextType = {
  currentSlideIndex: number;
  setCurrentSlideIndex: Dispatch<SetStateAction<number>>;
  totalSlides: number;
  setTotalSlides: Dispatch<SetStateAction<number>>;
  rollOverEnabled: boolean;
  startingIndex: number;
  carouselWidthInPixels: number;
  autoSlide: boolean;
  autoSlideInterval: number;
  pauseOnHover: boolean;
  fullWidth: boolean;
};

export const CarouselContext = createContext<CarouselContextType>({
  currentSlideIndex: 0,
  totalSlides: 0,
  setCurrentSlideIndex: () => {},
  setTotalSlides: () => {},
  rollOverEnabled: false,
  startingIndex: 0,
  carouselWidthInPixels: 0,
  autoSlide: false,
  autoSlideInterval: 3000,
  pauseOnHover: false,
  fullWidth: false,
});

export function CarouselContextProvider({
  children,
  totalSlides: numberOfSlides = 0,
  rollOverEnabled = false,
  startingIndex = 0,
  carouselWidthInPixels = 0,
  autoSlide = false,
  autoSlideInterval = 3000,
  pauseOnHover = false,
  fullWidth = false,
}: {
  children: React.ReactNode;
  totalSlides?: number;
  rollOverEnabled?: boolean;
  startingIndex?: number;
  carouselWidthInPixels?: number;
  autoSlide?: boolean;
  autoSlideInterval?: number;
  pauseOnHover?: boolean;
  fullWidth?: boolean;
}) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(startingIndex);
  const [totalSlides, setTotalSlides] = useState(numberOfSlides);

  const contextVal = useMemo(
    () => ({
      totalSlides,
      setTotalSlides,
      currentSlideIndex,
      setCurrentSlideIndex,
      rollOverEnabled,
      startingIndex,
      carouselWidthInPixels,
      autoSlide,
      autoSlideInterval,
      pauseOnHover,
      fullWidth,
    }),
    [
      totalSlides,
      setTotalSlides,
      currentSlideIndex,
      setCurrentSlideIndex,
      rollOverEnabled,
      startingIndex,
      carouselWidthInPixels,
      autoSlide,
      autoSlideInterval,
      pauseOnHover,
      fullWidth,
    ],
  );

  return <CarouselContext.Provider value={contextVal}>{children}</CarouselContext.Provider>;
}
