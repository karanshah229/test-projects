import {
  CertificationProgessDataArgs,
  CertificationsInsightsType,
  CertificationsOverviewType,
} from 'src/types/api/certifications';

import { rootApi } from './common/rootApi';

const enhancedRootApi = rootApi.enhanceEndpoints({
  addTagTypes: ['CertificationsOverview', 'CertificationsInsights'],
});

export const certificationsAPI = enhancedRootApi.injectEndpoints({
  endpoints: (builder) => ({
    getCertificationsOverview: builder.query<CertificationsOverviewType, {}>({
      query: () => ({
        url: `certifications/overview`,
      }),
      transformResponse: (response: CertificationsOverviewType) => {
        const { certifications = [] } = response.data;
        certifications.sort((a, b) => b.certifications_count - a.certifications_count);
        return response;
      },
      providesTags: ['CertificationsOverview'],
    }),
    getCertificationsInsights: builder.query<
      CertificationsInsightsType,
      Partial<CertificationProgessDataArgs>
    >({
      query: ({ id, ...args }) => ({
        url: `certifications/${id}/overview`,
        params: { ...args },
      }),
      providesTags: ['CertificationsInsights'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetCertificationsOverviewQuery,
  useGetCertificationsInsightsQuery,
  util: { getRunningQueriesThunk },
} = certificationsAPI;
