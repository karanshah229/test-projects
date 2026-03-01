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
import { useGetSkillsInsightsQuery } from 'src/services/Skills';
import { ProgessDataArgs, SkillsInsightsType } from 'src/types/api/skills';

import { DataLabel } from './DataLabel';
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

function customDataLabel(data) {
  if (!data) {
    return false;
  }
  const lastVal = data?.yData && data.yData.length > 0 ? data.yData[data.yData.length - 1] : 0;
  return renderToString(<DataLabel name={data?.name} lastVal={lastVal} />);
}

function customToolTip(data, translate) {
  if (!data) {
    return false;
  }
  const points = data?.points || [];
  return renderToString(
    <ProgressGraphToolTip
      points={points}
      headerLabel={translate('progress_chart.skills_tooltip_header')}
    />,
  );
}

export function SkillProgressChart({ id = '' }: { id: string }) {
  const { t: translate } = useTranslation('organisationOverview');

  const [queryArgs, updateQueryArgs] = useReducer(commonReducer<ProgessDataArgs>, {
    id,
  });

  const {
    data: skillInsightsData = {} as SkillsInsightsType,
    isError: isSkillInsightsDataHasError,
    isFetching: isSkillInsightsDataFetching,
    isLoading: isSkillInsightsDataLoading,
  } = useGetSkillsInsightsQuery(queryArgs);

  const isSkillDataLoading = isSkillInsightsDataFetching || isSkillInsightsDataLoading;
  if (isSkillInsightsDataHasError || !skillInsightsData) return <APIErrorFallback />;

  const prebeginner = [];
  const beginner = [];
  const intermediate = [];
  const expert = [];
  const skillProgressDatum = skillInsightsData?.data?.progress || [];

  skillProgressDatum.forEach((skillProgressData) => {
    const xAxisDate = dayjs(skillProgressData.date).valueOf() || dayjs();
    prebeginner.push([xAxisDate, skillProgressData?.proficiencies_count?.prebeginner]);
    beginner.push([xAxisDate, skillProgressData?.proficiencies_count?.beginner]);
    intermediate.push([xAxisDate, skillProgressData?.proficiencies_count?.intermediate]);
    expert.push([xAxisDate, skillProgressData?.proficiencies_count?.expert]);
  });

  const startDate = queryArgs.from_date
    ? dayjs(queryArgs.from_date).valueOf()
    : dayjs(skillProgressDatum[0]?.date).valueOf();
  const dateFormat = dayjs(startDate).isBefore(dayjs().subtract(6, 'month')) ? '%m/%y' : '%B';

  const skillSeriesData = [
    {
      name: 'Pre-beginners',
      color: 'var(--sklup-prebeginner-color)',
      data: prebeginner,
      pointPlacement: -0.2,
    },
    {
      name: 'Beginners',
      color: 'var(--sklup-beginner-color)',
      data: beginner,
      pointPlacement: 0,
    },
    {
      name: 'Intermediates',
      color: 'var(--sklup-intermediate-color)',
      data: intermediate,
      pointPlacement: 0.5,
    },
    {
      name: 'Experts',
      color: 'var(--sklup-expert-color)',
      data: expert,
      pointPlacement: 0.2,
    },
  ];

  const options: HighchartsReactProps = {
    chart: {
      height: '400px',
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
      layout: 'horizontal',
      verticalAlign: 'top',
      align: 'center',
      x: -20,
      width: '100%',
      useHTML: true,
      itemMarginRight: 0,
      itemMarginLeft: 0,
      itemMarginBottom: 24,
      itemMarginTop: 24,
      itemStyle: {
        fontSize: '12px',
        lineHeight: '16px',
        textOutline: 'none',
        fontWeight: 'normal',
      },
      marker: { enabled: false },
      formatter() {
        return customDataLabel(this);
      },
    },
    series: skillSeriesData,
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
    <div className="hr-m-b-1.5 hr-m-t-1">
      <div className="hr-flex hr-row hr-justify-between hr-align-center hr-py-1.25 hr-mb-2">
        <div className="hr-body-02">{translate('progress_chart.skills_header')}</div>
        <DurationFilter updateQueryArgs={updateQueryArgs} />
      </div>
      <div className="disableLegendInteraction center-x-legend" style={{ height: '400px' }}>
        {isSkillDataLoading ? (
          <SpinnerLoader />
        ) : (
          <HighchartsReact key={id} highcharts={Highcharts} options={options} />
        )}
      </div>
    </div>
  );
}
