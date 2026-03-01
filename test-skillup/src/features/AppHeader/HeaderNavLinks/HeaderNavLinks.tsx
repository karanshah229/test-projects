import { HRClickableDiv, HRHeaderNavbar } from '@hackerrank/hrds-components';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useContext, useEffect, useState } from 'react';

import { ROUTES } from 'src/constants/common';
import { PageTransitionLoaderContext } from 'src/contexts/PageTransitionLoaderContext';
import { useAppSelector } from 'src/hooks';
import { useInterval } from 'src/hooks/useInterval';
import { getHRWUserProfile, getSkillUpUserProfile, getUserRole } from 'src/slices/userDetailsSlice';
import { store } from 'src/store';
import { RouteShownInHeader } from 'src/types/common';
import { getNavActiveState } from 'src/utils/common';

async function getUserData() {
  const getSkillUpUserProfileAPIData = (await store.dispatch(getSkillUpUserProfile())) as any;
  const hrw_accessible = getSkillUpUserProfileAPIData?.payload?.data?.attributes?.hrw_accessible;
  const userRole = getSkillUpUserProfileAPIData?.payload?.data?.attributes?.role;

  if (hrw_accessible) await store.dispatch(getHRWUserProfile());

  return userRole;
}

function HeaderNavLinks() {
  const router = useRouter();
  const { t: translate } = useTranslation('common');
  const { setPageLoading } = useContext(PageTransitionLoaderContext);

  // TODO: Remove after https://github.com/kirill-konshin/next-redux-wrapper/issues/559 solved
  const [userRole, setUserRole] = useState(useAppSelector(getUserRole) || null);

  useEffect(() => {
    if (!userRole) getUserData();
  }, [userRole]);

  useInterval(
    () => {
      setUserRole(store.getState().userDetails.skillUpUserData.data?.attributes?.role || null);
    },
    userRole === null ? 500 : null,
  );

  // Assumption - Only top level routes will be considered to be shown in header for now
  const userRoleBasedRoutes = ROUTES.filter((route) => route.roles_allowed.includes(userRole));

  return (
    <HRHeaderNavbar key={router.asPath}>
      {userRoleBasedRoutes.map((route) => {
        if (!route.appHeaderNavLinkOptions.showInHeader) return null;

        const navTitle = (route.appHeaderNavLinkOptions as RouteShownInHeader).i18nTitleKey || '';
        const navURL = route.path || '';
        const childRoutes = route.childRoutes || [];
        const navLinkActive = getNavActiveState({
          routerAsPath: router.asPath,
          navURL,
          childRoutes,
          currentPathname: router.pathname,
        });

        return (
          <Link
            href={navURL}
            data-active={navLinkActive}
            className={`${navLinkActive} ? 'active': ''`}
            key={`${navTitle}-${navURL}-${navLinkActive}`}
            style={{ paddingLeft: '0', paddingRight: '0' }}
          >
            <HRClickableDiv
              onClick={() => setPageLoading(true)}
              className="hr-flex hr-align-center"
              style={{ height: '100%', padding: '0 var(--hr-spacing-06)' }}
              tabIndex={-1}
            >
              {translate(navTitle)}
            </HRClickableDiv>
          </Link>
        );
      })}
    </HRHeaderNavbar>
  );
}

export { HeaderNavLinks };
