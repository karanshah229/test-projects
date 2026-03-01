import { useTranslation } from 'next-i18next';

export function SkillDetailRating({ skillRating }: { skillRating: number }) {
  const { t: translate } = useTranslation('employeeSkillProfile');

  return (
    <div>
      {translate('IndividualSkillDetails.skill_rating')}
      <div className="hr-m-y-0.75">
        <span className="hr-heading-01 hr-m-r-0.5">{skillRating}</span>
        {translate('IndividualSkillDetails.total_rating')}
      </div>
    </div>
  );
}
