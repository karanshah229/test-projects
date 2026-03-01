import { HRDrawer, HRDrawerContext } from '@hackerrank/hrds-components';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useContext, useReducer } from 'react';

import { APIErrorFallback } from 'src/components/APIErrorFallback/APIErrorFallback';
import {
  useGetEmployeeDetailsQuery,
  useGetEmployeeSkillsDetailsQuery,
} from 'src/services/Employees';
import { DrawerContextType } from 'src/types/common';
import { templateString } from 'src/utils/common';

import { AssessmentHistory } from './AssessmentHistory';
import { Badges } from './Badges/Badges';
import { CertificationSummaryDrawer } from './CertificationSummaryDrawer/CertificationSummaryDrawer';
import { CertificationsTable } from './CertificationsTable/CertificationsTable';
import { EmployeeSkillDistribution } from './EmployeeSkillDistribution/EmployeeSkillDistribution';
import { SkillDetailDrawer } from './SkillDetailDrawer/SkillDetailDrawer';
import { SkillsTable } from './SkillsTable/SkillsTable';

function EmployeeDetails() {
  const router = useRouter();

  const { data: employeeData } = useGetEmployeeDetailsQuery(
    parseInt(router.query.id.toString(), 10),
  );
  const employeeName = employeeData?.data?.attributes?.name || '';
  const employeeEmail = employeeData?.data?.attributes?.email || '';
  const employeeDesignation = employeeData?.data?.attributes?.job_role?.name || '';

  return (
    <div className="bg-white">
      <div className="hr-grid-container">
        <div className="hr-grid-row">
          <div className="hr-grid-col-12 hr-flex hr-justify-between hr-p-y-1">
            <div>
              <span className="hr-heading-04">{employeeName}</span>
              <span className="hr-m-l-0.75" style={{ color: 'var(--hr-neutral-40)' }}>
                {employeeDesignation}
              </span>
            </div>
            <div className="hr-body-03">{employeeEmail}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InsightsDrawer({ drawerState }: { drawerState: any }) {
  const { t: translate } = useTranslation('employeeSkillProfile');
  const { isOpen } = useContext<DrawerContextType>(HRDrawerContext);
  const title = drawerState.skillId
    ? templateString(translate('IndividualSkillDetails.header'), {
        skillName: drawerState.skillName,
      })
    : drawerState.certificationName;
  return (
    <HRDrawer.Root title={title} isOpen={isOpen} size="lg">
      <HRDrawer.Body>
        {drawerState.skillId ? (
          <SkillDetailDrawer skillId={drawerState.skillId} />
        ) : (
          <CertificationSummaryDrawer certificationId={drawerState.certificationId} />
        )}
      </HRDrawer.Body>
    </HRDrawer.Root>
  );
}

type DrawerState = {
  skillId: string;
  skillName: string;
  certificationId: string;
  certifictionName: string;
};

function IndividualSkillProfile() {
  const initialDrawerState: DrawerState = {
    skillId: '',
    skillName: '',
    certificationId: '',
    certifictionName: '',
  };
  const [drawerState, setIsDrawerOpen] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialDrawerState,
  );
  const router = useRouter();
  const { data: employeeSkillsDetailsData, isError: employeeSkillsDataHasError } =
    useGetEmployeeSkillsDetailsQuery(parseInt(router.query.id.toString(), 10));
  const { t: translate } = useTranslation('employeeSkillProfile');
  const skillsCount = employeeSkillsDetailsData?.data?.length || 0;

  if (employeeSkillsDataHasError) return <APIErrorFallback className="hr-p-t-6" />;

  return (
    <main className="hr-grow hr-grid-container w-100 hr-m-y-2">
      <InsightsDrawer drawerState={drawerState} />
      <section className="hr-grid-row">
        <div className="hr-grid-col-12">
          <CertificationsTable setIsDrawerOpen={setIsDrawerOpen} />
        </div>

        <div className="hr-grid-col-12 hr-body-04 hr-m-b-1.25 hr-m-t-2">
          {templateString(translate('skills_count'), {
            skillsCount,
          })}
        </div>

        <div className="hr-grid-col-4">
          <EmployeeSkillDistribution />
          <div className="hr-m-t-1.5">
            <Badges />
          </div>
        </div>
        <div className="hr-grid-col-8">
          <SkillsTable setIsDrawerOpen={setIsDrawerOpen} />
          <div className="hr-m-t-1.5">
            <AssessmentHistory />
          </div>
        </div>
      </section>
    </main>
  );
}

export { IndividualSkillProfile, EmployeeDetails };
