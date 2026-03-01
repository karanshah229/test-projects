import { useTranslation } from 'next-i18next';

import { Badge } from 'src/components/Badge/Badge';
import { BadgeDatum } from 'src/types/api/common';

function sortAllSkillBadges(skillWiseBadges: BadgeDatum[][]) {
  const sortedAllSkillBadges = skillWiseBadges.sort(
    (badge1, badge2) => badge2.length - badge1.length,
  );

  return sortedAllSkillBadges;
}

function AllSkillBadges({ skillWiseBadges }: { skillWiseBadges: BadgeDatum[][] }) {
  const { t: translate } = useTranslation('employeeSkillProfile');

  const sortedAllSkillBadges = sortAllSkillBadges(skillWiseBadges);

  return (
    <>
      <div className="hr-body-04 hr-m-b-1.5 hr-p-t-0.5">{translate('Badges.all_badges_title')}</div>
      <div>
        {sortedAllSkillBadges.map((skillBadgesArr) => (
          <div className="hr-m-b-1.5" key={skillBadgesArr[0].id}>
            <div className="hr-m-b-1.5">{skillBadgesArr[0].attributes.skill_name}</div>
            <div className="hr-flex" style={{ gap: 'var(--hr-spacing-03)', flexWrap: 'wrap' }}>
              {skillBadgesArr.map((badge: BadgeDatum) => (
                <Badge badgeAttributes={badge.attributes} showTooltip key={badge.id} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export { AllSkillBadges };
