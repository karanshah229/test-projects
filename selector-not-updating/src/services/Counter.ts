import { rootApi } from "./rootApi";

const enhancedRootApi = rootApi.enhanceEndpoints({
	addTagTypes: ["GetCounter", "SetCounter"],
});

export const counterAPI = enhancedRootApi.injectEndpoints({
	endpoints: (builder) => ({
		getCounter: builder.query<
			{
				data: number;
			},
			void
		>({
			query: () => `/api/counter`,
			providesTags: ["GetCounter"],
		}),
	}),
	overrideExisting: true,
});

export const { useGetCounterQuery } = counterAPI;
