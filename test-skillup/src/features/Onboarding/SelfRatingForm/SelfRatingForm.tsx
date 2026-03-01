import {
  HRProgressBar,
  HRRadioGroup,
  HRRadioGroupItem,
  useToast,
} from '@hackerrank/hrds-components';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';

import { SKButton } from 'src/components/SKDS/Button/Button';
import { ONBOARDING_STATUS, PROFICIENCIES } from 'src/constants/common';
import { useIsomorphicLayoutEffect } from 'src/hooks/useIsomorphicLayoutEffect';
import { useUpdateSkillsSelfRatingsMutation } from 'src/services/JobRoles';
import { JobRoleSkillType } from 'src/types/api/job_roles';
import { OnboardingStatusType, ProficiencyType } from 'src/types/common';
import { templateString } from 'src/utils/common';

import { RatingOption } from './RatingOption';
import styles from './SelfRatingForm.module.scss';
import { handleOnboardingStatusUpdate } from '../utils';

type SelfRatingFormProps = {
  jobRoleId: string;
  jobRoleSkills: JobRoleSkillType[];
  setSkillProficiencyMap: Function;
  updateOnboardingStatus: (status: OnboardingStatusType) => Promise<boolean>;
};

export function SelfRatingForm({
  jobRoleId,
  jobRoleSkills,
  setSkillProficiencyMap,
  updateOnboardingStatus,
}: SelfRatingFormProps) {
  const { t: translate } = useTranslation('components/selfRatingForm');
  const toast = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const {
    id,
    name,
    self_rated_proficiency: selfRatedProficiency = null,
    verified_proficiency: verifiedProficiency = null,
  } = jobRoleSkills?.[currentIndex] || {};
  const skillsLength = jobRoleSkills?.length;
  const [newSelfRatedProficiency, setNewSelfRatedProficiency] = useState<ProficiencyType | null>(
    selfRatedProficiency || PROFICIENCIES.prebeginner,
  );
  const [updateSkillsSelfRatings, { isLoading }] = useUpdateSkillsSelfRatingsMutation();

  const handleBackButton = async () => {
    if (currentIndex === 0) {
      await handleOnboardingStatusUpdate(
        setIsDisabled,
        updateOnboardingStatus,
        toast,
        translate('error_toast_msg'),
        ONBOARDING_STATUS.PENDING,
      );
    } else {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNextButton = async () => {
    if (selfRatedProficiency !== newSelfRatedProficiency) {
      const skills = [
        {
          id,
          proficiency: newSelfRatedProficiency,
        },
      ];

      const result = await updateSkillsSelfRatings({ job_role_id: jobRoleId, skills });

      if ('error' in result) {
        toast.notify({
          type: 'error_strong',
          message: translate('error_toast_msg'),
          closable: true,
          placement: 'topCenter',
        });
        return;
      }
    }

    if (currentIndex + 1 === skillsLength) {
      await handleOnboardingStatusUpdate(
        setIsDisabled,
        updateOnboardingStatus,
        toast,
        translate('error_toast_msg'),
        ONBOARDING_STATUS.SELF_RATING_COMPLETED,
      );
      return;
    }

    setCurrentIndex(currentIndex + 1);
  };

  const updateSelectedProficiency = (proficiency: ProficiencyType) => {
    setNewSelfRatedProficiency(proficiency);
    setSkillProficiencyMap((prevMap) => ({
      ...prevMap,
      [id]: {
        ...prevMap[id],
        current_proficiency: proficiency,
      },
    }));
  };

  useIsomorphicLayoutEffect(() => {
    setNewSelfRatedProficiency(selfRatedProficiency || PROFICIENCIES.prebeginner);
  }, [currentIndex]);

  const ratingOptions = Object.keys(PROFICIENCIES).map((proficiencyKey, index) => ({
    id: index + 1,
    proficiency: PROFICIENCIES[proficiencyKey],
    description: translate(`proficiencies_description.${proficiencyKey}`),
  }));

  return (
    <div className="hr-flex hr-col hr-justify-between w-100">
      <div className={`${styles.form_container} hr-p-x-2.5`}>
        <div className="hr-flex hr-align-center w-100">
          <HRProgressBar
            aria-label={translate('skill_index_bar_aria_label')}
            max={skillsLength}
            shape="bar"
            type="default"
            value={currentIndex + 1}
            className={`hr-m-r-0.75 ${styles.progress_bar_container}`}
            progressBarClass={styles.progress_bar}
          />
          <div className={styles.index}>
            {templateString(translate('index_text'), {
              index: currentIndex + 1,
              length: skillsLength,
            })}
          </div>
        </div>
        <div className={`${styles.question} hr-m-b-1`}>
          {currentIndex + 1 === skillsLength
            ? translate('question_text.common')
            : translate('question_text.last')}
          <span className="hr-m-l-0.25">{name}</span>
          {translate('question_text.punctuation')}
        </div>
        {newSelfRatedProficiency || !!verifiedProficiency ? (
          <div
            className={`${styles.alert_container} hr-p-l-0.75 hr-p-y-0.75 hr-flex hr-justify-start hr-align-center`}
          >
            {translate(newSelfRatedProficiency ? 'auto_saved' : 'verified_proficiency')}
          </div>
        ) : null}

        <div className={styles.options_container}>
          <HRRadioGroup
            isDisabled={!!verifiedProficiency || isLoading}
            value={newSelfRatedProficiency || verifiedProficiency}
            onChange={(value) => updateSelectedProficiency(value)}
            aria-label={translate('self_rating_form_label')}
            required
          >
            {ratingOptions.map((option) => (
              <div className={`${styles.radio_btn_content} hr-m-y-0.75`} key={option.id}>
                <HRRadioGroupItem
                  id={option.id.toString()}
                  value={option.proficiency}
                  name={option.proficiency}
                  // @ts-ignore
                  label={
                    <RatingOption
                      option={option}
                      isLoading={isLoading}
                      verifiedProficiency={verifiedProficiency}
                    />
                  }
                />
              </div>
            ))}
          </HRRadioGroup>
        </div>
      </div>
      <div
        className={`${styles.btn_container} hr-flex hr-gap-0.75 hr-p-t-1.5 hr-m-y-1.5 hr-p-x-2.5`}
      >
        <SKButton
          variant="secondary"
          isDisabled={isLoading || isDisabled}
          onClick={handleBackButton}
          size="large"
        >
          {translate('back_btn')}
        </SKButton>
        <SKButton
          onClick={handleNextButton}
          variant="primary"
          isDisabled={isLoading || isDisabled}
          isLoading={isLoading}
          loadingText={translate('next_btn')}
          size="large"
        >
          {translate('next_btn')}
        </SKButton>
      </div>
    </div>
  );
}
