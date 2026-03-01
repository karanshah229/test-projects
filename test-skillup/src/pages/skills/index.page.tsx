import { GetServerSidePropsContext, PreviewData } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ParsedUrlQuery } from 'querystring';

import { authHOF } from 'src/HOF/auth';
import { SpinnerLoader } from 'src/components/SpinnerLoader/SpinnerLoader';
import { SkillsDirectory } from 'src/features/SkillsDirectory/SkillsDirectory';
import {
  SkillDirectoryAdditionalAttributes,
  skillsAPI,
  useGetSkillsDirectoryQuery,
} from 'src/services/Skills';
import { wrapper } from 'src/store';
import { isClient } from 'src/utils/common';

export default function Skills() {
  const router = useRouter();
  const { t: translate } = useTranslation('skillsDirectory');

  const {
    isFetching: skillsListingDataFetching,
    isLoading: skillsListingDataLoading,
    isError: skillsListingDataHasError,
    error: skillsListingDataError,
  } = useGetSkillsDirectoryQuery({
    additional_attributes: SkillDirectoryAdditionalAttributes.JOB_FAMILIES,
  });

  const showPageLoader = skillsListingDataFetching || skillsListingDataLoading;

  if (showPageLoader) {
    return <SpinnerLoader msg={translate('page_loader')} />;
  }

  const showPageFallback =
    skillsListingDataHasError && (skillsListingDataError as any)?.status !== 401;

  if (showPageFallback) {
    if (isClient) {
      router.back();
    }
    return null;
  }

  return (
    <>
      <Head>
        <title>{translate('page_title')}</title>
      </Head>
      <SkillsDirectory />
    </>
  );
}

export const getServerSideProps = wrapper.getServerSideProps((store) =>
  authHOF(store, async (context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) => {
    const { locale } = context;
    store.dispatch(
      skillsAPI.endpoints.getSkillsDirectory.initiate({
        additional_attributes: SkillDirectoryAdditionalAttributes.JOB_FAMILIES,
      }),
    );
    await Promise.all(store.dispatch(skillsAPI.util.getRunningQueriesThunk()));
    return {
      props: {
        ...(await serverSideTranslations(locale, [
          'common',
          'skillsDirectory',
          'components/search',
        ])),
      },
    };
  }),
);
