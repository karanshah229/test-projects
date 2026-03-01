import { useTranslation } from 'next-i18next';

import { SkillDataType } from 'src/types/common';

import styles from './SkillsList.module.scss';

export function SkillsList({ skills = [] }: { skills: SkillDataType[] }) {
  const { t: translate } = useTranslation('components/skillsList');
  if (skills?.length === 0)
    return <p className="hr-utility-02 hr-m-b-1.5">{translate('no_skills_available')}</p>;

  return (
    <div
      style={{ gap: 'var(--hr-spacing-03)' }}
      className="hr-flex hr-justify-start hr-align-center hr-m-b-1.5"
    >
      {skills?.map(({ name = '', proficiency = '' }) => (
        <div className={styles.skillBox} key={`${name}-${proficiency}`}>
          <p>{name}</p>
          <span className="hr-text-capitalize">{proficiency}</span>
        </div>
      ))}
    </div>
  );
}
