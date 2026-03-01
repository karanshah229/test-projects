import { HRBasicSelect } from '@hackerrank/hrds-components';
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';
import { useCallback, useState } from 'react';

import { durationFilterOptions } from 'src/constants/common';

import { SelectPropType } from '../../types';
import styles from '../InsightsSidebar.module.scss';

export function DurationFilter({ updateQueryArgs }: { updateQueryArgs: Function }) {
  const { t: translate } = useTranslation('organisationOverview');
  const [selectedDuration, setSelectedDuration] = useState<SelectPropType>({
    label: translate('progress_chart.duration_filter_labels.all_time'),
    value: 'ALL_TIME',
  });

  const resetSelectedRange = useCallback(() => {
    updateQueryArgs({
      from_date: '',
      to_date: '',
      select: '',
    });
  }, [updateQueryArgs]);

  const handleSelectChange = (updatedDuration: SelectPropType) => {
    setSelectedDuration(updatedDuration);
    const { value } = updatedDuration;
    if (value === 'ALL_TIME') {
      resetSelectedRange();
    } else {
      updateQueryArgs({
        from_date: dayjs()
          .subtract(value as number, 'day')
          .format('YYYY-MM-DD'),
        to_date: dayjs().format('YYYY-MM-DD'),
        select: 'progress',
      });
    }
  };

  return (
    <div className={styles.durationFilter}>
      <HRBasicSelect
        name={translate('progress_chart.duration_filter_aria_label')}
        options={durationFilterOptions.map((option) => ({
          ...option,
          label: translate(`progress_chart.duration_filter_labels.${option.i18nKey}`),
        }))}
        value={selectedDuration}
        onChange={handleSelectChange}
        // @ts-ignore
        isSearchable={false}
        aria-label={translate('progress_chart.duration_filter_aria_label')}
        isFullWidth
      />
      <div />
    </div>
  );
}
