import dayjs from 'dayjs';

import { PREREQUISITE_STATUS } from 'src/constants/common';
import { JobRoleSkillType } from 'src/types/api/job_roles';
import { CertificationPrerequisitesType } from 'src/types/common';

/**
 * Returns the duration left to reattempt certification
 * @param {Date | string} reattemptAvailableOn
 * @returns {[number, 'days' | 'hours']} The duration left to reattempt certification in [number, 'days' | 'hours'] format
 */
export function getTimeLeftToReattemptCertification(
  reattemptAvailableOn: Date | string,
): [number, 'days' | 'hours'] {
  if (reattemptAvailableOn === null) return [null, null];
  const timeLeftToReattemptInDays = dayjs
    .duration(dayjs(reattemptAvailableOn).diff(dayjs()))
    .asDays();
  return timeLeftToReattemptInDays >= 1
    ? [Math.floor(timeLeftToReattemptInDays), 'days']
    : [Math.ceil(dayjs.duration(dayjs(reattemptAvailableOn).diff(dayjs())).asHours()), 'hours'];
}

/**
 * Returns the certification prerequisite object containing total, pending and completed count for prerequisites
 * @param {Partial<JobRoleSkillType[]>} skills - The skills for which to determine the certification prerequisite object.
 * @returns {CertificationPrerequisitesType} The certification prerequisite object containing total, pending and completed count for prerequisites
 */
export function getCertificationPrerequisitesCount(skills: Partial<JobRoleSkillType[]> = []) {
  const certificationPrerequisites: CertificationPrerequisitesType = {
    total: 0,
    pending: 0,
    completed: 0,
  };

  skills.forEach((skill) => {
    if (skill.prerequisite === true) {
      if (skill.prerequisite_status === PREREQUISITE_STATUS.PENDING)
        certificationPrerequisites.pending += 1;
      if (skill.prerequisite_status === PREREQUISITE_STATUS.COMPLETED)
        certificationPrerequisites.completed += 1;
      certificationPrerequisites.total += 1;
    }
  });

  return certificationPrerequisites;
}
