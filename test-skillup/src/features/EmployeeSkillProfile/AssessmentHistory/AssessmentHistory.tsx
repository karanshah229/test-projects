import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useReducer } from 'react';

import { APIErrorFallback } from 'src/components/APIErrorFallback/APIErrorFallback';
import { commonReducer } from 'src/reducers/common';
import { useGetEmployeeAssessmentHistoryQuery } from 'src/services/Employees';
import {
  AssessmentHistoryArgs,
  AssessmentMetaDataType,
  EmployeeAssessmentHistoryType,
} from 'src/types/api/employees';
import { templateString } from 'src/utils/common';

import styles from './AssessmentHistory.module.scss';
import { DataTable } from './DataTable';
import { DurationFilter } from './DurationFilter';
import { Pagination } from './Pagination';
import { Search } from './Search';

export function AssessmentHistory() {
  const router = useRouter();
  const { t: translate } = useTranslation('employeeSkillProfile');
  const [queryArgs, updateQueryArgs] = useReducer(commonReducer<AssessmentHistoryArgs>, {
    id: parseInt(router.query.id.toString(), 10),
  });

  const {
    data: employeeAssessmentHistoryData = {} as EmployeeAssessmentHistoryType,
    isError: employeeAssessmentHistoryHasError,
    isFetching: isEmployeeAssessmentHistoryFetching,
    isLoading: isEmployeeAssessmentHistoryLoading,
  } = useGetEmployeeAssessmentHistoryQuery(queryArgs);

  const isTableDataLoading =
    isEmployeeAssessmentHistoryFetching || isEmployeeAssessmentHistoryLoading;
  if (employeeAssessmentHistoryHasError) return <APIErrorFallback className="bg-white" />;
  const tableData = employeeAssessmentHistoryData?.data || [];
  const metaData = employeeAssessmentHistoryData?.meta || ({} as AssessmentMetaDataType);

  const assessmentsCount = employeeAssessmentHistoryData?.meta?.result_count || 0;

  return (
    <div className="hr-flex hr-col hr-m-t-2.5">
      <div className="hr-body-04">
        {templateString(translate('assessment_history.title_count'), {
          assessmentsCount,
        })}
      </div>
      <div className="hr-flex hr-justify-between hr-align-center hr-m-t-2">
        <Search updateQueryArgs={updateQueryArgs} />
        <DurationFilter updateQueryArgs={updateQueryArgs} />
      </div>
      <div className={`${styles.dataTableContainer} bg-white hr-m-t-1.5 hr-m-b-0.75`}>
        <DataTable
          assessmentHistoryData={tableData}
          isTableDataLoading={isTableDataLoading}
          searchQueryArg={queryArgs?.search}
        />
      </div>
      <div className="hr-flex hr-justify-end hr-align-center">
        <Pagination metaData={metaData} updateQueryArgs={updateQueryArgs} />
      </div>
    </div>
  );
}
