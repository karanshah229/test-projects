import {
  HRCell,
  HRDescriptionCellContent,
  HRDrawerContext,
  HRTable,
  HRTableBody,
  HRTableRow,
} from '@hackerrank/hrds-components';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useContext } from 'react';

import { APIErrorFallback } from 'src/components/APIErrorFallback/APIErrorFallback';
import { DynamicList } from 'src/components/DynamicList/DynamicList';
import { EmptyStateFallback } from 'src/components/EmptyStateFallback/EmptyStateFallback';
import { CDN_URL_PREFIX } from 'src/constants/common';
import {
  useGetEmployeeCertificationsQuery,
  useGetEmployeeDetailsQuery,
} from 'src/services/Employees';
import { EmployeeCertificatonData } from 'src/types/api/employees';
import { DrawerContextType } from 'src/types/common';
import { templateString } from 'src/utils/common';
import { getAbsoluteTime, getRelativeTime } from 'src/utils/date';

import { tableHeader } from '../TableHeader';
import { certificationsTableHeaderText } from '../constants';

function certificationTableContent(
  certificationData: EmployeeCertificatonData,
  openSummaryDrawer: Function,
) {
  const certificationId = certificationData?.id || '';
  const {
    name: certificationName = '',
    issued_at: certificateIssuedAt = '',
    skills = [],
  } = certificationData?.attributes || {};

  const relativeTime = getRelativeTime(certificateIssuedAt || new Date());
  const absoluteTime = getAbsoluteTime(certificateIssuedAt || new Date());

  return (
    <HRTableRow
      key={certificationId}
      // @ts-ignore
      onClick={() => openSummaryDrawer({ certificationId, certificationName })}
    >
      <HRCell>
        <div className="hr-text-capitalize">
          <HRDescriptionCellContent text={relativeTime} description={absoluteTime} />
        </div>
      </HRCell>
      <HRCell>{certificationName}</HRCell>
      <HRCell>
        <DynamicList items={skills.map((skill) => skill?.name)} showTrigger />
      </HRCell>
    </HRTableRow>
  );
}

export function CertificationsTable({ setIsDrawerOpen }: { setIsDrawerOpen: Function }) {
  const router = useRouter();
  const { t: translate } = useTranslation('employeeSkillProfile');
  const { data: employeeCertificationData, isError: employeeSkillsDataHasError } =
    useGetEmployeeCertificationsQuery(parseInt(router.query.id.toString(), 10));

  const { data: employeeData } = useGetEmployeeDetailsQuery(
    parseInt(router.query.id.toString(), 10),
  );
  const employeeName = employeeData?.data?.attributes?.name || '';

  const certificationDatum = employeeCertificationData?.data || [];

  const { openDrawer } = useContext<DrawerContextType>(HRDrawerContext);
  const openSummaryDrawer = ({ certificationId, certificationName }) => {
    setIsDrawerOpen({ certificationId, certificationName, skillId: '', skillName: '' });
    openDrawer();
  };

  if (employeeSkillsDataHasError) return <APIErrorFallback className="bg-white" />;

  if (certificationDatum.length === 0) {
    return (
      <EmptyStateFallback
        textColor="var(--hr-neutral-40)"
        imageSrc={`${CDN_URL_PREFIX}/rocket_icon_disabled.svg`}
        imageHeight={143}
        imageWidth={143}
        height="350px"
        title={translate('fallback_state.header')}
        msg={templateString(translate('fallback_state.sub_header'), {
          employeeName,
        })}
      />
    );
  }

  return (
    <>
      <div className="hr-body-04 hr-m-b-1.5">
        {templateString(translate('certification_table.title_count'), {
          certificationsCount: certificationDatum?.length,
        })}
      </div>
      <HRTable aria-label={translate('certification_table.aria_label')} headerBgColor="white">
        {tableHeader(certificationsTableHeaderText, translate)}
        <HRTableBody>
          {certificationDatum.map((data) => certificationTableContent(data, openSummaryDrawer))}
        </HRTableBody>
      </HRTable>
    </>
  );
}
