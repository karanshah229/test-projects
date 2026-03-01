import { HRTooltip } from '@hackerrank/hrds-components';
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';

import { BadgeDatumAttributes } from 'src/types/api/common';
import { getBadgeImageFileName, getBadgeImageFilePath } from 'src/utils/common';

import { ImageWithLoader } from '../ImageWithLoader/ImageWithLoader';

function TooltipContent({ badgeAttributes }: { badgeAttributes: BadgeDatumAttributes }) {
  const { t: translate } = useTranslation('employeeSkillProfile');

  return (
    <>
      <div className="hr-flex hr-justify-center">{badgeAttributes.title}</div>
      <div>
        {translate('Badges.achieved_on')} {dayjs(badgeAttributes.issued_at)?.format("DD MMM, 'YY")}
      </div>
    </>
  );
}

export function Badge({
  badgeAttributes,
  showTooltip,
  isDisabled,
  height = 0,
  width = 0,
}: {
  badgeAttributes: BadgeDatumAttributes;
  showTooltip?: boolean;
  isDisabled?: boolean;
  height?: number;
  width?: number;
}) {
  const { t: translateBadge } = useTranslation('components/badge.json');
  const defaultBadgeHeight = badgeAttributes.proficiency === 'expert' ? 74 : 60;
  const defaultBadgeWidth = 54;
  const badgeHeight = height || defaultBadgeHeight;
  const badgeWidth = width || defaultBadgeWidth;

  const badgeImagePath = getBadgeImageFilePath(getBadgeImageFileName({ badgeAttributes }));

  const badgeImgAlt = `${badgeAttributes.skill_name} ${
    badgeAttributes.proficiency
  } ${translateBadge('Badges.badge')}`;

  const isTooltipDisabled = !showTooltip || !badgeAttributes.title || !badgeAttributes.issued_at;

  return (
    <HRTooltip
      content={<TooltipContent badgeAttributes={badgeAttributes} />}
      disabled={isTooltipDisabled}
    >
      <ImageWithLoader
        src={badgeImagePath}
        alt={badgeImgAlt}
        width={badgeWidth}
        height={badgeHeight}
        fallbackImagePath={getBadgeImageFilePath(
          getBadgeImageFileName({
            badgeAttributes: {
              ...badgeAttributes,
              skill_name: 'fallback',
            },
          }),
        )}
        isDisabled={isDisabled}
      />
    </HRTooltip>
  );
}
