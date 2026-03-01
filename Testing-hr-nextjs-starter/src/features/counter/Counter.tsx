import { RTKCounter } from './RTKCounter';
import { RTKQueryCounter } from './RTKQueryCounter';

export function Counter() {
  return (
    <>
      <RTKQueryCounter />
      <RTKCounter />
    </>
  );
}
