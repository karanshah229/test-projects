import { useRef } from 'react';

import { useResizeObserver } from 'src/hooks/useResizeObserver';

import { SearchAndOtherFilters } from './TalentDirectoryFilters/SearchAndOtherFilters';
import { TalentDirectoryFilters } from './TalentDirectoryFilters/TalentDirectoryFilters';
import { TalentDirectoryTable } from './TalentDirectoryTable/TalentDirectoryTable';
import { TalentDirectoryTablePagination } from './TalentDirectoryTable/TalentDirectoryTablePagination';
import { QueryArgsProvider } from './contexts/QueryArgsContext';
import { SelectedEmployeesProvider } from './contexts/SelectedEmployeesContext';

function TalentDirectory() {
  let talentDirectoryTableRef = useRef(null);
  const filterContainerRef = useRef(null);
  const onResize = (_target: HTMLDivElement, entry: ResizeObserverEntry) => {
    if (filterContainerRef.current)
      filterContainerRef.current.style.height = `${entry.borderBoxSize?.[0]?.blockSize}px`;
  };
  talentDirectoryTableRef = useResizeObserver(onResize);

  return (
    <QueryArgsProvider>
      <SelectedEmployeesProvider>
        <main className="hr-grow hr-grid-container w-100 hr-m-y-2">
          <div className="hr-grid-row">
            <div className="hr-grid-col-3">
              <TalentDirectoryFilters ref={filterContainerRef} />
            </div>
            <div className="hr-grid-col-9">
              <div
                className="hr-flex hr-col"
                style={{ gap: 'var(--hr-spacing-06)' }}
                ref={talentDirectoryTableRef}
              >
                <SearchAndOtherFilters />
                <TalentDirectoryTable />
              </div>
              <div className="hr-flex hr-justify-end hr-m-t-1.5">
                <TalentDirectoryTablePagination />
              </div>
            </div>
          </div>
        </main>
      </SelectedEmployeesProvider>
    </QueryArgsProvider>
  );
}

export { TalentDirectory };
