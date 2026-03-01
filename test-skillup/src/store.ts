import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { Context, createWrapper } from 'next-redux-wrapper';

import { rtkQueryErrorLogger } from './middlewares/rtkQueryErrorLogger';
import { rootApi } from './services/common/rootApi';
import { userDetailsReducer } from './slices/userDetailsSlice';
import { isDev } from './utils/common';

export const makeStore = (ctx?: Context) =>
  configureStore({
    reducer: {
      [rootApi.reducerPath]: rootApi.reducer,
      userDetails: userDetailsReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: ctx,
        },
        serializableCheck: false,
      })
        .concat(rootApi.middleware)
        .concat(rtkQueryErrorLogger),
    devTools: isDev,
  });

export const store = makeStore();
setupListeners(store.dispatch);

export type AppStoreType = ReturnType<typeof makeStore>;
export type RootStateType = ReturnType<typeof store.getState>;
export type AppDispatchType = AppStoreType['dispatch'];

export const wrapper = createWrapper<AppStoreType>(makeStore, {
  debug: isDev,
});
