import { HRDrawerProvider } from '@hackerrank/hrds-components';
import { GetServerSidePropsContext, PreviewData } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ParsedUrlQuery } from 'querystring';

import { authHOF } from 'src/HOF/auth';
import { SpinnerLoader } from 'src/components/SpinnerLoader/SpinnerLoader';
import {
  EmployeeDetails,
  IndividualSkillProfile,
} from 'src/features/EmployeeSkillProfile/IndividualSkillProfile';
import {
  employeeAPI,
  useGetEmployeeAssessmentHistoryQuery,
  useGetEmployeeBadgesQuery,
  useGetEmployeeCertificationsQuery,
  useGetEmployeeDetailsQuery,
  useGetEmployeeSkillsDetailsQuery,
} from 'src/services/Employees';
import { wrapper } from 'src/store';
import { isClient } from 'src/utils/common';

export default function EmployeeSkillProfilePage() {
  const router = useRouter();
  const { t: translate } = useTranslation('employeeSkillProfile');

  const {
    data: employeeDetailsData,
    isFetching: employeeDetailsFetching,
    isLoading: employeeDetailsLoading,
    isError: employeeDetailsHasError,
    error: employeeDetailsError,
  } = useGetEmployeeDetailsQuery(parseInt(router.query.id.toString(), 10));

  const { isFetching: employeeSkillsDetailsFetching, isLoading: employeeSkillsDetailsLoading } =
    useGetEmployeeSkillsDetailsQuery(parseInt(router.query.id.toString(), 10));

  const { isFetching: employeeCertificationsFetching, isLoading: employeeCertificationsLoading } =
    useGetEmployeeCertificationsQuery(parseInt(router.query.id.toString(), 10));

  const {
    isFetching: isEmployeeAssessmentHistoryFetching,
    isLoading: isEmployeeAssessmentHistoryLoading,
  } = useGetEmployeeAssessmentHistoryQuery({
    id: parseInt(router.query.id.toString(), 10),
  });

  const { isFetching: employeeBadgesFetching, isLoading: employeeBadgesLoading } =
    useGetEmployeeBadgesQuery({
      employeeID: parseInt(router.query.id.toString(), 10),
    });

  const showPageLoader =
    (employeeDetailsFetching || employeeDetailsLoading) &&
    (isEmployeeAssessmentHistoryFetching || isEmployeeAssessmentHistoryLoading) &&
    (employeeSkillsDetailsFetching || employeeSkillsDetailsLoading) &&
    (employeeCertificationsFetching || employeeCertificationsLoading) &&
    (employeeBadgesFetching || employeeBadgesLoading);

  if (showPageLoader) {
    return <SpinnerLoader />;
  }

  const showPageFallback = employeeDetailsHasError && (employeeDetailsError as any)?.status !== 401;
  if (showPageFallback) {
    if (isClient) {
      router.back();
    }
    return '';
  }

  const htmlTitleString = `${employeeDetailsData?.data?.attributes?.name || ''} ${translate(
    'Title_Tag',
  )}`;

  return (
    <HRDrawerProvider>
      <Head>
        <title>{htmlTitleString}</title>
      </Head>

      <EmployeeDetails />
      <IndividualSkillProfile />
    </HRDrawerProvider>
  );
}

export const getServerSideProps = wrapper.getServerSideProps((store) =>
  authHOF(store, async (context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) => {
    const { locale, params } = context;

    store.dispatch(
      employeeAPI.endpoints.getEmployeeDetails.initiate(parseInt(params.id.toString(), 10)),
    );
    store.dispatch(
      employeeAPI.endpoints.getEmployeeCertifications.initiate(parseInt(params.id.toString(), 10)),
    );
    store.dispatch(
      employeeAPI.endpoints.getEmployeeAssessmentHistory.initiate({
        id: parseInt(params.id.toString(), 10),
      }),
    );
    store.dispatch(
      employeeAPI.endpoints.getEmployeeSkillsDetails.initiate(parseInt(params.id.toString(), 10)),
    );
    store.dispatch(
      employeeAPI.endpoints.getEmployeeBadges.initiate({
        employeeID: parseInt(params.id.toString(), 10),
      }),
    );

    await Promise.all(store.dispatch(employeeAPI.util.getRunningQueriesThunk()));

    return {
      props: {
        ...(await serverSideTranslations(locale, [
          'common',
          'employeeSkillProfile',
          'components/badge',
          'components/dynamicList',
          'components/skillsList',
          'components/emptyStateFallback',
        ])),
      },
    };
  }),
);
