import { HRSearch } from '@hackerrank/hrds-components';
import { useTranslation } from 'next-i18next';
import { useContext, useEffect, useRef, useState } from 'react';

import { useDebounce } from 'src/hooks';

import { QueryArgsContext } from '../contexts/QueryArgsContext';
import { SelectedEmployeesContext } from '../contexts/SelectedEmployeesContext';

export function SearchFilter() {
  const { t: translate } = useTranslation('talentDirectory');
  const { queryArgs, updateQueryArgs } = useContext(QueryArgsContext);
  const { selectedEmployees } = useContext(SelectedEmployeesContext);

  const { search = '', page } = queryArgs;
  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearchInput = useDebounce(searchInput, 300);

  const firstLoad = useRef(true);
  useEffect(() => {
    // If first load, use `page` from query params
    // Else remove page param on search
    updateQueryArgs({
      search: debouncedSearchInput,
      page: firstLoad.current ? page : null,
    });
    if (firstLoad.current) firstLoad.current = false;
    // eslint-disable-next-line
  }, [debouncedSearchInput, updateQueryArgs]); // don't put page in deps

  return (
    <div style={{ width: '350px' }}>
      <HRSearch
        placeholder={translate('Search.search_placeholder')}
        aria-label={translate('Search.search_aria_label')}
        value={searchInput}
        onChange={setSearchInput}
        isFullWidth
        autoComplete="off"
        isDisabled={selectedEmployees.size !== 0}
      />
    </div>
  );
}
