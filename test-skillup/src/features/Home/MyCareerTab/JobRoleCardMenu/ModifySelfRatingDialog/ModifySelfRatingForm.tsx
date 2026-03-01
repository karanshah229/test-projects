import {
  HRAccordion,
  HRDivider,
  HRRadioGroup,
  HRRadioGroupItem,
} from '@hackerrank/hrds-components';
import { useTranslation } from 'next-i18next';

import { SkillCircularProgressIndicator } from 'src/components/SkillCircularProgressIndicator/SkillCircularProgressIndicator';
import { PROFICIENCIES } from 'src/constants/common';
import { capitalizeFirstLetter } from 'src/utils/common';

import styles from './ModifySelfRating.module.scss';

export type ModifySelfRatingFormProps = {
  setSkillProficiencyMap: Function;
  skillProficiencyMap: any;
};

export function ModifySelfRatingForm({
  setSkillProficiencyMap,
  skillProficiencyMap,
}: ModifySelfRatingFormProps) {
  const { t: translateSelfRating } = useTranslation('components/selfRatingForm');
  const { t: translate } = useTranslation('home');

  const ratingOptions = Object.keys(PROFICIENCIES).map((proficiencyKey, index) => ({
    id: index + 1,
    proficiency: PROFICIENCIES[proficiencyKey],
    description: translateSelfRating(`proficiencies_description.${proficiencyKey}`),
  }));

  return (
    <div className={`hr-grid-col-6 hr-p-t-2.5 hr-p-b-0.5 ${styles.selfRating__layout}`}>
      <div className={`hr-m-b-1 ${styles.selfRating__formHeading}`}>
        {translate('modify_self_rating.dialog_heading')}
      </div>
      <HRAccordion.Root type="single" collapsible>
        {Object.keys(skillProficiencyMap).map((skillId) => {
          const skillProficiency =
            skillProficiencyMap[skillId]?.current_proficiency || PROFICIENCIES.prebeginner;
          const skillName = skillProficiencyMap[skillId]?.name || '';
          const isSkillAssessed = !!skillProficiencyMap[skillId]?.verified_proficiency;

          return (
            <HRAccordion.Item
              key={skillId}
              value={skillId}
              className={`hr-m-y-0.75 ${styles.selfRatingAccordionItem}`}
            >
              <HRAccordion.Trigger
                className={`hr-flex hr-align-center hr-p-y-0.75 hr-p-l-1 ${
                  styles.selfRatingAccordionTrigger
                } ${isSkillAssessed ? styles.disabled : ''}`}
              >
                <div
                  className="hr-m-r-1 hr-flex hr-align-center"
                  style={{
                    height: '38px',
                    width: '38px',
                  }}
                >
                  <SkillCircularProgressIndicator
                    skillProgress={0}
                    skillName={skillProficiencyMap[skillId].name}
                  />
                </div>
                <div className="hr-grid-col-12 hr-flex">
                  <div className={`hr-grid-col-6 ${styles.selfRatingAccordionTrigger__skill}`}>
                    {capitalizeFirstLetter(skillName)}
                  </div>
                  <div
                    className={`hr-grid-col-6 hr-m-r-0.75 ${styles.selfRatingAccordionTrigger__proficiency} ${styles.proficiencyHidden}`}
                  >
                    {capitalizeFirstLetter(skillProficiency)}
                  </div>
                </div>
              </HRAccordion.Trigger>
              <HRAccordion.Content>
                <HRDivider
                  sx={{
                    marginTop: 'calc(var(--hr-spacing-03) * -1)',
                    marginBottom: 'var(--hr-spacing-04)',
                  }}
                />
                <HRRadioGroup
                  name={translate('modify_self_rating.radio_group_name')}
                  aria-label={translate('modify_self_rating.radio_group_aria_label')}
                  value={skillProficiency}
                  onChange={(value) =>
                    setSkillProficiencyMap((prevMap) => ({
                      ...prevMap,
                      [skillId]: {
                        ...prevMap[skillId],
                        current_proficiency: value,
                      },
                    }))
                  }
                  isDisabled={isSkillAssessed}
                >
                  {ratingOptions.map((option) => (
                    <div
                      className={`${styles.selfRatingOptionItem} ${
                        isSkillAssessed && option.proficiency !== skillProficiency
                          ? styles.disabled
                          : ''
                      }`}
                      key={option.id}
                    >
                      <HRRadioGroupItem
                        id={option.id.toString()}
                        value={option.proficiency}
                        name={option.proficiency}
                        key={option.id}
                        isDisabled={isSkillAssessed}
                        // @ts-ignore
                        label={
                          <div className="hr-m-x-2">
                            <div className={styles.selfRatingOptionItem__proficiency}>
                              {option.proficiency}
                            </div>
                            <div className={styles.selfRatingOptionItem__description}>
                              {option.description}
                            </div>
                          </div>
                        }
                      />
                    </div>
                  ))}
                </HRRadioGroup>
                {isSkillAssessed ? (
                  <div
                    className={`${styles.selfRatingAccordionItem__alertContainer} hr-m-t-0.25 hr-p-0.75 hr-flex hr-justify-start hr-align-center`}
                  >
                    {translate('modify_self_rating.disable_alert')}
                  </div>
                ) : null}
              </HRAccordion.Content>
            </HRAccordion.Item>
          );
        })}
      </HRAccordion.Root>
    </div>
  );
}
