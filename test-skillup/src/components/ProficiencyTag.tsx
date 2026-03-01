import { HRTag } from '@hackerrank/hrds-components';

import { proficiencyAttributes } from 'src/constants/common';

export function ProficiencyTag({
  proficiency = 'prebeginner',
  size = 'medium',
}: {
  proficiency: string;
  size?: 'medium' | 'large';
}) {
  return (
    <HRTag
      color={proficiencyAttributes[proficiency]?.tag}
      label={proficiencyAttributes[proficiency]?.label}
      size={size}
    />
  );
}
