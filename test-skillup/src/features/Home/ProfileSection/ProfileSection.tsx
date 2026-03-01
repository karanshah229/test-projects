import Image from 'next/image';
import { useTranslation } from 'next-i18next';

import { APIErrorFallback } from 'src/components/APIErrorFallback/APIErrorFallback';
import { Avatar } from 'src/components/Avatar/Avatar';
import { SpinnerLoader } from 'src/components/SpinnerLoader/SpinnerLoader';
import { CDN_ASSET_FOLDER_PATH, CDN_URL_PREFIX } from 'src/constants/common';
import { useGetUserProfileQuery } from 'src/services/User';
import { UserAdditionalAttributes, UserDetailsType } from 'src/types/api/User';
import { getUserFullName } from 'src/utils/common';

import styles from './ProfileSection.module.scss';

export function ProfileSection() {
  const { t: translate } = useTranslation('home');

  const {
    data: userDetailsData = {} as UserDetailsType,
    isError: userDetailsHasError,
    isLoading: isUserDetailLoading,
    isFetching: isUserDetailFetching,
  } = useGetUserProfileQuery({
    additional_attributes: [
      UserAdditionalAttributes.BADGES_COUNT,
      UserAdditionalAttributes.CERTIFICATIONS_COUNT,
    ],
  });

  const showLoader = isUserDetailLoading || isUserDetailFetching;
  const showFallback = userDetailsHasError || !userDetailsData;

  if (showLoader) return <SpinnerLoader />;
  if (showFallback) return <APIErrorFallback />;

  const {
    data: {
      attributes: {
        first_name: firstName = '',
        last_name: lastName = '',
        badges_count: badgesCount = 0,
        certifications_count: certificationsCount = 0,
      },
    },
  } = userDetailsData;
  const userFullName = getUserFullName(firstName, lastName);

  const showBadgeCount = badgesCount > 0;
  const showCertificationCount = certificationsCount > 0;

  return (
    <div className="hr-flex hr-col">
      <Avatar firstName={firstName} lastName={lastName} isDataLoading={showLoader} />
      <div className={` ${styles.profile__name}`}>{userFullName}</div>
      <div className="hr-flex hr-m-t-1">
        {showCertificationCount ? (
          <div className="hr-flex hr-align-center hr-m-r-1.25">
            <Image
              src={`${CDN_URL_PREFIX}${CDN_ASSET_FOLDER_PATH.icons}/certification_count.svg`}
              width={18}
              height={18}
              alt={translate('profile.certification_alt_text')}
            />
            <div className="hr-p-l-0.5">{certificationsCount}</div>
          </div>
        ) : null}
        {showBadgeCount ? (
          <div className="hr-flex hr-align-center hr-justify-center">
            <Image
              src={`${CDN_URL_PREFIX}${CDN_ASSET_FOLDER_PATH.icons}/badge_count.svg`}
              width={18}
              height={18}
              alt={translate('profile.badge_alt_text')}
            />
            <span className="hr-p-l-0.75">{badgesCount}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
