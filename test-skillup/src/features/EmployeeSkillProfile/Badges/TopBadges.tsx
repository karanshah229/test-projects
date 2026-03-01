import { Badge } from 'src/components/Badge/Badge';
import { BadgesType } from 'src/types/api/common';

function topBadges(sortedEmployeeSkillBadges: BadgesType): BadgesType {
  const skillsMap = {};

  const filteredEmployeeSkillBadgeDatums = sortedEmployeeSkillBadges.data.filter((badge) => {
    if (skillsMap[badge.attributes.skill_id] === true) return false;
    skillsMap[badge.attributes.skill_id] = true;
    return true;
  });

  return {
    data: filteredEmployeeSkillBadgeDatums,
  };
}

function TopBadges({ sortedEmployeeSkillBadges }: { sortedEmployeeSkillBadges: BadgesType }) {
  const topBadgesDetails = topBadges(sortedEmployeeSkillBadges);

  return (
    <div className="hr-flex" style={{ gap: 'var(--hr-spacing-03)', flexWrap: 'wrap' }}>
      {topBadgesDetails.data.map((badgeData) => [
        <Badge badgeAttributes={badgeData.attributes} showTooltip key={badgeData.id} />,
      ])}
    </div>
  );
}

export { TopBadges };
