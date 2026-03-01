import styles from './EmployerCard.module.scss';

export function EmployerCard({ children }: { children?: React.ReactNode }): JSX.Element {
  return <div className={styles.employer_card}>{children}</div>;
}
