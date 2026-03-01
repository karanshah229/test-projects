import {
  JobRolesSelfRatedSkillsType,
  JobRolesType,
  UpdateJobRolePriorityArgs,
  UpdateJobRolesArgs,
} from 'src/types/api/job_roles';

import { rootApi } from './common/rootApi';

const enhancedRootApi = rootApi.enhanceEndpoints({
  addTagTypes: ['EmployeeJobRolesDetails', 'EmployeeJobRoleSkills'],
});

export const jobRolesAPI = enhancedRootApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeeJobRolesDetails: builder.query<JobRolesType, void>({
      query: () => 'employees/me/job_roles',
      providesTags: ['EmployeeJobRolesDetails'],
    }),
    getJobRoleSkills: builder.query<JobRolesSelfRatedSkillsType, string>({
      query: (jobRoleId) => `employees/me/job_roles/${jobRoleId}/skills`,
      providesTags: ['EmployeeJobRoleSkills'],
    }),
    updateSkillsSelfRatings: builder.mutation<void, UpdateJobRolesArgs>({
      query: (args) => ({
        method: 'POST',
        url: `employees/me/skills/self_ratings`,
        body: args,
      }),
      async onQueryStarted({ job_role_id: jobRoleId, ...args }, { dispatch, queryFulfilled }) {
        await queryFulfilled;

        await dispatch(
          jobRolesAPI.util.updateQueryData('getJobRoleSkills', jobRoleId, (jobRoleSkillsData) => {
            const updateProficinciesMap = args.skills.reduce((acc, skill) => {
              acc[skill.id] = skill.proficiency;
              return acc;
            }, {});

            const skills = jobRoleSkillsData?.data?.attributes?.skills || [];
            skills.forEach((skill) => {
              // eslint-disable-next-line no-param-reassign
              skill.self_rated_proficiency =
                updateProficinciesMap?.[skill.id] || skill.self_rated_proficiency;
            });
          }),
        );
      },
      invalidatesTags: ['EmployeeJobRolesDetails'],
    }),
    deleteJobRole: builder.mutation<void, string>({
      query: (jobRoleId) => ({
        method: 'DELETE',
        url: `employees/me/job_roles/${jobRoleId}`,
      }),
      invalidatesTags: ['EmployeeJobRolesDetails'],
    }),
    updateJobRolePriority: builder.mutation<void, UpdateJobRolePriorityArgs>({
      query: ({ job_role_id: jobRoleId, ...args }) => ({
        method: 'PATCH',
        url: `employees/me/job_roles/${jobRoleId}`,
        body: { ...args },
      }),
      invalidatesTags: ['EmployeeJobRolesDetails'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetEmployeeJobRolesDetailsQuery,
  useGetJobRoleSkillsQuery,
  useUpdateSkillsSelfRatingsMutation,
  useDeleteJobRoleMutation,
  useUpdateJobRolePriorityMutation,
  util: { getRunningQueriesThunk },
} = jobRolesAPI;
