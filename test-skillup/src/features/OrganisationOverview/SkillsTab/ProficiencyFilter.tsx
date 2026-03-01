import { HRBasicSelect } from '@hackerrank/hrds-components';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';

import styles from './SkillsTab.module.scss';
import { proficienciesOptions } from '../constants';
import { SelectPropType } from '../types';

export function ProficiencyFilter({ setProficiencyFilter }: { setProficiencyFilter: Function }) {
  const { t: translate } = useTranslation('organisationOverview');
  const [selectedDuration, setSelectedDuration] = useState<SelectPropType>({
    label: translate('bubble_chart.filter_labels.any'),
    value: 'any',
  });
  const handleSelectChange = (updatedDuration: SelectPropType) => {
    setSelectedDuration(updatedDuration);
    setProficiencyFilter(updatedDuration?.value);
  };

  return (
    <div className={styles.proficiencyFilter}>
      <HRBasicSelect
        name={translate('bubble_chart.filter_labels.aria_label')}
        options={proficienciesOptions.map((option) => ({
          ...option,
          label: translate(`bubble_chart.filter_labels.${option.i18nKey}`),
        }))}
        value={selectedDuration}
        onChange={handleSelectChange}
        // @ts-ignore
        isSearchable={false}
        aria-label={translate('bubble_chart.filter_labels.aria_label')}
        isFullWidth
      />
    </div>
  );
}
