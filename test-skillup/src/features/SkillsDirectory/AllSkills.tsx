import { useTranslation } from 'next-i18next';
import { useMemo, useState } from 'react';

import { SKTag } from 'src/components/SKDS/Tag/Tag';
import { SkillsDirectoryData } from 'src/types/api/skills';

import { SkillsList } from './SkillsList';
import { SubHeader } from './Typography/Typography';

export function AllSkills({
  skills,
  hideProficiency,
  header,
}: {
  skills: SkillsDirectoryData[];
  hideProficiency?: boolean;
  header: string;
}) {
  const { t: translate } = useTranslation('skillsDirectory');

  const [selectedJobFamily, setSelectedJobFamily] = useState<string | null>(null);

  const jobFamilyMap = useMemo(() => {
    const map: { [key: string]: string } = {};

    skills?.forEach((skill) => {
      skill?.attributes?.job_families?.forEach((jobFamily) => {
        const { id: jobFamilyId, name: jobFamilyName } = jobFamily ?? {};
        if (!map[jobFamilyId]) map[jobFamilyId] = jobFamilyName;
      });
    });

    return map;
  }, [skills]);

  const filteredSkills = useMemo(
    () =>
      selectedJobFamily
        ? skills?.filter((skill) =>
            skill?.attributes?.job_families?.some(
              (jobFamily) => jobFamily?.id === selectedJobFamily,
            ),
          )
        : skills,
    [skills, selectedJobFamily],
  );

  return (
    <div className="hr-m-b-4">
      <SubHeader>{header}</SubHeader>
      <div className="hr-flex sk-flex-wrap hr-justify-start hr-align-center hr-gap-0.75 hr-m-b-2 hr-m-x-4 hr-select-none">
        {Object.keys(jobFamilyMap).map((jobFamilyId) => (
          <SKTag
            key={jobFamilyId}
            label={jobFamilyMap?.[jobFamilyId]}
            isActive={selectedJobFamily === jobFamilyId}
            onChange={() =>
              setSelectedJobFamily(selectedJobFamily === jobFamilyId ? null : jobFamilyId)
            }
            ariaLabel={translate('filter_aria_label', {
              jobRoleName: jobFamilyMap?.[jobFamilyId] || '',
            })}
          />
        ))}
      </div>
      <SkillsList skills={filteredSkills} hideProficiency={hideProficiency} />
    </div>
  );
}
