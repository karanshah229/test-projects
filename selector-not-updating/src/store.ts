import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { rootApi } from "./services/rootApi";
import { counterSliceReducer } from "./slices/counterSlice";
import { createWrapper } from "next-redux-wrapper";

export const makeStore = () =>
	configureStore({
		reducer: {
			[rootApi.reducerPath]: rootApi.reducer,
			counter: counterSliceReducer,
		},
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware().concat(rootApi.middleware),
		devTools: true,
	});

const store = makeStore();
setupListeners(store.dispatch);

export default store;

export type AppStoreType = ReturnType<typeof makeStore>;
export type RootStateType = ReturnType<typeof store.getState>;
export type AppDispatchType = AppStoreType["dispatch"];

export const wrapper = createWrapper<AppStoreType>(makeStore, {
	debug: true,
});
