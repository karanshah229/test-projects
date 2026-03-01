import { ReactNode } from 'react';

import { SkillsProficiencyType } from 'src/types/api/skills';

export type OverviewTabDataType = 'certifications' | 'skills';

export type BubbleChartConfigType = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export type BubbleChartConfigPropsType = Record<
  BubbleChartConfigType,
  {
    padding: number;
    minSize: number;
    maxSize: number;
  }
>;

export type DrawerStateType = { id: string; name: string; currentTab: OverviewTabDataType };

export type SelectPropType = {
  label: string;
  value: number | string;
};

export type TranslatedHeaderFieldType = {
  i18nKey?: string;
  key?: string;
  width?: string;
};

export type HeaderTranslatedTextType = {
  [key: string]: TranslatedHeaderFieldType;
};

export type CertificationGraphData = {
  name: string;
  value: number;
  overall_change_percentage: number;
};

export type SkillsGraphData = {
  name: string;
  value: number;
  total: number;
  overall_change_percentage: number;
  proficiencies: SkillsProficiencyType;
};

export type HeaderDataType = {
  employeeCount: number;
  employeeCountLabel: string;
  countValue: number;
  countValueLabel: string;
  widget: ReactNode;
  tooltipHeaderLabel: string;
};

export type ChartDataType = {
  name: string;
  color: string;
  data: CertificationGraphData[];
  fillOpacity: number;
};
