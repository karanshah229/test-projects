import { HRSpinner } from '@hackerrank/hrds-components';
import { useTranslation } from 'next-i18next';

import styles from './SpinnerLoader.module.scss';

export function SpinnerLoader({
  msg,
  size = 'xl',
  isAbsolute = true,
  isCentered = true,
}: {
  msg?: string;
  size?: 'xl' | 'xs' | 'sm' | 'md' | 'lg';
  isAbsolute?: boolean;
  isCentered?: boolean;
}) {
  const { t: translate } = useTranslation('common');
  const message = msg ?? translate('loading_msg');
  const centerStyling = isAbsolute
    ? styles.absoluteCentered
    : 'hr-flex hr-col hr-grow hr-justify-center hr-align-center';

  return (
    <div className={isCentered && centerStyling}>
      <div className="hr-flex hr-col hr-justify-center hr-align-center">
        <HRSpinner size={size} />
        {/* Empty string message prop is passed to not show any message */}
        {/* This check is to not render the enclosing div if empty string message prop is passed */}
        {message ? <div className="hr-m-t-2">{message}</div> : null}
      </div>
    </div>
  );
}
