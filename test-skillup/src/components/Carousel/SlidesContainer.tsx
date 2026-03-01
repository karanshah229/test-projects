import {
  AllHTMLAttributes,
  Children,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useInterval } from 'src/hooks/useInterval';
import { composeMultipleEventHandlers } from 'src/utils/common';

import { CarouselContext } from './CarouselContextProvider';
import { nextSlide } from './utils';

export function SlidesContainer({
  children,
  currentSlideIndex: customCurrentSlideIndex,
  style,
  ...rest
}: {
  children: ReactNode;
  currentSlideIndex?: number | null;
  style?: object;
} & AllHTMLAttributes<HTMLDivElement>) {
  const direction = useRef('-'); // ref since we don't want to re-render the component
  const lastSlideWidth = useRef(0); // ref since we don't want to re-render the component
  const slidesContainerRef = useRef<HTMLDivElement>(null);
  const {
    totalSlides,
    setTotalSlides,
    rollOverEnabled,
    currentSlideIndex,
    setCurrentSlideIndex,
    startingIndex,
    carouselWidthInPixels: _carouselWidthInPixels,
    autoSlide,
    autoSlideInterval,
    pauseOnHover,
    fullWidth,
  } = useContext(CarouselContext);

  const [carouselWidthInPixels, setCarouselWidthInPixels] = useState(
    fullWidth ? 0 : _carouselWidthInPixels,
  );
  const [slideContainerWidth, setSlideContainerWidth] = useState(
    slidesContainerRef.current?.scrollWidth || 0,
  );
  const [slideWidth, setSlideWidth] = useState(
    slidesContainerRef.current?.getBoundingClientRect().width || 0,
  );

  const [transformProperty, setTransformProperty] = useState(
    `translateX(${startingIndex * carouselWidthInPixels}px)`,
  );
  const [hoveredOnSlideContainer, setHoveredOnSlideContainer] = useState(false);

  useEffect(() => {
    if (fullWidth && slidesContainerRef.current) {
      setCarouselWidthInPixels(slidesContainerRef.current.getBoundingClientRect().width);
    }
  }, [fullWidth]);

  useEffect(() => {
    setSlideContainerWidth(slidesContainerRef.current?.scrollWidth || 0);
    setSlideWidth(slidesContainerRef.current?.getBoundingClientRect().width || 0);
  }, []);

  useEffect(() => {
    const totalSlidesCount =
      fullWidth && slidesContainerRef.current && slideContainerWidth && slideWidth
        ? Math.ceil(slideContainerWidth / slideWidth)
        : Children.count(children);
    setTotalSlides(totalSlidesCount);
  }, [children, fullWidth, setTotalSlides, slideWidth, slideContainerWidth]);

  useEffect(() => {
    if (customCurrentSlideIndex !== undefined && customCurrentSlideIndex !== null) {
      setCurrentSlideIndex(customCurrentSlideIndex);
    }
  }, [customCurrentSlideIndex, setCurrentSlideIndex]);

  useEffect(() => {
    lastSlideWidth.current = slideContainerWidth - (totalSlides - 1) * slideWidth;
  }, [slideWidth, totalSlides, slideContainerWidth]);

  useEffect(() => {
    // If last slide width is less than othen slides, need to remove the excess translateX
    const lastSlideExcess =
      currentSlideIndex === totalSlides - 1 ? slideWidth - lastSlideWidth.current : 0;
    const newTransformProperty = `translateX(${rollOverEnabled ? direction.current : '-'}${
      currentSlideIndex * carouselWidthInPixels - lastSlideExcess
    }px)`;
    setTransformProperty(newTransformProperty);
  }, [currentSlideIndex, rollOverEnabled, carouselWidthInPixels, slideWidth, totalSlides]);

  useInterval(
    () => {
      nextSlide({
        currentSlideIndex,
        totalSlides,
        rollOverEnabled,
        setCurrentSlideIndex,
      });
    },
    !autoSlide || (pauseOnHover && hoveredOnSlideContainer) ? null : autoSlideInterval,
  );

  // Compose only the handlers we require
  const composedMultipleEventHandlers = composeMultipleEventHandlers({
    onMouseOver: [rest.onMouseOver, () => setHoveredOnSlideContainer(true)],
    onFocus: [rest.onFocus, () => setHoveredOnSlideContainer(true)],
    onMouseOut: [rest.onFocus, () => setHoveredOnSlideContainer(false)],
    onBlur: [rest.onBlur, () => setHoveredOnSlideContainer(false)],
  });

  return (
    <div
      style={{
        ...style,
        display: 'flex',
        width: carouselWidthInPixels > 0 ? carouselWidthInPixels : '100%',
        transform: transformProperty,
        transition: 'transform 300ms ease-out',
      }}
      {...rest}
      {...composedMultipleEventHandlers}
      ref={slidesContainerRef}
    >
      {children}
    </div>
  );
}
