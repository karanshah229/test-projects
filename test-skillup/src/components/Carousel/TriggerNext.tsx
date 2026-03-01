/* eslint-disable no-param-reassign */
import React, { AllHTMLAttributes, useContext } from 'react';

import { composeEventHandlers } from 'src/utils/common';

import { CarouselContext } from './CarouselContextProvider';
import { nextSlide } from './utils';

interface Props {
  as: any;
  showOnLastSlide?: boolean;
  disabledProp?: string;
  children: React.ReactNode;
}

export function TriggerNext({
  as,
  showOnLastSlide = true,
  disabledProp = '',
  children,
  ...rest
}: Props & Omit<AllHTMLAttributes<HTMLElement>, 'as'>) {
  const { currentSlideIndex, setCurrentSlideIndex, totalSlides, rollOverEnabled } =
    useContext(CarouselContext);

  rest.onClick = composeEventHandlers(rest.onClick, () =>
    nextSlide({
      currentSlideIndex,
      setCurrentSlideIndex,
      totalSlides,
      rollOverEnabled,
    }),
  );

  rest.disabled = currentSlideIndex === totalSlides - 1 && !rollOverEnabled;

  // For HRDS components like HRIconButton that accept a isDisabled prop
  if (disabledProp) {
    (rest as any)[disabledProp] = currentSlideIndex === totalSlides - 1 && !rollOverEnabled;
  }

  if (currentSlideIndex === totalSlides - 1 && !showOnLastSlide) return null;
  return React.createElement(as, rest, children);
}
