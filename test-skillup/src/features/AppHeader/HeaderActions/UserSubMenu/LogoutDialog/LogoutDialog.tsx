import { HRButton, HRCheckbox, HRDialog } from '@hackerrank/hrds-components';
import { useTranslation } from 'next-i18next';
import { SyntheticEvent, useState } from 'react';

import { LogoutType } from 'src/types/auth';

function LogoutDialogBody({
  logoutFromMultipleSessions,
  setLogoutFromMultiSessions,
}: {
  logoutFromMultipleSessions: boolean;
  setLogoutFromMultiSessions: (value: boolean, event: SyntheticEvent<Element, Event>) => void;
}) {
  const { t: translate } = useTranslation('common');
  return (
    <HRDialog.Body>
      <div className="hr-flex hr-col" style={{ gap: 'var(--hr-spacing-04)' }}>
        <div>
          <p className="hr-body-01">{translate('app_header.logout_dialog_body')}</p>
        </div>
        <div>
          <HRCheckbox
            id="default-checkbox-story"
            label={translate('app_header.logout_dialog_checkbox_label')}
            checked={logoutFromMultipleSessions}
            onCheckedChange={setLogoutFromMultiSessions}
          />
        </div>
      </div>
    </HRDialog.Body>
  );
}

function LogoutDialogFooter({
  logoutFromMultipleSessions,
  logoutUser,
}: {
  logoutFromMultipleSessions: boolean;
  logoutUser: (logoutType: LogoutType) => void;
}) {
  const { t: translate } = useTranslation('common');
  const [logoutClicked, setLogoutClicked] = useState(false);

  return (
    <HRDialog.Footer className="hr-flex hr-justify-end hr-align-center hr-gap-0.75">
      <HRDialog.Close>
        <HRButton variant="secondary" isDisabled={logoutClicked}>
          {translate('app_header.logout_dialog_cancel_button')}
        </HRButton>
      </HRDialog.Close>
      <HRButton
        variant="primary"
        onClick={() => {
          setLogoutClicked(true);
          logoutUser(
            logoutFromMultipleSessions === true
              ? LogoutType.LogoutFromMultiSession
              : LogoutType.LogoutFromCurrentSession,
          );
        }}
        isLoading={logoutClicked}
        loadingText={translate('app_header.logout_dialog_logout_button')}
      >
        {translate('app_header.logout_dialog_logout_button')}
      </HRButton>
    </HRDialog.Footer>
  );
}

export function LogoutDialog({
  isLogoutDialogOpen,
  setLogoutDialogOpen,
  logoutUser,
}: {
  isLogoutDialogOpen: boolean;
  setLogoutDialogOpen: (isPopupOpen: boolean) => void;
  logoutUser: (logoutType: LogoutType) => void;
}) {
  const [logoutFromMultipleSessions, setLogoutFromMultiSessions] = useState(true);
  const { t: translate } = useTranslation('common');

  return (
    <HRDialog.Root
      size="sm"
      open={isLogoutDialogOpen}
      onOpenChange={() => {
        setLogoutDialogOpen(false);
        setLogoutFromMultiSessions(true);
      }}
    >
      <HRDialog.Content>
        <HRDialog.Header title={translate('app_header.logout_dialog_header')} renderCloseIcon />
        <LogoutDialogBody
          logoutFromMultipleSessions={logoutFromMultipleSessions}
          setLogoutFromMultiSessions={setLogoutFromMultiSessions}
        />
        <LogoutDialogFooter
          logoutUser={logoutUser}
          logoutFromMultipleSessions={logoutFromMultipleSessions}
        />
      </HRDialog.Content>
    </HRDialog.Root>
  );
}
