import {AnyAction, configureStore} from '@reduxjs/toolkit';
import apiReducer from './reducers/apiSlice';
import chatReducer from './reducers/chatReducer';
import userSlice from './reducers/userSlice';
import {reduceReducers, createStateUpdateReducer} from '@/genericApi/helper';
import {
  invokeApiClientSide,
  InvokeApiClientSidePayload
} from '@/genericApi/apiEndpoints';
import {ToolkitStore} from '@reduxjs/toolkit/dist/configureStore';
import {AxiosRequestConfig} from 'axios';
import {REPOSITORIES} from '@/utils/common/constants';
import {Subscribe, createSubscribeMiddleware} from './middleware';
import {toggleLikeReducer} from './reducers/likeReducer';

export type InvokeApiFunction = (
  name: string,
  payload: InvokeApiClientSidePayload,
  options?: AxiosRequestConfig
) => Promise<{[key: string]: any}>;

type StoreType = ToolkitStore<
  {
    apiRepository: ApiRepositoryState;
    feedsRepository: FeedsRepositoryState;
    functionsRepository: FunctionsRepositoryState;
    nominationRepository: NominationRepositoryState;
    facetsRepository: FacetsRepositoryState;
    membersRepository: MembersRepositoryState;
    partnersRepository: PartnersRepositoryState;
    investorsRepository: InvestorsRepositoryState;
    groupsRepository: GroupsRepositoryState;
    userRepository: UserRepositoryState;
    chatRepository: ChatRepositoryState;
    dealsRepository: DealsRepositoryState;
    membershipPlanRepository: membershipPlanRepositoryState;
    profileRepository: ProfileRepositoryState;
    libraryRepository: LibraryRepositoryState;
    adminRepository: AdminRepositoryState;
  },
  AnyAction
>;

interface StoreInterface extends StoreType {
  invokeApi: InvokeApiFunction;
  subscribe: Subscribe;
}

const feedsRepositoryReducer = reduceReducers([
  toggleLikeReducer,
  createStateUpdateReducer(REPOSITORIES.FEEDS_REPOSITORY)
]);

const functionsRepositoryReducer = reduceReducers([
  createStateUpdateReducer(REPOSITORIES.FUNCTIONS_REPOSITORY)
]);

const nominationRepositoryReducer = reduceReducers([
  createStateUpdateReducer(REPOSITORIES.NOMINATION_REPOSITORY)
]);

const facetsRepositoryReducer = reduceReducers([
  createStateUpdateReducer(REPOSITORIES.FACETS_REPOSITORY)
]);

const {subscriberMiddleware} = createSubscribeMiddleware();

const membersRepositoryReducer = reduceReducers([
  createStateUpdateReducer(REPOSITORIES.MEMBERS_REPOSITORY)
]);

const partnersRepositoryReducer = reduceReducers([
  createStateUpdateReducer(REPOSITORIES.PARTNERS_REPOSITORY)
]);

const investorsRepositoryReducer = reduceReducers([
  createStateUpdateReducer(REPOSITORIES.INVESTORS_REPOSITORY)
]);

const groupsRepositoryReducer = reduceReducers([
  createStateUpdateReducer(REPOSITORIES.GROUPS_REPOSITORY)
]);

const userRepositoryReducer = reduceReducers([
  userSlice,
  createStateUpdateReducer(REPOSITORIES.USER_REPOSITORY)
]);

const membershipPlanRepositoryReducer = reduceReducers([
  createStateUpdateReducer(REPOSITORIES.MEMBERSHIP_PLAN_REPOSITORY)
]);

const chatRepositoryReducer = reduceReducers([
  chatReducer,
  createStateUpdateReducer(REPOSITORIES.CHAT_REPOSITORY)
]);

const dealsRepositoryReducer = reduceReducers([
  createStateUpdateReducer(REPOSITORIES.DEALS_REPOSITORY)
]);

const profileRepositoryReducer = reduceReducers([
  createStateUpdateReducer(REPOSITORIES.PROFILE_REPOSITORY)
]);

const libraryRepositoryReducer = reduceReducers([
  createStateUpdateReducer(REPOSITORIES.LIBRARY_REPOSITORY)
]);

const adminRepositoryReducer = reduceReducers([
  createStateUpdateReducer(REPOSITORIES.ADMIN_REPOSITORY)
]);

