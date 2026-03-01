import dayjs, { Dayjs } from 'dayjs';
import Highcharts from 'highcharts';
import HC_more from 'highcharts/highcharts-more';
import HighChartsReact, { HighchartsReactProps } from 'highcharts-react-official';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { renderToString } from 'react-dom/server';

import { useGetIndividualSkillDetailsQuery } from 'src/services/Employees';
import { RatingCutoffs } from 'src/types/api/common';
import {
  IndividualSkillDetailsType,
  IndividualSkillQueryParameters,
  SkillDetailAttributes,
  SkillDetailProgress,
} from 'src/types/api/employees';
import { ProficiencyType } from 'src/types/common';
import { templateString } from 'src/utils/common';
import { dateNow, getDatesInBetweenDuration, startOfMonth } from 'src/utils/date';

import { SkillProgressDurationFilter } from './SkillProgressDurationFilter';
import { SkillProgressToolTip } from './SkillProgressToolTip';
import styles from '../SkillDetailDrawer.module.scss';

type SkillProgressChartProps = {
  skillRatingCutoffsData: RatingCutoffs;
  skillProgressData: SkillDetailProgress[];
  initialQueryParameters: IndividualSkillQueryParameters;
};

if (typeof Highcharts === 'object') {
  HC_more(Highcharts);
}

const defaultTickFormat = "%b %e'%y";
const MILLISECOND_CONVERTER = 1000;

function getPlotLines(rating: number, mostRecentAssessmentDate: Dayjs, translate: Function) {
  const resultObj = [];
  const currentDate = dayjs();
  const numberOfMonths = currentDate.diff(mostRecentAssessmentDate, 'month');
  resultObj.push({
    width: 1,
    value: rating,
    zIndex: 5,
    label: {
      text: templateString(
        `${translate('SkillProgressChart.reference_line_label_pre')} ${
          numberOfMonths === 1
            ? translate('SkillProgressChart.reference_line_label_post_singular')
            : translate('SkillProgressChart.reference_line_label_post')
        }`,
        { numberOfMonths },
      ),
      align: 'center',
      // below conditions are to adjust the label position (above or below the line) based on the rating value to prevent it going out of bounds
      y: rating > 290 ? 15 : -10,
      style: {
        fontSize: '14px',
        fontWeight: '400',
        fill: 'var(--hr-neutral-70)',
      },
    },
  });
  return resultObj;
}

function getPlotBands(skillRatingCutoffsData: RatingCutoffs = {} as RatingCutoffs) {
  const labelProps = {
    align: 'right',
    x: -10,
    style: {
      textTransform: 'capitalize',
      color: 'var(--hr-neutral-30)',
    },
  };

  const resultObj = [
    {
      className: `${styles.plotBand_prebeginner}`,
      from: 0, // Start of the plot band
      to: skillRatingCutoffsData?.beginner, // End of the plot band
      label: {
        text: 'pre-beginner',
        ...labelProps,
      },
    },
  ];

  Object.keys(skillRatingCutoffsData)?.forEach((proficiency: ProficiencyType) => {
    switch (proficiency) {
      case 'beginner':
        resultObj.push({
          className: `${styles.plotBand_beginner}`,
          from: skillRatingCutoffsData[proficiency],
          to: skillRatingCutoffsData.intermediate,
          label: {
            text: proficiency,
            ...labelProps,
          },
        });
        break;
      case 'intermediate':
        resultObj.push({
          className: `${styles.plotBand_intermediate}`,
          from: skillRatingCutoffsData[proficiency],
          to: skillRatingCutoffsData.expert,
          label: {
            text: proficiency,
            ...labelProps,
          },
        });
        break;
      case 'expert':
        resultObj.push({
          className: `${styles.plotBand_expert}`,
          from: skillRatingCutoffsData[proficiency],
          to: 300,
          label: {
            text: proficiency,
            ...labelProps,
          },
        });
        break;

      default:
        break;
    }
  });
  return resultObj;
}

