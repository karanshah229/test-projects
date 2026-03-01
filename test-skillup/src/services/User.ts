import { ONBOARDING_STATUS } from 'src/constants/common';
import {
  HRWUserDetailsType,
  LogoutResponse,
  UserDetailsQueryArgs,
  UserDetailsType,
  UserDetailsUpdateArgs,
} from 'src/types/api/User';
import { LogoutType } from 'src/types/auth';
import { getBackendURLOrigin } from 'src/utils/common';

import { rootApi } from './common/rootApi';

const enhancedRootApi = rootApi.enhanceEndpoints({
  addTagTypes: ['UserProfile', 'HRWUserProfile'],
});

export const userAPI = enhancedRootApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<UserDetailsType, UserDetailsQueryArgs>({
      query: (args) => ({
        url: `employees/me`,
        params: { ...args },
      }),
      providesTags: ['UserProfile'],
    }),
    getHRWUserProfile: builder.query<HRWUserDetailsType, void>({
      query: () =>
        `${getBackendURLOrigin()}/x/api/v3/users/me?additional_fields=applications_enabled`,
      providesTags: ['HRWUserProfile'],
    }),
    updateUserDetails: builder.mutation<UserDetailsType, UserDetailsUpdateArgs>({
      query: (args) => ({
        method: 'PATCH',
        url: `employees/me`,
        body: { ...args },
      }),
      async onQueryStarted(
        { onboarding_status: onboardingStatusParam },
        { dispatch, queryFulfilled },
      ) {
        const fullFilledQueryResult = await queryFulfilled;
        const onboardingStatus = fullFilledQueryResult?.data?.data?.attributes?.onboarding_status;
        if (onboardingStatus !== onboardingStatusParam) {
          dispatch(
            userAPI.util.updateQueryData('getUserProfile', {}, (employeeData) => {
              const updatedAttributes = {
                ...employeeData.data.attributes,
                onboarding_status:
                  onboardingStatusParam === ONBOARDING_STATUS.SELF_RATING_COMPLETED
                    ? ONBOARDING_STATUS.PROFILE_SETUP_LOADER
                    : onboardingStatusParam,
              };

              const updatedEmployeeData = {
                ...employeeData,
                data: {
                  ...employeeData.data,
                  attributes: updatedAttributes,
                },
              };

              return updatedEmployeeData;
            }),
          );
        }
      },
    }),
    logoutUser: builder.mutation<LogoutResponse, LogoutType>({
      query: (logoutType) => {
        const params = {
          url: `${getBackendURLOrigin()}/work/logout`,
          method: 'POST',
        };
        if (LogoutType.TryLogout === logoutType) {
          return params;
        }
        const destroyAllSessions = logoutType === LogoutType.LogoutFromMultiSession;
        return {
          ...params,
          body: {
            destroy_all: destroyAllSessions.toString(), // Boolean doesn't work
          },
        };
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetUserProfileQuery,
  useUpdateUserDetailsMutation,
  useLazyGetHRWUserProfileQuery,
  useGetHRWUserProfileQuery,
  useLogoutUserMutation,
  util: { getRunningQueriesThunk },
} = userAPI;
