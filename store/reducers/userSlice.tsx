import {createAction, createReducer} from '@reduxjs/toolkit';
import {Session} from 'next-auth';

export enum CacheType {
  newForumPost = 'newForumPost',
  libraryPageHistory = 'libraryPageHistory',
  functionEmailListing = 'functionEmailListing'
}

export const setUserInfo = createAction<Session['user']>('updateSession');
export const cacheData =
  createAction<{[key in keyof typeof CacheType]?: any}>('cacheData');

export const setUserOnboardingStatus = createAction<{
  type: string;
  value: boolean;
}>('updateUserOnboardingStatus');

export default createReducer({}, builder => {
  builder.addCase(setUserInfo, (state, action) => {
    return {
      ...state,
      userInfo: {
        ...action.payload,
        onboarding: {
          ...action.payload.onboarding
        }
      }
    };
  });

  builder.addCase(cacheData, (state: any, action) => {
    return {
      ...state,
      cache: {
        ...state.cache,
        ...action.payload
      }
    };
  });

  builder.addCase(setUserOnboardingStatus, (state: any, action) => {
    return {
      ...state,
      userInfo: {
        ...state.userInfo,
        onboarding: {
          ...state.userInfo.onboarding,
          status: {
            ...state.userInfo.onboarding.status,
            [action.payload.type]: action.payload.value
          }
        }
      }
    };
  });
});
