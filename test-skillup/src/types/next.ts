import type { NextPage } from 'next';
import type { ReactNode } from 'react';

export type Page<P = {}> = NextPage<P> & {
  getLayout?: (page: ReactNode, pageProps: any) => ReactNode;
};
