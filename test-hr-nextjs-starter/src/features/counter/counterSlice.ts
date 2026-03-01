import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import type { RootState } from 'src/store';

export interface CounterState {
  count: number;
}

const initialState: CounterState = {
  count: 1,
};

// TODO: Find a way to lazy load and inject reducers
export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
    decrement: (state) => {
      state.count -= 1;
    },
    incrementByAmount(state, action) {
      state.count += action.payload;
    },
    reset: (state) => {
      state.count = initialState.count;
    },
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    // @ts-ignore
    [HYDRATE]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
  },
});

export const { increment, decrement, incrementByAmount, reset } = counterSlice.actions;
export default counterSlice.reducer;

export const selectCount = (state: RootState) => state.counter.count;
