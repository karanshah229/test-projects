import { HRTable } from '@hackerrank/hrds-components';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useContext, useEffect, useState } from 'react';

import { APIErrorFallback } from 'src/components/APIErrorFallback/APIErrorFallback';
import { EmptyStateFallback } from 'src/components/EmptyStateFallback/EmptyStateFallback';
import { OverlayLoader } from 'src/components/OverlayLoader/OverlayLoader';
import { PageTransitionLoaderContext } from 'src/contexts/PageTransitionLoaderContext';
import { useGetEmployeeesQuery } from 'src/services/Employees';

import { TalentDirectoryTableBody } from './TalentDirectoryTableBody';
import { TalentDirectoryTableHeader } from './TalentDirectoryTableHeader';
import { QueryArgsContext } from '../contexts/QueryArgsContext';
import { SelectedEmployeesContext } from '../contexts/SelectedEmployeesContext';

export function TalentDirectoryTable() {
  const router = useRouter();
  const { t: translate } = useTranslation('talentDirectory');
  const { setPageLoading } = useContext(PageTransitionLoaderContext);
  const { queryArgs } = useContext(QueryArgsContext);
  const { selectedEmployees, setSelectedEmployees } = useContext(SelectedEmployeesContext);
  const {
    data: employeeListingData,
    isFetching: employeeListingFetching,
    isLoading: employeeListingLoading,
    isError: employeeListingHasError,
  } = useGetEmployeeesQuery({
    ...queryArgs,
  });

  const [showTableLoader, setShowTableLoader] = useState(
    employeeListingLoading || employeeListingFetching,
  );

  useEffect(() => {
    setShowTableLoader(employeeListingLoading || employeeListingFetching);
  }, [employeeListingLoading, employeeListingFetching]);

  useEffect(() => {
    router.events.on('routeChangeStart', () => setShowTableLoader(true));
    router.events.on('routeChangeComplete', () => setShowTableLoader((c) => c || false));
  }, [router, setPageLoading]);

  function handleRowSelectChange(employeeID: string | Set<string>) {
    if (employeeID === 'all') {
      setSelectedEmployees(new Set(employeeListingData?.data?.map((emp) => emp.id.toString())));
    } else if ((employeeID as Set<string>).size === 0) {
      setSelectedEmployees(new Set([]));
    } else {
      setSelectedEmployees(employeeID);
    }
  }

  if (employeeListingHasError) return <APIErrorFallback className="bg-white" />;

  return (
    <OverlayLoader showLoader={showTableLoader}>
      <HRTable
        headerBgColor="white"
        aria-label={translate('Table.aria_label')}
        selectionMode="multiple"
        onSelectionChange={(employeeID: any) => handleRowSelectChange(employeeID)}
        selectedKeys={selectedEmployees}
      >
        {TalentDirectoryTableHeader()}
        {TalentDirectoryTableBody()}
      </HRTable>
      <EmptyStateFallback
        msg={translate(
          Object.keys(queryArgs).length === 0 ? 'Table.empty_fallback' : 'Table.filtered_fallback',
        )}
        height="600px"
        isFallbackVisible={employeeListingData?.data.length === 0}
      />
    </OverlayLoader>
  );
}
