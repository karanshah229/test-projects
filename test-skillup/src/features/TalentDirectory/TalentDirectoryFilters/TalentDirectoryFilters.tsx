import { HRAccordion } from '@hackerrank/hrds-components';
import { useTranslation } from 'next-i18next';
import { RefObject, forwardRef, useContext } from 'react';

import { APIErrorFallback } from 'src/components/APIErrorFallback/APIErrorFallback';
import { OverlayLoader } from 'src/components/OverlayLoader/OverlayLoader';
import { useGetEmployeeeListingFiltersQuery } from 'src/services/Employees';

import { AccordianItemHeader } from './AccordianItemHeader';
import { CertificationsAccordianItemContent } from './CertificationsAccordianItemContent';
import { DesignationsAccordianItemContent } from './DesignationsAccordianItemContent';
import { FiltersCardHeader } from './FiltersCardHeader';
import { SkillsAccordianItemContent } from './SkillsAccordianItemContent';
import styles from './TalentDirectoryFilter.module.scss';
import { QueryArgsContext } from '../contexts/QueryArgsContext';

export const TalentDirectoryFilters = forwardRef(
  (_props, filterContainerRef: RefObject<HTMLDivElement>) => {
    const { t: translate } = useTranslation('talentDirectory');
    const { queryArgs } = useContext(QueryArgsContext);
    const {
      data: filtersData,
      isLoading: filtersDataLoading,
      isFetching: filtersDataFetching,
      isError: filtersHasError,
    } = useGetEmployeeeListingFiltersQuery();

    const designationsSelectedCount = queryArgs?.job_role_ids?.length;
    const certificationsSelectedCount = queryArgs?.certification_ids?.length;
    const skillsSelectedCount = Object.keys(queryArgs?.skills || {})?.length;

    const filtersDataHasDesignations = filtersData?.data?.job_roles.length !== 0;
    const filtersDataHasCertifications = filtersData?.data?.certifications.length !== 0;
    const filtersDataHasSkills = filtersData?.data?.skills.length !== 0;

    return (
      <section
        className={`hr-p-1.5 ${styles.filterContainer} bg-white hr-flex hr-col`}
        style={{ gap: 'var(--hr-spacing-07)' }}
        ref={filterContainerRef}
      >
        <FiltersCardHeader />

        {filtersHasError ? (
          <APIErrorFallback className="bg-white" />
        ) : (
          <OverlayLoader showLoader={filtersDataLoading || filtersDataFetching}>
            <HRAccordion.Root type="multiple">
              {filtersDataHasDesignations ? (
                <HRAccordion.Item value="designations_filter">
                  <HRAccordion.Trigger className={styles.accordionTrigger}>
                    <AccordianItemHeader
                      title={translate('Filters.designations_title')}
                      selectedCount={designationsSelectedCount}
                    />
                  </HRAccordion.Trigger>
                  <HRAccordion.Content>
                    <DesignationsAccordianItemContent />
                  </HRAccordion.Content>
                </HRAccordion.Item>
              ) : null}

              {filtersDataHasCertifications ? (
                <HRAccordion.Item value="certifications_filter">
                  <HRAccordion.Trigger className={styles.accordionTrigger}>
                    <AccordianItemHeader
                      title={translate('Filters.certifications_title')}
                      selectedCount={certificationsSelectedCount}
                    />
                  </HRAccordion.Trigger>
                  <HRAccordion.Content>
                    <CertificationsAccordianItemContent />
                  </HRAccordion.Content>
                </HRAccordion.Item>
              ) : null}

              {filtersDataHasSkills ? (
                <HRAccordion.Item value="skills_filter">
                  <HRAccordion.Trigger className={styles.accordionTrigger}>
                    <AccordianItemHeader
                      title={translate('Filters.skills_title')}
                      selectedCount={skillsSelectedCount}
                    />
                  </HRAccordion.Trigger>
                  <HRAccordion.Content>
                    <SkillsAccordianItemContent />
                  </HRAccordion.Content>
                </HRAccordion.Item>
              ) : null}
            </HRAccordion.Root>
          </OverlayLoader>
        )}
      </section>
    );
  },
);
