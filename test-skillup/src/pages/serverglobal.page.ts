import { ParsedUrlQuery } from 'querystring';

import { authHOF } from 'src/HOF/auth';
import { getServerGlobal } from 'src/services/common/serverGlobal';
import { wrapper } from 'src/store';

import type { GetServerSidePropsContext, PreviewData } from 'next';

export default function ServerGlobal() {
  return '';
}

export const getServerSideProps = wrapper.getServerSideProps((store) =>
  authHOF(store, async (context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) => {
    const { res } = context;

    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(getServerGlobal()).length.toString());
    res.end();
    return {
      props: {},
    };
  }),
);
