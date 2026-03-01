import dayjs from 'dayjs';
import Highcharts from 'highcharts';
import HC_more from 'highcharts/highcharts-more';
import HighchartsReact, { HighchartsReactProps } from 'highcharts-react-official';
import { useTranslation } from 'next-i18next';
import { useReducer } from 'react';
import { renderToString } from 'react-dom/server';

import { APIErrorFallback } from 'src/components/APIErrorFallback/APIErrorFallback';
import { SpinnerLoader } from 'src/components/SpinnerLoader/SpinnerLoader';
import { commonReducer } from 'src/reducers/common';
import { useGetCertificationsInsightsQuery } from 'src/services/Certifications';
import { CertificationsInsightsType } from 'src/types/api/certifications';
import { ProgessDataArgs } from 'src/types/api/skills';

import { DurationFilter } from './DurationFilter';
import { ProgressGraphToolTip } from './ProgressGraphToolTip';

if (typeof Highcharts === 'object') {
  // @ts-ignore
  Highcharts.Series.types.line.prototype.drawLegendSymbol =
    // @ts-ignore
    Highcharts.Series.types.area.prototype.drawLegendSymbol;
  HC_more(Highcharts);
}

function formatXAxisLabel(dateFormat, data) {
  return Highcharts.dateFormat(dateFormat, data?.value);
}

function formatYAxisLabel(data) {
  return data?.value;
}

function customToolTip(data, translate) {
  if (!data) {
    return false;
  }

  const points = data?.points || [];
  return renderToString(
    <ProgressGraphToolTip
      points={points}
      headerLabel={translate('progress_chart.certifications_tooltip_header')}
    />,
  );
}

function CertificationProgressChart({ id = '' }: { id: string }) {
  const { t: translate } = useTranslation('organisationOverview');

  const [queryArgs, updateQueryArgs] = useReducer(commonReducer<ProgessDataArgs>, {
    id,
  });

  const {
    data: certificationInsightsData = {} as CertificationsInsightsType,
    isError: isCertificationInsightsDataHasError,
    isFetching: isCertificationInsightsDataFetching,
    isLoading: isCertificationInsightsDataLoading,
  } = useGetCertificationsInsightsQuery(queryArgs);

  const isLoading = isCertificationInsightsDataFetching || isCertificationInsightsDataLoading;
  if (isCertificationInsightsDataHasError || !certificationInsightsData)
    return <APIErrorFallback />;

  const certified = [];
  const certificationProgressDatum = certificationInsightsData?.data?.attributes?.progress || [];

  certificationProgressDatum.forEach((certifiedData) => {
    const xAxisDate = dayjs(certifiedData.date).valueOf() || dayjs();
    certified.push([xAxisDate, certifiedData?.certified_employees_count]);
  });

  const startDate = queryArgs.from_date
    ? dayjs(queryArgs.from_date).valueOf()
    : dayjs(certificationProgressDatum[0]?.date).valueOf();
  const dateFormat = dayjs(startDate).isBefore(dayjs().subtract(6, 'month')) ? '%m/%y' : '%B';

  const certificationSeriesData = [
    {
      name: 'Certified',
      color: 'var(--sklup-intermediate-color)',
      data: certified,
      pointPlacement: -0.2,
    },
  ];

  const options: HighchartsReactProps = {
    chart: {
      height: '250px',
      type: 'line',
    },
    title: {
      text: null,
    },
    xAxis: {
      type: 'datetime',
      min: startDate,
      // 30 days tick interval on x-axis
      tickInterval: 30 * 24 * 3600 * 1000,
      accessibility: {
        rangeDescription: 'Last three months',
      },
      labels: {
        formatter() {
          return formatXAxisLabel(dateFormat, this);
        },
      },
    },
    plotOptions: {
      line: {
        width: 1,
        connectNulls: true,
      },
      series: {
        marker: {
          enabled: false,
          symbol: 'circle',
        },
      },
    },
    yAxis: {
      title: {
        text: null,
      },
      labels: {
        formatter() {
          return formatYAxisLabel(this);
        },
      },
      allowDecimals: false,
      minTickInterval: 1,
      minorTickInterval: 'auto',
      gridLineDashStyle: 'dash',
      minorGridLineDashStyle: 'dash',
      gridLineColor: 'var(--hr-neutral-40)',
      minorGridLineColor: 'var(--hr-neutral-15)',
    },
    tooltip: {
      xDateFormat: '%Y-%m-%d',
      shared: true,
      useHTML: true,
      shape: 'square',
      followPointer: true,
      formatter() {
        return customToolTip(this, translate);
      },
      padding: 0,
      hideDelay: 1.5,
    },
    legend: {
      enabled: false,
      marker: { enabled: false },
    },
    series: certificationSeriesData,
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 600,
          },
        },
      ],
    },
    credits: { enabled: false },
    exporting: { enabled: false },
  };

  return (
    <div className="hr-m-b-4">
      <div className="hr-flex hr-row hr-justify-between hr-align-center hr-py-1.25 hr-mb-2">
        <div className="hr-body-02">{translate('progress_chart.certifications_header')}</div>
        <DurationFilter updateQueryArgs={updateQueryArgs} />
      </div>
      <div
        className="hr-p-t-2 disableLegendInteraction center-x-legend"
        style={{ height: '250px' }}
      >
        {isLoading ? (
          <SpinnerLoader />
        ) : (
          <HighchartsReact key={id} highcharts={Highcharts} options={options} />
        )}
      </div>
    </div>
  );
}

export { CertificationProgressChart };