const middleware = (getDefaultMiddleware: any) => {
  const middlewareStack = [subscriberMiddleware];

  if (process.env.NODE_ENV !== 'production') {
    // const logger = require('redux-logger').default;
    // middlewareStack.push(logger);
  }

  return getDefaultMiddleware({serializableCheck: false}).concat(
    middlewareStack
  );
};

export const store: StoreInterface = configureStore({
  reducer: {
    [REPOSITORIES.API_REPOSITORY]: apiReducer,
    [REPOSITORIES.FEEDS_REPOSITORY]: feedsRepositoryReducer,
    [REPOSITORIES.FUNCTIONS_REPOSITORY]: functionsRepositoryReducer,
    [REPOSITORIES.NOMINATION_REPOSITORY]: nominationRepositoryReducer,
    [REPOSITORIES.FACETS_REPOSITORY]: facetsRepositoryReducer,
    [REPOSITORIES.MEMBERS_REPOSITORY]: membersRepositoryReducer,
    [REPOSITORIES.PARTNERS_REPOSITORY]: partnersRepositoryReducer,
    [REPOSITORIES.INVESTORS_REPOSITORY]: investorsRepositoryReducer,
    [REPOSITORIES.GROUPS_REPOSITORY]: groupsRepositoryReducer,
    [REPOSITORIES.USER_REPOSITORY]: userRepositoryReducer,
    [REPOSITORIES.CHAT_REPOSITORY]: chatRepositoryReducer,
    [REPOSITORIES.DEALS_REPOSITORY]: dealsRepositoryReducer,
    [REPOSITORIES.MEMBERSHIP_PLAN_REPOSITORY]: membershipPlanRepositoryReducer,
    [REPOSITORIES.PROFILE_REPOSITORY]: profileRepositoryReducer,
    [REPOSITORIES.LIBRARY_REPOSITORY]: libraryRepositoryReducer,
    [REPOSITORIES.ADMIN_REPOSITORY]: adminRepositoryReducer
  },
  middleware,
  devTools: process.env.NODE_ENV !== 'production'
}) as StoreInterface;

store.invokeApi = (name, payload, options = {}) => {
  return new Promise((resolve, reject) => {
    store.dispatch(
      invokeApiClientSide(name, payload, options, resolve, reject)
    );
  });
};

// Define reducer types
type ApiRepositoryState = ReturnType<typeof apiReducer>;
type FeedsRepositoryState = ReturnType<typeof feedsRepositoryReducer>;
type FunctionsRepositoryState = ReturnType<typeof functionsRepositoryReducer>;
type NominationRepositoryState = ReturnType<typeof nominationRepositoryReducer>;
type FacetsRepositoryState = ReturnType<typeof facetsRepositoryReducer>;
type MembersRepositoryState = ReturnType<typeof membersRepositoryReducer>;
type PartnersRepositoryState = ReturnType<typeof partnersRepositoryReducer>;
type InvestorsRepositoryState = ReturnType<typeof investorsRepositoryReducer>;
type GroupsRepositoryState = ReturnType<typeof groupsRepositoryReducer>;
type UserRepositoryState = ReturnType<typeof userRepositoryReducer>;
type ChatRepositoryState = ReturnType<typeof chatRepositoryReducer>;
type DealsRepositoryState = ReturnType<typeof dealsRepositoryReducer>;
type membershipPlanRepositoryState = ReturnType<
  typeof membershipPlanRepositoryReducer
>;
type ProfileRepositoryState = ReturnType<typeof profileRepositoryReducer>;
type LibraryRepositoryState = ReturnType<typeof libraryRepositoryReducer>;
type AdminRepositoryState = ReturnType<typeof adminRepositoryReducer>;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = {
  apiRepository: ApiRepositoryState;
  feedsRepository: FeedsRepositoryState;
  functionsRepository: FunctionsRepositoryState;
  nominationRepository: NominationRepositoryState;
  facetsRepository: FacetsRepositoryState;
  membersRepository: MembersRepositoryState;
  partnersRepository: PartnersRepositoryState;
  investorsRepository: InvestorsRepositoryState;
  groupsRepository: GroupsRepositoryState;
  userRepository: UserRepositoryState;
  chatRepository: ChatRepositoryState;
  dealsRepository: DealsRepositoryState;
  membershipPlanRepository: membershipPlanRepositoryState;
  profileRepository: ProfileRepositoryState;
  libraryRepository: LibraryRepositoryState;
  adminRepository: AdminRepositoryState;
};

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
