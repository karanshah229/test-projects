import { HRCell, HRClickableDiv, HRTableRow } from '@hackerrank/hrds-components';
import { useTranslation } from 'next-i18next';

import { OpenNewWindowIcon } from 'ui-icons';

import { APIErrorFallback } from 'src/components/APIErrorFallback/APIErrorFallback';
import { ProficiencyTag } from 'src/components/ProficiencyTag';
import { SkillsList } from 'src/components/SkillsList/SkillsList';
import { SpinnerLoader } from 'src/components/SpinnerLoader/SpinnerLoader';
import { getNewURL } from 'src/features/TalentDirectory/requestParamsReducer';
import { useGetCertificationsInsightsQuery } from 'src/services/Certifications';
import { useGetSkillsInsightsQuery } from 'src/services/Skills';
import { CertificationLeaderDataType } from 'src/types/api/certifications';
import { SkillLeaderDataType } from 'src/types/api/skills';
import { openInNewTab } from 'src/utils/common';

import { LeaderBoard } from './LeaderBoard';
import { CertificationProgressChart } from './ProgressChart/CertificationProgressChart';
import { SkillProgressChart } from './ProgressChart/SkillProgressChart';
import { certificationHeader, skillsHeader } from '../constants';

function SkillTableBody(leaderData: SkillLeaderDataType) {
  const { id, name, proficiency, rating } = leaderData;
  return (
    <HRTableRow key={id}>
      <HRCell>{name}</HRCell>
      <HRCell>
        <ProficiencyTag proficiency={proficiency} />
      </HRCell>
      <HRCell>{rating}</HRCell>

      <HRCell>
        <div className="hr-flex hr-justify-center hr-align-center">
          <HRClickableDiv onClick={() => openInNewTab(`employees/${id}`)}>
            {' '}
            <OpenNewWindowIcon />{' '}
          </HRClickableDiv>
        </div>
      </HRCell>
    </HRTableRow>
  );
}

function CertificationTableBody(leaderData: CertificationLeaderDataType) {
  const {
    id,
    name,
    job_role: { name: designation },
  } = leaderData;
  return (
    <HRTableRow key={id}>
      <HRCell>{name}</HRCell>
      <HRCell> {designation}</HRCell>
      <HRCell>
        <div className="hr-flex hr-justify-center hr-align-center">
          <HRClickableDiv onClick={() => openInNewTab(`employees/${id}`)}>
            {' '}
            <OpenNewWindowIcon />{' '}
          </HRClickableDiv>
        </div>
      </HRCell>
    </HRTableRow>
  );
}

export function CertifiedInsightsSidebar({ id }: { id: string }) {
  const {
    data: certificationInsightsData,
    isFetching: certificationInsightsDataFetching,
    isLoading: certificationInsightsDataLoading,
    isError: certificationInsightsDataHasError,
  } = useGetCertificationsInsightsQuery({ id });
  const { t: translate } = useTranslation('organisationOverview');
  const showLoader = certificationInsightsDataFetching || certificationInsightsDataLoading;
  const showFallback = !certificationInsightsData || certificationInsightsDataHasError;

  if (showLoader) {
    return <SpinnerLoader msg={translate('insights_sidebar.loader')} />;
  }

  if (showFallback) return <APIErrorFallback />;

  const {
    description = '',
    skills = [],
    leaders,
  } = certificationInsightsData?.data?.attributes || {};

  const talentDirectoryURL = { certification_ids: [id] };

  return (
    <div className="hr-flex hr-col">
      <div className="hr-p-b-1.5">
        <p className="hr-body-02">{translate('insights_sidebar.header')}</p>
        <span className="hr-body-01">{description}</span>

        <p className="hr-body-02 hr-m-t-1.5">{translate('insights_sidebar.sub-header')}</p>
        <div
          style={{ gap: 'var(--hr-spacing-03)' }}
          className="hr-flex hr-justify-start hr-align-center"
        >
          <SkillsList skills={skills} />
        </div>
      </div>
      <CertificationProgressChart id={id} />
      <LeaderBoard
        tableHeader={certificationHeader}
        TableBody={CertificationTableBody}
        leaderBoardData={leaders}
        talentDirectoryURL={getNewURL(talentDirectoryURL)}
      />
    </div>
  );
}

export function SkillsInsightsSidebar({ id }: { id: string }) {
  const {
    data: skillInsightsData,
    isFetching: skillInsightsDataFetching,
    isLoading: skillInsightsDataLoading,
    isError: skillInsightsDataHasError,
  } = useGetSkillsInsightsQuery({ id });
  const { t: translate } = useTranslation('organisationOverview');
  const showLoader = skillInsightsDataFetching || skillInsightsDataLoading;
  const showFallback = !skillInsightsData || skillInsightsDataHasError;

  if (showLoader) {
    return <SpinnerLoader msg={translate('insights_sidebar.loader')} />;
  }

  if (showFallback) return <APIErrorFallback />;

  const talentDirectoryURL = {
    skills: [
      {
        id,
        proficiencies: ['prebeginner', 'beginner', 'intermediate', 'expert'],
      },
    ],
  };

  return (
    <div className="hr-flex hr-col">
      <SkillProgressChart id={id} />
      <LeaderBoard
        TableBody={SkillTableBody}
        tableHeader={skillsHeader}
        leaderBoardData={skillInsightsData?.data?.leaders || []}
        talentDirectoryURL={getNewURL(talentDirectoryURL)}
      />
    </div>
  );
}
