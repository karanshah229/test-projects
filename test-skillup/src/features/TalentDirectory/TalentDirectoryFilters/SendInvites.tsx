import { HRBasicSelect, HRButton, HRDialog } from '@hackerrank/hrds-components';
import { useTranslation } from 'next-i18next';
import { useContext, useState } from 'react';

import { ShareV2Icon } from 'ui-icons';

import { APIErrorFallback } from 'src/components/APIErrorFallback/APIErrorFallback';
import { SpinnerLoader } from 'src/components/SpinnerLoader/SpinnerLoader';
import { useGetAssessmentsQuery } from 'src/services/Assessments';
import { useGetEmployeeesQuery } from 'src/services/Employees';
import { EmployeeType } from 'src/types/api/employees';
import { getTestInviteURL, openInNewTab } from 'src/utils/common';

import { QueryArgsContext } from '../contexts/QueryArgsContext';
import { SelectedEmployeesContext } from '../contexts/SelectedEmployeesContext';

function getCandidatesToInvite(
  employeeListingData: EmployeeType = {} as EmployeeType,
  selectedEmplyoeesArray: string[] = [],
) {
  const candidates =
    employeeListingData?.data
      ?.filter((emplyoee) => selectedEmplyoeesArray.includes(emplyoee.id.toString()))
      .map((employee) => ({ name: employee.attributes.name, email: employee.attributes.email })) ||
    [];

  return candidates;
}

function ChooseAssessmentDialog({
  dialogOpen = false,
  dialogOpenChange = () => {},
}: {
  dialogOpen: boolean;
  dialogOpenChange: (open: boolean) => void;
}) {
  const { t: translate } = useTranslation('talentDirectory');
  const { selectedEmployees } = useContext(SelectedEmployeesContext);
  const selectedEmplyoeesArray = Array.from(selectedEmployees);

  const { queryArgs } = useContext(QueryArgsContext);
  const { data: employeeListingData } = useGetEmployeeesQuery(queryArgs);
  const {
    data: assessmentsData,
    isFetching: assessmentsFetching,
    isLoading: assessmentsLoading,
    isError: assessmentsHasError,
  } = useGetAssessmentsQuery({});

  const assessmentOptions =
    assessmentsData?.data?.map((assessmentData) => ({
      label: assessmentData?.attributes?.name || '',
      value: assessmentData?.attributes?.recruit_test_id,
    })) || [];
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  const assessmentsQueryLoading = assessmentsFetching || assessmentsLoading;
  return (
    <HRDialog.Root open={dialogOpen} onOpenChange={dialogOpenChange}>
      <HRDialog.Content align="top">
        <HRDialog.Header title={translate('SendInvites.dialog_header_title')} renderCloseIcon />
        <HRDialog.Body>
          {assessmentsHasError ? (
            <APIErrorFallback />
          ) : assessmentsQueryLoading ? (
            <div style={{ minHeight: '150px' }}>
              <SpinnerLoader msg={translate('SendInvites.dialog_body_loader')} size="lg" />
            </div>
          ) : (
            <div style={{ minHeight: '250px' }}>
              <HRBasicSelect
                name={translate('SendInvites.select_name')}
                label={translate('SendInvites.select_label')}
                options={assessmentOptions}
                value={selectedAssessment}
                onChange={setSelectedAssessment}
                aria-label={translate('SendInvites.select_aria_label')}
                // @ts-ignore
                maxMenuHeight={150}
                isFullWidth
              />
            </div>
          )}
        </HRDialog.Body>
        <HRDialog.Footer>
          <div className="hr-flex hr-justify-end" style={{ gap: 'var(--hr-spacing-04)' }}>
            <HRButton
              variant="secondary"
              onClick={() => dialogOpenChange(false)}
              disabled={assessmentsQueryLoading}
            >
              {translate('SendInvites.footer_cancel_btn')}
            </HRButton>
            <HRButton
              variant="primary"
              onClick={() => {
                const url =
                  getTestInviteURL(
                    selectedAssessment?.value,
                    getCandidatesToInvite(employeeListingData, selectedEmplyoeesArray),
                  ) || '';
                openInNewTab(url);
                dialogOpenChange(false);
              }}
              disabled={
                assessmentsQueryLoading || assessmentsHasError || !selectedAssessment?.value
              }
            >
              {translate('SendInvites.footer_next_btn')}
            </HRButton>
          </div>
        </HRDialog.Footer>
      </HRDialog.Content>
    </HRDialog.Root>
  );
}

export function SendInvites() {
  const { t: translate } = useTranslation('talentDirectory');
  const [chooseAssessmentDialogOpen, setChooseAssessmentDialogOpen] = useState(false);

  return (
    <>
      <HRButton
        startIcon={<ShareV2Icon />}
        variant="idle"
        onClick={() => setChooseAssessmentDialogOpen(true)}
      >
        {translate('SendInvites.send_invites_dialog_trigger')}
      </HRButton>
      <ChooseAssessmentDialog
        dialogOpen={chooseAssessmentDialogOpen}
        dialogOpenChange={setChooseAssessmentDialogOpen}
      />
    </>
  );
}
