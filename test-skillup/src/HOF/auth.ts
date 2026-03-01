import { GetServerSidePropsContext, PreviewData } from 'next';
import { ParsedUrlQuery } from 'querystring';

import { APP_PREFIX, UN_PROTECTED_ROUTES, UserRoleHomePageMapping } from 'src/constants/common';
import { getHRWUserProfile, getSkillUpUserProfile } from 'src/slices/userDetailsSlice';
import { AppStoreType } from 'src/store';
import {
  getCurrentRouteAllowedRoles,
  getHRWLoginRedirectUrl,
  isUserLoggedOut,
  redirectToHomePage,
} from 'src/utils/auth';
import { getCurrentURL, redirect, urlContainsFilename } from 'src/utils/common';

export function authHOF(
  store: AppStoreType,
  gssp: (context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) => any,
) {
  return async function innerFn(context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) {
    // Authn
    const {
      req = {} as GetServerSidePropsContext['req'],
      res = {} as GetServerSidePropsContext['res'],
    } = context;
    if (isUserLoggedOut(req) && !UN_PROTECTED_ROUTES.includes(getCurrentURL(req))) {
      // https://github.com/interviewstreet/skillup-frontend/issues/80
      // CSR
      if (urlContainsFilename(req.url)) {
        return {
          redirect: {
            destination: getHRWLoginRedirectUrl(`${APP_PREFIX}${context.req.url}`),
            permanent: false,
            basePath: false,
          },
        };
      }
      // SSR - _app.getInitialProps
      return {
        props: {},
      };
    }

    // Authz
    const getSkillUpUserProfileAPIData = (await store.dispatch(getSkillUpUserProfile())) as any;

    const userRole = getSkillUpUserProfileAPIData?.payload?.data?.attributes?.role;

    const hrw_accessible = getSkillUpUserProfileAPIData?.payload?.data?.attributes?.hrw_accessible;

    const currentRouteAllowedRoles = getCurrentRouteAllowedRoles(context.req.url);
    if (currentRouteAllowedRoles && !currentRouteAllowedRoles.includes(userRole)) {
      if (UserRoleHomePageMapping[userRole] === `${APP_PREFIX}${context.req.url}`) {
        // HomePage itself is not accessible
        redirect(`${APP_PREFIX}/404`, res);
      } else {
        redirectToHomePage(userRole, res);
      }
    }

    if (hrw_accessible) await store.dispatch(getHRWUserProfile());

    return gssp(context);
  };
}
