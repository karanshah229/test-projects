import { HRButton } from '@hackerrank/hrds-components';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import { OpenNewWindowIcon } from 'ui-icons';

import { APIErrorFallback } from 'src/components/APIErrorFallback/APIErrorFallback';
import { SkillsList } from 'src/components/SkillsList/SkillsList';
import { SpinnerLoader } from 'src/components/SpinnerLoader/SpinnerLoader';
import { useGetEmployeeCertificationsQuery } from 'src/services/Employees';
import { openInNewTab } from 'src/utils/common';

export function CertificationSummaryDrawer({ certificationId }: { certificationId: string }) {
  const router = useRouter();
  const { t: translate } = useTranslation('employeeSkillProfile');
  const {
    data: employeeCertificationDatum,
    isFetching: employeeCertificationFetching,
    isLoading: employeeCertificationLoading,
    isError: employeeCertificationHasError,
  } = useGetEmployeeCertificationsQuery(parseInt(router.query.id.toString(), 10));

  const employeeCertificationData = employeeCertificationDatum?.data?.find(
    (item) => item.id === certificationId,
  );
  const showSidebarLoader = employeeCertificationFetching || employeeCertificationLoading;

  const showSidebarFallback = employeeCertificationHasError || !employeeCertificationData;

  if (showSidebarLoader) {
    return <SpinnerLoader />;
  }

  if (showSidebarFallback) return <APIErrorFallback />;

  const {
    description = '',
    skills = [],
    report_url: reportUrl = '',
  } = employeeCertificationData?.attributes || {};
  const isReportBtnDisabled = reportUrl?.length === 0;

  return (
    <div className="hr-flex hr-col hr-align-start hr-justify-between">
      <div className="hr-p-b-1.5">
        <p className="hr-body-02">{translate('certification_insights.description')}</p>
        <span className="hr-body-01">{description}</span>

        <p className="hr-body-02 hr-m-t-1.5">{translate('certification_insights.skills')}</p>

        <SkillsList skills={skills} />

        <HRButton
          aria-label="Detailed Reports Trigger Button"
          endIcon={<OpenNewWindowIcon />}
          size="medium"
          isDisabled={isReportBtnDisabled}
          onClick={() => openInNewTab(reportUrl)}
          variant="primary"
        >
          {translate('certification_insights.btn_text')}
        </HRButton>
      </div>
    </div>
  );
}
