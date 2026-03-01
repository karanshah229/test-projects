import { useTranslation } from 'next-i18next';

import { SkillsDirectoryData } from 'src/types/api/skills';

import { SkillCard } from './SkillCard/SkillCard';
import { Text } from './Typography/Typography';
import { getLatestProficiency } from './utils';

export function SkillsList({
  skills,
  hideProficiency,
  searchInput,
}: {
  skills: SkillsDirectoryData[];
  hideProficiency?: boolean;
  searchInput?: string;
}) {
  const { t: translate } = useTranslation('skillsDirectory');
  if (skills?.length === 0) {
    return (
      <div className="hr-flex sk-flex-wrap hr-align-start hr-p-x-4 hr-gap-1.25">
        <Text>
          {searchInput.length > 0
            ? translate('search.no_results_desc', {
                searchInput,
              })
            : translate('search.no_skills')}
        </Text>
      </div>
    );
  }

  return (
    <div className="hr-flex sk-flex-wrap hr-align-start hr-p-x-4 hr-gap-1.25">
      {skills.map(({ id, attributes }) => {
        const latestProficiency = getLatestProficiency(attributes.proficiency_progress);
        const progressPercentage =
          attributes.proficiency_progress?.[latestProficiency]?.progress_percentage;

        return (
          <SkillCard
            key={id}
            name={attributes.name}
            slug={attributes.slug}
            skillProgress={progressPercentage}
            hideProficiency={hideProficiency}
          />
        );
      })}
    </div>
  );
}
