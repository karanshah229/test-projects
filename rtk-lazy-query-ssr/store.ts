import { configureStore } from "@reduxjs/toolkit";
import { Context, createWrapper } from "next-redux-wrapper";
import { todoAPI } from "./src/services/todos";

export const makeStore = (ctx?: Context) =>
	configureStore({
		reducer: {
			[todoAPI.reducerPath]: todoAPI.reducer,
		},
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware({
				thunk: {
					extraArgument: ctx,
				},
				serializableCheck: false,
			}).concat(todoAPI.middleware),
		devTools: true,
	});

export type AppStoreType = ReturnType<typeof makeStore>;
export type RootStateType = ReturnType<AppStoreType["getState"]>;
export type AppDispatchType = AppStoreType["dispatch"];

export const wrapper = createWrapper<AppStoreType>(makeStore, {
	debug: true,
});
