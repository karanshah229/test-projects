import { useTranslation } from 'next-i18next';
import { useEffect, useMemo, useState } from 'react';

import { APIErrorFallback } from 'src/components/APIErrorFallback/APIErrorFallback';
import { EmployeeSkillDistribution } from 'src/components/EmployeeSkillDistribution/EmployeeSkillDistribution';
import { SkillProficiencyMapType } from 'src/components/EmployeeSkillDistribution/types';
import { SpinnerLoader } from 'src/components/SpinnerLoader/SpinnerLoader';
import { SelfRatingForm } from 'src/features/Onboarding/SelfRatingForm/SelfRatingForm';
import { useGetJobRoleSkillsQuery } from 'src/services/JobRoles';
import { OnboardingStatusType } from 'src/types/common';
import { templateString } from 'src/utils/common';

import styles from './Onboarding.module.scss';

type SelfRatingProps = {
  updateOnboardingStatus: (status: OnboardingStatusType) => Promise<boolean>;
  jobRoleName: string;
  jobRoleId: string;
};

export function SelfRating({ updateOnboardingStatus, jobRoleId, jobRoleName }: SelfRatingProps) {
  const { t: translate } = useTranslation('welcome');

  const {
    data: employeeJobRolesSkillsData,
    isFetching: employeeJobRolesSkillsFetching,
    isLoading: employeeJobRolesSkillsLoading,
    isError: employeeJobRolesSkillsHasError,
    error: employeeJobRolesSkillsError,
  } = useGetJobRoleSkillsQuery(jobRoleId);

  const jobRoleSkills = useMemo(
    () => employeeJobRolesSkillsData?.data?.attributes?.skills || [],
    [employeeJobRolesSkillsData],
  );

  const [skillProficiencyMap, setSkillProficiencyMap] = useState<SkillProficiencyMapType>({});

  useEffect(() => {
    if (jobRoleSkills.length > 0) {
      const map = {};
      jobRoleSkills.forEach((skill) => {
        map[skill.id] = {
          name: skill.name,
          current_proficiency: skill.self_rated_proficiency,
        };
      });
      setSkillProficiencyMap(map);
    }
  }, [jobRoleSkills]);

  const showPageLoader = employeeJobRolesSkillsFetching || employeeJobRolesSkillsLoading;
  const showPageFallback =
    employeeJobRolesSkillsHasError && (employeeJobRolesSkillsError as any)?.status !== 401;

  if (showPageLoader) {
    return <SpinnerLoader />;
  }

  if (showPageFallback) return <APIErrorFallback />;

  return (
    <div className={`${styles.self_rating_component} hr-flex h-100`}>
      <div className="hr-flex hr-col w-50 hr-p-t-2 h-100">
        <div className={`${styles.heading_container} hr-p-x-2.5 hr-m-b-1.25`}>
          <div className={styles.heading_emoji}>{translate('self_rating.text_01')}</div>
          <div className={styles.heading_text}>
            {templateString(translate('self_rating.text_02'), {
              jobRoleName: jobRoleName || '',
            })}
          </div>
          <div className={styles.heading_text}>{translate('self_rating.text_03')}</div>
        </div>

        <div className="hr-flex hr-grow">
          <SelfRatingForm
            jobRoleId={jobRoleId}
            setSkillProficiencyMap={setSkillProficiencyMap}
            jobRoleSkills={jobRoleSkills}
            updateOnboardingStatus={updateOnboardingStatus}
          />
        </div>
      </div>
      <div
        className={`${styles.graph_container} w-50 h-100 hr-flex hr-justify-center hr-align-center`}
      >
        <EmployeeSkillDistribution
          key={JSON.stringify(skillProficiencyMap)}
          skillProficiencyMap={skillProficiencyMap}
        />
      </div>
    </div>
  );
}
