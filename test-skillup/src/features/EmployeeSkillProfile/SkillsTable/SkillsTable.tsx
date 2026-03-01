import {
  HRCell,
  HRDrawerContext,
  HRTable,
  HRTableBody,
  HRTableColumn,
  HRTableHeader,
  HRTableRow,
  HRTooltip,
} from '@hackerrank/hrds-components';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useContext } from 'react';

import { InfoIcon } from 'ui-icons';

import { APIErrorFallback } from 'src/components/APIErrorFallback/APIErrorFallback';
import { TrendIcon } from 'src/components/ChartIcons';
import { EmptyStateFallback } from 'src/components/EmptyStateFallback/EmptyStateFallback';
import { ProficiencyTag } from 'src/components/ProficiencyTag';
import { useGetEmployeeSkillsDetailsQuery } from 'src/services/Employees';
import { EmployeeSkillsType, SkillDatum } from 'src/types/api/employees';
import { DrawerContextType } from 'src/types/common';

import styles from './SkillsTable.module.scss';

function SkillRatingTooltipContent() {
  const { t: translate } = useTranslation('employeeSkillProfile');

  return (
    <div className={styles.toolTipContent}>
      {translate('SkillsTable.skill_rating_header_tooltip.part_1')}
      <br />
      {translate('SkillsTable.skill_rating_header_tooltip.part_2')}
      <br />
      {translate('SkillsTable.skill_rating_header_tooltip.part_3')}{' '}
    </div>
  );
}

function TableContent(data: string, skillsData: SkillDatum[], handleOnClick: Function) {
  const skillAttributes = skillsData?.[data]?.attributes;
  const percentChange = skillAttributes?.progress?.percent_change || 0;
  const skillName = skillAttributes.name;
  const skillProficiency = skillAttributes.proficiency;
  const skillRating = skillAttributes.rating || 0;
  const skillId = skillAttributes.skill_id;
  return (
    <HRTableRow
      key={skillId}
      // @ts-ignore
      onClick={() => handleOnClick({ skillId, skillName })}
    >
      <HRCell>{skillName}</HRCell>
      <HRCell>
        <ProficiencyTag proficiency={skillProficiency} />
      </HRCell>
      <HRCell align="right">
        <span>
          <div className={`${styles.ratingChange} hr-flex hr-align-center hr-justify-end`}>
            <span>{skillRating}</span>
            <TrendIcon percentChange={percentChange} />
          </div>
        </span>
      </HRCell>
    </HRTableRow>
  );
}

function SkillsTable({ setIsDrawerOpen }: { setIsDrawerOpen: Function }) {
  const router = useRouter();
  const { t: translate } = useTranslation('employeeSkillProfile');
  const {
    data: employeeSkillsDetailsData = {} as EmployeeSkillsType,
    isError: employeeSkillsDataHasError,
  } = useGetEmployeeSkillsDetailsQuery(parseInt(router.query.id.toString(), 10));

  const skillsData = employeeSkillsDetailsData.data || [];

  const { openDrawer } = useContext<DrawerContextType>(HRDrawerContext);
  const handleOnClick = ({ skillId, skillName }) => {
    setIsDrawerOpen({ skillId, skillName, certificationId: '', certifictionName: '' });
    openDrawer();
  };

  if (employeeSkillsDataHasError) return <APIErrorFallback className="bg-white" />;
  return (
    <>
      <HRTable headerBgColor="white" aria-label={translate('SkillsTable.table_aria_label')}>
        <HRTableHeader>
          <HRTableColumn width="30%">{translate('SkillsTable.skill_header')}</HRTableColumn>

          <HRTableColumn>{translate('SkillsTable.proficiency_header')}</HRTableColumn>

          <HRTableColumn align="right" width="22%">
            <span>{translate('SkillsTable.skill_rating_header')}</span>
            <HRTooltip content={<SkillRatingTooltipContent />} triggerType="hover" placement="top">
              <InfoIcon className={`hr-m-l-0.25 ${styles.infoIcon}`} />
            </HRTooltip>
          </HRTableColumn>
        </HRTableHeader>
        <HRTableBody>
          {Object.keys(skillsData)?.map((data) => TableContent(data, skillsData, handleOnClick))}
        </HRTableBody>
      </HRTable>
      <EmptyStateFallback
        height="365px"
        msg={translate('fallback_state.assessment_text')}
        isFallbackVisible={skillsData.length === 0}
      />
    </>
  );
}

export { SkillsTable };
