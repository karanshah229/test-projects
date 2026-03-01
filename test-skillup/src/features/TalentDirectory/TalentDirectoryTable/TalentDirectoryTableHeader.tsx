import { HRTableColumn, HRTableHeader } from '@hackerrank/hrds-components';
import { useTranslation } from 'next-i18next';

const columns: {
  key: string;
  width: string;
  align: 'left' | 'right' | 'center';
}[] = [
  { key: 'name', width: '27.5%', align: 'left' },
  { key: 'current_designation', width: '20.5%', align: 'left' },
  { key: 'certifications', width: '20%', align: 'left' },
  { key: 'skills', width: '22.5%', align: 'left' },
  { key: 'profile', width: '9.5%', align: 'center' },
];

export function TalentDirectoryTableHeader() {
  const { t: translate } = useTranslation('talentDirectory');

  return (
    <HRTableHeader>
      {columns.map((col) => (
        <HRTableColumn
          key={col?.key}
          // @ts-ignore
          width={col?.width}
          align={col?.align}
        >
          {translate(`Table.headers.${col?.key}`)}
        </HRTableColumn>
      ))}
    </HRTableHeader>
  );
}
