import {
  HRActionCellContent,
  HRCell,
  HRDescriptionCellContent,
  HRIconButton,
  HRTable,
  HRTableBody,
  HRTableRow,
  HRTooltip,
} from '@hackerrank/hrds-components';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';

import { EyeIcon } from 'ui-icons';

import { DynamicList } from 'src/components/DynamicList/DynamicList';
import { EmptyStateFallback } from 'src/components/EmptyStateFallback/EmptyStateFallback';
import { OverlayLoader } from 'src/components/OverlayLoader/OverlayLoader';
import { CDN_ASSET_FOLDER_PATH, CDN_URL_PREFIX } from 'src/constants/common';
import { AssessmentDataType } from 'src/types/api/employees';
import { openInNewTab } from 'src/utils/common';
import { getAbsoluteTime, getRelativeTime } from 'src/utils/date';

import { tableHeader } from '../TableHeader';
import { assessmentHistoryHeaderText } from '../constants';

type ActionCellType = {
  reportUrl: string;
  retakeUrl: string;
  translate: Function;
};

type TableContentType = {
  assessmentData: AssessmentDataType;
  translate: Function;
};

function ActionCell({ reportUrl, retakeUrl, translate }: ActionCellType) {
  return (
    <HRActionCellContent>
      <HRTooltip
        content={translate('assessment_history.actions.view_report')}
        offset={4}
        placement="top"
        triggerType="hover"
      >
        <HRIconButton
          aria-label={translate('assessment_history.actions.view_report')}
          variant="ghost"
          onClick={() => openInNewTab(reportUrl)}
        >
          <EyeIcon />
        </HRIconButton>
      </HRTooltip>

      <HRTooltip
        content={translate('assessment_history.actions.reinvite_candidate')}
        offset={4}
        placement="top"
        triggerType="hover"
      >
        {' '}
        <HRIconButton
          aria-label={translate('assessment_history.actions.reinvite_candidate')}
          variant="ghost"
          onClick={() => openInNewTab(retakeUrl)}
        >
          <Image
            alt={translate('assessment_history.actions.reinvite_candidate')}
            width="20"
            height="20"
            src={`${CDN_URL_PREFIX}${CDN_ASSET_FOLDER_PATH.icons}/send.svg`}
          />
        </HRIconButton>
      </HRTooltip>
    </HRActionCellContent>
  );
}

function TableContent({ assessmentData, translate }: TableContentType) {
  const { id: assessmentId, attributes: assessmentAttributes } = assessmentData;
  const assessmentName = assessmentAttributes?.name || translate('assessment_history.date');
  const skills = assessmentAttributes?.skills || [];
  const reportUrl = assessmentAttributes?.report_url || '';
  const retakeUrl = assessmentAttributes?.retake_url || '';
  const relativeTime = getRelativeTime(assessmentAttributes?.completed_at || new Date());
  const absoluteTime = getAbsoluteTime(assessmentAttributes?.completed_at || new Date());

  return (
    <HRTableRow key={assessmentId}>
      <HRCell>
        <div className="hr-text-capitalize">
          <HRDescriptionCellContent text={relativeTime} description={absoluteTime} />
        </div>
      </HRCell>
      <HRCell>{assessmentName}</HRCell>
      <HRCell>
        <DynamicList items={skills.map((skill) => skill?.name)} showTrigger />
      </HRCell>
      <HRCell>
        <ActionCell reportUrl={reportUrl} retakeUrl={retakeUrl} translate={translate} />
      </HRCell>
    </HRTableRow>
  );
}

export function DataTable({
  assessmentHistoryData = [],
  isTableDataLoading = true,
  searchQueryArg = '',
}: {
  assessmentHistoryData: AssessmentDataType[];
  isTableDataLoading: boolean;
  searchQueryArg: string;
}) {
  const { t: translate } = useTranslation('employeeSkillProfile');

  return (
    <OverlayLoader showLoader={isTableDataLoading}>
      <HRTable aria-label="Assessment History Table" headerBgColor="white">
        {tableHeader(assessmentHistoryHeaderText, translate)}
        <HRTableBody>
          {assessmentHistoryData.map((assessmentData) =>
            TableContent({ assessmentData, translate }),
          )}
        </HRTableBody>
      </HRTable>
      <EmptyStateFallback
        height="350px"
        msg={translate(
          searchQueryArg ? 'assessment_history.search_fallback' : 'fallback_state.assessment_text',
        )}
        isFallbackVisible={assessmentHistoryData.length === 0}
      />
    </OverlayLoader>
  );
}
