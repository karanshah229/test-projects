import { HRTag, HRTooltip } from '@hackerrank/hrds-components';
import { useTranslation } from 'next-i18next';

import { templateString } from 'src/utils/common';

export function RemainingSkillsTrigger({
  overflowedSkills,
  isTriggerInline,
}: {
  overflowedSkills: string[];
  isTriggerInline: boolean;
}) {
  const { t: translate } = useTranslation('components/dynamicList');
  const overflowedSkillsCount = overflowedSkills.length;

  if (!overflowedSkillsCount) return null;
  return (
    <HRTooltip
      content={
        <div>
          {overflowedSkills.map((skill, index) => (
            <div key={skill || index} className="hr-m-y-0.25">
              {skill}
            </div>
          ))}
        </div>
      }
      placement="bottom-start"
    >
      {isTriggerInline ? (
        <HRTag color="default" label={`+${overflowedSkillsCount}`} size="medium" />
      ) : (
        <span style={{ color: 'var(--hr-neutral-50)', width: 'fit-content' }}>
          <u className="hr-m-t-0.5">
            <i className="hr-utility-01">
              {templateString(translate('more_skills_text'), {
                overflowedSkillsCount,
              })}
            </i>
          </u>
        </span>
      )}
    </HRTooltip>
  );
}
