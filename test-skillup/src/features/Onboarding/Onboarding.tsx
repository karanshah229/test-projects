import { useToast } from '@hackerrank/hrds-components';
import { useTranslation } from 'next-i18next';
import { useCallback, useState } from 'react';

import { APIErrorFallback } from 'src/components/APIErrorFallback/APIErrorFallback';
import { EmployerCard } from 'src/components/EmployerCard/EmployerCard';
import { SpinnerLoader } from 'src/components/SpinnerLoader/SpinnerLoader';
import { ONBOARDING_STATUS } from 'src/constants/common';
import { useGetUserProfileQuery, useUpdateUserDetailsMutation } from 'src/services/User';
import { UserDetailsDataAttributesType, UserDetailsType } from 'src/types/api/User';
import { OnboardingStatusType } from 'src/types/common';
import { getUserFullName } from 'src/utils/common';

import { ProductPreview } from './ProductPreview';
import { ProfileSetup } from './ProfileSetup';
import { SelfRating } from './SelfRating';

function OnboardingContent({
  uiOnboardingStatus,
  userDetailsAttributes,
  updateOnboardingStatus,
}: {
  uiOnboardingStatus: OnboardingStatusType;
  userDetailsAttributes: UserDetailsDataAttributesType;
  updateOnboardingStatus: (status: OnboardingStatusType) => Promise<boolean>;
}) {
  const {
    first_name: firstName,
    last_name: lastName,
    job_role: jobRole,
    role,
  } = userDetailsAttributes || {};
  const { name: jobRoleName, id: jobRoleId } = jobRole || {};

  switch (uiOnboardingStatus) {
    case ONBOARDING_STATUS.PENDING:
      return (
        <ProductPreview
          updateOnboardingStatus={updateOnboardingStatus}
          name={getUserFullName(firstName, lastName)}
          jobRoleName={jobRoleName}
        />
      );
    case ONBOARDING_STATUS.PRODUCT_PREVIEW_COMPLETED:
      return (
        <SelfRating
          updateOnboardingStatus={updateOnboardingStatus}
          jobRoleName={jobRoleName}
          jobRoleId={jobRoleId}
        />
      );
    case ONBOARDING_STATUS.PROFILE_SETUP_LOADER:
      return <ProfileSetup role={role} />;
    default:
      return <APIErrorFallback />;
  }
}

export function Onboarding() {
  const { t: translate } = useTranslation('welcome');
  const {
    data: userDetailsData = {} as UserDetailsType,
    isLoading: userDetailsLoading,
    isFetching: userDetailsFetching,
    isError: userDetailsHasError,
    error: userDetailsError,
  } = useGetUserProfileQuery({});
  const [updateUserDetailsMutation, { isLoading }] = useUpdateUserDetailsMutation();
  const toast = useToast();

  const onboardingStatus =
    userDetailsData?.data?.attributes?.onboarding_status || ONBOARDING_STATUS.PENDING;

  const [uiOnboardingStatus, setUiOnboardingStatus] = useState(onboardingStatus);

  const updateOnboardingStatus = useCallback(
    async (status: OnboardingStatusType) => {
      if (isLoading) return false;
      const storeStateIndex = Object.values(ONBOARDING_STATUS).indexOf(onboardingStatus);
      const uiStateIndex = Object.values(ONBOARDING_STATUS).indexOf(status);

      if (uiStateIndex > storeStateIndex) {
        const result = await updateUserDetailsMutation({ onboarding_status: status });

        if ('error' in result) {
          toast.notify({
            type: 'error_strong',
            message: translate('error_toast_msg'),
            closable: true,
            placement: 'topCenter',
          });
          return false;
        }
        setUiOnboardingStatus(
          status === ONBOARDING_STATUS.SELF_RATING_COMPLETED
            ? ONBOARDING_STATUS.PROFILE_SETUP_LOADER
            : status,
        );
      } else {
        setUiOnboardingStatus(status);
      }
      return true;
    },
    [isLoading, onboardingStatus, toast, translate, updateUserDetailsMutation],
  );

  const showPageLoader = userDetailsLoading || userDetailsFetching;
  const showFallback = userDetailsHasError && (userDetailsError as any)?.status !== 401;

  if (showPageLoader) {
    return <SpinnerLoader />;
  }
  if (showFallback) return <APIErrorFallback />;

  return (
    <main className="fixed-viewport-height-layout bg-blue-gradient">
      <div className="hr-grid-container hr-p-y-2.5 h-100">
        <div className="hr-grid-col-12 h-100">
          <EmployerCard>
            <OnboardingContent
              uiOnboardingStatus={uiOnboardingStatus}
              userDetailsAttributes={userDetailsData?.data?.attributes}
              updateOnboardingStatus={updateOnboardingStatus}
            />
          </EmployerCard>
        </div>
      </div>
    </main>
  );
}
