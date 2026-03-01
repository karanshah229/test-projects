import { HRTableColumn, HRTableHeader } from '@hackerrank/hrds-components';

import { HeaderTranslatedTextType } from './types';

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
