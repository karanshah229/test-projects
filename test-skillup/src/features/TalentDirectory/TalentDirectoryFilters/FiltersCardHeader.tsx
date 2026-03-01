import { HRClickableDiv } from '@hackerrank/hrds-components';
import { useTranslation } from 'next-i18next';
import { useContext } from 'react';

import styles from './TalentDirectoryFilter.module.scss';
import { QueryArgsContext } from '../contexts/QueryArgsContext';
import { SelectedEmployeesContext } from '../contexts/SelectedEmployeesContext';

export function FiltersCardHeader() {
  const { t: translate } = useTranslation('talentDirectory');
  const { queryArgs, updateQueryArgs } = useContext(QueryArgsContext);
  const { setSelectedEmployees } = useContext(SelectedEmployeesContext);
  const {
    skills = [],
    job_role_ids: jobRolesIDs = [],
    certification_ids: certificationIDs = [],
  } = queryArgs;

  function clearAll() {
    updateQueryArgs({
      type: 'CLEAR_ALL_FILTERS',
    });
    setSelectedEmployees(new Set([]));
  }

  const showClearAll =
    skills.length !== 0 || jobRolesIDs.length !== 0 || certificationIDs.length !== 0;

  return (
    <span className="hr-flex hr-justify-between">
      <span className="hr-body-02">{translate('Filters.filters_title')}</span>
      {showClearAll && (
        <HRClickableDiv
          // @ts-ignore
          as="span"
          className={`hr-body-01 ${styles.clear_all_btn}`}
          onClick={() => clearAll()}
        >
          {translate('Filters.filters_clear_all_text')}
        </HRClickableDiv>
      )}
    </span>
  );
}
