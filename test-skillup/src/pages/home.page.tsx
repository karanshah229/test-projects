import { GetServerSidePropsContext, PreviewData } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ParsedUrlQuery } from 'querystring';

import { authHOF } from 'src/HOF/auth';
import { Home } from 'src/features/Home/Home';
import { SIDE_MENU_ITEMS } from 'src/features/Home/constants';
import { assignmentsAPI, useGetAsignmentsQuery } from 'src/services/Assignments';
import { jobRolesAPI, useGetEmployeeJobRolesDetailsQuery } from 'src/services/JobRoles';
import { UserAdditionalAttributes } from 'src/types/api/User';

import { SpinnerLoader } from '../components/SpinnerLoader/SpinnerLoader';
import { useGetUserProfileQuery, userAPI } from '../services/User';
import { wrapper } from '../store';
import { isClient } from '../utils/common';

export default function HomePage() {
  const router = useRouter();
  const { t: translate } = useTranslation('home');

  const {
    isLoading: userDetailsLoading,
    isFetching: userDetailsFetching,
    isError: userDetailsHasError,
    error: userDetailsError,
  } = useGetUserProfileQuery({
    additional_attributes: [
      UserAdditionalAttributes.BADGES_COUNT,
      UserAdditionalAttributes.CERTIFICATIONS_COUNT,
    ],
  });

  const {
    isFetching: employeeAssignmentsFetching,
    isLoading: employeeAssignmentsLoading,
    isError: employeeAssignmentsHasError,
    error: employeeAssignmentsError,
  } = useGetAsignmentsQuery();

  const {
    isFetching: employeeJobRolesDetailsFetching,
    isLoading: employeeJobRolesDetailsLoading,
    isError: employeeJobRolesDetailsHasError,
    error: employeeJobRolesDetailsError,
  } = useGetEmployeeJobRolesDetailsQuery();

  const showPageLoader =
    (userDetailsLoading || userDetailsFetching) &&
    (employeeAssignmentsFetching || employeeAssignmentsLoading) &&
    (employeeJobRolesDetailsFetching || employeeJobRolesDetailsLoading);

  if (showPageLoader) {
    return <SpinnerLoader msg={translate('page_loader')} />;
  }

  const showPageFallback =
    userDetailsHasError &&
    (userDetailsError as any)?.status !== 401 &&
    employeeAssignmentsHasError &&
    (employeeAssignmentsError as any)?.status !== 401 &&
    employeeJobRolesDetailsHasError &&
    (employeeJobRolesDetailsError as any)?.status !== 401;

  if (showPageFallback) {
    if (isClient) {
      router.back();
    }
    return '';
  }

  return (
    <>
      <Head>
        <title>{translate('title_tag')}</title>
      </Head>
      <Home selectedTab={SIDE_MENU_ITEMS.my_career.key} />
    </>
  );
}

export const getServerSideProps = wrapper.getServerSideProps((store) =>
  authHOF(store, async (context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) => {
    const { locale } = context;

    await store.dispatch(
      userAPI.endpoints.getUserProfile.initiate({
        additional_attributes: [
          UserAdditionalAttributes.BADGES_COUNT,
          UserAdditionalAttributes.CERTIFICATIONS_COUNT,
        ],
      }),
    );
    store.dispatch(jobRolesAPI.endpoints.getEmployeeJobRolesDetails.initiate());
    store.dispatch(assignmentsAPI.endpoints.getAsignments.initiate());
    await Promise.all(store.dispatch(userAPI.util.getRunningQueriesThunk()));
    await Promise.all(store.dispatch(jobRolesAPI.util.getRunningQueriesThunk()));
    await Promise.all(store.dispatch(assignmentsAPI.util.getRunningQueriesThunk()));
    return {
      props: {
        ...(await serverSideTranslations(locale, [
          'common',
          'home',
          'components/employeeSkillDistributionChart',
          'components/skillsList',
          'components/emptyStateFallback',
          'components/certificationCard',
          'components/skillCard',
          'components/selfRatingForm',
        ])),
      },
    };
  }),
);
