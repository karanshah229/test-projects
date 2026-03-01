import { HRButton, useToast } from '@hackerrank/hrds-components';
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';
import { useContext, useEffect, useState } from 'react';

import { DownloadIcon } from 'ui-icons';

import { useGetTalentDirectoryExportCSVMutation } from 'src/services/Employees';
import { downloadBlob } from 'src/utils/downloadBlob';

import { QueryArgsContext } from '../contexts/QueryArgsContext';
import { SelectedEmployeesContext } from '../contexts/SelectedEmployeesContext';

export function ExportEmployees({ disableExportBtn = false }: { disableExportBtn: boolean }) {
  const { t: translate } = useTranslation('talentDirectory');
  const toast = useToast();
  const { queryArgs } = useContext(QueryArgsContext);
  const { selectedEmployees } = useContext(SelectedEmployeesContext);

  const [exportBtnLoading, setExportBtnLoading] = useState(false);
  const [downloadTalentDirectoryExportCSV, talentDirectoryExportCSVResult] =
    useGetTalentDirectoryExportCSVMutation();

  useEffect(() => {
    const {
      data: downloadExportCSVData,
      isLoading: downloadExportCSVLoading,
      isError: downloadExportCSVHasError,
      reset: resetDownloadExportCSVHook,
    } = talentDirectoryExportCSVResult;

    if (downloadExportCSVLoading) setExportBtnLoading(true);
    if (!downloadExportCSVHasError && downloadExportCSVData) {
      setExportBtnLoading(false);
      downloadBlob(
        downloadExportCSVData,
        `talent-directory-export-${dayjs().unix()}.csv`,
        'text/csv',
      );
      // To the browser from launching file download dialog twice
      resetDownloadExportCSVHook();
    } else if (downloadExportCSVHasError) {
      setExportBtnLoading(false);
      toast.notify({
        type: 'error_strong',
        message: translate('Export.export_error'),
        closable: true,
        placement: 'topCenter',
      });
    }
  }, [talentDirectoryExportCSVResult, toast, translate]);

  const selectedEmployeeArr = Array.from(selectedEmployees);
  let requestBody: any = {
    employee_ids:
      selectedEmployeeArr.length !== 0 ? selectedEmployeeArr.map((e) => parseInt(e, 10)) : null,
  };

  if (!requestBody.employee_ids) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { page, size, ...restQueryArgs } = queryArgs;
    requestBody = {
      ...restQueryArgs,
    };
  }

  return (
    <HRButton
      variant="seconday"
      startIcon={<DownloadIcon />}
      onClick={() => downloadTalentDirectoryExportCSV(requestBody)}
      isDisabled={disableExportBtn}
      isLoading={exportBtnLoading}
    >
      {translate('Export.export_button_text')}
    </HRButton>
  );
}
