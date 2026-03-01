import { HRTooltip } from '@hackerrank/hrds-components';
import { useEffect, useRef, useState } from 'react';

import { SkillCircularProgressIndicator } from 'src/components/SkillCircularProgressIndicator/SkillCircularProgressIndicator';
import { CDN_URL_PREFIX, PROFICIENCIES } from 'src/constants/common';
import { ProficiencyType } from 'src/types/common';

import styles from './Body.module.scss';

export type SkillCardBodyProps = {
  skillName: string;
  skillVerifiedProficiency: ProficiencyType | null;
  skillProgress: number;
  showFooter?: boolean;
  isHovered?: boolean;
};

export function SkillCardBody({
  skillName = 'fallback',
  skillVerifiedProficiency,
  skillProgress = 0,
  showFooter = false,
  isHovered = false,
}: SkillCardBodyProps) {
  const parentRef = useRef(null);
  const contentRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const parent = parentRef.current;
    const content = contentRef.current;

    if (content.scrollWidth > parent.clientWidth) {
      setIsOverflowing(true);
    } else {
      setIsOverflowing(false);
    }
  }, []);

  const backgroundImageURL = `url("${CDN_URL_PREFIX}/noiseEffect.png")`;
  return (
    <div
      className={`hr-p-x-1 hr-flex hr-col hr-justify-between ${styles.skill_card__body} ${
        showFooter
          ? `${styles.skill_card__show_footer} hr-p-y-1.25`
          : 'hr-p-t-1 hr-p-b-1.25 hr-row-gap-1'
      }`}
      style={{
        backgroundImage: backgroundImageURL,
        backgroundColor: isHovered ? '#E4EFF8' : '#F5FBFF',
      }}
    >
      <div className={styles.skill_card__body__progress_indicator}>
        <SkillCircularProgressIndicator
          isHovered={isHovered}
          skillProgress={skillProgress}
          skillName={skillName}
        />
      </div>
      <div ref={parentRef}>
        <HRTooltip
          content={skillName}
          triggerType="hover"
          disabled={!isOverflowing}
          placement="bottom"
          offset={0}
        >
          <div
            className={`first-letter-uppercase ${styles.skill_card__body__skill_name}`}
            ref={contentRef}
          >
            {skillName}
          </div>

          <div className={`first-letter-uppercase ${styles.skill_card__body__proficiency_text}`}>
            {skillVerifiedProficiency || PROFICIENCIES.prebeginner}
          </div>
        </HRTooltip>
      </div>
    </div>
  );
}
