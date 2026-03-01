import { AssignmentData } from 'src/types/api/assignment';

import { rootApi } from './common/rootApi';

const enhancedRootApi = rootApi.enhanceEndpoints({
  addTagTypes: ['EmployeeAssignments'],
});

export const assignmentsAPI = enhancedRootApi.injectEndpoints({
  endpoints: (builder) => ({
    getAsignments: builder.query<AssignmentData, void>({
      query: () => ({
        url: `/employees/me/assignments`,
      }),
      providesTags: ['EmployeeAssignments'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAsignmentsQuery,
  util: { getRunningQueriesThunk },
} = assignmentsAPI;
