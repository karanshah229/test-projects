/* eslint-disable no-param-reassign */ /* can do this since redux uses Immer under the hood for RTK APIs */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import { userAPI } from 'src/services/User';
import type { RootStateType } from 'src/store';
import { HRWUserDetailsType, UserDetailsType } from 'src/types/api/User';

const initialState: {
  skillUpUserProfileDataLoading: boolean;
  skillUpUserProfileDataHasError: boolean;
  skillUpUserProfileDataError: any;

  HRWUserProfileDataLoading: boolean;
  HRWUserProfileDataHasError: boolean;
  HRWUserProfileDataError: any;

  skillUpUserData: UserDetailsType;
  HRWUserData: HRWUserDetailsType;
} = {
  skillUpUserProfileDataLoading: false,
  skillUpUserProfileDataHasError: false,
  skillUpUserProfileDataError: null,

  HRWUserProfileDataLoading: false,
  HRWUserProfileDataHasError: false,
  HRWUserProfileDataError: null,

  skillUpUserData: {} as UserDetailsType,
  HRWUserData: { applications_enabled: ['skillup'] } as HRWUserDetailsType,
};

export const getSkillUpUserProfile = createAsyncThunk<UserDetailsType>(
  'getSkillUpUserProfile',
  async (_params, thunkAPI) => {
    const result = thunkAPI.dispatch(userAPI.endpoints.getUserProfile.initiate({}));
    // after `keepUnusedFor` time limit, subscription is removed by Redux
    // if we don't unsubscribe here
    result.unsubscribe();
    const response = await result;
    return response.data;
  },
);

export const getHRWUserProfile = createAsyncThunk<HRWUserDetailsType>(
  'getHRWUserProfile',
  async (_params, thunkAPI) => {
    const result = thunkAPI.dispatch(userAPI.endpoints.getHRWUserProfile.initiate());
    // after `keepUnusedFor` time limit, subscription is removed by Redux
    // if we don't unsubscribe here
    result.unsubscribe();
    const response = await result;
    return response.data;
  },
);

export const userDetailsSlice = createSlice({
  name: 'userDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action) => ({
      ...state,
      // @ts-ignore
      ...action?.payload?.userDetails,
    }));

    builder.addMatcher(userAPI.endpoints.getUserProfile.matchPending, (state) => {
      state.skillUpUserProfileDataLoading = true;
    });
    builder.addMatcher(userAPI.endpoints.getUserProfile.matchFulfilled, (state, { payload }) => {
      state.skillUpUserProfileDataLoading = false;
      state.skillUpUserData = payload;
    });
    builder.addMatcher(userAPI.endpoints.getUserProfile.matchRejected, (state, { error }) => {
      state.skillUpUserProfileDataLoading = false;
      state.skillUpUserProfileDataHasError = true;
      state.skillUpUserProfileDataError = error;
    });

    builder.addMatcher(userAPI.endpoints.getHRWUserProfile.matchPending, (state) => {
      state.HRWUserProfileDataLoading = true;
    });
    builder.addMatcher(userAPI.endpoints.getHRWUserProfile.matchFulfilled, (state, { payload }) => {
      state.HRWUserProfileDataLoading = false;
      state.HRWUserData = payload;
    });
    builder.addMatcher(userAPI.endpoints.getHRWUserProfile.matchRejected, (state, { error }) => {
      state.HRWUserProfileDataLoading = false;
      state.HRWUserProfileDataHasError = true;
      state.HRWUserProfileDataError = error;
    });
  },
});

export const userDetailsReducer = userDetailsSlice.reducer;

export const getUserProfileData = (state: RootStateType) => ({
  skillUpUserProfileDataLoading: state.userDetails.skillUpUserProfileDataLoading,
  skillUpUserProfileDataHasError: state.userDetails.skillUpUserProfileDataHasError,
  skillUpUserProfileDataError: state.userDetails.skillUpUserProfileDataError,
  skillUpUserData: state.userDetails.skillUpUserData,
});

export const getHRWUserProfileData = (state: RootStateType) => ({
  HRWUserProfileDataLoading: state.userDetails.HRWUserProfileDataLoading,
  HRWUserProfileDataHasError: state.userDetails.HRWUserProfileDataHasError,
  HRWUserProfileDataError: state.userDetails.HRWUserProfileDataError,
  HRWUserData: state.userDetails.HRWUserData,
});

export function getUserRole(state: RootStateType) {
  return state.userDetails.skillUpUserData?.data?.attributes?.role;
}
