import { HRTableColumn, HRTableHeader } from '@hackerrank/hrds-components';

import { HeaderTranslatedTextType } from './types';

export const tableHeader = (headerText: HeaderTranslatedTextType, translate: Function) => (
  <HRTableHeader>
    {Object.keys(headerText).map((key) => (
      <HRTableColumn
        key={key}
        // @ts-ignore
        width={headerText[key].width}
      >
        {translate(headerText[key].label)}
      </HRTableColumn>
    ))}
  </HRTableHeader>
);
