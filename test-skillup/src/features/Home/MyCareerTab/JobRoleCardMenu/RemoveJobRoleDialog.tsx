import { HRDialog, useToast } from '@hackerrank/hrds-components';
import { useTranslation } from 'next-i18next';
import { useCallback } from 'react';

import { SKButton } from 'src/components/SKDS/Button/Button';
import { useDeleteJobRoleMutation } from 'src/services/JobRoles';

import styles from './RemoveJobRoleDialog.module.scss';

export type RemoveJobRoleDialogProps = {
  setRemoveCardDialogOpen?: Function;
  openDialog: boolean;
  jobRoleId: string;
  setStartSlideIndex?: Function;
};

export function RemoveJobRoleDialog({
  setRemoveCardDialogOpen,
  openDialog,
  jobRoleId,
  setStartSlideIndex,
}: RemoveJobRoleDialogProps) {
  const { t: translate } = useTranslation('home');
  const [deleteJobRole, { isLoading: deleteJobRoleInProgress }] = useDeleteJobRoleMutation();

  const toast = useToast();
  const closeRoleCardDialog = useCallback(() => {
    setRemoveCardDialogOpen(false);
  }, [setRemoveCardDialogOpen]);

  const handleDeleteJobRole = async () => {
    try {
      await deleteJobRole(jobRoleId);
      closeRoleCardDialog();
      toast.notify({
        type: 'success',
        duration: 3000,
        closable: false,
        message: `${translate('remove_card.success_toast_message')}`,
        placement: 'topCenter',
      });
      setStartSlideIndex(0);
    } catch (err) {
      toast.notify({
        type: 'error',
        duration: 3000,
        closable: false,
        message: `${translate('remove_card.error_toast_message')}`,
        placement: 'topCenter',
      });
    }
  };

  return (
    <HRDialog.Root
      open={openDialog}
      onOpenChange={(open: boolean) => setRemoveCardDialogOpen(open)}
    >
      <HRDialog.Content
        align="center"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className={styles.removeCardDialog__content}
      >
        <HRDialog.Body>
          <div className="hr-flex hr-col">
            <div className={styles.removeCardDialog__bodyHeading}>
              {translate('remove_card.dialog_heading')}
            </div>
            <div className={`hr-utility-02 hr-p-t-0.75 ${styles.removeCardDialog__bodyText}`}>
              {translate('remove_card.dialog_body')}
            </div>
          </div>
        </HRDialog.Body>

        <HRDialog.Footer>
          <div className="hr-flex hr-justify-end hr-gap-1">
            <HRDialog.Close>
              <SKButton
                variant="secondary"
                className={`${styles.removeCardDialog__btn}`}
                isDisabled={deleteJobRoleInProgress}
              >
                {translate('remove_card.dialog_cancel_btn')}
              </SKButton>
            </HRDialog.Close>
            <SKButton
              variant="destructive"
              className={`${styles.removeCardDialog__btn}`}
              onClick={() => handleDeleteJobRole()}
              isDisabled={deleteJobRoleInProgress}
            >
              {translate('remove_card.dialog_remove_btn')}
            </SKButton>
          </div>
        </HRDialog.Footer>
      </HRDialog.Content>
    </HRDialog.Root>
  );
}
