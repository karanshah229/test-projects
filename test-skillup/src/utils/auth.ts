// TODO: Add more comments, types and examples in this file
import throttle from 'lodash/throttle';
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';

import {
  COOKIE_KEYS_TO_INCLUDE,
  HOURS_6_IN_MILLISECONDS,
  ONBOARDING_ROUTE,
  ROUTE_PERMISSIONS_INDEX,
  UserRoleHomePageMapping,
} from 'src/constants/common';
import { getServerGlobal, pruneJWTTokens } from 'src/services/common/serverGlobal';
import { UserRolesType } from 'src/types/auth';

import { getCurrentURL, isServer, redirect, trim_Next_SSR_URL } from './common';

import type { IncomingMessage, ServerResponse } from 'http';

export const throttledPruneJWTTokens = isServer
  ? throttle(pruneJWTTokens, HOURS_6_IN_MILLISECONDS, {
      leading: true,
    })
  : () => {};

export function getCookieStringFromCookieObj(cookies: any) {
  let cookieKeysToInclude = [...COOKIE_KEYS_TO_INCLUDE];
  const refreshCallResponseCookies = getServerGlobal(
    `refreshTokenResponseCookiesCache.${cookies.jwt_refresh_token}.refreshCallResponseCookies`,
  ) as [];
  if (refreshCallResponseCookies) {
    // If new tokens exists, i.e. Refresh call was made, remove old tokens if any
    const keysToRemove = ['jwt_access_token', 'jwt_refresh_token'];
    cookieKeysToInclude = cookieKeysToInclude.filter(
      (cookieKey) => !keysToRemove.includes(cookieKey),
    );
  }

  return Object.entries(cookies)
    .filter(([key]) => cookieKeysToInclude.includes(key))
    .map(([k, v]) => `${k}=${v}`)
    .concat(refreshCallResponseCookies)
    .join('; ');
}

export function extractHeaderValues(headers: Headers, headerKeys: string[]) {
  const iter = headers.entries();
  let { value, done } = iter.next();
  const headerValues = [];
  while (!done) {
    if (headerKeys.includes(value[0])) headerValues.push(value[1]);
    ({ value, done } = iter.next());
  }
  return headerValues;
}

export function getHRWLoginRedirectUrl(currentURL?: ReturnType<typeof getCurrentURL>) {
  return currentURL ? `/work/login?redirect=${encodeURIComponent(currentURL)}` : '/work/login';
}

export async function redirectToHRWLogin(
  req?: NextApiRequest,
  res?: NextApiResponse,
  addRedirectParamInURL: boolean = false, // add redirect param only if redirect to login is done by application and not user
) {
  const redirectURL = getHRWLoginRedirectUrl(addRedirectParamInURL ? getCurrentURL(req) : '');
  redirect(redirectURL, res);
}

export function isUserLoggedOut(
  req: NextApiRequest | GetServerSidePropsContext['req'] = {} as NextApiRequest,
) {
  const { cookies = {} } = req;
  const { jwt_access_token: jwtAccessToken = '', jwt_refresh_token: jwtRefreshToken = '' } =
    cookies;

  if (!jwtAccessToken && !jwtRefreshToken) return true;
  return false;
}

export function redirectToHomePage(
  role: UserRolesType,
  res?: NextApiResponse | ServerResponse<IncomingMessage>,
) {
  if (!role) return;

  const url = UserRoleHomePageMapping[role];
  redirect(url, res);
}

export function redirectToOnboarding(res?: NextApiResponse | ServerResponse<IncomingMessage>) {
  return redirect(ONBOARDING_ROUTE, res);
}

/**
 *
 * @param url url to get permissions for
 * @returns `[]` if the route can't be found.
 *
 * `null` in the following conditions
 * 1. Random / Invalid values - /asdljasd.asdioej, /ao**({s+d
 * 2. Incorrect, unavailable route values - '/overview/test'
 */
export function getCurrentRouteAllowedRoles(url: string) {
  let matchedRole: UserRolesType[] = null;
  const decodedURL = decodeURIComponent(url);

  // For routes without any dynamic parts - eg: /emplyoees/home, /overview
  if (ROUTE_PERMISSIONS_INDEX[decodedURL] !== undefined) return ROUTE_PERMISSIONS_INDEX[decodedURL];

  let parsedRoute = '';
  if (decodedURL.startsWith('/_next/data')) {
    parsedRoute = trim_Next_SSR_URL(decodedURL);
  }

  Object.keys(ROUTE_PERMISSIONS_INDEX).forEach((route) => {
    // Regex https://github.com/interviewstreet/skillup-frontend/issues/156
    const routePattern = `${route.replace(/\//g, '\\/').replace(/\[(.*?)\]/g, '(.*?)')}(/|$)`;

    const regex = new RegExp(`^${routePattern}$`);

    const pathSegments = parsedRoute.split('/').filter(Boolean);
    const routeSegments = route.split('/').filter(Boolean);

    if (pathSegments.length === routeSegments.length) {
      let isMatch = true;

      for (let i = 0; i < routeSegments.length; i += 1) {
        if (!(routeSegments[i].startsWith('[') && routeSegments[i].endsWith(']'))) {
          if (pathSegments[i] !== routeSegments[i]) {
            isMatch = false;
            break;
          }
        }
      }

      if (isMatch && parsedRoute.match(regex)) {
        matchedRole = ROUTE_PERMISSIONS_INDEX[route];
      }
    }
  });

  return matchedRole;
}
