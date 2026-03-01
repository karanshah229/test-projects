import { HRCard, HRCardHeader } from '@hackerrank/hrds-components';
import Highcharts from 'highcharts';
import HC_more from 'highcharts/highcharts-more';
import { HighchartsReactProps } from 'highcharts-react-official';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import { APIErrorFallback } from 'src/components/APIErrorFallback/APIErrorFallback';
import { Chart } from 'src/components/Chart/Chart';
import { ImageWithLoader } from 'src/components/ImageWithLoader/ImageWithLoader';
import { CDN_ASSET_FOLDER_PATH, CDN_URL_PREFIX } from 'src/constants/common';
import {
  useGetEmployeeDetailsQuery,
  useGetEmployeeSkillsDetailsQuery,
} from 'src/services/Employees';

if (typeof Highcharts === 'object') {
  HC_more(Highcharts);
}

function EmployeeSkillDistributionFallback() {
  const { t: translate } = useTranslation('employeeSkillProfile');
  return (
    <div className="hr-flex hr-col hr-align-center">
      <ImageWithLoader
        alt={translate('Skill_Distribution_Chart.not_enough_skills_image_alt')}
        width="260"
        height="200"
        src={`${CDN_URL_PREFIX}${CDN_ASSET_FOLDER_PATH.employeeSkillDistribution}/no_skills_chart.svg`}
      />
      <span
        className="hr-m-t-0.75 hr-p-x-2 hr-body-01"
        style={{
          textAlign: 'center',
        }}
      >
        {translate('Skill_Distribution_Chart.not_enough_skills_text')}
      </span>
    </div>
  );
}

function EmployeeSkillDistribution() {
  const { t: translate } = useTranslation('employeeSkillProfile');
  const router = useRouter();

  const { data: employeeData, isError: employeeDetailsHasError } = useGetEmployeeDetailsQuery(
    parseInt(router.query.id.toString(), 10),
  );

  const { data: employeeSkillsDetailsData, isError: employeeSkillDetailsHasError } =
    useGetEmployeeSkillsDetailsQuery(parseInt(router.query.id.toString(), 10));

  if (employeeSkillDetailsHasError) return <APIErrorFallback className="bg-white" />;
  if (employeeDetailsHasError) return <APIErrorFallback className="bg-white" />;

  const skillDatums = employeeSkillsDetailsData?.data || [];

  const employeeName = employeeData?.data?.attributes?.name || '';
  const xAxisCategories = skillDatums.map((skillData) => skillData.attributes.name);
  const seriesData = skillDatums.map((skillData) => skillData.attributes.rating);

  const options: HighchartsReactProps = {
    chart: {
      polar: true,
      height: '85%',
    },
    accessibility: {
      description: `${employeeName} ${translate(
        'Skill_Distribution_Chart.accessibility_description',
      )}`,
    },
    plotOptions: {
      series: {
        states: {
          hover: {
            enabled: false,
          },
        },
      },
    },
    title: {
      text: null,
    },
    xAxis: {
      categories: [...xAxisCategories],
      tickmarkPlacement: 'on',
      lineWidth: 0,
      gridLineColor: 'var(--hr-neutral-10)',
    },
    yAxis: {
      gridLineInterpolation: 'polygon',
      min: 0,
      gridLineDashStyle: 'dash',
      gridLineColor: 'var(--hr-neutral-20)',
      labels: {
        enabled: false,
      },
      tickPositions: [0, 100, 200, 300],
    },
    series: [
      {
        type: 'area',
        name: `${employeeName} ${translate('Skill_Distribution_Chart.series_text')}`,
        data: [...seriesData],
        pointPlacement: 'on',
        color: '#a9c5ef80',
        lineColor: 'var(--hr-blue-20)',
        marker: {
          enabled: false,
          radius: 1,
          states: {
            hover: {
              enabled: false,
            },
          },
        },
      },
    ],
    tooltip: { enabled: false },
    credits: { enabled: false },
    exporting: { enabled: false },
  };

  return (
    <div
      className="polarGrid"
      style={{
        minHeight: '300px',
      }}
    >
      <HRCard renderAs="section" spacing={24}>
        <HRCardHeader
          // @ts-ignore
          title={
            <span className="hr-body-04">
              {translate('Skill_Distribution_Chart.skill_distribution_title')}
            </span>
          }
        />
        {skillDatums?.length <= 2 ? (
          <EmployeeSkillDistributionFallback />
        ) : (
          <Chart options={options} highcharts={Highcharts} />
        )}
      </HRCard>
    </div>
  );
}

export { EmployeeSkillDistribution };
