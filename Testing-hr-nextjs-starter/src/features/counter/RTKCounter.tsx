import { HRButton } from '@hackerrank/hrds-components';
import { useState } from 'react';

import { useAppDispatch, useAppSelector } from 'src/hooks';

import { decrement, increment, incrementByAmount, reset, selectCount } from './counterSlice';

export function RTKCounter() {
  const dispatch = useAppDispatch();
  const count = useAppSelector(selectCount);
  const [incrementAmount, setIncrementAmount] = useState(0);

  return (
    <>
      <h2>Redux Toolkit Counter: {count}</h2>
      <div className="hr-flex hr-row" style={{ gap: 'var(--hr-spacing-02)' }}>
        <HRButton onClick={() => dispatch(increment())}>Add 1</HRButton>
        <HRButton onClick={() => dispatch(decrement())}>Subtract 1</HRButton>
        <HRButton onClick={() => dispatch(reset())}>Reset</HRButton>
      </div>
      <br />
      <div className="hr-flex hr-row" style={{ gap: 'var(--hr-spacing-02)' }}>
        <input
          value={incrementAmount}
          onChange={(e) => setIncrementAmount(Number(e.target.value))}
          type="number"
        />
        <HRButton
          onClick={() => {
            dispatch(incrementByAmount(Number(incrementAmount)));
            setIncrementAmount(0);
          }}
        >
          Increment By Amount
        </HRButton>
      </div>
    </>
  );
}
