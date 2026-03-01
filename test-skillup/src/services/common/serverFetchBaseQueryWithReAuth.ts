// Docs - https://hackerrank.atlassian.net/wiki/spaces/SKUP/pages/2578744010/JTBD+Authentication
import { Mutex, MutexInterface } from 'async-mutex';
import dayjs from 'dayjs';

import { APP_PREFIX } from 'src/constants/common';
import { extractHeaderValues, redirectToHRWLogin, throttledPruneJWTTokens } from 'src/utils/auth';
import { getBackendURLOrigin } from 'src/utils/common';
import { logger } from 'src/utils/logger';

import { baseQuery } from './baseQuery';
import { getServerGlobal, setServerGlobal } from './serverGlobal';

import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

export const serverBaseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const { extra = {} } = api as any;
  const { res = {}, req = {} } = extra;
  const { cookies = {} } = req;
  const { jwt_refresh_token: jwtRefreshToken = '' } = cookies;
  let mutex: MutexInterface = getServerGlobal(`mutexCache.${jwtRefreshToken}.mutex`);
  if (!mutex) {
    mutex = new Mutex();
    setServerGlobal(`mutexCache.${jwtRefreshToken}`, {
      mutex,
      created_at: dayjs(),
    });
  }

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
          // Forward the response headers of Token Refresh call to client
          const refreshCallResponseHeaderValues = extractHeaderValues(
            refreshResult.meta.response.headers,
            ['Set-Cookie', 'set-cookie'],
          );
          if (!res.writableEnded) {
            res.setHeader('Set-Cookie', [...refreshCallResponseHeaderValues]);
          }

          setServerGlobal(`refreshTokenResponseCookiesCache.${jwtRefreshToken}`, {
            refreshCallResponseCookies: refreshCallResponseHeaderValues,
            created_at: dayjs(),
          });

          // retry the initial query
          result = await baseQuery(args, api, extraOptions);
          if (result.meta.response.status === 401) {
            // Token mismatch - redirect to login
            redirectToHRWLogin(req, res, true);
          }
        } else {
          // Logged out case - No refresh, access token in original query
          redirectToHRWLogin(req, res, true);
        }
      } catch (error) {
        logger.error({
          message: 'Error fetching refresh token on server',
          error,
        });
      } finally {
        mutex.release();
        throttledPruneJWTTokens();
      }
    } else {
      // Other API calls wait for mutex to unlock i.e. Refresh token call to finish.
      await mutex.waitForUnlock();
      // Original API call is made with new tokens
      result = await baseQuery(args, api, extraOptions);
      if (result.meta.response.status === 401) {
        // Token mismatch - redirect to login
        redirectToHRWLogin(req, res, true);
      }
    }
  } else if (result.error && result.error.status === 403) {
    // User does not have access to resource
    const redirectURL = `${APP_PREFIX}/403`;
    if (!res.writableEnded) {
      res.writeHead(307, { Location: redirectURL });
      res.end();
    }
  }
  return result;
};
