import type { Dispatch, SetStateAction } from 'react';

export function nextSlide({
  currentSlideIndex,
  totalSlides,
  rollOverEnabled,
  setCurrentSlideIndex,
}: {
  currentSlideIndex: number;
  totalSlides: number;
  rollOverEnabled: boolean;
  setCurrentSlideIndex: Dispatch<SetStateAction<number>>;
}) {
  if (currentSlideIndex === totalSlides - 1 && !rollOverEnabled) return;
  setCurrentSlideIndex((c) => {
    if (!rollOverEnabled) return c + 1;
    return (c + 1) % totalSlides;
  });
}

export function prevSlide({
  currentSlideIndex,
  totalSlides,
  rollOverEnabled,
  setCurrentSlideIndex,
}: {
  currentSlideIndex: number;
  totalSlides: number;
  rollOverEnabled: boolean;
  setCurrentSlideIndex: Dispatch<SetStateAction<number>>;
}) {
  if (currentSlideIndex === 0 && !rollOverEnabled) return;
  setCurrentSlideIndex((c) => {
    if (!rollOverEnabled) return c - 1;
    return (c - 1 + totalSlides) % totalSlides;
  });
}

export function isIndexValidSlideIndex(index: number, totalSlides: number) {
  if (index !== undefined && index !== null && index >= 0 && index < totalSlides - 1) return true;
  return false;
}
