import { HRDrawerProvider } from '@hackerrank/hrds-components';
import { GetServerSidePropsContext, PreviewData } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ParsedUrlQuery } from 'querystring';

import { authHOF } from 'src/HOF/auth';
import { SpinnerLoader } from 'src/components/SpinnerLoader/SpinnerLoader';
import { OrganisationOverview } from 'src/features/OrganisationOverview/OrganisationOverview';
import { certificationsAPI, useGetCertificationsOverviewQuery } from 'src/services/Certifications';
import { skillsAPI, useGetSkillsOverviewQuery } from 'src/services/Skills';
import { wrapper } from 'src/store';
import { isClient } from 'src/utils/common';

export default function Overiew() {
  const router = useRouter();
  const { t: translate } = useTranslation('organisationOverview');

  const {
    isFetching: certificationsOverviewFetching,
    isLoading: certificationsOverviewLoading,
    isError: certificationsOverviewHasError,
  } = useGetCertificationsOverviewQuery({});

  const {
    isFetching: skillsOverviewFetching,
    isLoading: skillsOverviewLoading,
    isError: skillsOverviewHasError,
  } = useGetSkillsOverviewQuery({});

  const showPageLoader =
    skillsOverviewFetching ||
    skillsOverviewLoading ||
    certificationsOverviewFetching ||
    certificationsOverviewLoading;

  if (showPageLoader) {
    return <SpinnerLoader msg={translate('page_loader')} />;
  }

  const showPageFallback =
    skillsOverviewHasError &&
    (skillsOverviewHasError as any)?.status !== 401 &&
    certificationsOverviewHasError &&
    (certificationsOverviewHasError as any)?.status !== 401;

  if (showPageFallback) {
    if (isClient) {
      router.back();
    }
    return '';
  }

  return (
    <HRDrawerProvider>
      <Head>
        <title>{translate('title_tag')}</title>
      </Head>

      <OrganisationOverview />
    </HRDrawerProvider>
  );
}

export const getServerSideProps = wrapper.getServerSideProps((store) =>
  authHOF(store, async (context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) => {
    const { locale } = context;

    store.dispatch(certificationsAPI.endpoints.getCertificationsOverview.initiate({}));
    store.dispatch(skillsAPI.endpoints.getSkillsOverview.initiate({}));

    await Promise.all(store.dispatch(certificationsAPI.util.getRunningQueriesThunk()));
    await Promise.all(store.dispatch(skillsAPI.util.getRunningQueriesThunk()));

    return {
      props: {
        ...(await serverSideTranslations(locale, [
          'common',
          'organisationOverview',
          'components/skillsList',
          'components/emptyStateFallback',
        ])),
      },
    };
  }),
);
