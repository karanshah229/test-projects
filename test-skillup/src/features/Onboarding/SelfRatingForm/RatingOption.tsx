import { ProficiencyType } from 'src/types/common';

import styles from './SelfRatingForm.module.scss';

type RatingOptionProps = {
  isLoading: boolean;
  verifiedProficiency: ProficiencyType | null;
  option: {
    proficiency: ProficiencyType;
    description: string;
  };
};

export function RatingOption({ isLoading, verifiedProficiency, option }: RatingOptionProps) {
  return (
    <div
      className={`${styles.label_container} ${
        isLoading || !!verifiedProficiency ? styles.disabled : ''
      }`}
    >
      <div className={styles.proficiency}>{option.proficiency}</div>
      <div className={styles.descrption}>{option.description}</div>
    </div>
  );
}
