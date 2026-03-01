import { HRClickableDiv } from '@hackerrank/hrds-components';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { SkillCircularProgressIndicator } from 'src/components/SkillCircularProgressIndicator/SkillCircularProgressIndicator';
import { CDN_URL_PREFIX } from 'src/constants/common';
import { ProficiencyType } from 'src/types/common';

import styles from './SkillCard.module.scss';

export type SkillCardBodyProps = {
  slug: string;
  name: string;
  proficiency?: ProficiencyType;
  skillProgress?: number;
  hideProficiency?: boolean;
  resetProgess?: boolean;
};

export function SkillCard({
  slug,
  name,
  proficiency,
  skillProgress,
  hideProficiency = false,
  resetProgess = false,
}: SkillCardBodyProps) {
  const backgroundImageURL = `url("${CDN_URL_PREFIX}/noiseEffect.png")`;
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  return (
    <HRClickableDiv
      className={`${styles.skill_card} hr-flex hr-col hr-justify-center hr-align-center hr-row-gap-1.5 hr-p-y-4`}
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      onClick={() => router.push(`/skills/${slug}`)}
      style={{
        backgroundImage: backgroundImageURL,
        backgroundColor: isHovered ? '#E4EFF8' : '#F5FBFF',
      }}
    >
      <div className={styles.skill_progress_bar}>
        <SkillCircularProgressIndicator
          isHovered={isHovered}
          skillProgress={resetProgess ? 0 : skillProgress}
          skillName={name}
        />
      </div>
      <div className="hr-flex hr-col hr-justify-center hr-align-center hr-text-capitalize">
        <div className={styles.skill_name}>{name}</div>
        {hideProficiency ? null : proficiency}
      </div>
    </HRClickableDiv>
  );
}
