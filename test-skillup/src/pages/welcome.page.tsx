import { GetServerSidePropsContext, PreviewData } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ParsedUrlQuery } from 'querystring';

import { authHOF } from 'src/HOF/auth';
import { SpinnerLoader } from 'src/components/SpinnerLoader/SpinnerLoader';
import { ONBOARDING_STATUS } from 'src/constants/common';
import { Onboarding } from 'src/features/Onboarding/Onboarding';
import { jobRolesAPI, useGetJobRoleSkillsQuery } from 'src/services/JobRoles';
import { useGetUserProfileQuery, userAPI } from 'src/services/User';
import { wrapper } from 'src/store';
import { UserDetailsType } from 'src/types/api/User';
import { redirectToHomePage } from 'src/utils/auth';
import { isClient } from 'src/utils/common';

export default function Welcome() {
  const router = useRouter();
  const { t: translate } = useTranslation('welcome');
  const {
    data: userDetailsData = {} as UserDetailsType,
    isLoading: userDetailsLoading,
    isFetching: userDetailsFetching,
    isError: userDetailsHasError,
    error: userDetailsError,
  } = useGetUserProfileQuery({});

  const {
    job_role: { id: jobRoleId } = { id: '' },
    onboarding_status: onboardingStatus,
    role = 'trainee',
  } = userDetailsData?.data?.attributes || {};

  const {
    isFetching: employeeJobRolesSkillsFetching,
    isLoading: employeeJobRolesSkillsLoading,
    isError: employeeJobRolesSkillsHasError,
    error: employeeJobRolesSkillsError,
  } = useGetJobRoleSkillsQuery(jobRoleId);

  const showPageLoader =
    employeeJobRolesSkillsFetching ||
    employeeJobRolesSkillsLoading ||
    userDetailsLoading ||
    userDetailsFetching;

  const showPageFallback =
    employeeJobRolesSkillsHasError &&
    (employeeJobRolesSkillsError as any)?.status !== 401 &&
    userDetailsHasError &&
    (userDetailsError as any)?.status !== 401;

  if (showPageLoader) {
    return <SpinnerLoader />;
  }

  if (showPageFallback) {
    if (isClient) {
      router.back();
    }
    return '';
  }

  const onboardingStatusIndex = Object.values(ONBOARDING_STATUS).indexOf(onboardingStatus);

  if (
    onboardingStatusIndex >=
    Object.values(ONBOARDING_STATUS).indexOf(ONBOARDING_STATUS.SELF_RATING_COMPLETED)
  ) {
    if (isClient) {
      redirectToHomePage(role);
    }
    return '';
  }

  return (
    <>
      <Head>
        <title>{translate('page_title')}</title>
      </Head>

      <Onboarding />
    </>
  );
}

export const getServerSideProps = wrapper.getServerSideProps((store) =>
  authHOF(store, async (context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) => {
    const { locale, res } = context;

    store.dispatch(userAPI.endpoints.getUserProfile.initiate({}));
    await Promise.all(store.dispatch(userAPI.util.getRunningQueriesThunk()));

    const userDetailsApiResponse = store.getState().rootApi.queries['getUserProfile({})']
      ?.data as UserDetailsType;

    const {
      job_role: { id: jobRoleId } = { id: '' },
      onboarding_status: onboardingStatus,
      role = 'trainee',
    } = userDetailsApiResponse?.data?.attributes || {};

    const onboardingStatusIndex = Object.values(ONBOARDING_STATUS).indexOf(onboardingStatus);
    if (
      onboardingStatusIndex >=
      Object.values(ONBOARDING_STATUS).indexOf(ONBOARDING_STATUS.SELF_RATING_COMPLETED)
    ) {
      return redirectToHomePage(role, res);
    }

    store.dispatch(jobRolesAPI.endpoints.getJobRoleSkills.initiate(jobRoleId));
    await Promise.all(store.dispatch(jobRolesAPI.util.getRunningQueriesThunk()));
    return {
      props: {
        ...(await serverSideTranslations(locale, [
          'common',
          'welcome',
          'components/employeeSkillDistributionChart',
          'components/selfRatingForm',
        ])),
      },
    };
  }),
);
