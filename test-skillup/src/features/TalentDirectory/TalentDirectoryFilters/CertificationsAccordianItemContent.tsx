import { HRCheckbox } from '@hackerrank/hrds-components';
import { useTranslation } from 'next-i18next';
import { Fragment, useContext } from 'react';

import { useGetEmployeeeListingFiltersQuery } from 'src/services/Employees';
import { EmployeeFiltersCertifications, EmployeeFiltersType } from 'src/types/api/employees';
import { templateString } from 'src/utils/common';

import { QueryArgsContext } from '../contexts/QueryArgsContext';
import { SelectedEmployeesContext } from '../contexts/SelectedEmployeesContext';

export function CertificationsAccordianItemContent() {
  const { t: translate } = useTranslation('talentDirectory');
  const { setSelectedEmployees } = useContext(SelectedEmployeesContext);
  const { queryArgs, updateQueryArgs } = useContext(QueryArgsContext);
  const { certification_ids: certificationIDs = [] } = queryArgs;
  const { data: filtersData = {} as EmployeeFiltersType } = useGetEmployeeeListingFiltersQuery();
  const certificationsData = filtersData?.data?.certifications || null;

  function handleOnCheckedChange(checked: boolean, certification: EmployeeFiltersCertifications) {
    let updatedCertificationIDs = [...certificationIDs];
    if (checked) {
      updatedCertificationIDs = [...certificationIDs, certification?.id];
    } else {
      updatedCertificationIDs = updatedCertificationIDs.filter(
        (certificationID) => certificationID !== certification?.id,
      );
    }

    updateQueryArgs({
      certification_ids: [...updatedCertificationIDs],
      page: 1,
    });
    setSelectedEmployees(new Set([]));
  }

  if (certificationsData.length === 0) return null;
  return (
    <div className="hr-p-b-0.5 hr-flex hr-col" style={{ gap: 'var(--hr-spacing-03)' }}>
      {certificationsData?.map((certification, index) => (
        <Fragment
          key={templateString(translate('Filters.certifications_filter_checkbox_id'), {
            certificationID: `${certification?.id}-fragment`,
          })}
        >
          <HRCheckbox
            id={templateString(translate('Filters.certifications_filter_checkbox_id'), {
              certificationID: certification?.id,
            })}
            label={certification?.name}
            onCheckedChange={(checked: boolean) => handleOnCheckedChange(checked, certification)}
            isSelected={certificationIDs.includes(certification?.id)}
          />
          {index !== certificationsData.length - 1 ? (
            <div>
              <hr style={{ border: '0.5px solid var(--hr-neutral-10)' }} />
            </div>
          ) : null}
        </Fragment>
      ))}
    </div>
  );
}
