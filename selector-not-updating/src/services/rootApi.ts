import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// initialize an empty api service that we'll inject endpoints into dynamically
export const rootApi = createApi({
	reducerPath: "rootApi",
	baseQuery: fetchBaseQuery(),
	endpoints: () => ({}),
});
