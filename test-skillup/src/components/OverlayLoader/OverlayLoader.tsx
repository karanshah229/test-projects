import styles from './OverlayLoader.module.scss';
import { SpinnerLoader } from '../SpinnerLoader/SpinnerLoader';

function TableSpinner() {
  return (
    <div className={styles.tableSpinner}>
      <SpinnerLoader size="lg" isAbsolute={false} msg="" />
    </div>
  );
}

export function OverlayLoader({
  children,
  showLoader,
  className = '',
}: {
  children: React.ReactNode;
  showLoader: boolean;
  className?: string;
}) {
  return (
    <div className={`${styles.tableWrapper} ${className}`}>
      {showLoader ? <TableSpinner /> : null}
      {children}
    </div>
  );
}
