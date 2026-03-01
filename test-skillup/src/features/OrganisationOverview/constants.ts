import { BubbleChartConfigPropsType, OverviewTabDataType } from './types';

export const OVERVIEW_TAB_DATA: OverviewTabDataType[] = ['certifications', 'skills'];

export const bubbleChartConfig: BubbleChartConfigPropsType = {
  xs: {
    padding: 16,
    minSize: 75,
    maxSize: 150,
  },
  sm: {
    padding: 20,
    minSize: 75,
    maxSize: 250,
  },
  md: {
    padding: 24,
    minSize: 100,
    maxSize: 350,
  },
  lg: {
    padding: 32,
    minSize: 100,
    maxSize: 450,
  },
  xl: {
    padding: 32,
    minSize: 150,
    maxSize: 550,
  },
  xxl: {
    padding: 32,
    minSize: 150,
    maxSize: 650,
  },
};

export const proficienciesOptions = [
  { i18nKey: 'any', value: 'any' },
  { i18nKey: 'prebeginner', value: 'prebeginner' },
  { i18nKey: 'beginner', value: 'beginner' },
  { i18nKey: 'intermediate', value: 'intermediate' },
  { i18nKey: 'expert', value: 'expert' },
];

export const skillsHeader = {
  name: {
    i18nKey: 'leader_board.table.name_header',
  },
  assessed: {
    i18nKey: 'leader_board.table.proficiency_header',
  },
  certified: {
    i18nKey: 'leader_board.table.rating_header',
  },
  profile: {
    i18nKey: 'leader_board.table.profile_header',
  },
};

export const certificationHeader = {
  name: {
    i18nKey: 'leader_board.table.name_header',
  },
  designation: {
    i18nKey: 'leader_board.table.designation_header',
  },
  profile: {
    i18nKey: 'leader_board.table.profile_header',
  },
};

export const skillsTranslatedHeaders = {
  name: {
    i18nKey: 'skills_table.skills_header',
    key: 'name',
    width: '15%',
  },
  assessed: {
    i18nKey: 'skills_table.assessed_employees',
    key: 'count',
    width: '25%',
  },
  prebeginner: {
    i18nKey: 'skills_table.prebeginner_header',
    key: 'prebeginner',
    width: 'auto',
  },
  beginner: {
    i18nKey: 'skills_table.beginner_header',
    key: 'beginner',
    width: 'auto',
  },
  intermediate: {
    i18nKey: 'skills_table.intermediate_header',
    key: 'intermediate',
    width: 'auto',
  },
  expert: {
    i18nKey: 'skills_table.expert_header',
    key: 'expert',
    width: 'auto',
  },
};

export const certificationsTranslatedHeaders = {
  name: {
    i18nKey: 'certifications_table.certifications_header',
    key: 'name',
    width: '33%',
  },
  assessed: {
    i18nKey: 'certifications_table.assessed_employees',
    key: 'assessed_employees_count',
    width: '33%',
  },
  certified: {
    i18nKey: 'certifications_table.certified_employees',
    key: 'certifications_count',
    width: '33%',
  },
};
