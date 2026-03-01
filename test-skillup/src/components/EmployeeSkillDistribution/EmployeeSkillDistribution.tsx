import Highcharts from 'highcharts';
import HC_more from 'highcharts/highcharts-more';
import { HighchartsReactProps } from 'highcharts-react-official';
import { useTranslation } from 'next-i18next';
import { renderToString } from 'react-dom/server';

import { Chart } from 'src/components/Chart/Chart';
import { ImageWithLoader } from 'src/components/ImageWithLoader/ImageWithLoader';
import { CDN_ASSET_FOLDER_PATH, CDN_URL_PREFIX, PROFICIENCIES } from 'src/constants/common';

import { SkillDistributionToolTip } from './SkillDistributionToolTip';
import { CHART_OPTIONS, SkillProficiencySeriesDataMap } from './constant';
import { PointDataType, SeriesDataType, SkillProficiencyMapType } from './types';

type EmployeeSkillDistributionProps = {
  skillProficiencyMap: SkillProficiencyMapType;
  showToolTip?: boolean;
  showLegend?: boolean;
};

if (typeof Highcharts === 'object') {
  HC_more(Highcharts);
}

function EmployeeSkillDistributionFallback() {
  const { t: translate } = useTranslation('components/employeeSkillDistributionChart');

  return (
    <div className="hr-flex hr-col hr-align-center">
      <ImageWithLoader
        alt={translate('fallback.not_enough_skills_image_alt')}
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
        {translate('fallback.not_enough_skills_text')}
      </span>
    </div>
  );
}

