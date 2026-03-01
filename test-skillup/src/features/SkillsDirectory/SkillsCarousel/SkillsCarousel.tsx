import { useState } from 'react';

import { Carousel } from 'src/components/Carousel';
import { SkillsDirectoryData } from 'src/types/api/skills';

import { TriggerNext, TriggerPrev } from './CarouselTrigger';
import styles from './SkillsCarousel.module.scss';
import { SkillCard } from '../SkillCard/SkillCard';
import { SubHeader } from '../Typography/Typography';
import { getLatestProficiency } from '../utils';

type SkillsCarouselProps = {
  skills: SkillsDirectoryData[];
  header: string;
  showIndex?: boolean;
  resetProgess?: boolean;
  hideProficiency?: boolean;
};

function SkillIndex({ index }: { index: number }) {
  return (
    <div
      className={`${styles.index_container} ${
        index > 8 ? styles.index_container__sm : ''
      } hr-flex hr-align-center`}
    >
      <div className={`${styles.index} ${index > 8 ? styles.index__sm : ''}`}>{index + 1}</div>
    </div>
  );
}

export function SkillsCarousel({
  skills,
  header,
  showIndex,
  resetProgess = false,
  hideProficiency = false,
}: SkillsCarouselProps) {
  const [isTriggerVisible, setIsTriggerVisible] = useState(false);

  if (skills?.length === 0) {
    return null;
  }

  return (
    <div className="hr-m-b-4 hr-select-none">
      <SubHeader>{header}</SubHeader>
      <Carousel.Root
        fullWidth
        onMouseOver={() => setIsTriggerVisible(true)}
        onFocus={() => setIsTriggerVisible(true)}
        onBlur={() => setIsTriggerVisible(false)}
        onMouseOut={() => setIsTriggerVisible(false)}
        style={{
          paddingInline: 'var(--hr-spacing-10)',
        }}
      >
        <div className="hr-flex">
          <TriggerPrev isTriggerVisible={isTriggerVisible} />

          <Carousel.SlidesContainer>
            {skills.map((skill, index) => {
              const latestProficiency = getLatestProficiency(skill.attributes.proficiency_progress);
              const progressPercentage =
                skill.attributes.proficiency_progress?.[latestProficiency]?.progress_percentage;
              return (
                <Carousel.Slide key={skill.id}>
                  {showIndex ? (
                    <div
                      className={`${styles.card_container} ${
                        index === 0 ? styles.card_container__first : ''
                      }
                      ${index + 1 === skills.length ? styles.card_container__last : ''}`}
                    >
                      <SkillIndex index={index} />
                      <div className={styles.index_skill_card}>
                        <SkillCard
                          name={skill.attributes.name}
                          slug={skill.attributes.slug}
                          hideProficiency={hideProficiency}
                          resetProgess={resetProgess}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className={index + 1 === skills.length ? '' : 'hr-m-r-1.25'}>
                      <SkillCard
                        name={skill.attributes.name}
                        slug={skill.attributes.slug}
                        skillProgress={progressPercentage}
                        proficiency={latestProficiency}
                        hideProficiency={hideProficiency}
                      />
                    </div>
                  )}
                </Carousel.Slide>
              );
            })}
          </Carousel.SlidesContainer>

          <TriggerNext isTriggerVisible={isTriggerVisible} />
        </div>
      </Carousel.Root>
    </div>
  );
}
