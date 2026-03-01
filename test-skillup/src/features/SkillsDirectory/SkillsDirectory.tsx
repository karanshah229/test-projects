import { useTranslation } from 'next-i18next';
import { useMemo, useState } from 'react';

import { APIErrorFallback } from 'src/components/APIErrorFallback/APIErrorFallback';
import { SpinnerLoader } from 'src/components/SpinnerLoader/SpinnerLoader';
import {
  SkillDirectoryAdditionalAttributes,
  useGetSkillsDirectoryQuery,
} from 'src/services/Skills';
import { fuzzySearch } from 'src/utils/common';

import { AllSkills } from './AllSkills';
import { SearchContainer } from './Search/SearchContainer';
import { SearchResults } from './Search/SearchResults';
import { SkillsCarousel } from './SkillsCarousel/SkillsCarousel';
import styles from './SkillsDirectory.module.scss';
import { MATCH_FACTOR } from './constants';
import { getPopularSkills, getSortedSkillsByRecency } from './utils';

export function SkillsDirectory() {
  const { t: translate } = useTranslation('skillsDirectory');
  const {
    data: skillsListingData,
    isFetching: skillsListingDataFetching,
    isLoading: skillsListingDataLoading,
    isError: skillsListingDataHasError,
    error: skillsListingDataError,
  } = useGetSkillsDirectoryQuery({
    additional_attributes: SkillDirectoryAdditionalAttributes.JOB_FAMILIES,
  });
  const [searchInput, setSearchInput] = useState('');

  const skills = useMemo(() => skillsListingData?.data || [], [skillsListingData]);
  const popularSkills = getPopularSkills(skills);
  const recentSkills = getSortedSkillsByRecency(skills);

  const filteredSkills = useMemo(
    () =>
      skills.filter((skill) =>
        fuzzySearch(searchInput.toLowerCase(), skill.attributes.name.toLowerCase(), MATCH_FACTOR),
      ),
    [skills, searchInput],
  );

  const showPageLoader = skillsListingDataFetching || skillsListingDataLoading;

  if (showPageLoader) {
    return <SpinnerLoader msg="" />;
  }

  const showPageFallback =
    skillsListingDataHasError && (skillsListingDataError as any)?.status !== 401;

  if (showPageFallback) {
    return <APIErrorFallback />;
  }

  return (
    <main className={`${styles.container} fixed-viewport-height-layout bg-blue-gradient hr-p-y-4`}>
      <SearchContainer
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        header={translate('header.search')}
        placeholderText={translate('search.placeholder_text')}
      />

      {searchInput.length > 0 ? (
        <SearchResults
          searchInput={searchInput}
          translate={translate}
          filteredSkills={filteredSkills}
        />
      ) : (
        <>
          <SkillsCarousel skills={recentSkills} header={translate('header.recent')} />

          <SkillsCarousel
            skills={popularSkills}
            hideProficiency
            resetProgess
            showIndex
            header={translate('header.popular')}
          />

          <AllSkills skills={skills} hideProficiency header={translate('header.all')} />
        </>
      )}
    </main>
  );
}
