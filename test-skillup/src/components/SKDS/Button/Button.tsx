import { HRButton } from '@hackerrank/hrds-components';
import { ComponentPropsWithoutRef } from 'react';

import styles from './Button.module.scss';

type ButtonProps = ComponentPropsWithoutRef<typeof HRButton> & {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'destructive' | 'tertiary';
};

function Button({ children, className, variant, ...rest }: ButtonProps) {
  return (
    <HRButton
      className={`${styles['button-wrapper']} ${styles[variant] || ''} ${className}`}
      {...rest}
    >
      {children}
    </HRButton>
  );
}

export { Button as SKButton };
