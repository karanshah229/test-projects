import styles from './CountLabel.module.scss';

export function CountLabel({ count }: { count: number }) {
  return (
    <div className={`hr-flex hr-align-center hr-justify-center ${styles.label_container} `}>
      {count}
    </div>
  );
}