function EmployeeSkillDistribution({
  skillProficiencyMap = {},
  showLegend = false,
  showToolTip = false,
}: EmployeeSkillDistributionProps) {
  const { t: translate } = useTranslation('components/employeeSkillDistributionChart');

  const {
    CHART_BACKGROUND_COLOR,
    LEGEND,
    SERIES: { TARGET_PROFICIENCY, CURRENT_PROFICIENCY },
    X_AXIS,
    Y_AXIS,
  } = CHART_OPTIONS;

  const skillNames: string[] = Object.values(skillProficiencyMap).map((skill) => skill.name);

  const currentProficiencies: number[] = Object.keys(skillProficiencyMap).reduce((acc, id) => {
    if (Object.prototype.hasOwnProperty.call(skillProficiencyMap[id], 'current_proficiency')) {
      acc.push(
        SkillProficiencySeriesDataMap[
          skillProficiencyMap[id].current_proficiency || PROFICIENCIES.prebeginner
        ],
      );
    }
    return acc;
  }, []);

  const targetProficiencies: number[] = Object.keys(skillProficiencyMap).reduce((acc, id) => {
    if (Object.prototype.hasOwnProperty.call(skillProficiencyMap[id], 'target_proficiency')) {
      acc.push(
        SkillProficiencySeriesDataMap[
          skillProficiencyMap[id].target_proficiency || PROFICIENCIES.prebeginner
        ],
      );
    }
    return acc;
  }, []);

  const showCurrentProficiencies = Object.keys(currentProficiencies).length !== 0;
  const showTargetProficiencies = Object.keys(targetProficiencies).length !== 0;
  const showFallback = Object.keys(skillNames).length <= 2;

  const skillNameAndProgressMap = Object.keys(skillProficiencyMap).reduce((acc, id) => {
    acc[skillProficiencyMap[id].name] = skillProficiencyMap[id].proficiency_progress_percentage;
    return acc;
  }, {});

  const seriesData: SeriesDataType[] = [
    ...(showTargetProficiencies
      ? [
          {
            type: TARGET_PROFICIENCY.TYPE,
            name: translate('series.target_proficiency_title'),
            data: [...targetProficiencies],
            pointPlacement: 'on',
            color: TARGET_PROFICIENCY.COLOR,
            lineColor: TARGET_PROFICIENCY.LINE_COLOR,
            marker: TARGET_PROFICIENCY.MARKER,
          },
        ]
      : []),
    ...(showCurrentProficiencies
      ? [
          {
            type: CURRENT_PROFICIENCY.TYPE,
            name: translate('series.current_proficiency_title'),
            data: [...currentProficiencies],
            pointPlacement: 'off',
            color: CURRENT_PROFICIENCY.COLOR,
            lineColor: CURRENT_PROFICIENCY.LINE_COLOR,
            marker: CURRENT_PROFICIENCY.MARKER,
          },
        ]
      : []),
  ];

  const customToolTip = (data) => {
    if (!data) {
      return false;
    }
    let pointsList: PointDataType[] = data?.points || [];
    if (pointsList.length === 0) {
      pointsList = [
        {
          x: data?.x,
          y: data?.y,
          color: data?.color,
          series: {
            name:
              data?.color === TARGET_PROFICIENCY.COLOR
                ? translate('series.target_proficiency_title')
                : translate('series.current_proficiency_title'),
          },
        },
      ];
    }

    return renderToString(
      <SkillDistributionToolTip
        points={pointsList}
        skillName={data.x}
        skillNameAndProgressMap={skillNameAndProgressMap}
        seriesData={seriesData}
        skillNames={[...skillNames]}
      />,
    );
  };

  const options: HighchartsReactProps = {
    chart: {
      polar: true,
      style: {
        fontFamily: 'var(--hr-font-family-text)',
      },
      backgroundColor: CHART_BACKGROUND_COLOR,
    },
    accessibility: {
      description: translate('accessibility_description'),
    },
    plotOptions: {
      series: {
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: showToolTip,
            },
          },
        },
        events: {
          legendItemClick: () => false,
        },
        fillOpacity: 0.4,
        animation: false,
      },
      area: {
        states: {
          inactive: {
            enabled: false,
          },
        },
      },
    },
    pane: {
      size: '65%',
    },
    title: {
      text: null,
    },
    xAxis: {
      categories: [...skillNames, 'Rest API'],
      tickmarkPlacement: 'on',
      lineWidth: 0,
      gridLineColor: X_AXIS.GRID_LINE_COLOR,
      labels: {
        style: {
          fontSize: 'var(--hr-spacing-03)',
          fontWeight: 600,
          color: 'var(--hr-neutral-70)',
          whiteSpace: 'break-word',
        },
      },
    },
    yAxis: {
      gridLineInterpolation: 'polygon',
      min: 0,
      gridLineColor: Y_AXIS.GRID_LINE_COLOR,
      labels: {
        enabled: false,
      },
      tickPositions: [0, 40, 100, 200, 300],
    },
    legend: {
      enabled: showLegend,
      layout: 'horizontal',
      verticalAlign: 'bottom',
      align: 'center',
      backgroundColor: LEGEND.BACKGROUND_COLOR,
      borderColor: LEGEND.BORDER_COLOR,
      borderRadius: 29,
      borderWidth: 1,
      itemDistance: 22,
      itemStyle: LEGEND.ITEM_STYLE,
      padding: 18,
      reversed: true,
    },
    tooltip: {
      enabled: showToolTip,
      shared: false,
      useHTML: true,
      distance: 22,
      formatter() {
        return customToolTip(this);
      },
      hideDelay: 1.5,
      positioner(width: number, height: number, point) {
        let tooltipY: number;

        if (point.plotY < height) {
          tooltipY = point.plotY + height / 2.5; // distance above the marker
        } else {
          tooltipY = point.plotY - height + 10; // distance below the marker
        }

        const tooltipX: number = point.plotX - width / 2.25;

        return {
          x: tooltipX,
          y: tooltipY,
        };
      },
    },
    series: [...seriesData],
    credits: { enabled: false },
    exporting: { enabled: false },
  };

  return (
    <div className="polarGridV2">
      {showFallback ? (
        <EmployeeSkillDistributionFallback />
      ) : (
        <Chart options={options} highcharts={Highcharts} />
      )}
    </div>
  );
}

export { EmployeeSkillDistribution };
