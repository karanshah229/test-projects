import styles from './Typography.module.scss';

type TypographyProps = {
  children: React.ReactNode;
};

export function Header({ children }: TypographyProps) {
  return <div className={styles.header}>{children}</div>;
}

export function SubHeader({ children }: TypographyProps) {
  return <div className={styles.sub_header}>{children}</div>;
}

export function Text({ children }: TypographyProps) {
  return <div className={styles.text}>{children}</div>;
}
