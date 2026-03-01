import { HRCheckbox } from '@hackerrank/hrds-components';
import { useTranslation } from 'next-i18next';
import { Fragment, useContext } from 'react';

import { useGetEmployeeeListingFiltersQuery } from 'src/services/Employees';
import { EmployeeFiltersJobRoles, EmployeeFiltersType } from 'src/types/api/employees';
import { templateString } from 'src/utils/common';

import { QueryArgsContext } from '../contexts/QueryArgsContext';
import { SelectedEmployeesContext } from '../contexts/SelectedEmployeesContext';

export function DesignationsAccordianItemContent() {
  const { t: translate } = useTranslation('talentDirectory');
  const { setSelectedEmployees } = useContext(SelectedEmployeesContext);
  const { queryArgs, updateQueryArgs } = useContext(QueryArgsContext);
  const { job_role_ids: jobRoleIDS = [] } = queryArgs;
  const { data: filtersData = {} as EmployeeFiltersType } = useGetEmployeeeListingFiltersQuery();
  const designationsData = filtersData?.data?.job_roles || null;

  function handleOnCheckedChange(checked: boolean, designation: EmployeeFiltersJobRoles) {
    let updatedJobRoleIDS = [...jobRoleIDS];
    if (checked) {
      updatedJobRoleIDS = [...jobRoleIDS, designation?.id];
    } else {
      updatedJobRoleIDS = updatedJobRoleIDS.filter(
        (designationID) => designationID !== designation?.id,
      );
    }

    updateQueryArgs({
      job_role_ids: [...updatedJobRoleIDS],
      page: 1,
    });
    setSelectedEmployees(new Set([]));
  }

  if (designationsData.length === 0) return null;
  return (
    <div className="hr-p-b-0.5 hr-flex hr-col" style={{ gap: 'var(--hr-spacing-03)' }}>
      {designationsData?.map((designation, index) => (
        <Fragment
          key={templateString(translate('Filters.designations_filter_checkbox_id'), {
            designationID: `${designation?.id}-fragment`,
          })}
        >
          <HRCheckbox
            id={templateString(translate('Filters.designations_filter_checkbox_id'), {
              designationID: designation?.id,
            })}
            label={designation?.name}
            onCheckedChange={(checked: boolean) => {
              handleOnCheckedChange(checked, designation);
            }}
            isSelected={jobRoleIDS.includes(designation?.id)}
          />
          {index !== designationsData.length - 1 ? (
            <div>
              <hr style={{ border: '0.5px solid var(--hr-neutral-10)' }} />
            </div>
          ) : null}
        </Fragment>
      ))}
    </div>
  );
}
