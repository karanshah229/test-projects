import { CertificationCard } from 'src/components/CertificationCard';
import { SkillCard } from 'src/components/SkillProgressCard';
import { ASSIGNMENT_TYPE } from 'src/constants/common';
import { AssignmentDatum, AssignmentSkillMetadata } from 'src/types/api/assignment';
import { CertificationJobRoleType, CertificationMetadata } from 'src/types/api/common';

import styles from './AssignmentsTab.module.scss';

export function AssignmentsContent({
  header,
  assignments,
}: {
  header: string;
  assignments: AssignmentDatum[];
}) {
  if (assignments.length === 0) return null;

  return (
    <div className="hr-m-b-2.5 skds-grid-gap-11">
      <div className={styles.assignments_header}>{header}</div>
      <div className="hr-grid-row hr-row-gap-1 hr-m-b-1">
        {assignments.map((assignment) => {
          const {
            name,
            entity_id: entityId,
            entity_type: entityType,
            completed_on: completedOn,
            due_date: dueDate,
            assigned_by: assignedBy,
            metadata,
          } = assignment?.attributes || {};

          const skillCardProps = {
            name,
            id: entityId,
            due_date: dueDate,
            completed_on: completedOn,
            assigned_by: assignedBy,
          };

          const certificationCardProps = {
            id: entityId,
            name,
            assignment: {
              due_date: dueDate,
              completed_on: completedOn,
              assigned_by: assignedBy,
            },
          };

          if (entityType === ASSIGNMENT_TYPE.SKILL) {
            const { proficiency_progress_percentage: proficiencyProgressPercentage, proficiency } =
              (metadata as AssignmentSkillMetadata) || {};
            return (
              <div className="hr-grid-col-4" key={entityId}>
                <SkillCard
                  data={{
                    ...skillCardProps,
                    verified_proficiency: proficiency,
                    proficiency_progress_percentage: proficiencyProgressPercentage,
                  }}
                  showFooter
                  key={assignment.id}
                />
              </div>
            );
          }

          const { assessment, job_role: jobRole = {} as CertificationJobRoleType } =
            (metadata as CertificationMetadata) || {};

          const { skills: jobRoleSkills = [] } = jobRole;

          return (
            <div className="hr-grid-col-4" key={entityId}>
              <CertificationCard
                data={{
                  ...certificationCardProps,
                  assessment,
                  skills: jobRoleSkills,
                }}
                showFooter
                key={assignment.id}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
