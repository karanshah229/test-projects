import {
  HRAnchor,
  HRTable,
  HRTableBody,
  HRTableColumn,
  HRTableHeader,
} from '@hackerrank/hrds-components';
import { useTranslation } from 'next-i18next';

import { OpenNewWindowIcon } from 'ui-icons';

import { EmptyStateFallback } from 'src/components/EmptyStateFallback/EmptyStateFallback';
import { CertificationLeaderDataType } from 'src/types/api/certifications';
import { SkillLeaderDataType } from 'src/types/api/skills';

import { HeaderTranslatedTextType } from '../types';

function leaderBoardTableHeader(
  headerTranslatedText: HeaderTranslatedTextType,
  translate: Function,
) {
  return (
    <HRTableHeader>
      {Object.keys(headerTranslatedText).map((key, index) => (
        <HRTableColumn
          // @ts-ignore
          width={index === Object.keys(headerTranslatedText).length - 1 ? '10%' : 'auto'}
          key={key}
        >
          {translate(headerTranslatedText[key].i18nKey)}
        </HRTableColumn>
      ))}
    </HRTableHeader>
  );
}

function LeaderBoard({
  leaderBoardData,
  TableBody = () => {},
  talentDirectoryURL = '',
  tableHeader = {},
}: {
  leaderBoardData: SkillLeaderDataType[] | CertificationLeaderDataType[];
  TableBody: Function;
  talentDirectoryURL: string;
  tableHeader: HeaderTranslatedTextType;
}) {
  const { t: translate } = useTranslation('organisationOverview');

  return (
    <div>
      <span className="hr-body-02">{translate('leader_board.header')}</span>
      <div className="hr-m-t-0.5 hr-m-b-1.5">
        <HRTable headerBgColor="white" aria-label={translate('leader_board.aria_label')}>
          {leaderBoardTableHeader(tableHeader, translate)}
          <HRTableBody>{leaderBoardData.map((leaderData) => TableBody(leaderData))}</HRTableBody>
        </HRTable>
        <EmptyStateFallback
          height="300px"
          msg={translate('leader_board.fallback_text')}
          isFallbackVisible={leaderBoardData?.length === 0}
        />
      </div>
      <HRAnchor href={talentDirectoryURL} target="_blank">
        <span className="hr-m-r-0.75 hr-body-01">
          {translate('leader_board.talent_directory_link')}
        </span>
        <OpenNewWindowIcon />
      </HRAnchor>
    </div>
  );
}

export { LeaderBoard };
