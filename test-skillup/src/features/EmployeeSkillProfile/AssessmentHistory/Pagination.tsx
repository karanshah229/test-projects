import { HRPagination } from '@hackerrank/hrds-components';

import { AssessmentMetaDataType } from 'src/types/api/employees';

type PaginationProps = {
  metaData: AssessmentMetaDataType;
  updateQueryArgs: Function;
};

export function Pagination({ metaData, updateQueryArgs }: PaginationProps) {
  const {
    page: currentPage = 1,
    size: pageSize = 1,
    total_pages: totalPages = 1,
    result_count: resultCount = 0,
  } = metaData;

  const handlePageChange = (value: any) => {
    updateQueryArgs({ page: value });
  };

  return (
    <HRPagination
      type="compact"
      currentPage={currentPage}
      pageSize={pageSize}
      totalPages={totalPages}
      totalCount={resultCount}
      onChange={handlePageChange}
    />
  );
}
