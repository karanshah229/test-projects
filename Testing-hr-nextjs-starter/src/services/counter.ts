import { rootApi } from './rootApi';

type Counter = {
  count: number;
};

const enhancedRootApi = rootApi.enhanceEndpoints({
  addTagTypes: ['Counter'],
});

export const counterApi = enhancedRootApi.injectEndpoints({
  endpoints: (builder) => ({
    getInitCounterVal: builder.query<Counter, void>({
      query: () => `Counter/`,
      providesTags: ['Counter'],
    }),
    incrementCount: builder.mutation<Counter, number>({
      query: (count) => ({ url: `Counter/`, method: 'POST', body: { count } }),
      // invalidatesTags: ['Counter'],
      async onQueryStarted(countVal, { dispatch, queryFulfilled }) {
        // Not to done like this. Invalidate Tags after mutation
        // Dummy backend, hence doing it like this
        const { data: resp } = await queryFulfilled;
        dispatch(
          counterApi.util.updateQueryData('getInitCounterVal', undefined, (counter) => {
            counter.count = resp.count;
          }),
        );
      },
    }),
    decrementCount: builder.mutation<Counter, number>({
      query: (count) => ({ url: `Counter/`, method: 'POST', body: { count } }),
      //   invalidatesTags: ['Counter'],
      async onQueryStarted(countVal, { dispatch, queryFulfilled }) {
        // Not to done like this. Invalidate Tags after mutation
        // Dummy backend, hence doing it like this
        const { data: resp } = await queryFulfilled;
        dispatch(
          counterApi.util.updateQueryData('getInitCounterVal', undefined, (counter) => {
            counter.count = resp.count;
          }),
        );
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetInitCounterValQuery,
  useIncrementCountMutation,
  useDecrementCountMutation,
  util: { getRunningQueriesThunk },
} = counterApi;
