import { HRDialog, useToast } from '@hackerrank/hrds-components';
import { useTranslation } from 'next-i18next';
import { useCallback, useState } from 'react';

import { APIErrorFallback } from 'src/components/APIErrorFallback/APIErrorFallback';
import { EmployeeSkillDistribution } from 'src/components/EmployeeSkillDistribution/EmployeeSkillDistribution';
import { SkillProficiencyMapType } from 'src/components/EmployeeSkillDistribution/types';
import { SKButton } from 'src/components/SKDS/Button/Button';
import { CDN_URL_PREFIX, PROFICIENCIES } from 'src/constants/common';
import { useIsomorphicLayoutEffect } from 'src/hooks/useIsomorphicLayoutEffect';
import {
  useGetEmployeeJobRolesDetailsQuery,
  useUpdateSkillsSelfRatingsMutation,
} from 'src/services/JobRoles';
import { JobRoleDatum, JobRoleSkillType, UpdateJobRolesArgs } from 'src/types/api/job_roles';
import { sortObjectsByStringProperty } from 'src/utils/common';

import styles from './ModifySelfRating.module.scss';
import { ModifySelfRatingForm } from './ModifySelfRatingForm';

export type ModifySelfRatingDialogProps = {
  setModifyRatingDialogOpen?: Function;
  openDialog: boolean;
  jobRoleId: string;
  currentJobRoleCardIndex: number;
};

export function ModifySelfRatingDialog({
  openDialog,
  setModifyRatingDialogOpen,
  jobRoleId,
  currentJobRoleCardIndex,
}: ModifySelfRatingDialogProps) {
  const { t: translate } = useTranslation('home');
  const toast = useToast();
  const backgroundImage = `url("${CDN_URL_PREFIX}/noiseEffect2.png")`;

  const { data: employeeJobRolesDetails, isError: employeeJobRolesDetailsHasError } =
    useGetEmployeeJobRolesDetailsQuery();

  const [updateSkillsSelfRatings, { isLoading: isSkillsUpdateInProgress }] =
    useUpdateSkillsSelfRatingsMutation();

  const closeRoleCardDialog = useCallback(() => {
    setModifyRatingDialogOpen(false);
  }, [setModifyRatingDialogOpen]);

  const [skillProficiencyMap, setSkillProficiencyMap] = useState<SkillProficiencyMapType>({});

  useIsomorphicLayoutEffect(() => {
    if (openDialog) {
      const jobRoleData: JobRoleDatum = employeeJobRolesDetails.data[currentJobRoleCardIndex];
      const jobRoleSkills: JobRoleSkillType[] = jobRoleData.attributes?.skills || [];

      const map: SkillProficiencyMapType = {};
      jobRoleSkills.forEach((skill) => {
        map[skill.id] = {
          id: skill.id,
          name: skill.name,
          current_proficiency: skill.self_rated_proficiency,
          verified_proficiency: skill.verified_proficiency,
        };
      });

      const sortedSkillObjects = Object.values(map).sort((skill1, skill2) =>
        sortObjectsByStringProperty(skill1, skill2, 'name'),
      );

      const sortedSkillProficiencyMap: SkillProficiencyMapType = sortedSkillObjects.reduce(
        (acc: SkillProficiencyMapType, skill) => {
          acc[skill.id] = skill;
          return acc;
        },
        {},
      );

      setSkillProficiencyMap(sortedSkillProficiencyMap);
    }
  }, [openDialog]);

  const showFallback = !employeeJobRolesDetails || employeeJobRolesDetailsHasError;
  if (showFallback) return <APIErrorFallback />;

  const handleSave = async () => {
    const updatedJobRoleSkillsData: UpdateJobRolesArgs = {
      job_role_id: jobRoleId,
      skills: Object.keys(skillProficiencyMap).reduce((acc, id) => {
        acc.push({
          id: skillProficiencyMap[id].id,
          proficiency: skillProficiencyMap[id].current_proficiency || PROFICIENCIES.prebeginner,
        });
        return acc;
      }, []),
    };

    try {
      await updateSkillsSelfRatings(updatedJobRoleSkillsData);
      closeRoleCardDialog();
    } catch (error) {
      toast.notify({
        type: 'error',
        duration: 3000,
        closable: false,
        message: `${translate('modify_self_rating.error_toast_message')}`,
        placement: 'topCenter',
      });
    }
  };

  // TODO: Check how to use ref in Dialog Body so that the extra div can be removed
  return (
    <HRDialog.Root
      open={openDialog}
      onOpenChange={(open: boolean) => setModifyRatingDialogOpen(open)}
    >
      <HRDialog.Content
        // eslint-disable-next-line jsx-a11y/aria-props
        aria-description={translate('modify_self_rating.dialog_aria_description')}
        align="center"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className={styles.modifySelfRatingDialogContent}
      >
        <HRDialog.Body>
          <div
            className={`hr-flex hr-grid-col-12 ${
              isSkillsUpdateInProgress ? styles.modifySelfRatingDialogContent__bodyDisabled : ''
            }`}
          >
            <ModifySelfRatingForm
              setSkillProficiencyMap={setSkillProficiencyMap}
              skillProficiencyMap={skillProficiencyMap}
            />
            <div
              className="hr-grid-col-6 hr-flex hr-align-center hr-justify-center hr-p-x-4 hr-p-y-5"
              style={{
                backgroundImage: `${backgroundImage}`,
                backgroundSize: 'cover',
                backgroundColor: '#F7F9FD',
              }}
            >
              <EmployeeSkillDistribution
                key={JSON.stringify(skillProficiencyMap)}
                skillProficiencyMap={skillProficiencyMap}
              />
            </div>
          </div>
        </HRDialog.Body>

        <HRDialog.Footer>
          <div className="hr-flex hr-justify-end hr-gap-1">
            <HRDialog.Close>
              <SKButton
                variant="secondary"
                className={styles.modifySelfRatingDialogContent__btn}
                isDisabled={isSkillsUpdateInProgress}
              >
                {translate('modify_self_rating.dialog_cancel_btn')}
              </SKButton>
            </HRDialog.Close>
            <SKButton
              variant="primary"
              className={styles.modifySelfRatingDialogContent__btn}
              onClick={handleSave}
              isDisabled={isSkillsUpdateInProgress}
            >
              {translate('modify_self_rating.dialog_save_btn')}
            </SKButton>
          </div>
        </HRDialog.Footer>
      </HRDialog.Content>
    </HRDialog.Root>
  );
}
