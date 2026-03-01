import { HRSpinner } from '@hackerrank/hrds-components';
import { useTranslation } from 'next-i18next';

import { getUserFullName, getUserInitials, isEmptyStr } from 'src/utils/common';

import styles from './Avatar.module.scss';
import { ImageWithLoader } from '../ImageWithLoader/ImageWithLoader';

type AvatarProps = {
  imagePath?: string;
  firstName?: string;
  lastName?: string;
  isDataLoading: boolean;
  width?: number;
  height?: number;
};

export function Avatar({
  imagePath = '',
  firstName = '',
  lastName = '',
  isDataLoading = true,
  width = 76,
  height = 76,
}: AvatarProps) {
  const { t: translate } = useTranslation('home');

  const userInitials = getUserInitials(firstName, lastName);

  return (
    <div
      className={`hr-flex hr-align-center hr-justify-center hr-heading-04 ${styles.avatarLayout}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      {!isEmptyStr(imagePath) ? (
        <ImageWithLoader
          src={imagePath}
          alt={translate('profile.avatar_alt_text')}
          width={width}
          height={height}
          className={styles.avatarImage}
        />
      ) : (
        <span
          aria-label={`${getUserFullName(
            firstName,
            lastName,
          )} avatar with initials ${userInitials}`}
          className={styles.avatarInitials}
        >
          {isDataLoading ? <HRSpinner size="xs" /> : userInitials}
        </span>
      )}
    </div>
  );
}
