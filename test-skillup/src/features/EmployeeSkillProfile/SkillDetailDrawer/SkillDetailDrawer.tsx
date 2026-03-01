import { useRouter } from 'next/router';

import { APIErrorFallback } from 'src/components/APIErrorFallback/APIErrorFallback';
import { SpinnerLoader } from 'src/components/SpinnerLoader/SpinnerLoader';
import {
  useGetEmployeeSkillsDetailsQuery,
  useGetIndividualSkillDetailsQuery,
} from 'src/services/Employees';
import {
  EmployeeSkillsType,
  IndividualSkillDetailsType,
  IndividualSkillQueryParameters,
  SkillDatum,
} from 'src/types/api/employees';

import { SkillBadgesEarned } from './SkillBadgesEarned';
import { SkillConcepts } from './SkillConcepts/SkillConcepts';
import styles from './SkillDetailDrawer.module.scss';
import { SkillDetailRating } from './SkillDetailRating';
import { SkillProgressChart } from './SkillProgress/SkillProgressChart';

type DrawerPropType = {
  skillId: string;
};

export function SkillDetailDrawer(props: DrawerPropType) {
  const router = useRouter();
  const { skillId } = props;

  const initialQueryParameters: IndividualSkillQueryParameters = {
    employeeId: parseInt(router.query.id.toString(), 10),
    skillId,
  };

  const {
    data: employeeSkillsDetailsData = {} as EmployeeSkillsType,
    isFetching: employeeSkillsDetailsFetching,
    isLoading: employeeSkillsDetailsLoading,
    isError: employeeSkillsDetailsHasError,
  } = useGetEmployeeSkillsDetailsQuery(parseInt(router.query.id.toString(), 10));

  const skillRatingCutoff = {};
  const employeeSkillsDetails = employeeSkillsDetailsData.data || ({} as SkillDatum[]);
  Object.values(employeeSkillsDetails).forEach((data) => {
    skillRatingCutoff[data.attributes.skill_id] = data.attributes.rating_cutoffs;
  });

  const {
    data: individualSkillDetailsData = {} as IndividualSkillDetailsType,
    isFetching: individualSkillDetailsFetching,
    isLoading: individualSkillDetailsLoading,
    isError: individualSkillDetailsHasError,
  } = useGetIndividualSkillDetailsQuery({ ...initialQueryParameters });

  const showSidebarLoader =
    individualSkillDetailsFetching ||
    individualSkillDetailsLoading ||
    employeeSkillsDetailsFetching ||
    employeeSkillsDetailsLoading;
  const showSidebarFallback =
    individualSkillDetailsHasError ||
    !individualSkillDetailsData ||
    employeeSkillsDetailsHasError ||
    !employeeSkillsDetailsData;

  if (showSidebarLoader) {
    return <SpinnerLoader />;
  }

  if (showSidebarFallback) return <APIErrorFallback />;

  const skillAttributes = individualSkillDetailsData?.data?.attributes;
  const skillRating = skillAttributes?.rating;
  const skillBadges = skillAttributes?.badges;
  const skillConcepts = skillAttributes?.concepts;
  const skillProgress = skillAttributes?.progress;

  return (
    <div className={`hr-flex hr-col ${styles.drawer_container}`}>
      <div className="hr-flex hr-row hr-align-start hr-justify-between">
        <SkillDetailRating skillRating={skillRating} />
        <SkillBadgesEarned skillBadges={skillBadges} />
      </div>

      <SkillProgressChart
        skillProgressData={skillProgress}
        skillRatingCutoffsData={skillRatingCutoff[skillId]}
        initialQueryParameters={initialQueryParameters}
      />
      <SkillConcepts skillConcepts={skillConcepts} />
    </div>
  );
}
