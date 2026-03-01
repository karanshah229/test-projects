import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';

import { Counter } from 'src/features/counter/Counter';
import { Localise } from 'src/features/localise/localise';
import { counterApi } from 'src/services/counter';

import Home from '../components/Home/Home';
import { wrapper } from '../store';

export default function IndexPage() {
  return (
    <div className="hr-m-0.75">
      <Head>
        <title>Hackerrank Next.js Starter</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Home />
      <Counter />
      <Localise />
    </div>
  );
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ locale }) => {
  store.dispatch(counterApi.endpoints.getInitCounterVal.initiate());
  await Promise.all(store.dispatch(counterApi.util.getRunningQueriesThunk()));
  return {
    props: {
      ...(await serverSideTranslations(locale, ['home'])),
    },
  };
});
