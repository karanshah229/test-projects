import { HRSearch } from '@hackerrank/hrds-components';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';

import { useDebounce } from 'src/hooks';

import styles from './AssessmentHistory.module.scss';

export function Search({ updateQueryArgs }: { updateQueryArgs: Function }) {
  const { t: translate } = useTranslation('employeeSkillProfile');
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearchInput = useDebounce(searchInput, 350);

  useEffect(() => {
    updateQueryArgs({ search: debouncedSearchInput });
  }, [debouncedSearchInput, updateQueryArgs]);

  return (
    <div className={styles.search}>
      <HRSearch
        placeholder={translate('assessment_history.search')}
        value={searchInput}
        onChange={setSearchInput}
        isFullWidth
        autoComplete="off"
      />
    </div>
  );
}
