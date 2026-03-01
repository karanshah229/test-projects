import { useTranslation } from 'next-i18next';

import { SkillDetailConcepts } from 'src/types/api/employees';

import { SkillConceptsChart } from './SkillConceptsChart';

type SkillConceptsPropType = {
  skillConcepts: SkillDetailConcepts[];
};

export function SkillConcepts({ skillConcepts }: SkillConceptsPropType) {
  const { t: translate } = useTranslation('employeeSkillProfile');

  return (
    <div>
      <div>
        <div className="hr-m-y-1.5">
          <div className="hr-body-04 hr-m-b-2">
            {translate('IndividualSkillDetails.concept_breakdown')}
          </div>
          <div>
            <SkillConceptsChart skillConcepts={skillConcepts} />
          </div>
        </div>
      </div>
    </div>
  );
}
