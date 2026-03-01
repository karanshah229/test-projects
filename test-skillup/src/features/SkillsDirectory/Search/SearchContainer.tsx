import { SKSearch } from 'src/components/SKDS/Search/Search';

import { Header } from '../Typography/Typography';
import { SEARCH_BAR_WIDTH } from '../constants';

type SearchContainerProps = {
  searchInput: string;
  setSearchInput: (value: string) => void;
  header: string;
  placeholderText: string;
};

export function SearchContainer({
  searchInput,
  setSearchInput,
  header,
  placeholderText,
}: SearchContainerProps) {
  return (
    <div className="hr-p-y-4 hr-flex hr-col hr-justify-center hr-align-center">
      <Header>{header}</Header>
      <SKSearch
        placeholder={placeholderText}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        containerStyles={{ width: SEARCH_BAR_WIDTH }}
        isFullWidth
        color="light"
      />
    </div>
  );
}
