import { HRAccordion, HRCheckbox, HRClickableDiv } from '@hackerrank/hrds-components';
import { useTranslation } from 'next-i18next';
import { Fragment, useContext } from 'react';

import { PROFICIENCES } from 'src/constants/common';
import { useGetEmployeeeListingFiltersQuery } from 'src/services/Employees';
import { EmployeeFiltersDataSkills, EmployeeFiltersType } from 'src/types/api/employees';
import { ProficiencyType } from 'src/types/common';
import { templateString } from 'src/utils/common';

import styles from './TalentDirectoryFilter.module.scss';
import { QueryArgsContext } from '../contexts/QueryArgsContext';
import { SelectedEmployeesContext } from '../contexts/SelectedEmployeesContext';

export function SkillsAccordianItemContent() {
  const { t: translate } = useTranslation('talentDirectory');
  const { t: translateCommon } = useTranslation('common');
  const { data: filtersData = {} as EmployeeFiltersType } = useGetEmployeeeListingFiltersQuery();
  const skills = filtersData?.data?.skills || null;

  const { setSelectedEmployees } = useContext(SelectedEmployeesContext);
  const { queryArgs, updateQueryArgs } = useContext(QueryArgsContext);
  const selectedSkills = queryArgs?.skills || [];

  function handleSkillCheckChange(checked: boolean, skillID: string) {
    const updatedSelectedSkills = [...selectedSkills];
    const skillIndex = selectedSkills.findIndex((skill) => skill?.id === skillID);

    if (checked) {
      const newSkillSelected = {
        id: skillID,
        proficiencies: [...PROFICIENCES],
      };

      if (skillIndex !== -1) updatedSelectedSkills[skillIndex] = newSkillSelected;
      else updatedSelectedSkills.push(newSkillSelected);
    } else updatedSelectedSkills.splice(skillIndex, 1);

    updateQueryArgs({ skills: updatedSelectedSkills });
    setSelectedEmployees(new Set([]));
  }

  function handleProficiencyCheckChange(checked: boolean, prof: ProficiencyType, skillID: string) {
    const updatedSelectedSkills = [...selectedSkills];
    const currentSkillIndex = updatedSelectedSkills.findIndex(
      (skillObj) => skillObj?.id === skillID,
    );
    const currentSkill = {
      id: skillID,
      proficiencies: [],
      ...updatedSelectedSkills[currentSkillIndex],
    };
    const oldProfs = currentSkill?.proficiencies || [];
    const updatedProfs = checked ? [...oldProfs, prof] : oldProfs.filter((p) => p !== prof);

    currentSkill.proficiencies = updatedProfs;
    if (currentSkillIndex !== -1) {
      // update existing skill

      // remove skill if last checked prof becomes unchecked
      if (updatedProfs.length === 0) updatedSelectedSkills.splice(currentSkillIndex, 1);
      else updatedSelectedSkills[currentSkillIndex] = currentSkill;
    } else {
      // add new skill
      updatedSelectedSkills.push(currentSkill);
    }
    updateQueryArgs({ skills: updatedSelectedSkills });
    setSelectedEmployees(new Set([]));
  }

  if (skills.length === 0) return null;
  return (
    <div className="hr-flex hr-col" style={{ gap: 'var(--hr-spacing-05)' }}>
      <HRAccordion.Root type="multiple">
        {skills?.map((skill = {} as EmployeeFiltersDataSkills) => {
          const skillIndexCurrent = selectedSkills.findIndex(
            (selectedSkill) => selectedSkill?.id === skill?.id,
          );
          const selectedSkillProficiencies =
            skillIndexCurrent !== -1 ? selectedSkills[skillIndexCurrent]?.proficiencies || [] : [];
          const skillCheckboxIsSelected = selectedSkillProficiencies.length === PROFICIENCES.length;
          const skillCheckIsIndeterminate =
            selectedSkillProficiencies.length > 0 && !skillCheckboxIsSelected;

          return (
            <HRAccordion.Item value={skill.id} key={skill.id}>
              <HRAccordion.Trigger className={styles.accordionTrigger}>
                <HRClickableDiv onClick={(e) => e.stopPropagation()} tabIndex={-1}>
                  <HRCheckbox
                    // @ts-ignore
                    label={
                      <div className="hr-body-01" style={{ fontWeight: '400' }}>
                        {skill.name}
                      </div>
                    }
                    aria-label={templateString(
                      translate('Filters.skills_filter_skill_checkbox_aria_label'),
                      {
                        skillName: skill.name,
                      },
                    )}
                    id={templateString(translate('Filters.skills_filter_skill_checkbox_id'), {
                      skillID: skill.id,
                    })}
                    isSelected={skillCheckboxIsSelected}
                    isIndeterminate={skillCheckIsIndeterminate}
                    onCheckedChange={(checked: boolean) => {
                      handleSkillCheckChange(checked, skill.id);
                    }}
                  />
                </HRClickableDiv>
              </HRAccordion.Trigger>
              <HRAccordion.Content>
                <div className="hr-flex hr-col" style={{ gap: 'var(--hr-spacing-03)' }}>
                  {PROFICIENCES.map((proficiency, index) => {
                    const skillID = skill?.id;
                    const skillName = skill?.name;
                    const skillIndex = selectedSkills.findIndex(
                      (skillObj) => skillObj?.id === skillID,
                    );
                    const profCheckboxIsSelected =
                      selectedSkills[skillIndex]?.proficiencies?.includes(proficiency) || false;

                    return (
                      <Fragment
                        key={templateString(
                          translate('Filters.skills_filter_proficiency_checkbox_id'),
                          {
                            skillID: `${skillID}-fragment`,
                            proficiency,
                          },
                        )}
                      >
                        <HRCheckbox
                          aria-label={templateString(
                            translate('Filters.skills_filter_proficiency_checkbox_aria_label'),
                            {
                              skillName,
                              proficiency,
                            },
                          )}
                          id={templateString(
                            translate('Filters.skills_filter_proficiency_checkbox_id'),
                            {
                              skillID,
                              proficiency,
                            },
                          )}
                          // @ts-ignore
                          label={
                            <div className="hr-body-01">
                              {translateCommon(`proficiencies.${proficiency}`)}
                            </div>
                          }
                          isSelected={profCheckboxIsSelected}
                          onCheckedChange={(checked: boolean) => {
                            handleProficiencyCheckChange(checked, proficiency, skillID);
                          }}
                        />
                        {index !== PROFICIENCES.length - 1 ? (
                          <div>
                            <hr style={{ border: '0.5px solid var(--hr-neutral-10)' }} />
                          </div>
                        ) : null}
                      </Fragment>
                    );
                  })}
                </div>
              </HRAccordion.Content>
            </HRAccordion.Item>
          );
        })}
      </HRAccordion.Root>
    </div>
  );
}
