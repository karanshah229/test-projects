import { HRButton } from '@hackerrank/hrds-components';

import {
  useDecrementCountMutation,
  useGetInitCounterValQuery,
  useIncrementCountMutation,
} from 'src/services/counter';

export function RTKQueryCounter() {
  const { data, error, isFetching, refetch, isLoading } = useGetInitCounterValQuery();

  const [increment, { isLoading: incrementIsLoading }] = useIncrementCountMutation();
  const [decrement, { isLoading: decrementIsLoading }] = useDecrementCountMutation();

  const controlsDisabled = isLoading || isFetching || incrementIsLoading;

  return (
    <>
      <h2>
        RTK Query Async Counter:{' '}
        {error
          ? 'Error'
          : isFetching || isLoading || incrementIsLoading || decrementIsLoading
          ? 'Loading...'
          : data.count}
      </h2>
      <div className="hr-flex hr-row" style={{ gap: 'var(--hr-spacing-02)' }}>
        <HRButton onClick={() => increment(data.count + 1)} isDisabled={controlsDisabled}>
          Add 1
        </HRButton>
        <HRButton onClick={() => decrement(data.count - 1)} isDisabled={controlsDisabled}>
          Subtract 1
        </HRButton>
        <HRButton onClick={() => refetch()} isDisabled={controlsDisabled}>
          Reset
        </HRButton>
      </div>
    </>
  );
}
