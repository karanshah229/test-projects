import {
  HRAvatar,
  HRClickableDiv,
  HRHeaderUserPopover,
  HRSpinner,
} from '@hackerrank/hrds-components';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useEffect, useRef, useState } from 'react';

import { HandleInteractionOutside } from 'src/components/HandleInteractionOutside';
import { HEADER_USER_DROPDOWN_ACTIONS } from 'src/constants/common';
import { useAppSelector } from 'src/hooks';
import { useInterval } from 'src/hooks/useInterval';
import { useLogoutUserMutation } from 'src/services/User';
import { getUserProfileData } from 'src/slices/userDetailsSlice';
import { store } from 'src/store';
import { LogoutErrorResponse } from 'src/types/api/User';
import { LogoutType } from 'src/types/auth';
import { redirectToHRWLogin } from 'src/utils/auth';
import { getUserFullName, getUserInitials } from 'src/utils/common';
import { identifyFullstoryUser } from 'src/utils/fullstory';

import { LogoutDialog } from './LogoutDialog/LogoutDialog';
import styles from './UserSubMenu.module.scss';

function UserSubMenu() {
  const { t: translate } = useTranslation('common');

  const {
    skillUpUserData: _skillUpUserData,
    skillUpUserProfileDataLoading: _skillUpUserProfileDataLoading,
    skillUpUserProfileDataHasError: _skillUpUserProfileDataHasError,
  } = useAppSelector(getUserProfileData);

  // TODO: Remove after https://github.com/kirill-konshin/next-redux-wrapper/issues/559 solved
  const [skillUpUserData, setSkillUpUserData] = useState(_skillUpUserData);
  const [skillUpUserProfileDataLoading, setSkillUpUserProfileDataLoading] = useState(
    _skillUpUserProfileDataLoading,
  );
  const [skillUpUserProfileDataHasError, setSkillUpUserProfileDataHasError] = useState(
    _skillUpUserProfileDataHasError,
  );

  useInterval(
    () => {
      const {
        skillUpUserData: __skillUpUserData,
        skillUpUserProfileDataLoading: __skillUpUserProfileDataLoading,
        skillUpUserProfileDataHasError: __skillUpUserProfileDataHasError,
      } = store.getState().userDetails;
      setSkillUpUserData(__skillUpUserData);
      setSkillUpUserProfileDataLoading(__skillUpUserProfileDataLoading);
      setSkillUpUserProfileDataHasError(__skillUpUserProfileDataHasError);
    },
    Object.keys(skillUpUserData).length === 0 ? 500 : null,
  );

  const [userSubMenuOpen, setUserSubMenuOpen] = useState(false);

  const [logoutUser, logoutResult] = useLogoutUserMutation();
  const [isLogoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const ignoreClickOutsideRef = useRef(null);

  useEffect(() => {
    const { error: logoutError, data: logoutResponse } = logoutResult;

    if (logoutError) {
      const logoutErr = (logoutError as LogoutErrorResponse) || ({} as LogoutErrorResponse);
      setLogoutDialogOpen(logoutErr?.data?.active_sessions > 1);
      setUserSubMenuOpen(false);
    } else if (logoutResponse?.status) {
      redirectToHRWLogin(null, null, false);
    }
  }, [logoutResult]);

  // Setup Fullstory User Data
  identifyFullstoryUser({ user: skillUpUserData });

  const tryLogout = () => {
    logoutUser(LogoutType.TryLogout);
  };

  const { data: { attributes: { first_name, last_name } = {} } = {} } = skillUpUserData;
  const userInitials = getUserInitials(first_name, last_name);
  const userFullName = getUserFullName(first_name, last_name);

  if (skillUpUserProfileDataHasError || !skillUpUserData) return null;

  return (
    <>
      <HandleInteractionOutside
        onClickOutside={() => setUserSubMenuOpen(false)}
        ignoreRefs={[ignoreClickOutsideRef]}
      >
        <HRHeaderUserPopover
          avatar={
            <HRAvatar
              size="medium"
              color="light"
              aria-label={`${userFullName} ${translate('app_header.aria_label')} ${userInitials}`}
            >
              {skillUpUserProfileDataLoading ? <HRSpinner size="xs" /> : userInitials}
            </HRAvatar>
          }
          open={userSubMenuOpen}
          onOpenChange={(open: boolean) => setUserSubMenuOpen(open)}
        >
          <div role="menu" className={styles.headerAccountSubmenu} ref={ignoreClickOutsideRef}>
            {userFullName ? (
              <div className={styles.top}>
                <div className={styles.userName}>{userFullName}</div>
              </div>
            ) : null}
            <ul role="none" className={styles.bottom}>
              {HEADER_USER_DROPDOWN_ACTIONS.map((userDropdownAction) => (
                <HRClickableDiv
                  // @ts-ignore
                  as="li"
                  onClick={() => setUserSubMenuOpen(false)}
                >
                  <Link
                    href={userDropdownAction.actionLink}
                    key={userDropdownAction.actionTitleI18nKey}
                  >
                    {translate(`app_header.${userDropdownAction.actionTitleI18nKey}`)}
                  </Link>
                </HRClickableDiv>
              ))}
              <HRClickableDiv
                onClick={tryLogout}
                // @ts-ignore
                as="li"
                className="hr-flex hr-align-center hr-gap-0.5"
                disabled={logoutResult?.isLoading}
              >
                {translate('app_header.logout')}
                {logoutResult?.isLoading ? <HRSpinner size="xs" /> : null}
              </HRClickableDiv>
            </ul>
          </div>
        </HRHeaderUserPopover>
      </HandleInteractionOutside>
      <LogoutDialog
        isLogoutDialogOpen={isLogoutDialogOpen}
        setLogoutDialogOpen={setLogoutDialogOpen}
        logoutUser={logoutUser}
      />
    </>
  );
}

export { UserSubMenu };
