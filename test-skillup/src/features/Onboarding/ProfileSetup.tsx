import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';

import { UserRolesType } from 'src/types/auth';
import { redirectToHomePage } from 'src/utils/auth';

import styles from './Onboarding.module.scss';
import {
  LOADING_TEXT_i18n_KEYS,
  PROGRESS_UPDATE_DURATION,
  TEXT_UPDATE_DURATION,
} from './constants';

export function ProfileSetup({ role }: { role: UserRolesType }) {
  const { t: translate } = useTranslation('welcome');
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [displayTextIndex, setDisplayTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgressPercentage((prevProgress) => {
        if (prevProgress < 100) {
          return prevProgress + 1;
        }
        clearInterval(interval);
        setTimeout(() => {
          redirectToHomePage(role);
        }, 0);
        return prevProgress;
      });
    }, PROGRESS_UPDATE_DURATION);
    return () => clearInterval(interval);
  }, [role]);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setDisplayTextIndex((prevIndex) =>
        prevIndex + 1 === LOADING_TEXT_i18n_KEYS.length ? prevIndex : prevIndex + 1,
      );
    }, TEXT_UPDATE_DURATION);
    return () => clearInterval(textInterval);
  }, []);

  return (
    <div className="hr-flex hr-col hr-justify-center hr-align-center h-100">
      <div className={`${styles.loading_icon} hr-m-b-2`} />
      <div className={styles.progress_bar_container}>
        <div
          className={styles.progress_bar}
          style={{ height: '100%', width: `${progressPercentage}%` }}
        />
      </div>
      <span className={styles.status_text}>
        {translate(LOADING_TEXT_i18n_KEYS?.[displayTextIndex])}
      </span>
    </div>
  );
}
