import { createApi, retry } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';

import { isServer } from 'src/utils/common';

import { clientBaseQueryWithReAuth } from './clientFetchBaseQueryWithReAuth';
import { serverBaseQueryWithReAuth } from './serverFetchBaseQueryWithReAuth';

// initialize an empty api service that we'll inject endpoints into dynamically
export const rootApi = createApi({
  reducerPath: 'rootApi',
  baseQuery: retry(isServer ? serverBaseQueryWithReAuth : clientBaseQueryWithReAuth, {
    maxRetries: 0,
  }),
  keepUnusedDataFor: 60, // 1 minute
  /* istanbul ignore next */
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }

    return undefined;
  },
  endpoints: () => ({}),
});
