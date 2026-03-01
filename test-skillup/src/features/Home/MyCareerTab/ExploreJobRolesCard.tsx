import { useTranslation } from 'next-i18next';

import { SKButton } from 'src/components/SKDS/Button/Button';

import styles from './MyCareerTab.module.scss';

// TODO: Replace grey ractangle with svg later

export function ExploreJobRolesCard({ cardIndex = 0 }: { cardIndex: number }) {
  const { t: translate } = useTranslation('home');
  return (
    <div
      key={cardIndex}
      className={`hr-flex hr-col hr-align-center hr-justify-center ${styles.explore_job_role_card}`}
    >
      <div
        style={{
          width: `572px`,
          height: `300px`,
          background: '#D9D9D9',
          borderRadius: '8px',
        }}
      />
      <div className="hr-flex hr-col hr-align-center">
        <div className={`hr-m-y-2 ${styles.main_heading_style}`}>
          {translate('explore_job_roles.add_role_text')}
        </div>
        <SKButton variant="primary">{translate('explore_job_roles.explore_btn')}</SKButton>
      </div>
    </div>
  );
}
