import { SkillsDirectoryData } from 'src/types/api/skills';

import { SkillsList } from '../SkillsList';
import { SubHeader } from '../Typography/Typography';

type SearchResultsProps = {
  searchInput: string;
  translate: Function;
  filteredSkills: SkillsDirectoryData[];
};

export function SearchResults({ searchInput, translate, filteredSkills }: SearchResultsProps) {
  return (
    <div className="hr-m-b-4">
      <SubHeader>
        {filteredSkills.length > 0
          ? translate('search.result_title')
          : translate('search.no_results_title', {
              searchInput,
            })}
      </SubHeader>

      <SkillsList searchInput={searchInput} skills={filteredSkills} />
    </div>
  );
}
