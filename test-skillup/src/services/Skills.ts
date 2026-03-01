import {
  ProgessDataArgs,
  SkillsDirectoryDatum,
  SkillsDirectoryQueryArgs,
  SkillsInsightsType,
  SkillsOverviewType,
  SkillsPlaylistArgs,
  SkillsPlaylistType,
} from 'src/types/api/skills';
import { sortProficiencies } from 'src/utils/common';

import { rootApi } from './common/rootApi';

export enum SkillDirectoryAdditionalAttributes {
  BADGES = 'badges',
  JOB_ROLES = 'job_roles',
  JOB_FAMILIES = 'job_families',
  RATING_CUTOFFS = 'rating_cutoffs',
}

export enum SkillDirectorySortParam {
  SORT = 'sort',
}

const enhancedRootApi = rootApi.enhanceEndpoints({
  addTagTypes: ['SkillsOverview', 'SkillsInsights', 'SkillsPlaylist', 'SkillsDirectory'],
});

export const skillsAPI = enhancedRootApi.injectEndpoints({
  endpoints: (builder) => ({
    getSkillsOverview: builder.query<SkillsOverviewType, {}>({
      query: () => ({
        url: `skills/overview`,
      }),
      transformResponse: (response: SkillsOverviewType) => {
        const { skills } = response.data;

        skills.sort((a, b) => b.count - a.count);

        return response;
      },
      providesTags: ['SkillsOverview'],
    }),
    getSkillsInsights: builder.query<SkillsInsightsType, Partial<ProgessDataArgs>>({
      query: ({ id, ...args }) => ({
        url: `skills/${id}/overview`,
        params: { ...args },
      }),
      providesTags: ['SkillsInsights'],
    }),
    getSkillsDirectory: builder.query<SkillsDirectoryDatum, SkillsDirectoryQueryArgs>({
      query: (args) => ({
        url: `skills`,
        params: args,
      }),
      providesTags: ['SkillsDirectory'],
    }),
    getSkillsPlaylist: builder.query<SkillsPlaylistType, SkillsPlaylistArgs>({
      query: ({ skillId }) => ({
        url: `skills/${skillId}/learning_playlists`,
      }),
      transformResponse: (response: SkillsPlaylistType) => {
        const { playlists } = response.data;

        playlists.sort((a, b) => sortProficiencies(a.proficiency, b.proficiency));

        return { ...response, data: { ...response.data, playlists } };
      },
      providesTags: ['SkillsPlaylist'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetSkillsOverviewQuery,
  useGetSkillsInsightsQuery,
  useGetSkillsPlaylistQuery,
  useGetSkillsDirectoryQuery,
  util: { getRunningQueriesThunk },
} = skillsAPI;
