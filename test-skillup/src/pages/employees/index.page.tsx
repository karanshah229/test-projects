import { GetServerSidePropsContext, PreviewData } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ParsedUrlQuery } from 'querystring';

import { authHOF } from 'src/HOF/auth';
import { SpinnerLoader } from 'src/components/SpinnerLoader/SpinnerLoader';
import { TalentDirectory } from 'src/features/TalentDirectory/TalentDirectory';
import { parseQueryArgs } from 'src/features/TalentDirectory/utils';
import {
  employeeAPI,
  useGetEmployeeeListingFiltersQuery,
  useGetEmployeeesQuery,
} from 'src/services/Employees';
import { wrapper } from 'src/store';
import { APIErrorType } from 'src/types/api/common';
import { isClient } from 'src/utils/common';

export default function TalentDirectoryPage() {
  const router = useRouter();
  const { t: translate } = useTranslation('talentDirectory');

  const {
    data: employeeFiltersData,
    isFetching: employeeFiltersFetching,
    isLoading: employeeFiltersLoading,
    isError: employeeFiltersHasError,
    error: employeeFiltersError,
  } = useGetEmployeeeListingFiltersQuery();

  const { query } = router;
  const parsedQueryArgs = parseQueryArgs(query);
  const {
    data: employeeListingData,
    isFetching: employeeListingFetching,
    isLoading: employeeListingLoading,
    isError: employeeListingHasError,
    error: employeeListingError,
  } = useGetEmployeeesQuery({ ...parsedQueryArgs });

  const showPageLoader =
    (employeeListingFetching || employeeListingLoading) &&
    (employeeFiltersFetching || employeeFiltersLoading);

  if (showPageLoader) {
    return <SpinnerLoader />;
  }

  const showFallbackPage =
    (employeeListingHasError || !employeeListingData) &&
    (employeeListingError as APIErrorType)?.status !== 401 &&
    (employeeFiltersHasError || !employeeFiltersData) &&
    (employeeFiltersError as APIErrorType)?.status !== 401;

  if (showFallbackPage) {
    if (isClient) {
      router.back();
    }
    return '';
  }

  return (
    <>
      <Head>
        <title>{translate('TitleTag')}</title>
      </Head>

      <TalentDirectory />
    </>
  );
}

export const getServerSideProps = wrapper.getServerSideProps((store) =>
  authHOF(store, async (context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) => {
    const { locale, query } = context;

    const parsedQueryArgs = parseQueryArgs(query);

    await store.dispatch(employeeAPI.endpoints.getEmployeeeListingFilters.initiate());
    await store.dispatch(employeeAPI.endpoints.getEmployeees.initiate({ ...parsedQueryArgs }));

    await Promise.all(store.dispatch(employeeAPI.util.getRunningQueriesThunk()));

    return {
      props: {
        ...(await serverSideTranslations(locale, [
          'common',
          'talentDirectory',
          'components/dynamicList',
          'components/emptyStateFallback',
        ])),
      },
    };
  }),
);
