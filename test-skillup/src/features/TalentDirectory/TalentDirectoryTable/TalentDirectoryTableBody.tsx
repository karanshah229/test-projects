import { HRCell, HRIconButton, HRTableBody, HRTableRow } from '@hackerrank/hrds-components';
import { useTranslation } from 'next-i18next';
import { useContext } from 'react';

import { OpenNewWindowIcon } from 'ui-icons';

import { DynamicList } from 'src/components/DynamicList/DynamicList';
import { APP_PREFIX } from 'src/constants/common';
import { useGetEmployeeesQuery } from 'src/services/Employees';
import { EmployeeType } from 'src/types/api/employees';
import { openInNewTab, templateString } from 'src/utils/common';

import { QueryArgsContext } from '../contexts/QueryArgsContext';

export function TalentDirectoryTableBody() {
  const { t: translate } = useTranslation('talentDirectory');
  const { queryArgs } = useContext(QueryArgsContext);
  const { data: employeeListingData = {} as EmployeeType } = useGetEmployeeesQuery({
    ...queryArgs,
  });

  return (
    <HRTableBody>
      {employeeListingData.data?.map((emp) => (
        <HRTableRow key={emp.id}>
          <HRCell>{emp.attributes?.name || ''}</HRCell>
          <HRCell>{emp.attributes?.job_role?.name || ''}</HRCell>
          <HRCell>
            <DynamicList
              items={
                emp.attributes?.certifications.map((certification) => certification?.name) || []
              }
              lines={2}
              seperator=" • "
              showTrigger
              isTriggerInline={false}
            />
          </HRCell>
          <HRCell>
            <DynamicList
              items={emp.attributes?.skills.map((skill) => skill?.name) || []}
              lines={2}
              seperator=" • "
              showTrigger
              isTriggerInline={false}
            />
          </HRCell>
          <HRCell align="center">
            <HRIconButton
              aria-label={templateString(translate('Table.body.profile_icon_button_aria_label'), {
                empAttributesName: emp?.attributes?.name,
              })}
              variant="ghost"
              onClick={() => openInNewTab(`${APP_PREFIX}/employees/${emp.id}`)}
            >
              <OpenNewWindowIcon />
            </HRIconButton>
          </HRCell>
        </HRTableRow>
      ))}
    </HRTableBody>
  );
}
