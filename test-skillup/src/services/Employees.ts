import { API_VERSIONS } from 'src/constants/common';
import { getNewURL } from 'src/features/TalentDirectory/requestParamsReducer';
import { UserDetailsType } from 'src/types/api/User';
import { BadgesType } from 'src/types/api/common';
import {
  AssessmentHistoryArgs,
  BadgeAPIParams,
  EmployeeAssessmentHistoryType,
  EmployeeCertificatonType,
  EmployeeFiltersType,
  EmployeeListingAPIParams,
  EmployeeSkillsType,
  EmployeeType,
  IndividualSkillDetailsType,
  IndividualSkillQueryParameters,
} from 'src/types/api/employees';
import { getBackendURL, sortObjectsByStringProperty } from 'src/utils/common';

import { rootApi } from './common/rootApi';

const enhancedRootApi = rootApi.enhanceEndpoints({
  addTagTypes: [
    'EmployeeDetails',
    'EmployeeSkillsDetails',
    'EmployeeAssessmentHistory',
    'EmployeeBadges',
    'IndividualSkillDetails',
    'EmployeeListing',
    'EmployeeFilters',
    'EmployeeCertifications',
  ],
});

export const employeeAPI = enhancedRootApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeeDetails: builder.query<UserDetailsType, number>({
      query: (employeeID) => `employees/${employeeID}`,
      providesTags: ['EmployeeDetails'],
    }),
    getEmployeeSkillsDetails: builder.query<EmployeeSkillsType, number>({
      query: (employeeID) => `employees/${employeeID}/skills`,
      providesTags: ['EmployeeSkillsDetails'],
    }),
    getEmployeeAssessmentHistory: builder.query<
      EmployeeAssessmentHistoryType,
      AssessmentHistoryArgs
    >({
      query: ({ id, ...args }) => ({
        url: `employees/${id}/assessments`,
        params: { ...args },
      }),

      providesTags: ['EmployeeAssessmentHistory'],
    }),
    getEmployeeBadges: builder.query<BadgesType, BadgeAPIParams>({
      query: ({ employeeID, ...args }) => ({
        url: `employees/${employeeID}/badges`,
        params: { ...args },
      }),
      providesTags: ['EmployeeBadges'],
    }),
    getEmployeeCertifications: builder.query<EmployeeCertificatonType, number>({
      query: (employeeID) => `employees/${employeeID}/certifications`,
      providesTags: ['EmployeeCertifications'],
    }),
    getIndividualSkillDetails: builder.query<
      IndividualSkillDetailsType,
      IndividualSkillQueryParameters
    >({
      query: ({ employeeId, skillId, ...args }) => ({
        url: `employees/${employeeId}/skills/${skillId}`,
        params: { ...args },
      }),
      providesTags: ['IndividualSkillDetails'],
    }),
    getEmployeees: builder.query<EmployeeType, Partial<EmployeeListingAPIParams>>({
      query: (args) => ({
        url: `${getBackendURL(API_VERSIONS.v2)}/employees`,
        method: 'POST',
        body: { ...args },
      }),
      providesTags: ['EmployeeListing'],
      serializeQueryArgs: ({ queryArgs, endpointName }) => {
        // https://github.com/interviewstreet/skillup-frontend/issues/86
        const modifiedQueryArgs = { ...queryArgs };
        if ('page' in queryArgs && queryArgs.page === 1) delete modifiedQueryArgs.page;
        const queryCacheKey = getNewURL(modifiedQueryArgs, false);
        return `${endpointName}-${queryCacheKey}`;
      },
    }),
    getEmployeeeListingFilters: builder.query<EmployeeFiltersType, void>({
      query: () => `${getBackendURL(API_VERSIONS.v2)}/employees/filters`,
      providesTags: ['EmployeeFilters'],
      transformResponse: (response: EmployeeFiltersType) => {
        const {
          data: { skills = [], job_roles: jobRoles = [], certifications = [] } = {},
          ...rest
        } = response;

        const sortedSkillsByName = [...skills].sort((skill1, skill2) =>
          sortObjectsByStringProperty(skill1, skill2, 'name'),
        );

        const sortedJobRolesByName = [...jobRoles].sort((jobRole1, jobRole2) =>
          sortObjectsByStringProperty(jobRole1, jobRole2, 'name'),
        );

        const sortedCertificationsByName = [...certifications].sort(
          (certification1, certification2) =>
            sortObjectsByStringProperty(certification1, certification2, 'name'),
        );

        return {
          data: {
            certifications: sortedCertificationsByName,
            job_roles: sortedJobRolesByName,
            skills: sortedSkillsByName,
          },
          ...rest,
        };
      },
    }),
    getTalentDirectoryExportCSV: builder.mutation<any, any>({
      query: (args) => ({
        url: `${getBackendURL(API_VERSIONS.v2)}/employees/export`,
        method: 'POST',
        body: { ...args },
        responseHandler: (response) => response.blob(),
        cache: 'no-cache',
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetEmployeeDetailsQuery,
  useGetEmployeeSkillsDetailsQuery,
  useGetEmployeeAssessmentHistoryQuery,
  useGetEmployeeBadgesQuery,
  useGetIndividualSkillDetailsQuery,
  useGetEmployeeesQuery,
  useGetEmployeeeListingFiltersQuery,
  useGetEmployeeCertificationsQuery,
  useGetTalentDirectoryExportCSVMutation,
  util: { getRunningQueriesThunk },
} = employeeAPI;
