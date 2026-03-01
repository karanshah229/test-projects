import { HRTimeCircleIcon, HRUser1Icon } from '@hackerrank/hrds-icons';
import dayjs from 'dayjs';

import { AssignmentAssignedByType } from 'src/types/api/assignment';
import { getUserFullName } from 'src/utils/common';

import styles from './Footer.module.scss';

export type SkillCardFooterType = {
  assigned_by: AssignmentAssignedByType;
  due_date: string | null;
};

export function SkillCardFooter(props: SkillCardFooterType) {
  const { assigned_by: assignedBy = {} as AssignmentAssignedByType, due_date: dueDate } = props;

  return (
    <div className={`hr-flex hr-col bg-white hr-p-1 ${styles.skill_card_footer}`}>
      <div className="hr-flex hr-justify-between">
        {assignedBy.first_name ? (
          <div className="hr-flex hr-align-center" style={{ gap: '5px' }}>
            <HRUser1Icon stroke="#888888" width="1rem" height="1rem" />
            <div className="hr-utility-01" style={{ color: '#646464' }}>
              {getUserFullName(assignedBy.first_name, assignedBy.last_name)}
            </div>
          </div>
        ) : null}

        {dueDate ? (
          <div
            className={`hr-flex hr-align-center hr-gap-0.25 ${
              dayjs(dueDate).isBefore(new Date()) ? styles.skill_card_footer__overdue : ''
            }`}
          >
            <HRTimeCircleIcon width="1rem" height="1rem" />
            <div className="hr-utility-01">{dayjs(dueDate).format('MMM DD, YYYY')}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
