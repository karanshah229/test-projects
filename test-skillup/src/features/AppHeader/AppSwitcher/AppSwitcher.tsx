import { HRDropdownMenu, HRSpinner } from '@hackerrank/hrds-components';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';

import { ChevronDownIcon, ChevronUpIcon } from 'ui-icons';

import { useAppSelector } from 'src/hooks';
import { useInterval } from 'src/hooks/useInterval';
import { getHRWUserProfileData } from 'src/slices/userDetailsSlice';
import { store } from 'src/store';
import { Application, HRWUserDetailsType } from 'src/types/api/User';

import styles from './AppSwitcher.module.scss';
import { APPLICATIONS } from './constants';

type AppOption = {
  title: string;
  value: Application;
  link: string;
};

function getActiveApplications(data: HRWUserDetailsType): AppOption[] {
  const { applications_enabled: applicationEnabled = [] } = data;
  return applicationEnabled.map((app) => {
    const { link = '', title = '' } = APPLICATIONS[app] || {};
    return {
      title,
      value: app,
      link,
    };
  });
}

export function AppSwitcher() {
  const { t: translate } = useTranslation('common');

  const {
    HRWUserData: _HRWUserData,
    HRWUserProfileDataLoading: _HRWUserProfileDataLoading,
    HRWUserProfileDataHasError: _HRWUserProfileDataHasError,
  } = useAppSelector(getHRWUserProfileData);

  // TODO: Remove after https://github.com/kirill-konshin/next-redux-wrapper/issues/559 solved
  const [HRWUserData, setHRWUserData] = useState(_HRWUserData);
  const [HRWUserProfileDataLoading, setHRWUserProfileDataLoading] = useState(
    _HRWUserProfileDataLoading,
  );
  const [HRWUserProfileDataHasError, setHRWUserProfileDataHasError] = useState(
    _HRWUserProfileDataHasError,
  );

  useInterval(
    () => {
      const {
        HRWUserData: __HRWUserData,
        HRWUserProfileDataLoading: __HRWUserProfileDataLoading,
        HRWUserProfileDataHasError: __HRWUserProfileDataHasError,
        skillUpUserProfileDataLoading,
      } = store.getState().userDetails;
      setHRWUserData(__HRWUserData);
      setHRWUserProfileDataLoading(__HRWUserProfileDataLoading || skillUpUserProfileDataLoading);
      setHRWUserProfileDataHasError(__HRWUserProfileDataHasError);
    },
    Object.keys(HRWUserData).length === 1 ? 500 : null,
  );

  const [isAppSwitcherMenuOpen, setAppSwitcherMenuOpen] = useState<boolean>(false);

  const activeApplications = getActiveApplications(HRWUserData);

  const skillUpTitle = APPLICATIONS.skillup.title;
  const skillUpTitleLowerCase = skillUpTitle.toLowerCase();

  const onApplicationClicked = (value: Application) => {
    const { link } = APPLICATIONS[value];
    if (value === skillUpTitleLowerCase) {
      window.location.assign(link);
    } else {
      window.open(link, '_blank', 'noreferrer');
    }
  };

  if (activeApplications.length === 0) return null;

  if (HRWUserProfileDataHasError || activeApplications.length === 1) {
    return <div>{translate('skillup_product_title')}</div>;
  }

  return (
    <div className={styles.appSwitcher}>
      <HRDropdownMenu.Root onOpenChange={(open: boolean) => setAppSwitcherMenuOpen(open)}>
        <HRDropdownMenu.Trigger aria-label={skillUpTitle} className="text-white">
          <span className="hr-p-r-0.5 ">{skillUpTitle}</span>
          {HRWUserProfileDataLoading ? (
            <HRSpinner size="xs" className="text-white" />
          ) : isAppSwitcherMenuOpen ? (
            <ChevronUpIcon />
          ) : (
            <ChevronDownIcon />
          )}
        </HRDropdownMenu.Trigger>
        <HRDropdownMenu.Content side="bottom" align="start" alignOffset={-16}>
          {activeApplications.map(({ title, value }) => (
            <HRDropdownMenu.Item
              onClick={() => onApplicationClicked(value)}
              key={title}
              className={`${value === skillUpTitleLowerCase ? styles.selectedMenuItem : ''}`}
              isSelected={value === skillUpTitleLowerCase}
            >
              {title}
            </HRDropdownMenu.Item>
          ))}
        </HRDropdownMenu.Content>
      </HRDropdownMenu.Root>
    </div>
  );
}
