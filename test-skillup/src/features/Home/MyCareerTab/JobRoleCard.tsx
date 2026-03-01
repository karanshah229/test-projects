import { HRAnchor } from '@hackerrank/hrds-components';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';

import { APIErrorFallback } from 'src/components/APIErrorFallback/APIErrorFallback';
import { CertificationCard, CertificationCardType } from 'src/components/CertificationCard';
import { SkillProficiencyMapType } from 'src/components/EmployeeSkillDistribution/types';
import { OverlayLoader } from 'src/components/OverlayLoader/OverlayLoader';
import { SkillCard } from 'src/components/SkillProgressCard';
import { CDN_URL_PREFIX } from 'src/constants/common';
import { useGetEmployeeJobRolesDetailsQuery } from 'src/services/JobRoles';
import { JobRoleDatum, JobRoleSkillType, JobRolesType } from 'src/types/api/job_roles';
import { sortObjectsByStringProperty, templateString } from 'src/utils/common';

import { JobRoleCardMenu } from './JobRoleCardMenu/JobRoleCardMenu';
import styles from './MyCareerTab.module.scss';
import { EmployeeSkillDistribution } from '../../../components/EmployeeSkillDistribution/EmployeeSkillDistribution';

export function JobRoleCard({
  cardIndex = 0,
  setStartSlideIndex,
}: {
  cardIndex: number;
  setStartSlideIndex: Function;
}) {
  const { t: translate } = useTranslation('home');

  const [viewAllClicked, setViewAllClicked] = useState(false);

  const skillProficiencyMap: SkillProficiencyMapType = {};

  const {
    data: employeeJobRolesDetails = {} as JobRolesType,
    isFetching: employeeJobRolesDetailsFetching,
    isLoading: employeeJobRolesDetailsLoading,
    isError: employeeJobRolesDetailsHasError,
  } = useGetEmployeeJobRolesDetailsQuery();

  const showLoader = employeeJobRolesDetailsFetching || employeeJobRolesDetailsLoading;
  const showFallback = !employeeJobRolesDetails && employeeJobRolesDetailsHasError;

  const [showCardLoader, setShowCardLoader] = useState(showLoader);

  useEffect(() => {
    setShowCardLoader(showLoader);
  }, [showLoader]);

  if (showFallback) return <APIErrorFallback />;

  const jobRoleData: JobRoleDatum = employeeJobRolesDetails.data[cardIndex];
  const jobRoleSkills: JobRoleSkillType[] = jobRoleData.attributes?.skills || [];

  const jobRolesSkillsSorted = [...jobRoleSkills].sort((skill1, skill2) =>
    sortObjectsByStringProperty(skill1, skill2, 'name'),
  );

  jobRolesSkillsSorted.forEach((skill) => {
    skillProficiencyMap[skill.id] = {
      id: skill.id,
      name: skill.name,
      target_proficiency: skill.required_proficiency,
      current_proficiency: skill.verified_proficiency || skill.self_rated_proficiency,
      proficiency_progress_percentage: skill.proficiency_progress_percentage,
    };
  });

  const showViewAllBtn = jobRolesSkillsSorted.length > 4 && !viewAllClicked;
  const showAllSkillsBtn = jobRolesSkillsSorted.length > 4 && viewAllClicked;

  const certificationCardData: CertificationCardType = {
    ...jobRoleData.attributes.certification,
    skills: jobRoleSkills,
  };
  const jobRoleName = employeeJobRolesDetails.data[cardIndex].attributes.name;
  const showDefaultVisibleSkills = !viewAllClicked && jobRolesSkillsSorted?.length > 0;
  const defaultVisibleJobRoleSkills = Object.values(jobRolesSkillsSorted).slice(0, 4);

  const renderedSkills: JobRoleSkillType[] = showDefaultVisibleSkills
    ? defaultVisibleJobRoleSkills
    : jobRolesSkillsSorted;

  const backgroundImageURL = `url("${CDN_URL_PREFIX}/noiseEffect2.png")`;

  return (
    <OverlayLoader showLoader={showCardLoader} className={styles.job_role_card__loader}>
      <div key={cardIndex} className={`hr-flex  ${styles.job_role_card}`}>
        <div
          className={`w-50 ${styles.job_role_card__leftSection}`}
          style={{
            backgroundImage: backgroundImageURL,
            backgroundSize: 'cover',
            backgroundColor: '#F7F9FD',
          }}
        >
          <div className={`hr-flex hr-justify-center ${styles.job_role_card__next_goal_text}`}>
            {translate('job_role_card.next_goal')}
          </div>
          <div className={`hr-m-t-0.25 ${styles.job_role_card__role_title_text}`}>
            {templateString(translate('job_role_card.role_name'), {
              jobRoleName,
            })}
          </div>
          <div>
            <EmployeeSkillDistribution
              key={JSON.stringify(skillProficiencyMap)}
              skillProficiencyMap={skillProficiencyMap}
              showLegend
              showToolTip
            />
          </div>

          <div className={`hr-m-l-0.75 hr-m-b-1 ${styles.job_role_card__menu}`}>
            <JobRoleCardMenu
              jobRoleId={jobRoleData.id}
              cardIndex={cardIndex}
              jobRoleName={jobRoleName}
              setShowCardLoader={setShowCardLoader}
              setStartSlideIndex={setStartSlideIndex}
            />
          </div>
        </div>

        <div className={`w-50 ${styles.job_role_card__rightSection}`}>
          <div className={`${styles.job_role_card__typography} skds-grid-gap-9 hr-p-b-0.875`}>
            {translate('job_role_card.learning_progress')}
            <div className="hr-grid-row hr-row-gap-1 hr-p-t-1.25 hr-p-b-1.5">
              {renderedSkills?.length > 0
                ? renderedSkills.map((skill: JobRoleSkillType) => {
                    const skillCardProps = { data: { ...skill }, showFooter: false };
                    return (
                      <div key={skill.id} className="hr-grid-col-6">
                        <SkillCard key={skill.id} {...skillCardProps} />
                      </div>
                    );
                  })
                : null}
            </div>
            <HRAnchor
              underline="none"
              variant="medium"
              onClick={(e) => {
                e.preventDefault();
                setViewAllClicked(!viewAllClicked);
              }}
              className={styles.job_role_card__expand_skills_btn}
            >
              {showViewAllBtn ? translate('job_role_card.view_all_skill_cards') : null}
              {showAllSkillsBtn ? translate('job_role_card.collapse_skill_cards') : null}
            </HRAnchor>
          </div>

          <div className="hr-p-t-1.25 hr-grid-row ">
            <div className={`${styles.job_role_card__typography} hr-p-t-0.25`}>
              {translate('job_role_card.earn_certification')}
            </div>
            <div className="hr-grid-col-12 hr-p-t-0.75">
              <CertificationCard data={certificationCardData} showFooter={false} />
            </div>
          </div>
        </div>
      </div>
    </OverlayLoader>
  );
}
