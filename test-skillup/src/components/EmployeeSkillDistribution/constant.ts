import { PROFICIENCIES } from 'src/constants/common';

export const SkillProficiencySeriesDataMap = {
  [PROFICIENCIES.prebeginner]: 40,
  [PROFICIENCIES.beginner]: 100,
  [PROFICIENCIES.intermediate]: 200,
  [PROFICIENCIES.expert]: 300,
};

export const SkillSeriesProficiencyDataMap = {
  40: [PROFICIENCIES.prebeginner],
  100: [PROFICIENCIES.beginner],
  200: [PROFICIENCIES.intermediate],
  300: [PROFICIENCIES.expert],
};

export const CHART_OPTIONS = {
  CHART_BACKGROUND_COLOR: 'transparent',
  Y_AXIS: {
    GRID_LINE_COLOR: '#D9D9E0',
  },
  X_AXIS: {
    GRID_LINE_COLOR: '#D9D9E0',
  },
  LEGEND: {
    BACKGROUND_COLOR: '#FAFCFF',
    BORDER_COLOR: '#E9EEF4',
    ITEM_STYLE: {
      fontSize: 12,
      fontWeight: 400,
      color: 'var(--hr-neutral-70)',
    },
  },
  TOOLTIP: {
    BACKGROUND_COLOR: 'transparent',
    BORDER_COLOR: 'transparent',
  },
  SERIES: {
    TARGET_PROFICIENCY: {
      TYPE: 'area',
      COLOR: '#9ED1FF',
      LINE_COLOR: '#27B1FF',
      MARKER: {
        symbol: 'circle',
        fillColor: 'var(--hr-neutral-0)',
        lineWidth: 1,
        lineColor: '#27B1FF',
      },
    },
    CURRENT_PROFICIENCY: {
      TYPE: 'area',
      COLOR: '#46EAA4',
      LINE_COLOR: '#22BD7B',
      MARKER: {
        symbol: 'circle',
        fillColor: 'var(--hr-neutral-0)',
        lineWidth: 1,
        lineColor: '#22BD7B',
      },
    },
  },
};
