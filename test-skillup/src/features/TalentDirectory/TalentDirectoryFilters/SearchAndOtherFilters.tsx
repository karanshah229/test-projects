import { HRDivider } from '@hackerrank/hrds-components';
import { useContext } from 'react';

import { useGetEmployeeesQuery } from 'src/services/Employees';

import { ExportEmployees } from './Export';
import { SearchFilter } from './SearchFilter';
import { SendInvites } from './SendInvites';
import { QueryArgsContext } from '../contexts/QueryArgsContext';
import { SelectedEmployeesContext } from '../contexts/SelectedEmployeesContext';

export function SearchAndOtherFilters() {
  const { selectedEmployees } = useContext(SelectedEmployeesContext);
  const { queryArgs } = useContext(QueryArgsContext);
  const {
    data: employeeListingData,
    isFetching: employeeListingFetching,
    isLoading: employeeListingLoading,
  } = useGetEmployeeesQuery({ ...queryArgs });

  const showSendInvites = selectedEmployees.size !== 0;
  const disableExportBtn =
    employeeListingFetching ||
    employeeListingLoading ||
    employeeListingData?.meta?.result_count === 0;

  return (
    <div className="hr-flex hr-justify-between searchAndOtherFilters">
      <div className="hr-flex hr-align-center" style={{ gap: 'var(--hr-spacing-04)' }}>
        <SearchFilter />
        {showSendInvites && <HRDivider orientation="vertical" />}
        {showSendInvites && <SendInvites />}
      </div>
      <ExportEmployees disableExportBtn={disableExportBtn} />
    </div>
  );
}
