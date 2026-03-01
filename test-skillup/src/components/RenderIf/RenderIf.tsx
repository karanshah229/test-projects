import { HRSpinner } from '@hackerrank/hrds-components';

import { useAppSelector } from 'src/hooks';
import { getUserProfileData } from 'src/slices/userDetailsSlice';
import { UserRolesType } from 'src/types/auth';
import { logger } from 'src/utils/logger';

import { APIErrorFallback } from '../APIErrorFallback/APIErrorFallback';

// TODO: Add flag based rendering here
export function RenderIf({
  roles,
  children,
}: {
  roles: UserRolesType[];
  children: React.ReactNode;
}) {
  const { skillUpUserData, skillUpUserProfileDataLoading, skillUpUserProfileDataHasError } =
    useAppSelector(getUserProfileData);

  const {
    data: {
      id: userID,
      attributes: { role },
    },
  } = skillUpUserData;

  if (skillUpUserProfileDataLoading) return <HRSpinner />;
  if (skillUpUserProfileDataHasError) {
    logger.error({
      message: `Error loading user profile data for user with ID - ${userID}`,
    });
    return (
      // TODO: i18n
      <APIErrorFallback message="Could not fetch user information. Try reloading. If the problem persists, please contact customer support" />
    );
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (roles.includes(role)) return <>{children}</>;
  return null;
}
