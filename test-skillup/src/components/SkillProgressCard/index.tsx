import { HRClickableDiv } from '@hackerrank/hrds-components';
import { useState } from 'react';

import type { AssignmentAssignedByType } from 'src/types/api/assignment';
import type { JobRoleSkillType } from 'src/types/api/job_roles';
import { ProficiencyType } from 'src/types/common';

import { SkillCardBody, SkillCardBodyProps } from './Body/Body';
import { SkillCardFooter, SkillCardFooterType } from './Footer/Footer';
import styles from './index.module.scss';

export type SkillWithFooterType = {
  id: string;
  name: string;
  due_date: string | null;
  completed_on: string | null;
  assigned_by: AssignmentAssignedByType;
  verified_proficiency: ProficiencyType;
  proficiency_progress_percentage: number;
};

export type SkillCardProps =
  | {
      data: JobRoleSkillType;
      showFooter?: boolean;
    }
  | {
      data: SkillWithFooterType;
      showFooter?: boolean;
    };

export function SkillCard(props: SkillCardProps) {
  const [hoveredOverIcon, setHoveredOverIcon] = useState(false);
  const { data = {} as JobRoleSkillType | SkillWithFooterType, showFooter } = props;

  const cardBodyProps: SkillCardBodyProps = {
    skillName: data.name,
    skillVerifiedProficiency: data.verified_proficiency,
    skillProgress: data.proficiency_progress_percentage,
    showFooter,
  };

  const footerBodyProps: SkillCardFooterType = {} as SkillCardFooterType;
  if (showFooter) {
    const skillData = data as SkillWithFooterType;
    footerBodyProps.assigned_by = skillData.assigned_by;
    footerBodyProps.due_date = skillData.due_date;
  }

  return (
    <HRClickableDiv
      onClick={() => alert('Show Skill Details Dialog')}
      className={styles.skill_card_wrapper}
      onMouseOver={() => setHoveredOverIcon(true)}
      onMouseOut={() => setHoveredOverIcon(false)}
    >
      <SkillCardBody {...cardBodyProps} isHovered={hoveredOverIcon} />

      {showFooter ? <SkillCardFooter {...footerBodyProps} /> : null}
    </HRClickableDiv>
  );
}
