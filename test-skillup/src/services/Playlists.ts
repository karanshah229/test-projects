import { PlayListResponse, UpdateSkillLearningPlaylistArgs } from 'src/types/api/playlists';

import { rootApi } from './common/rootApi';

const enhancedRootApi = rootApi.enhanceEndpoints({
  addTagTypes: ['SkillsPlaylist'],
});

export const playListAPI = enhancedRootApi.injectEndpoints({
  endpoints: (builder) => ({
    updateSkillLearningPlaylist: builder.mutation<
      PlayListResponse,
      UpdateSkillLearningPlaylistArgs
    >({
      query: ({ playListID, ...args }) => ({
        method: 'PUT',
        url: `employees/me/learning_playlists/${playListID}`,
        body: { ...args },
      }),
      invalidatesTags: ['SkillsPlaylist'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useUpdateSkillLearningPlaylistMutation,
  util: { getRunningQueriesThunk },
} = playListAPI;
