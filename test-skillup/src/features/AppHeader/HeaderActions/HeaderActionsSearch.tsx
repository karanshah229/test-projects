import { HRHeaderSearch } from '@hackerrank/hrds-components';
import { useRouter } from 'next/router';

function HeaderActionsSearch() {
  const router = useRouter();
  const handleSearch = (searchKeyword: string) => {
    if (!searchKeyword) return;
    const searchTerm = encodeURIComponent(searchKeyword.slice(0, 100));
    router.push(`/employees?search=${searchTerm}`);
  };

  return <HRHeaderSearch onSearch={handleSearch} />;
}
export { HeaderActionsSearch };