function getSeriesData(
  skillProgress: SkillDetailProgress[],
  showNoProgressPlotLine: boolean,
  queryArgs: Partial<IndividualSkillQueryParameters>,
) {
  let series = [];
  const { progress_from_date: startDate, progress_to_date: endDate } = queryArgs;

  if (showNoProgressPlotLine) {
    const datesInBetween = getDatesInBetweenDuration(startDate, endDate);
    series = datesInBetween.map((date) => {
      const dateInMilliseconds = dayjs(date).unix() * MILLISECOND_CONVERTER;
      return [dateInMilliseconds, 0, 'No Assessment', 0, '', ''];
    });
  } else {
    if (startDate && dayjs(startDate).toDate() < dayjs(skillProgress[0].timestamp).toDate()) {
      const datesInBetween = [
        startOfMonth(startDate),
        ...getDatesInBetweenDuration(startDate, skillProgress[0].timestamp),
      ];
      series = datesInBetween.map((date) => {
        const dateInMilliseconds = dayjs(date).unix() * MILLISECOND_CONVERTER;
        return [dateInMilliseconds, null, 'No Assessment', null, '', ''];
      });
    }

    skillProgress?.map((data) => {
      const dateInMilliseconds = dayjs(data.timestamp).unix() * MILLISECOND_CONVERTER;

      return series.push([
        dateInMilliseconds,
        data.new_rating,
        data.assessment.name,
        Math.round(data.rating_change_percent),
        dayjs(data.timestamp).format("MMM D'YY"),
      ]);
    });
    series.push([
      dateNow(),
      skillProgress[skillProgress.length - 1]?.new_rating,
      '',
      0,
      '',
      'transparent',
      'end-point',
    ]);
  }
  return series;
}

function getSeriesMarker(progerssDataLength: number, showNoProgressPlotLine: boolean) {
  if (showNoProgressPlotLine) {
    return {
      radius: 0,
      enabled: false,
      states: {
        hover: {
          enabled: false,
        },
      },
    };
  }
  if (progerssDataLength === 1) {
    return { radius: 2, enabled: true };
  }

  return {
    radius: 2,
    enabled: false,
    states: {
      hover: {
        enabled: true,
      },
    },
  };
}

function getToolTip(data, translate: Function) {
  const { point } = data.points[0];
  const {
    assessment_date: assessmentDate,
    assessment_name: assessmentName,
    rating_change_percent: ratingChangePercent,
    y,
  } = point;
  // don't show tooltip for the last point (today's date)
  if (!assessmentDate && !assessmentName) {
    return false;
  }

  const tooltipMaxRating = translate('SkillProgressChart.tooltip_max_rating');
  const tooltipAssessmentLabel = translate('SkillProgressChart.tooltip_assessment_label');

  return renderToString(
    <SkillProgressToolTip
      assessmentDate={assessmentDate}
      assessmentName={assessmentName}
      ratingChangePercent={ratingChangePercent}
      tooltipAssessmentLabel={tooltipAssessmentLabel}
      tooltipMaxRating={tooltipMaxRating}
      obtainedScore={y}
    />,
  );
}

