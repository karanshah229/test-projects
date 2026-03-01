import { HRChevronLeftIcon, HRChevronRightIcon } from '@hackerrank/hrds-icons';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';

import { APIErrorFallback } from 'src/components/APIErrorFallback/APIErrorFallback';
import { Carousel } from 'src/components/Carousel';
import { useGetEmployeeJobRolesDetailsQuery } from 'src/services/JobRoles';
import { JobRoleDatum, JobRolesType } from 'src/types/api/job_roles';

import { CertifiedJobRoleCard } from './CertifiedJobRoleCard';
import { ExploreJobRolesCard } from './ExploreJobRolesCard';
import { JobRoleCard } from './JobRoleCard';
import styles from './MyCareerTab.module.scss';

function CarouselControls({ showLoader }: { showLoader: boolean }) {
  const { t: translate } = useTranslation('home');
  return (
    <div className="hr-grid-row hr-flex hr-align-center hr-justify-center hr-m-t-1">
      <Carousel.TriggerPrev
        as="button"
        className={`hr-flex hr-align-center hr-justify-center ${styles.carousel__control_btn}`}
        disabled={showLoader}
      >
        <HRChevronLeftIcon
          stroke="black"
          strokeWidth="2px"
          title={translate('carousel.left_button_title')}
          title-id={translate('carousel.left_button_id')}
        />
      </Carousel.TriggerPrev>

      <div className="hr-flex hr-gap-0.75">
        <Carousel.Indicators>
          {(index, isActiveSlideIndicator, onClick) => (
            <div
              className={styles.carousel__indicator}
              style={{
                background: isActiveSlideIndicator ? '#FFF' : '#8A8A8A',
              }}
              aria-disabled={showLoader}
              onClick={onClick}
              aria-hidden="true"
              key={`carousel-indicator-${index}`}
            />
          )}
        </Carousel.Indicators>
      </div>

      <Carousel.TriggerNext
        as="button"
        className={`hr-flex hr-align-center hr-justify-center ${styles.carousel__control_btn}`}
        disabled={showLoader}
      >
        <HRChevronRightIcon
          stroke="black"
          strokeWidth="2px"
          title={translate('carousel.right_button_title')}
          title-id={translate('carousel.right_button_id')}
        />
      </Carousel.TriggerNext>
    </div>
  );
}

function MyCareerTab() {
  const {
    data: employeeJobRolesDetails = {} as JobRolesType,
    isError: employeeJobRolesDetailsHasError,
    isFetching: employeeJobRolesDetailsFetching,
    isLoading: employeeJobRolesDetailsLoading,
  } = useGetEmployeeJobRolesDetailsQuery();

  const showLoader = employeeJobRolesDetailsFetching || employeeJobRolesDetailsLoading;
  const showFallback = !employeeJobRolesDetails && employeeJobRolesDetailsHasError;

  const [startSlideIndex, setStartSlideIndex] = useState(null);
  useEffect(() => {
    if (!showLoader) setStartSlideIndex(null);
  }, [startSlideIndex, showLoader]);

  if (showFallback) return <APIErrorFallback />;

  const jobRoleList: JobRoleDatum[] = employeeJobRolesDetails.data || [];
  const totalJobRoles = jobRoleList.length;

  return (
    <Carousel.Root fullWidth>
      <div className={styles.carousel__layout}>
        <Carousel.SlidesContainer currentSlideIndex={startSlideIndex}>
          {Object.keys(jobRoleList).map((index) => {
            const jobRoleCardIndex = parseInt(index, 10);
            const isCertificationAchieved =
              !!jobRoleList[jobRoleCardIndex].attributes.certification.issued_at;

            return (
              <Carousel.Slide key={`carousel-slide-${jobRoleCardIndex}`} style={{ width: '100%' }}>
                {isCertificationAchieved ? (
                  <CertifiedJobRoleCard cardIndex={jobRoleCardIndex} />
                ) : (
                  <JobRoleCard
                    cardIndex={jobRoleCardIndex}
                    setStartSlideIndex={setStartSlideIndex}
                  />
                )}
              </Carousel.Slide>
            );
          })}
          <Carousel.Slide key={`carousel-slide-${totalJobRoles}`} style={{ width: '100%' }}>
            <ExploreJobRolesCard cardIndex={totalJobRoles} />
          </Carousel.Slide>
        </Carousel.SlidesContainer>
      </div>
      <CarouselControls showLoader={showLoader} />
    </Carousel.Root>
  );
}

export { MyCareerTab };
