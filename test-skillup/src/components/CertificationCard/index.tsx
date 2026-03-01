import { HRClickableDiv } from '@hackerrank/hrds-components';

import type { AssignmentAssignedByType } from 'src/types/api/assignment';
import type { JobRoleCertificationType, JobRoleSkillType } from 'src/types/api/job_roles';

import { CertificationCardBody, CertificationCardBodyProps } from './Body/Body';
import { CertificationCardFooter, CertificationCardFooterType } from './Footer/Footer';
import styles from './index.module.scss';
import { getCertificationPrerequisitesCount } from './utils';

export type CertificationCardAssignmentType = {
  due_date: string | null;
  completed_on: string | null;
  assigned_by: AssignmentAssignedByType;
};

export type CertificationCardType = Partial<JobRoleCertificationType> & {
  skill_match_percentage?: number;
  skills?: Partial<JobRoleSkillType[]> | null;
  assignment?: {
    due_date: string | null;
    completed_on: string | null;
    assigned_by: AssignmentAssignedByType;
  };
};

export type CertificationCardProps = {
  data: CertificationCardType;
  showFooter?: boolean;
};

type Props = CertificationCardProps & {
  onClick?: () => {};
};

export function CertificationCard(props: Props) {
  const { data = {} as CertificationCardType, showFooter, onClick } = props;

  const cardBodyProps: CertificationCardBodyProps = {
    certificationName: data.name,
    certificationSkillsCount: data.skills?.length || 0,
    certificationAssessmentDuration: data.assessment?.duration,
    certificationPrerequisites: getCertificationPrerequisitesCount(data.skills),
    certificationIssuedAt: showFooter ? data?.assignment.completed_on : data.issued_at,
    certificationReattemptAvailableOn: data.is_available ? data.next_available_on : null,
    certificationSkillPercentMatch: data?.skill_match_percentage,
    showFooter,
  };

  const footerBodyProps: CertificationCardFooterType = {} as CertificationCardFooterType;
  if (showFooter) {
    const certificationData = data as CertificationCardType;
    footerBodyProps.assigned_by = certificationData.assignment?.assigned_by;
    footerBodyProps.due_date = certificationData.assignment?.due_date;
  }

  return (
    <HRClickableDiv onClick={onClick} className={styles.card_wrapper}>
      <CertificationCardBody {...cardBodyProps} />
      {showFooter ? <CertificationCardFooter {...footerBodyProps} /> : null}
    </HRClickableDiv>
  );
}
