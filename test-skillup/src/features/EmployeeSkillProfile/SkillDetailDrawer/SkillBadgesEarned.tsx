import { useTranslation } from 'next-i18next';

import { Badge } from 'src/components/Badge/Badge';
import { SkillDetailBadges } from 'src/types/api/employees';

export function SkillBadgesEarned({ skillBadges }: { skillBadges: SkillDetailBadges[] }) {
  const { t: translate } = useTranslation('employeeSkillProfile');

  return (
    <div>
      <div style={{ textAlign: 'end' }}>{translate('IndividualSkillDetails.badges_earned')}</div>
      <div
        className="hr-flex hr-row hr-align-center hr-justify-end hr-m-y-0.75"
        style={{ gap: 'var(--hr-spacing-04)' }}
      >
        {skillBadges?.map((badge = {} as SkillDetailBadges) => (
          <Badge
            badgeAttributes={{
              issued_at: badge.issued_at,
              title: badge.title,
              skill_id: '',
              skill_name: badge.skill_name,
              proficiency: badge.proficiency,
              priority: badge.priority,
              image_urls: badge.image_urls,
            }}
            showTooltip
            key={badge.id}
          />
        ))}
      </div>
    </div>
  );
}
