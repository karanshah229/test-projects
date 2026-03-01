import { HRChevronLeftIcon, HRChevronRightIcon } from '@hackerrank/hrds-icons';

import { Carousel } from 'src/components/Carousel';

import styles from './SkillsCarousel.module.scss';

type CarouselTriggerProps = {
  isTriggerVisible: boolean;
};

export function TriggerPrev({ isTriggerVisible }: CarouselTriggerProps) {
  return (
    <Carousel.TriggerPrev
      as="button"
      disabledProp="isDisabled"
      showOnFirstSlide={false}
      className={`${styles.carousel_trigger} ${isTriggerVisible ? styles.show_trigger : ''}`}
      style={{
        left: 0,
      }}
    >
      <HRChevronLeftIcon width="20px" height="20px" />
    </Carousel.TriggerPrev>
  );
}

export function TriggerNext({ isTriggerVisible }: CarouselTriggerProps) {
  return (
    <Carousel.TriggerNext
      as="button"
      disabledProp="isDisabled"
      showOnLastSlide={false}
      className={`${styles.carousel_trigger} ${isTriggerVisible ? styles.show_trigger : ''}`}
      style={{
        right: 0,
      }}
    >
      <HRChevronRightIcon width="20px" height="20px" />
    </Carousel.TriggerNext>
  );
}
