import { useToast } from '@hackerrank/hrds-components';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';

import { SKButton } from 'src/components/SKDS/Button/Button';
import { ONBOARDING_STATUS } from 'src/constants/common';
import { OnboardingStatusType } from 'src/types/common';
import { getArticle, templateString } from 'src/utils/common';

import styles from './Onboarding.module.scss';
import { handleOnboardingStatusUpdate } from './utils';

export function ProductPreview({
  updateOnboardingStatus,
  name,
  jobRoleName,
}: {
  updateOnboardingStatus: (status: OnboardingStatusType) => Promise<boolean>;
  name: string;
  jobRoleName: string;
}) {
  const { t: translate } = useTranslation('welcome');
  const [isDisabled, setIsDisabled] = useState(false);
  const toast = useToast();

  return (
    <div className="h-100 hr-p-y-2 hr-p-x-2.5 hr-flex hr-col hr-justify-between">
      <div>
        <div className={styles.heading_emoji}>{translate('product_preview.text_01')}</div>
        <div className={styles.heading_text}>
          {templateString(translate('product_preview.text_02'), {
            name,
          })}
        </div>
        <div className={styles.heading_text}>
          {templateString(translate('product_preview.text_03'), {
            article: getArticle(jobRoleName),
            jobRoleName: jobRoleName || '',
          })}
        </div>
      </div>
      <SKButton
        onClick={async () =>
          handleOnboardingStatusUpdate(
            setIsDisabled,
            updateOnboardingStatus,
            toast,
            translate('error_toast_msg'),
            ONBOARDING_STATUS.PRODUCT_PREVIEW_COMPLETED,
          )
        }
        variant="primary"
        className="hr-m-x-auto"
        isDisabled={isDisabled}
        isLoading={isDisabled}
        loadingText={translate('next_btn')}
        size="large"
      >
        {translate('next_btn')}
      </SKButton>
    </div>
  );
}
