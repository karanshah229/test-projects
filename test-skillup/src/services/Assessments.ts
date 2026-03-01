import { AssessmentsAPIParams, AssessmentsType } from 'src/types/api/employees';

import { rootApi } from './common/rootApi';

const enhancedRootApi = rootApi.enhanceEndpoints({
  addTagTypes: ['EmployeeSendAssesment'],
});

export const assessmentsAPI = enhancedRootApi.injectEndpoints({
  endpoints: (builder) => ({
    getAssessments: builder.query<AssessmentsType, Partial<AssessmentsAPIParams>>({
      query: ({ ...args }) => ({
        url: `/assessments`,
        params: { ...args },
      }),
      providesTags: ['EmployeeSendAssesment'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAssessmentsQuery,
  util: { getRunningQueriesThunk },
} = assessmentsAPI;
