import Highcharts from 'highcharts';
import HC_more from 'highcharts/highcharts-more';
import HighchartsReact, { HighchartsReactProps } from 'highcharts-react-official';
import { useTranslation } from 'next-i18next';
import { renderToString } from 'react-dom/server';

import { EmptyStateFallback } from 'src/components/EmptyStateFallback/EmptyStateFallback';

import styles from './OverviewChart.module.scss';
import { OverviewToolTip } from './OverviewToolTip';
import { ChartDataType, HeaderDataType } from '../types';
import { getChartConfig } from '../utils/utils';

if (typeof Highcharts === 'object') {
  HC_more(Highcharts);
}

function legendLabelFormatter(data, translate: Function) {
  if (data?.name === 'Constant') return translate('bubble_chart.labels.constant');
  return `${data?.name} ${translate('bubble_chart.labels.last_three_months')}`;
}

function customTooltip(data, tooltipHeaderLabel, translate: Function) {
  if (!data) {
    return false;
  }
  return renderToString(
    <OverviewToolTip
      totalCount={data.total ? data?.total : data?.y}
      hasSubElements={data.total >= 0}
      overallChangePercentage={data?.point?.overall_change_percentage}
      proficiencyData={data?.point?.proficiencies}
      headerLabel={tooltipHeaderLabel}
      translate={translate}
    />,
  );
}

export function OverviewChart({
  itemsCount = 0,
  chartData = [],
  headerData = {} as HeaderDataType,
  chartFallbackText = '',
}: {
  itemsCount: number;
  chartData: ChartDataType[];
  headerData: HeaderDataType;
  chartFallbackText: string;
}) {
  const { t: translate } = useTranslation('organisationOverview');
  const {
    employeeCount = 0,
    employeeCountLabel = 0,
    countValue = 0,
    countValueLabel = 0,
    widget = null,
    tooltipHeaderLabel = '',
  } = headerData;
  const chartConfig = getChartConfig(itemsCount);
  const options: HighchartsReactProps = {
    chart: {
      type: 'packedbubble',
      height: 400,
      spacingLeft: 24,
      spacingRight: 24,
      paddingTop: 24,
      paddingBottom: 76,
    },
    accessibility: {
      description: `${translate('bubble_chart.description')}`,
    },
    tooltip: {
      xDateFormat: '%Y-%m-%d',
      shared: false,
      useHTML: true,
      shape: 'square',
      followPointer: false,
      outside: false,
      shadow: false,
      formatter() {
        return customTooltip(this, tooltipHeaderLabel, translate);
      },
      padding: 0,
      hideDelay: 1.5,
    },
    plotOptions: {
      packedbubble: {
        draggable: false,
        minSize: chartConfig.minSize,
        maxSize: chartConfig.maxSize,
        zMin: 0,
        zMax: 1000,
        opacity: 1,
        fillOpacity: 1,
        dataLabels: {
          enabled: true,
          useHTML: true,
          allowOverlap: false,
          format: '{point.name}',
          style: {
            textOverflow: 'visible',
            whiteSpace: 'normal',
            width: '90%',
            color: 'black',
            textOutline: 'none',
            fontWeight: 'normal',
            textAlign: 'center',
          },
        },
        marker: {
          fillOpacity: 1,
          states: {
            hover: {
              lineWidth: 1,
              lineColor: 'var(--hr-neutral-90)',
            },
          },
        },
        layoutAlgorithm: {
          splitSeries: false,
          seriesInteraction: true,
          dragBetweenSeries: false,
          parentNodeLimit: true,
          enableSimulation: false,
          bubblePadding: chartConfig.padding,
        },
      },
    },
    title: {
      text: null,
    },
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom',
      opacity: 1,
      fillOpacity: 1,
      itemMarginTop: 36,
      labelFormatter() {
        return legendLabelFormatter(this, translate);
      },
      itemStyle: {
        opacity: 1,
        fontSize: '12px',
        lineHeight: '16px',
        textOutline: 'none',
        fontWeight: 'normal',
      },
      itemHoverStyle: {
        color: null,
      },
    },
    series: chartData,
    credits: { enabled: false },
    exporting: { enabled: false },
  };

  return (
    <section className={`${styles.chartContainer} bg-white hr-m-b-1.5`}>
      <div className="hr-flex hr-justify-between hr-align-center hr-p-1.25">
        <div className="hr-flex" style={{ gap: 'var(--hr-spacing-05)' }}>
          <div>
            <div className="hr-body-04">{employeeCount}</div>
            <div className="hr-utility-01">{employeeCountLabel}</div>
          </div>
          <div>
            <div className="hr-body-04">{countValue}</div>
            <div className="hr-utility-01">{countValueLabel}</div>
          </div>
        </div>
        <div>{widget}</div>
      </div>
      {itemsCount === 0 ? (
        <EmptyStateFallback height="400px" msg={chartFallbackText} />
      ) : (
        <div className="centered-highcharts-data-label disableLegendInteraction">
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
      )}
    </section>
  );
}
