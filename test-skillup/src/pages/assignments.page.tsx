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
import { jobRolesAPI } from 'src/services/JobRoles';
import { UserAdditionalAttributes } from 'src/types/api/User';

import { SpinnerLoader } from '../components/SpinnerLoader/SpinnerLoader';
import { employeeAPI } from '../services/Employees';
import { useGetUserProfileQuery, userAPI } from '../services/User';
import { wrapper } from '../store';
import { isClient } from '../utils/common';

export default function AssignmentPage() {
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

  const showPageLoader =
    userDetailsLoading ||
    userDetailsFetching ||
    employeeAssignmentsFetching ||
    employeeAssignmentsLoading;

  if (showPageLoader) {
    return <SpinnerLoader msg={translate('page_loader')} />;
  }

  const showPageFallback =
    userDetailsHasError &&
    (userDetailsError as any)?.status !== 401 &&
    employeeAssignmentsHasError &&
    (employeeAssignmentsError as any)?.status !== 401;

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
      <Home selectedTab={SIDE_MENU_ITEMS.assigned_to_me.key} />
    </>
  );
}

export const getServerSideProps = wrapper.getServerSideProps((store) =>
  authHOF(store, async (context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) => {
    const { locale } = context;

    store.dispatch(
      userAPI.endpoints.getUserProfile.initiate({
        additional_attributes: [
          UserAdditionalAttributes.BADGES_COUNT,
          UserAdditionalAttributes.CERTIFICATIONS_COUNT,
        ],
      }),
    );
    store.dispatch(jobRolesAPI.endpoints.getEmployeeJobRolesDetails.initiate());
    store.dispatch(assignmentsAPI.endpoints.getAsignments.initiate());
    await Promise.all(store.dispatch(employeeAPI.util.getRunningQueriesThunk()));
    await Promise.all(store.dispatch(userAPI.util.getRunningQueriesThunk()));
    await Promise.all(store.dispatch(jobRolesAPI.util.getRunningQueriesThunk()));
    await Promise.all(store.dispatch(assignmentsAPI.util.getRunningQueriesThunk()));
    return {
      props: {
        ...(await serverSideTranslations(locale, [
          'common',
          'home',
          'components/employeeSkillDistribution',
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
