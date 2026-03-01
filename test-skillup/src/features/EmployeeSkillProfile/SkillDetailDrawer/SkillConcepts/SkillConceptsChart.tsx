import Highcharts from 'highcharts';
import HC_patternFill from 'highcharts-pattern-fill';
import HighChartsReact, { HighchartsReactProps } from 'highcharts-react-official';
import { useTranslation } from 'next-i18next';
import { renderToString } from 'react-dom/server';

import { ImageWithLoader } from 'src/components/ImageWithLoader/ImageWithLoader';
import { CDN_ASSET_FOLDER_PATH, CDN_URL_PREFIX } from 'src/constants/common';
import { SkillDetailConcepts } from 'src/types/api/employees';

import { SkillConceptsLegendLabel } from './SkillConceptsLegendLabel';

if (typeof Highcharts === 'object') {
  HC_patternFill(Highcharts);
}

const CHART_BASE_HEIGHT = 100;
const CHART_HEIGHT_MULTIPLIER = 25;
const MAX_CONCEPT_RATING = 100;

type SkillConceptsChartPropType = {
  skillConcepts: SkillDetailConcepts[];
};

function SkillConceptsChartFallback() {
  const { t: translate } = useTranslation('employeeSkillProfile');
  return (
    <div className="hr-flex hr-col hr-align-center">
      <ImageWithLoader
        alt={translate('SkillConceptBreakdown.not_enough_concepts_image_alt')}
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
        {translate('SkillConceptBreakdown.not_enough_concepts_text')}
      </span>
    </div>
  );
}

function formatLabel(data: Highcharts.Series, translate: Function): string {
  const isMaximumRating = data.name === 'Maximum Rating';
  const strongConceptsLegendImage = `${CDN_URL_PREFIX}${CDN_ASSET_FOLDER_PATH.employeeSkillDistribution}/strong_concepts_legend.svg`;
  const strongConceptsLegendTitle = translate('SkillConceptBreakdown.strong_concepts_legend_title');
  const weakConceptsLegendImage = `${CDN_URL_PREFIX}${CDN_ASSET_FOLDER_PATH.employeeSkillDistribution}/weak_concepts_legend.svg`;
  const weakConceptsLegendTitle = translate('SkillConceptBreakdown.weak_concepts_legend_title');
  return `${renderToString(
    <SkillConceptsLegendLabel
      ratingType={data.name}
      imageSrc={isMaximumRating ? strongConceptsLegendImage : weakConceptsLegendImage}
      legendLabel={isMaximumRating ? strongConceptsLegendTitle : weakConceptsLegendTitle}
    />,
  )}`;
}

function SkillConceptsChart({ skillConcepts }: SkillConceptsChartPropType) {
  const { t: translate } = useTranslation('employeeSkillProfile');
  const skillConceptsSorted = [...skillConcepts].sort((concept1, concept2) => {
    if (concept1.rating < concept2.rating) return 1;
    if (concept1.rating === concept2.rating)
      if (concept1.name > concept2.name) return 1;
      else return -1;
    return -1;
  });

  const xAxisCategories = [];
  const seriesData = [];
  const maxRatingData = [];
  const colorData = [];

  Object(skillConceptsSorted).forEach((skillConcept) => {
    xAxisCategories.push(skillConcept.name);
    seriesData.push(skillConcept.rating);
    maxRatingData.push(MAX_CONCEPT_RATING);
    if (skillConcept.interpretation === 'strength') {
      colorData.push('var(--hr-neutral-10)');
    } else colorData.push('url(#slanted-line-pattern)');
  });

  const options: HighchartsReactProps = {
    chart: {
      type: 'bar',
      maxWidth: '100%',
      height: CHART_BASE_HEIGHT + CHART_HEIGHT_MULTIPLIER * skillConceptsSorted.length,
    },
    defs: {
      patterns: [
        {
          id: 'slanted-line-pattern',
          path: {
            d: 'M 10 0 L 0 10 M -1 1 L 1 -1 M 11 9 L 9 11',
            strokeWidth: 1,
            stroke: 'var(--hr-neutral-40)',
          },
          width: 10,
          height: 10,
        },
      ],
    },
    title: {
      text: null,
    },
    xAxis: {
      categories: xAxisCategories,
      gridLineWidth: 0,
      lineWidth: 0,
      labels: {
        align: 'left',
        reserveSpace: true,
      },
    },
    yAxis: {
      min: 0,
      title: {
        enabled: false,
      },
      labels: {
        enabled: false,
      },
      gridLineWidth: 0,
    },
    plotOptions: {
      bar: {
        showInLegend: true,
        dataLabels: {
          enabled: false,
        },
        grouping: false,
        states: {
          hover: {
            enabled: false,
          },
        },
      },
      series: {
        colorByPoint: true,
        colors: colorData,
        states: {
          hover: {
            enabled: false,
          },
        },
        pointWidth: 18,
      },
    },
    tooltip: {
      enabled: false,
    },
    legend: {
      enabled: true,
      align: 'right',
      verticalAlign: 'top',
      useHTML: true,
      x: 50,
      y: 0,
      symbolPadding: 0,
      symbolWidth: 0.1,
      symbolHeight: 0.1,
      symbolRadius: 0,
      labelFormatter() {
        return formatLabel(this, translate);
      },

      itemStyle: {
        fontWeight: 400,
        fontSize: 'var(--hr-spacing-03)',
      },
    },
    series: [
      {
        name: 'Maximum Rating',
        enableMouseTracking: false,
        data: maxRatingData,
      },
      {
        name: 'Current Rating',
        enableMouseTracking: false,
        data: seriesData,
      },
    ],
    credits: { enabled: false },
    exporting: { enabled: false },
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 700,
          },
        },
      ],
    },
  };

  return (
    <div>
      {skillConceptsSorted?.length < 1 ? (
        <SkillConceptsChartFallback />
      ) : (
        <div className="conceptsBarChart">
          <HighChartsReact highcharts={Highcharts} options={options} />
        </div>
      )}
    </div>
  );
}

export { SkillConceptsChart };
