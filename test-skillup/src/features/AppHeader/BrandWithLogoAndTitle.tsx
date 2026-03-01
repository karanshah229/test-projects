import { HRClickableDiv, HRHeaderBrand } from '@hackerrank/hrds-components';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useContext, useState } from 'react';

import { HackerRankLogo } from 'src/components/HackerrankLogo';
import { PageTransitionLoaderContext } from 'src/contexts/PageTransitionLoaderContext';
import { useAppSelector } from 'src/hooks';
import { useInterval } from 'src/hooks/useInterval';
import { getUserProfileData } from 'src/slices/userDetailsSlice';
import { store } from 'src/store';
import { redirectToHomePage } from 'src/utils/auth';

import { AppSwitcher } from './AppSwitcher/AppSwitcher';

function BrandWithLogoAndTitle() {
  const router = useRouter();
  const { skillUpUserData } = useAppSelector(getUserProfileData);
  const { t: translate } = useTranslation('common');
  const { setPageLoading } = useContext(PageTransitionLoaderContext);

  // TODO: Remove after https://github.com/kirill-konshin/next-redux-wrapper/issues/559 solved
  const [userRole, setUserRole] = useState(skillUpUserData.data?.attributes?.role);

  useInterval(
    () => {
      setUserRole(store.getState().userDetails.skillUpUserData?.data?.attributes?.role);
    },
    userRole === null || userRole === undefined ? 500 : null,
  );

  return (
    <div className="hr-flex" style={{ gap: 'var(--hr-spacing-07)' }}>
      <HRClickableDiv
        className="hr-flex"
        onClick={() => {
          setPageLoading(true);
          return userRole ? redirectToHomePage(userRole) : router.push('/overview');
        }}
      >
        <HRHeaderBrand logo={<HackerRankLogo title={translate('hackerrank_logo_title')} />} />
      </HRClickableDiv>
      <AppSwitcher />
    </div>
  );
}

export { BrandWithLogoAndTitle };
