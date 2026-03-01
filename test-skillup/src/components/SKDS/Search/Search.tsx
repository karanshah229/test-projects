import { HRSearch } from '@hackerrank/hrds-components';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { ComponentPropsWithoutRef } from 'react';

import { CDN_ASSET_FOLDER_PATH, CDN_URL_PREFIX } from 'src/constants/common';

import styles from './Search.module.scss';

type SearchProps = ComponentPropsWithoutRef<typeof HRSearch> & {
  searchInput: string;
  setSearchInput: (value: string) => void;
  containerStyles?: React.CSSProperties;
};

function Search({ searchInput, setSearchInput, containerStyles = {}, ...rest }: SearchProps) {
  const { t: translate } = useTranslation('components/search');

  return (
    <div style={{ ...containerStyles }} className={styles.search_container}>
      <Image
        alt={translate('search_icon_alt_text')}
        width={24}
        height={24}
        src={`${CDN_URL_PREFIX}${CDN_ASSET_FOLDER_PATH.icons}/search.svg`}
      />
      <HRSearch value={searchInput} onChange={setSearchInput} {...rest} />
    </div>
  );
}

export { Search as SKSearch };
