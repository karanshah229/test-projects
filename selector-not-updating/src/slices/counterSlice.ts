/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import type { RootStateType } from "src/store";
import { counterAPI } from "../services/Counter";

const initialState: {
	loading: boolean;
	hasError: boolean;
	error: any;
	counter: number | undefined;
} = {
	loading: false,
	hasError: false,
	error: null,
	counter: undefined,
};

export const fetchCounterDataThunk = createAsyncThunk<any>(
	"fetchCounterDataThunk",
	async (_params, thunkAPI) => {
		const result = thunkAPI.dispatch(
			counterAPI.endpoints.getCounter.initiate()
		);

		result.unsubscribe();
		const response = await result;
		return response.data;
	}
);

export const counterSlice = createSlice({
	name: "counterSlice",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addMatcher(
			counterAPI.endpoints.getCounter.matchPending,
			(state) => {
				state.loading = true;
			}
		);
		builder.addMatcher(
			counterAPI.endpoints.getCounter.matchFulfilled,
			(state, { payload }) => {
				state.loading = false;
				state.counter = payload.data;
			}
		);
		builder.addMatcher(
			counterAPI.endpoints.getCounter.matchRejected,
			(state, { error }) => {
				state.loading = false;
				state.hasError = true;
				state.error = error;
			}
		);
	},
});

export const counterSliceReducer = counterSlice.reducer;

export const getCounterAPIValues = (state: RootStateType) => ({
	...state,
});

export function getCounter(state: RootStateType) {
	return state.counter.counter;
}
