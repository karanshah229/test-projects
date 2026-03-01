import { HRCell, HRDrawerContext, HRTableRow } from '@hackerrank/hrds-components';
import { useTranslation } from 'next-i18next';
import { useContext, useState } from 'react';

import { APIErrorFallback } from 'src/components/APIErrorFallback/APIErrorFallback';
import { EmptyStateFallback } from 'src/components/EmptyStateFallback/EmptyStateFallback';
import { SpinnerLoader } from 'src/components/SpinnerLoader/SpinnerLoader';
import { CDN_URL_PREFIX } from 'src/constants/common';
import { useGetSkillsOverviewQuery } from 'src/services/Skills';
import { SkillsDataType, SortedSkillsDataType } from 'src/types/api/skills';
import { DrawerContextType } from 'src/types/common';
import { templateString } from 'src/utils/common';

import { ProficiencyFilter } from './ProficiencyFilter';
import { OverviewChart } from '../OverviewChart/OverviewChart';
import { OverviewTable } from '../OverviewTable';
import { OVERVIEW_TAB_DATA, skillsTranslatedHeaders } from '../constants';
import { ChartDataType, HeaderDataType, SkillsGraphData } from '../types';
import { getProgress } from '../utils/utils';

const mapSkillsData = (skillsData: SkillsDataType[]) =>
  skillsData.map(({ id, name, count, proficiencies }) => ({
    id,
    name,
    count,
    prebeginner: proficiencies.prebeginner.count,
    beginner: proficiencies.beginner.count,
    intermediate: proficiencies.intermediate.count,
    expert: proficiencies.expert.count,
  }));

// Segregates skills data into three different arrays based on progress change.
const filterSkillData = (skillsData: SkillsDataType[], proficiency: string) => {
  const skillsWithPositiveGrowth: SkillsGraphData[] = [];
  const skillsWithNegativeGrowth: SkillsGraphData[] = [];
  const skillsWithoutGrowth: SkillsGraphData[] = [];

  skillsData.forEach((obj: SkillsDataType) => {
    const isUnfiltered = proficiency === 'any';
    const count = isUnfiltered ? obj.count : obj.proficiencies[proficiency]?.count;
    const changePercentage = isUnfiltered
      ? obj.change_percentage
      : obj.proficiencies[proficiency]?.change_percentage;

    if (count > 0) {
      const filteredObj: SkillsGraphData = {
        name: obj.name,
        value: count,
        total: obj.count,
        overall_change_percentage: obj.change_percentage,
        proficiencies: obj.proficiencies,
      };

      if (getProgress('positive', changePercentage)) {
        skillsWithPositiveGrowth.push(filteredObj);
      } else if (getProgress('negative', changePercentage)) {
        skillsWithNegativeGrowth.push(filteredObj);
      } else if (getProgress('constant', changePercentage)) {
        skillsWithoutGrowth.push(filteredObj);
      }
    }
  });

  return {
    skillsWithPositiveGrowth,
    skillsWithNegativeGrowth,
    skillsWithoutGrowth,
  };
};

function tableBody(rowData: SortedSkillsDataType, handleOnClick: Function) {
  const { id, name, count, prebeginner, beginner, intermediate, expert } = rowData;

  return (
    <HRTableRow
      key={id}
      // @ts-ignore
      onClick={() => handleOnClick({ id, name, tab: OVERVIEW_TAB_DATA[1] })}
    >
      <HRCell>{name}</HRCell>
      <HRCell>{count}</HRCell>
      <HRCell>{prebeginner}</HRCell>
      <HRCell>{beginner}</HRCell>
      <HRCell>{intermediate}</HRCell>
      <HRCell>{expert}</HRCell>
    </HRTableRow>
  );
}

export function SkillsTab({ setIsDrawerOpen }: { setIsDrawerOpen: Function }) {
  const { t: translate } = useTranslation('organisationOverview');

  const {
    data: skillsOverviewData,
    isFetching: skillsOverviewFetching,
    isLoading: skillsOverviewLoading,
    isError: skillsOverviewHasError,
  } = useGetSkillsOverviewQuery({});

  const { openDrawer } = useContext<DrawerContextType>(HRDrawerContext);
  const [proficiencyFilter, setProficiencyFilter] = useState('any');
  const showLoader = skillsOverviewFetching || skillsOverviewLoading;
  const showFallback = !skillsOverviewData || skillsOverviewHasError;

  if (showLoader) {
    return <SpinnerLoader msg={translate('insights_sidebar.loader')} />;
  }

  if (showFallback) return <APIErrorFallback />;

  const skillsDatum = skillsOverviewData?.data?.skills || [];

  const skillsCount = skillsOverviewData?.data?.skills_count || 0;

  const skilledEmployeesCount = skillsOverviewData?.data?.skilled_employees_count || 0;

  const { skillsWithPositiveGrowth, skillsWithNegativeGrowth, skillsWithoutGrowth } =
    filterSkillData(skillsDatum, proficiencyFilter);

  const chartData: ChartDataType[] = [
    {
      name: 'Increased',
      color: 'var(--sklup-chart-positive-color)',
      data: skillsWithPositiveGrowth,
      fillOpacity: 1,
    },
    {
      name: 'Declined',
      color: 'var(--sklup-chart-negative-color)',
      data: skillsWithNegativeGrowth,
      fillOpacity: 1,
    },
    {
      name: 'Constant',
      color: 'var(--sklup-chart-neutral-color)',
      data: skillsWithoutGrowth,
      fillOpacity: 1,
    },
  ];

  const headerData: HeaderDataType = {
    employeeCount: skilledEmployeesCount,
    employeeCountLabel: translate('bubble_chart.assessed_employees'),
    countValue: skillsCount,
    countValueLabel: translate('bubble_chart.skills'),
    widget: <ProficiencyFilter setProficiencyFilter={setProficiencyFilter} />,
    tooltipHeaderLabel: translate('bubble_chart.assessed_employees'),
  };

  const handleOnClick = ({ id, name, currentTab }) => {
    setIsDrawerOpen({ id, name, currentTab });
    openDrawer();
  };

  const skillsCountForSelectedProficiency = chartData.reduce(
    (acc, { data = [] }) => acc + data.length,
    0,
  );

  const chartFallbackText =
    proficiencyFilter === 'any'
      ? translate('bubble_chart.unfiltered_fallback')
      : templateString(translate('bubble_chart.filtered_fallback'), {
          proficiencyLabel: proficiencyFilter,
        });

  if (skilledEmployeesCount === 0)
    return (
      <EmptyStateFallback
        height="650px"
        title={translate('fallback_state.skills.header')}
        msg={translate('fallback_state.skills.sub_header')}
        imageSrc={`${CDN_URL_PREFIX}/rocket_icon_disabled.svg`}
        imageHeight={143}
        imageWidth={143}
        textColor="var(--hr-neutral-40)"
        ctaBtnText={translate('fallback_state.btn_text')}
        ctaBtnUrl="/employees"
      />
    );

  return (
    <>
      <OverviewChart
        headerData={headerData}
        chartData={chartData}
        itemsCount={skillsCountForSelectedProficiency}
        chartFallbackText={chartFallbackText}
      />
      <OverviewTable
        handleOnClick={handleOnClick}
        headerText={skillsTranslatedHeaders}
        tableBody={tableBody}
        overviewData={mapSkillsData(skillsOverviewData?.data?.skills)}
      />
    </>
  );
}
