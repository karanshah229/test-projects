import { useId } from 'react';

import styles from './Tag.module.scss';

type TagProps = {
  label: React.ReactNode;
  ariaLabel: string;
  isActive?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  sx?: React.CSSProperties;
};

function Tag({ label, isActive = false, onChange = () => {}, ariaLabel, sx = {} }: TagProps) {
  const id = useId();
  return (
    <label style={sx} htmlFor={id} className={`${styles.body} ${isActive ? styles.active : ''}`}>
      <input
        type="checkbox"
        checked={isActive}
        onChange={onChange}
        aria-label={ariaLabel}
        id={id}
      />
      {label}
    </label>
  );
}
export { Tag as SKTag };
