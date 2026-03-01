import { HRProgressBar, HRTooltip } from '@hackerrank/hrds-components';
import { HRCheckIcon, HRLockIcon, HRTimeCircleIcon, HRUnlockIcon } from '@hackerrank/hrds-icons';
import { useTranslation } from 'next-i18next';
import { RefObject, useEffect, useRef, useState } from 'react';

import { CDN_URL_PREFIX } from 'src/constants/common';
import { useIsomorphicLayoutEffect } from 'src/hooks/useIsomorphicLayoutEffect';
import { CertificationPrerequisitesType } from 'src/types/common';

import styles from './Body.module.scss';
import {
  certificationCardLinearGradient,
  certificationCardLinearGradientHover,
} from '../constants';
import { getTimeLeftToReattemptCertification } from '../utils';

export type CertificationCardBodyProps = {
  certificationName: string;
  certificationSkillsCount: number;
  certificationAssessmentDuration: number;
  certificationPrerequisites: CertificationPrerequisitesType;
  certificationIssuedAt: string | null;
  certificationReattemptAvailableOn?: string | null;
  certificationSkillPercentMatch?: number;
  showFooter: boolean;
};

function setBackgroundImage({
  cardBodyRef,
  backgroundImage,
  hoverStyle = false,
}: {
  cardBodyRef: RefObject<HTMLDivElement>;
  backgroundImage: string;
  hoverStyle?: boolean;
}) {
  if (cardBodyRef.current) {
    cardBodyRef.current.style.setProperty(
      `--background-image${hoverStyle ? '-onHover' : ''}`,
      `${backgroundImage}, ${
        hoverStyle ? certificationCardLinearGradientHover : certificationCardLinearGradient
      }`,
    );
  }
}

export function CertificationCardBody({
  certificationName = '',
  certificationSkillsCount = 0,
  certificationAssessmentDuration = 0,
  certificationPrerequisites = {} as CertificationPrerequisitesType,
  certificationIssuedAt = null,
  certificationReattemptAvailableOn = null,
  certificationSkillPercentMatch = 0,
  showFooter = false,
}: CertificationCardBodyProps) {
  const cardBodyRef = useRef<HTMLDivElement>(null);
  const certificationTitleRef = useRef<HTMLDivElement>(null);
  const { t: translate } = useTranslation('components/certificationCard');

  // Load noiseEffect_1000x1000.png for higher DPR devices
  const backgroundImage = `url("${CDN_URL_PREFIX}/noiseEffect.png")`;

  useIsomorphicLayoutEffect(() => {
    setBackgroundImage({ cardBodyRef, backgroundImage });
    setBackgroundImage({ cardBodyRef, backgroundImage, hoverStyle: true });
  }, [backgroundImage]);

  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    if (
      certificationTitleRef.current.scrollHeight >
      certificationTitleRef.current.getBoundingClientRect().height
    ) {
      setIsOverflowing(true);
    } else {
      setIsOverflowing(false);
    }
  }, []);

  const isCertificationEarned = certificationIssuedAt !== null;
  const certificationHasPrerequisites = certificationPrerequisites.total > 0;
  const arePrerequisitesMet =
    certificationHasPrerequisites &&
    certificationPrerequisites?.completed === certificationPrerequisites.total;
  const [timeLeftToReattempt, durationType] = getTimeLeftToReattemptCertification(
    certificationReattemptAvailableOn,
  );

  const showTimeLeftToReattempt = !isCertificationEarned && timeLeftToReattempt > 0;

  return (
    <div
      className={`hr-p-x-1 hr-p-y-1.25 hr-flex hr-col hr-justify-between ${styles.card_body} ${
        showFooter ? styles.showFooter : ''
      }`}
      style={{
        backgroundImage: `${backgroundImage}, ${certificationCardLinearGradient}`,
      }}
      ref={cardBodyRef}
    >
      <div>
        <HRTooltip
          content={certificationName}
          triggerType="hover"
          disabled={!isOverflowing}
          placement="bottom"
          offset={0}
        >
          <div className={styles.card_title} ref={certificationTitleRef}>
            {certificationName}
          </div>
        </HRTooltip>

        <div className={styles.card_body__typography}>
          {certificationSkillPercentMatch > 50 ? (
            <div className="hr-flex hr-align-center hr-col-gap-0.75">
              <span>
                {translate('body.skill_match', { count: certificationSkillPercentMatch })}
              </span>
              <span>
                <HRProgressBar
                  aria-label={translate('body.progressbar_aria_label')}
                  max={100}
                  shape="bar"
                  type="primary"
                  value={certificationSkillPercentMatch}
                  className={styles.card_body__progressbar_container}
                  progressBarClass={styles.card_body__progressbar}
                />
              </span>
            </div>
          ) : (
            <div className="hr-m-t-0.5">
              {certificationSkillsCount ? (
                <span>{translate('body.skill', { count: certificationSkillsCount })}</span>
              ) : null}
              {certificationSkillsCount && certificationAssessmentDuration
                ? translate('body.separator')
                : null}
              {certificationAssessmentDuration ? (
                <span>
                  {certificationAssessmentDuration} {translate('body.minutes')}
                </span>
              ) : null}
            </div>
          )}
        </div>
      </div>

      <div className="hr-flex hr-align-center hr-gap-0.5">
        {isCertificationEarned ? (
          <>
            <div
              className={`hr-flex hr-justify-center hr-align-center ${styles.check_icon_wrapper}`}
            >
              <HRCheckIcon stroke="white" width="22px" height="22px" />
            </div>
            <div className={styles.card_body__typography}>{translate('body.certified')}</div>
          </>
        ) : showTimeLeftToReattempt ? (
          <>
            <div
              className={`hr-flex hr-justify-center hr-align-center ${styles.time_icon_wrapper}`}
            >
              <HRTimeCircleIcon stroke="white" width="12px" height="12px" />
            </div>
            <div className={styles.card_body__typography}>
              {durationType === 'days'
                ? translate('body.reattempt_in_days', { count: Math.floor(timeLeftToReattempt) })
                : translate('body.reattempt_in_hours', { count: timeLeftToReattempt })}
            </div>
          </>
        ) : certificationHasPrerequisites ? (
          <>
            <div
              className={`hr-flex hr-justify-center hr-align-center ${
                arePrerequisitesMet ? styles.unlock_icon_wrapper : styles.lock_icon_wrapper
              }`}
            >
              {arePrerequisitesMet ? (
                <HRUnlockIcon stroke="#32C766" width="12px" height="12px" />
              ) : (
                <HRLockIcon stroke="white" width="12px" height="12px" />
              )}
            </div>
            <div className={styles.card_body__typography}>
              {arePrerequisitesMet
                ? translate('body.prerequisites_met')
                : translate('body.prerequisite', { count: certificationPrerequisites.pending })}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
