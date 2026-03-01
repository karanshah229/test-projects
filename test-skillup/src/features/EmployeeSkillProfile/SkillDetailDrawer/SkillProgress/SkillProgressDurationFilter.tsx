import { HRBasicSelect } from '@hackerrank/hrds-components';
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';

import { durationFilterOptions } from 'src/constants/common';

import styles from '../SkillDetailDrawer.module.scss';

type SelectPropType = {
  label: string;
  value: number | string;
};

export function SkillProgressDurationFilter({ updateQueryArgs }: { updateQueryArgs: Function }) {
  const { t: translate } = useTranslation('employeeSkillProfile');

  const [selectedDuration, setSelectedDuration] = useState<SelectPropType>({
    label: translate('SkillProgressChart.duration_filter_labels.all_time'),
    value: 'ALL_TIME',
  });

  const handleSelectChange = (updatedDuration: SelectPropType) => {
    setSelectedDuration(updatedDuration);
    const { value } = updatedDuration;

    if (value === 'ALL_TIME')
      updateQueryArgs({
        progress_to_date: dayjs().format('YYYY-MM-DD'),
      });
    else
      updateQueryArgs({
        progress_from_date: dayjs()
          .subtract(value as number, 'day')
          .format('YYYY-MM-DD'),
        progress_to_date: dayjs().format('YYYY-MM-DD'),
      });
  };

  return (
    <div className={`${styles.chart_duration_filter}`}>
      <HRBasicSelect
        name={translate('SkillProgressChart.duration_filter_name')}
        options={durationFilterOptions.map((option) => ({
          ...option,
          label: translate(`SkillProgressChart.duration_filter_labels.${option.i18nKey}`),
        }))}
        value={selectedDuration}
        onChange={handleSelectChange}
        // @ts-ignore
        isSearchable={false}
        aria-label={translate('SkillProgressChart.duration_filter_aria_label')}
        isFullWidth
      />
    </div>
  );
}
