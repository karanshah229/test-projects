import { HRDropdownMenu, HRIconButton, useToast } from '@hackerrank/hrds-components';
import { HRInfoMenuHorizontalIcon } from '@hackerrank/hrds-icons';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';

import { CDN_ASSET_FOLDER_PATH, CDN_URL_PREFIX } from 'src/constants/common';
import { useUpdateJobRolePriorityMutation } from 'src/services/JobRoles';
import { templateString } from 'src/utils/common';

import styles from './JobRoleCardMenu.module.scss';
import { ModifySelfRatingDialog } from './ModifySelfRatingDialog/ModifySelfRatingDialog';
import { RemoveJobRoleDialog } from './RemoveJobRoleDialog';

export function JobRoleCardMenu({
  jobRoleId,
  jobRoleName,
  cardIndex,
  setShowCardLoader,
  setStartSlideIndex,
}: {
  jobRoleId: string;
  jobRoleName: string;
  cardIndex: number;
  setShowCardLoader: Function;
  setStartSlideIndex: Function;
}) {
  const toast = useToast();
  const { t: translate } = useTranslation('home');

  const [isOpen, setIsOpen] = useState(false);
  const [removeCardDialogOpen, setRemoveCardDialogOpen] = useState(false);
  const [modifyRatingDialogOpen, setModifyRatingDialogOpen] = useState(false);

  const [updateJobRolePriority, { isLoading: isUpdateJobRolePriorityLoading }] =
    useUpdateJobRolePriorityMutation();

  useEffect(() => {
    if (isUpdateJobRolePriorityLoading) {
      setShowCardLoader(true);
    }
  }, [isUpdateJobRolePriorityLoading, setShowCardLoader]);

  const handleBtnClick = () => {
    setIsOpen(!isOpen);
  };

  const handlePinCard = async () => {
    try {
      await updateJobRolePriority({ job_role_id: jobRoleId, priority: 1 });
      if (!isUpdateJobRolePriorityLoading) setStartSlideIndex(0);
      toast.notify({
        type: 'success',
        duration: 3000,
        closable: false,
        message: `${templateString(translate('pin_card.success_toast_message'), {
          jobRoleName,
        })}`,
        placement: 'topCenter',
      });
    } catch {
      toast.notify({
        type: 'error',
        duration: 3000,
        closable: false,
        message: `${translate('pin_card.error_toast_message')}`,
        placement: 'topCenter',
      });
    }
  };

  const menu = [
    {
      title: translate('pin_card.title'),
      onClick: () => {
        handlePinCard();
      },
      value: 1,
      icon: 'pin.svg',
      disabled_icon: 'pin_disabled.svg',
    },
    {
      title: translate('modify_self_rating.title'),
      onClick: () => {
        setModifyRatingDialogOpen(true);
        setIsOpen(false);
      },
      value: 2,
      icon: 'network.svg',
      disabled_icon: 'network.svg',
    },
    {
      title: translate('remove_card.title'),
      onClick: () => {
        setRemoveCardDialogOpen(true);
        setIsOpen(false);
      },
      value: 3,
      icon: 'remove.svg',
      disabled_icon: 'remove.svg',
    },
  ];

  return (
    <div className={styles.roleCardMenu}>
      <HRDropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
        <HRDropdownMenu.Trigger
          aria-label={translate('job_role_card_menu.trigger_label')}
          asChild
          hasDefaultStyle={false}
        >
          <HRIconButton
            onClick={handleBtnClick}
            variant="secondary"
            className={styles.roleCardMenu__iconButton}
          >
            <HRInfoMenuHorizontalIcon className={styles.roleCardMenu__infoMenuIcon} />
          </HRIconButton>
        </HRDropdownMenu.Trigger>
        <HRDropdownMenu.Content
          aria-label={translate('job_role_card_menu.content_label')}
          side="top"
          align="start"
          className={styles.jobRoleCardMenuOptions}
        >
          {menu.map(({ title, onClick, value, icon, disabled_icon }) => {
            const isPinMenuSelected = value === 1 && cardIndex === 0;
            return (
              <HRDropdownMenu.Item
                onClick={onClick}
                key={title}
                isSelected={isPinMenuSelected}
                aria-label={title}
              >
                <div className="hr-flex hr-align-center">
                  <Image
                    alt=""
                    src={`${CDN_URL_PREFIX}${CDN_ASSET_FOLDER_PATH.icons}/${
                      isPinMenuSelected ? disabled_icon : icon
                    }`}
                    width={18}
                    height={18}
                  />
                  <span className={`hr-utility-02 hr-m-l-0.75 ${styles.roleCardMenu__itemText}`}>
                    {title}
                  </span>
                </div>
              </HRDropdownMenu.Item>
            );
          })}
        </HRDropdownMenu.Content>
      </HRDropdownMenu.Root>

      <RemoveJobRoleDialog
        setRemoveCardDialogOpen={setRemoveCardDialogOpen}
        openDialog={removeCardDialogOpen}
        jobRoleId={jobRoleId}
        setStartSlideIndex={setStartSlideIndex}
      />

      <ModifySelfRatingDialog
        setModifyRatingDialogOpen={setModifyRatingDialogOpen}
        openDialog={modifyRatingDialogOpen}
        jobRoleId={jobRoleId}
        currentJobRoleCardIndex={cardIndex}
      />
    </div>
  );
}