function SkillProgressChart({
  skillRatingCutoffsData,
  skillProgressData,
  initialQueryParameters,
}: SkillProgressChartProps) {
  const { t: translate } = useTranslation('employeeSkillProfile');

  const { skillId, employeeId } = initialQueryParameters;
  const [queryArgs, updateQueryArgs] = useState<Partial<IndividualSkillQueryParameters>>({});

  const selectProgress = Object.keys(queryArgs).length === 0 ? undefined : 'progress';

  const {
    data: individualSkillDetailsData = {} as IndividualSkillDetailsType,
    isFetching: individualSkillDetailsFetching,
    isLoading: individualSkillDetailsLoading,
  } = useGetIndividualSkillDetailsQuery({
    ...queryArgs,
    skillId,
    employeeId,
    select: selectProgress,
  });
  const skillAttributes =
    individualSkillDetailsData?.data?.attributes || ({} as SkillDetailAttributes);
  const skillProgress = skillAttributes?.progress || skillProgressData;
  const showLoadingState = individualSkillDetailsFetching || individualSkillDetailsLoading;

  // when no progress is made for the selected duration,
  // the most recent assessment before the progress_from_date is sent from the backend
  const progressFromDate = queryArgs?.progress_from_date && dayjs(queryArgs?.progress_from_date);
  const mostRecentAssessmentDate = dayjs(skillProgress[skillProgress.length - 1]?.timestamp);
  const showNoProgressPlotLine =
    skillProgress.length === 1 && mostRecentAssessmentDate < progressFromDate;

  const seriesData = Object.values(skillProgress).length
    ? getSeriesData(skillProgress, showNoProgressPlotLine, queryArgs)
    : [];

  const options: HighchartsReactProps = {
    chart: {
      maxWidth: '100%',
    },
    title: {
      text: null,
    },
    yAxis: {
      title: {
        text: null,
      },
      labels: {
        enabled: true,
      },
      plotBands: getPlotBands(skillRatingCutoffsData),
      plotLines: showNoProgressPlotLine
        ? getPlotLines(skillProgress[0].new_rating, mostRecentAssessmentDate, translate)
        : [],
      max: 300,
      tickPositions: [0, 100, 200, 300],
    },

    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        millisecond: defaultTickFormat,
        second: defaultTickFormat,
        minute: defaultTickFormat,
        hour: defaultTickFormat,
        day: '%b %e',
        week: '%b %e',
        month: "%b'%y",
        year: '%Y',
      },
      accessibility: {
        rangeDescription: `${translate('SkillProgressChart.xaxis_description')}`,
      },
      gridLineWidth: 0,
    },

    tooltip: {
      enabled: !showNoProgressPlotLine,
      xDateFormat: '%Y-%m-%d',
      shared: true,
      useHTML: true,
      footerFormat: '</table>',
      borderColor: 'var(--hr-neutral-0)',
      backgroundColor: 'var(--hr-neutral-0)',
      style: {
        background: 'var(--hr-neutral-0)',
        boxShadow: '0px 4px 8px var(--hr-neutral-10)',
        whiteSpace: 'pre-wrap',
        width: '220px',
        border: '1px solid var(--hr-neutral-10)',
        borderRadius: '4px',
      },
      hideDelay: 0,
      formatter() {
        return getToolTip(this, translate);
      },
    },
    plotOptions: {
      line: {
        color: showNoProgressPlotLine ? 'var(--hr-neutral-40)' : 'var(--hr-neutral-90)',
        lineWidth: showNoProgressPlotLine ? 0 : 1,
      },
    },

    series: [
      {
        type: 'line',
        gapSize: 1,
        name: 'Rating',
        keys: [
          'x',
          'y',
          'assessment_name',
          'rating_change_percent',
          'assessment_date',
          'color',
          'colorIndex',
        ],
        data: seriesData,
        states: {
          hover: {
            enabled: !showNoProgressPlotLine,
          },
        },
        marker: getSeriesMarker(seriesData.length, showNoProgressPlotLine),
      },
    ],
    legend: { enabled: false },
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
    <div className="hr-m-t-2 hr-m-b-1.5 hr-flex hr-col">
      <div className="hr-flex hr-justify-between">
        <div className="hr-body-04 hr-m-b-2">
          {translate('SkillProgressChart.progress_over_time')}
        </div>
        <SkillProgressDurationFilter updateQueryArgs={updateQueryArgs} />
      </div>
      <div
        className={`skillProgressChart
        ${showLoadingState ? styles.loading_chart : ''}`}
      >
        <HighChartsReact highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
}

export { SkillProgressChart };
