import { HRCell, HRDrawerContext, HRTableRow } from '@hackerrank/hrds-components';
import { useTranslation } from 'next-i18next';
import { useContext } from 'react';

import { APIErrorFallback } from 'src/components/APIErrorFallback/APIErrorFallback';
import { EmptyStateFallback } from 'src/components/EmptyStateFallback/EmptyStateFallback';
import { SpinnerLoader } from 'src/components/SpinnerLoader/SpinnerLoader';
import { CDN_URL_PREFIX } from 'src/constants/common';
import { useGetCertificationsOverviewQuery } from 'src/services/Certifications';
import { CertificationsDataType } from 'src/types/api/certifications';
import { DrawerContextType } from 'src/types/common';

import { OverviewChart } from '../OverviewChart/OverviewChart';
import { OverviewTable } from '../OverviewTable';
import { OVERVIEW_TAB_DATA, certificationsTranslatedHeaders } from '../constants';
import { CertificationGraphData, ChartDataType, HeaderDataType } from '../types';
import { getProgress } from '../utils/utils';

// Segregates certification data into three different arrays based on progress change.
const filterCertificationData = (certificationsDatum: CertificationsDataType[]) => {
  const certificationsWithPositiveGrowth: CertificationGraphData[] = [];
  const certificationsWithNegativeGrowth: CertificationGraphData[] = [];
  const certificationsWithConstantGrowth: CertificationGraphData[] = [];

  certificationsDatum.forEach((certificationData: CertificationsDataType) => {
    const changePercentage = certificationData.change_percentage || 0;
    if (certificationData.certifications_count > 0) {
      const filteredObj = {
        name: certificationData.name,
        value: certificationData.certifications_count,
        overall_change_percentage: certificationData.change_percentage,
      };

      if (getProgress('positive', changePercentage)) {
        certificationsWithPositiveGrowth.push(filteredObj);
      } else if (getProgress('negative', changePercentage)) {
        certificationsWithNegativeGrowth.push(filteredObj);
      } else if (getProgress('constant', changePercentage)) {
        certificationsWithConstantGrowth.push(filteredObj);
      }
    }
  });

  return {
    certificationsWithPositiveGrowth,
    certificationsWithNegativeGrowth,
    certificationsWithConstantGrowth,
  };
};

function tableBody(rowData: CertificationsDataType, handleOnClick: Function) {
  const {
    id,
    name,
    assessed_employees_count: assessedEmployeesCount = 0,
    certifications_count: certificationsCount = 0,
  } = rowData;

  return (
    <HRTableRow
      key={id}
      // @ts-ignore
      onClick={() => handleOnClick({ id, name, tab: OVERVIEW_TAB_DATA[0] })}
    >
      <HRCell>{name}</HRCell>
      <HRCell>{assessedEmployeesCount}</HRCell>
      <HRCell>{certificationsCount}</HRCell>
    </HRTableRow>
  );
}

export function CertificationsTab({ setIsDrawerOpen }: { setIsDrawerOpen: Function }) {
  const { t: translate } = useTranslation('organisationOverview');

  const {
    data: certificationsOverviewData,
    isFetching: certificationsOverviewFetching,
    isLoading: certificationsOverviewLoading,
    isError: certificationsOverviewHasError,
  } = useGetCertificationsOverviewQuery({});

  const { openDrawer } = useContext<DrawerContextType>(HRDrawerContext);

  const showLoader = certificationsOverviewFetching || certificationsOverviewLoading;
  const showFallback = !certificationsOverviewData || certificationsOverviewHasError;

  if (showLoader) {
    return <SpinnerLoader msg={translate('insights_sidebar.loader')} />;
  }

  if (showFallback) return <APIErrorFallback />;

  const certificationDatum = certificationsOverviewData?.data?.certifications || [];
  const certificationsCount = certificationsOverviewData?.data?.certifications_count || 0;
  const certifiedEmployeesCount = certificationsOverviewData?.data?.certified_employees_count || 0;

  const {
    certificationsWithPositiveGrowth,
    certificationsWithNegativeGrowth,
    certificationsWithConstantGrowth,
  } = filterCertificationData(certificationDatum);

  const chartData: ChartDataType[] = [
    {
      name: 'Increased',
      color: 'var(--sklup-chart-positive-color)',
      data: certificationsWithPositiveGrowth,
      fillOpacity: 1,
    },
    {
      name: 'Declined',
      color: 'var(--sklup-chart-negative-color)',
      data: certificationsWithNegativeGrowth,
      fillOpacity: 1,
    },
    {
      name: 'Constant',
      color: 'var(--sklup-chart-neutral-color)',
      data: certificationsWithConstantGrowth,
      fillOpacity: 1,
    },
  ];

  const headerData: HeaderDataType = {
    employeeCount: certifiedEmployeesCount,
    employeeCountLabel: translate('bubble_chart.certified_employees'),
    countValue: certificationsCount,
    countValueLabel: translate('bubble_chart.certifications'),
    widget: null,
    tooltipHeaderLabel: translate('bubble_chart.certified_employees'),
  };

  const handleOnClick = ({ id, name, currentTab }) => {
    setIsDrawerOpen({ id, name, currentTab });
    openDrawer();
  };

  if (certifiedEmployeesCount === 0)
    return (
      <EmptyStateFallback
        height="650px"
        title={translate('fallback_state.certifications.header')}
        msg={translate('fallback_state.certifications.sub_header')}
        imageSrc={`${CDN_URL_PREFIX}/rocket_icon.svg`}
        imageHeight={274}
        imageWidth={274}
        ctaBtnText={translate('fallback_state.btn_text')}
        ctaBtnUrl="/employees"
      />
    );

  return (
    <>
      <OverviewChart
        headerData={headerData}
        chartData={chartData}
        itemsCount={certifiedEmployeesCount}
        chartFallbackText={translate('fallback_state.certifications.header')}
      />
      <OverviewTable
        handleOnClick={handleOnClick}
        tableBody={tableBody}
        headerText={certificationsTranslatedHeaders}
        overviewData={certificationsOverviewData?.data?.certifications}
      />
    </>
  );
}
