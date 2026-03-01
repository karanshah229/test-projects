// Docs - https://hackerrank.atlassian.net/wiki/spaces/SKUP/pages/2578744010/JTBD+Authentication
import { Mutex, MutexInterface } from 'async-mutex';

import { APP_PREFIX } from 'src/constants/common';
import { redirectToHRWLogin } from 'src/utils/auth';
import { getBackendURLOrigin } from 'src/utils/common';
import { logger } from 'src/utils/logger';

import { baseQuery } from './baseQuery';

import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

// create a new mutex to avoid multiple calls to refresh token
const mutex: MutexInterface = new Mutex();

export const clientBaseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Check if a refresh token call is in progress
    if (!mutex.isLocked()) {
      await mutex.acquire();
      try {
        const refreshResult = await baseQuery(
          {
            url: `${getBackendURLOrigin()}/authn/v1/session/refresh`,
            method: 'POST',
          },
          api,
          extraOptions,
        );

        if (refreshResult.meta.response.status === 201) {
          // retry the initial query
          result = await baseQuery(args, api, extraOptions);
          if (result.meta.response.status === 401) {
            // Token mismatch - redirect to login
            redirectToHRWLogin(null, null, true);
          }
        } else {
          // Logout case
          redirectToHRWLogin(null, null, true);
        }
      } catch (error) {
        logger.error({
          message: 'Error fetching refresh token on client',
          error,
        });
      } finally {
        mutex.release();
      }
    } else {
      // Other API calls wait for mutex to unlock i.e. Refresh token call to finish.
      await mutex.waitForUnlock();
      // Original API call is made with new tokens
      result = await baseQuery(args, api, extraOptions);
      if (result.meta.response.status === 401) {
        // Token mismatch - redirect to login
        redirectToHRWLogin(null, null, true);
      }
    }
  } else if (result.error && result.error.status === 403) {
    // User does not have access to resource
    const redirectURL = `${APP_PREFIX}/403`;
    window.location.assign(redirectURL);
  }
  return result;
};
