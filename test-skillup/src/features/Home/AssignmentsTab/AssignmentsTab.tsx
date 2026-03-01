import { useTranslation } from 'next-i18next';

import { APIErrorFallback } from 'src/components/APIErrorFallback/APIErrorFallback';
import { SKButton } from 'src/components/SKDS/Button/Button';
import { SpinnerLoader } from 'src/components/SpinnerLoader/SpinnerLoader';
import { useGetAsignmentsQuery } from 'src/services/Assignments';

import { AssignmentsContent } from './AssignmentsContent';
import styles from './AssignmentsTab.module.scss';
import { groupAssignments } from '../utils';

function AssignmentsFallback() {
  const { t: translate } = useTranslation('home');

  return (
    <div className={`${styles.assignments_card} hr-flex hr-col hr-justify-center hr-align-center`}>
      <div className={`${styles.fallback_text} hr-m-b-2`}>
        {translate('assigned_to_me.fallback.header')}
      </div>
      <SKButton variant="primary">{translate('assigned_to_me.fallback.btn_text')}</SKButton>
    </div>
  );
}

export function AssignmentsTab() {
  const { t: translate } = useTranslation('home');

  const {
    data: employeeAssignments,
    isFetching: employeeAssignmentsFetching,
    isLoading: employeeAssignmentsLoading,
    isError: employeeAssignmentsHasError,
  } = useGetAsignmentsQuery();

  const showLoader = employeeAssignmentsFetching || employeeAssignmentsLoading;
  const showFallback = !employeeAssignments || employeeAssignmentsHasError;

  if (showLoader) {
    return <SpinnerLoader msg={translate('page_loader')} />;
  }

  if (showFallback) return <APIErrorFallback />;

  const assignments = employeeAssignments?.data || [];

  if (assignments.length === 0) {
    return <AssignmentsFallback />;
  }

  const { completed, overdue, upcoming } = groupAssignments(assignments);

  return (
    <div className={styles.assignments_card}>
      <div className={styles.assignments_container}>
        <AssignmentsContent
          header={translate('assigned_to_me.headers.overdue')}
          assignments={overdue}
        />
        <AssignmentsContent
          header={translate('assigned_to_me.headers.upcoming')}
          assignments={upcoming}
        />
        <AssignmentsContent
          header={translate('assigned_to_me.headers.completed')}
          assignments={completed}
        />
      </div>
    </div>
  );
}
