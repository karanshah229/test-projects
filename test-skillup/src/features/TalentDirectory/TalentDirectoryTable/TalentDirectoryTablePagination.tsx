import { HRPagination } from '@hackerrank/hrds-components';
import { useContext } from 'react';

import { useGetEmployeeesQuery } from 'src/services/Employees';
import { EmployeeType } from 'src/types/api/employees';

import { QueryArgsContext } from '../contexts/QueryArgsContext';
import { SelectedEmployeesContext } from '../contexts/SelectedEmployeesContext';

export function TalentDirectoryTablePagination() {
  const { queryArgs, updateQueryArgs } = useContext(QueryArgsContext);
  const { setSelectedEmployees } = useContext(SelectedEmployeesContext);

  const { data: employeeListingData = {} as EmployeeType } = useGetEmployeeesQuery({
    ...queryArgs,
  });

  const {
    meta: {
      page: currentPage = 1,
      size: pageSize = 0,
      total_pages: totalPages = 0,
      result_count: resultCount = 0,
    } = {},
  } = employeeListingData;

  function handleOnPageChange(page: number) {
    updateQueryArgs({
      ...queryArgs,
      page,
    });
    setSelectedEmployees(new Set([]));
  }

  return (
    <HRPagination
      type="compact"
      totalPages={totalPages}
      pageSize={pageSize}
      currentPage={currentPage}
      totalCount={resultCount}
      onChange={(page: any) => {
        if (currentPage !== page) handleOnPageChange(page);
      }}
    />
  );
}
