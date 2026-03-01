import { useTranslation } from 'next-i18next';

import { APIErrorFallback } from 'src/components/APIErrorFallback/APIErrorFallback';
import { SKButton } from 'src/components/SKDS/Button/Button';
import { SpinnerLoader } from 'src/components/SpinnerLoader/SpinnerLoader';
import { CDN_URL_PREFIX } from 'src/constants/common';
import { useGetEmployeeJobRolesDetailsQuery } from 'src/services/JobRoles';
import { JobRoleDatum } from 'src/types/api/job_roles';
import { templateString } from 'src/utils/common';

import styles from './MyCareerTab.module.scss';

// TODO: Replace grey ractangle with svg later

export function CertifiedJobRoleCard({ cardIndex = 0 }: { cardIndex: number }) {
  const { t: translate } = useTranslation('home');

  const {
    data: employeeJobRolesDetails,
    isFetching: employeeJobRolesDetailsFetching,
    isLoading: employeeJobRolesDetailsLoading,
    isError: employeeJobRolesDetailsHasError,
  } = useGetEmployeeJobRolesDetailsQuery();

  const showLoader = employeeJobRolesDetailsFetching || employeeJobRolesDetailsLoading;
  const showFallback = !employeeJobRolesDetails || employeeJobRolesDetailsHasError;

  if (showLoader) {
    return <SpinnerLoader msg={translate('page_loader')} />;
  }

  if (showFallback) return <APIErrorFallback />;

  const jobRoleData: JobRoleDatum = employeeJobRolesDetails.data[cardIndex];
  const jobRoleName = jobRoleData.attributes.name || '';
  const jobRoleSkillName = jobRoleName.split(' ')[0];

  const backgroundImageURL = `url("${CDN_URL_PREFIX}/Confetti.png")`;

  return (
    <div
      style={{
        backgroundImage: backgroundImageURL,
        backgroundSize: 'cover',
      }}
      key={cardIndex}
      className={`hr-flex hr-col hr-align-center ${styles.certified_job_role_card}`}
    >
      <div className={styles.main_heading_style}>
        {templateString(translate('certified_job_role.congratulations_heading'), {
          jobRoleSkillName,
        })}
      </div>
      <div className={`hr-m-t-0.75 ${styles.certified_job_role_card__subheading}`}>
        {translate('certified_job_role.congratulations_sub_heading')}
      </div>
      <div className="hr-grid-row hr-col-gap-2 hr-m-y-4 hr-align-center">
        <div
          style={{
            background: '#000',
            width: '655px',
            height: '390px',
          }}
        />
        <div className="hr-flex hr-col hr-row-gap-1">
          <SKButton className={styles.certified_job_role_card__btns}>
            {translate('certified_job_role.archive_btn')}
          </SKButton>

          <SKButton variant="secondary" className={styles.certified_job_role_card__btns}>
            {translate('certified_job_role.view_result_btn')}
          </SKButton>

          <SKButton variant="secondary" className={styles.certified_job_role_card__btns}>
            {translate('certified_job_role.share_btn')}
          </SKButton>
        </div>
      </div>
    </div>
  );
}
