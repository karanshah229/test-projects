import { fetchBaseQuery } from '@reduxjs/toolkit/dist/query';

import { API_VERSIONS } from 'src/constants/common';
import { getCookieStringFromCookieObj } from 'src/utils/auth';
import { getBackendURL, isServer } from 'src/utils/common';

export const baseQuery = fetchBaseQuery({
  baseUrl: getBackendURL(API_VERSIONS.v1),
  credentials: 'include',
  prepareHeaders(headers, api) {
    if (isServer) {
      const { extra: ctx } = api as any;
      let cookies = {};
      if ('req' in ctx && ctx.req && 'cookies' in ctx.req && ctx.req.cookies) {
        cookies = ctx.req.cookies;
      }

      const cookieValue = getCookieStringFromCookieObj(cookies);

      headers.set('cookie', cookieValue);
      return headers;
    }
    return headers;
  },
  timeout: 12000,
});
