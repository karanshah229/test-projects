import { HRTable, HRTableBody, HRTableColumn, HRTableHeader } from '@hackerrank/hrds-components';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';

import { EmptyStateFallback } from 'src/components/EmptyStateFallback/EmptyStateFallback';
import { CertificationsDataType } from 'src/types/api/certifications';
import { SkillDataType } from 'src/types/common';
import { sortTableData } from 'src/utils/common';

import { HeaderTranslatedTextType } from './types';

import type { SortDescriptor } from '@react-types/shared';

export function tableHeader(headerTranslatedText: HeaderTranslatedTextType, translate: Function) {
  return (
    <HRTableHeader>
      {Object.keys(headerTranslatedText).map((key) => (
        <HRTableColumn
          key={headerTranslatedText[key].key}
          allowsSorting
          // @ts-ignore
          width={headerTranslatedText[key].width}
        >
          {translate(headerTranslatedText[key].i18nKey)}
        </HRTableColumn>
      ))}
    </HRTableHeader>
  );
}

export function OverviewTable({
  overviewData = [],
  headerText = {} as HeaderTranslatedTextType,
  tableBody = () => {},
  handleOnClick = () => {},
}: {
  headerText: HeaderTranslatedTextType;
  overviewData: CertificationsDataType[] | SkillDataType[];
  tableBody: Function;
  handleOnClick: Function;
}) {
  const { t: translate } = useTranslation('organisationOverview');
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({});
  const [tableData, setTableData] = useState(overviewData);
  const handleSortChange = (value: SortDescriptor) => {
    const { updatedSortDescriptor, updatedTableData } = sortTableData(value, tableData, 'name');
    setSortDescriptor(updatedSortDescriptor);
    setTableData(updatedTableData);
  };
  return (
    <>
      <HRTable
        sortDescriptor={sortDescriptor}
        onSortChange={handleSortChange}
        headerBgColor="white"
        aria-label={translate('overview_table_aria_label')}
      >
        {tableHeader(headerText, translate)}
        <HRTableBody>{tableData.map((rowData) => tableBody(rowData, handleOnClick))}</HRTableBody>
      </HRTable>
      <EmptyStateFallback
        height="400px"
        msg={translate('table_fallback_text')}
        isFallbackVisible={tableData?.length === 0}
      />
    </>
  );
}
