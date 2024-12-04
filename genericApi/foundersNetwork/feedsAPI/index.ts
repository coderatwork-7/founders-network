import {NoDataFoundError} from '@/genericApi/errors';
import {
  facetStateToPayload,
  makeUrlVariables,
  processOutput
} from '@/genericApi/helper';
import {
  REPOSITORIES,
  CONST_RSVP,
  FEEDS_TYPE,
  FACET_KEY_TYPE
} from '@/utils/common/constants';
import {createAPI} from '@/genericApi/foundersNetwork/apiEndpoints';
import {FacetPayload} from '@/utils/common/commonTypes';
import {ForumCardResponse} from '@/components/Cards/Forum/forumCard';
import {
  convertObjectUsingMapping,
  prefixIdByType,
  removePrefixFromId
} from '@/utils/common/helper';
import {FEED_MAPS} from '@/utils/common/apiToStoreMaps';

interface FeedsPayload extends FacetPayload {
  feedsType: string;
}
export const prefixes: any = {
  forums: 'fr',
  functions: 'fn',
  members: 'mm',
  groups: 'gp',
  deals: 'dl'
};

const REPO_MAP: {[key: string]: string} = {
  [FEEDS_TYPE.DEALS]: REPOSITORIES.DEALS_REPOSITORY,
  [FEEDS_TYPE.FUNCTIONS]: REPOSITORIES.FUNCTIONS_REPOSITORY,
  [FEEDS_TYPE.GROUPS]: REPOSITORIES.GROUPS_REPOSITORY
};

const TYPE_TO_ID_FIELD_MAP: {[key: string]: string} = {
  [FEEDS_TYPE.DEALS]: 'dealId',
  [FEEDS_TYPE.FUNCTIONS]: 'functionId',
  [FEEDS_TYPE.GROUPS]: 'groupId'
};

const separateFeedApiObject = (obj: any) => {
  if (obj.type === FEEDS_TYPE.DEALS) {
    return {
      mainObj: convertObjectUsingMapping(obj, FEED_MAPS[obj.type]),
      feedObj: {
        id: obj.id,
        dealId: obj.dealId,
        type: obj.type,
        members: obj.members,
        additionalMemberCount: obj.additionalMemberCount,
        like: obj.like,
        author: obj.author
      }
    };
  } else if (obj.type === FEEDS_TYPE.FUNCTIONS) {
    if (!obj.functionId)
      obj.functionId = removePrefixFromId(obj.id, FEEDS_TYPE.FUNCTIONS);
    return {
      mainObj: convertObjectUsingMapping(obj, FEED_MAPS[obj.type]),
      feedObj: {
        id: obj.id,
        functionId: obj.functionId,
        type: obj.type,
        subtype: obj.subtype,
        attendies: obj.attendies,
        extraAttendiesCount: obj.extraAttendiesCount,
        media: obj.media,
        like: obj.like,
        author: obj.author
      }
    };
  } else if (obj.type === FEEDS_TYPE.GROUPS) {
    return {
      mainObj: convertObjectUsingMapping(obj, FEED_MAPS[obj.type]),
      feedObj: {
        id: obj.id,
        groupId: obj.groupId,
        type: obj.type,
        author: obj.author,
        datetime: obj.datetime,
        members: obj.members,
        additionalMemberCount: obj.additionalMemberCount,
        like: obj.like,
        postedTo: obj.postedTo
      }
    };
  }
  return {mainObj: null, feedObj: obj};
};

const CREATION_DATE = 'Creation Date';

export const processAuthorAndLike = (obj: any) => {
  if (!obj.author.name) obj.author.name = 'Author Name';
  if (!obj.author.avatarUrl) obj.author.avatarUrl = '/images/logo_key.png';
  if (!obj.like.count) obj.like.count = 0;
  if (!obj.like.liked) obj.like.liked = false;
  if (!obj.like.profile) obj.like.profile = [];
};

const processMembers = (obj: any) => {
  if (!obj.datetime.creationDate) obj.datetime.creationDate = CREATION_DATE;
  if (!obj.nominated) obj.nominated = 'Nominated Member';
};

const processGroups = (obj: any) => {
  if (!obj.additionalMemberCount) obj.additionalMemberCount = 0;
  if (!obj.datetime.creationDate) obj.datetime.creationDate = CREATION_DATE;
  if (!obj.groupName) obj.groupName = 'Group Name';
  if (obj.isPrivate !== false && !obj.isPrivate) obj.isPrivate = true;
  if (!obj.members) obj.members = [];
};

export const processForums = (obj: ForumCardResponse) => {
  if (!obj.title) obj.title = 'Forum post title';
  if (!obj.author.companyName) obj.author.companyName = 'Company Name';
  if (!obj.datetime.creationDate) obj.datetime.creationDate = CREATION_DATE;
  if (obj.muteThread !== false && !obj.muteThread) obj.muteThread = false;
  if (obj.followThread !== false && !obj.followThread) obj.followThread = false;
  if (!obj.analytics)
    obj.analytics = {
      comment: 0,
      privateComment: 0
    };
};

const processDeals = (obj: any) => {
  if (!obj.datetime.creationDate) obj.datetime.creationDate = CREATION_DATE;
  if (!obj.members) obj.members = [];
  if (!obj.additionalMemberCount) obj.additionalMemberCount = 0;
  if (!obj.details.allowedTo) obj.details.allowedTo = [];
  if (!obj.details.dealProvider) obj.details.dealProvider = 'Deal Provider';
  if (!obj.details.image) obj.details.image = '/images/logo_key.png';
  if (!obj.details.title) obj.details.title = 'Deal Title';
};

const processFunctions = (obj: any) => {
  if (!obj.title) obj.title = 'Title';

  if (obj.subtype === CONST_RSVP) {
    if (!obj.attendies) obj.attendies = [];
    if (!obj.extraAttendiesCount) obj.extraAttendiesCount = 0;
  }
};
const processBlankValues: any = {
  members: processMembers,
  groups: processGroups,
  forums: processForums,
  deals: processDeals,
  functions: processFunctions
};

function denormalizeFeedsOutput(this: any, response: any) {
  if (response instanceof NoDataFoundError) return response;
  const res = processOutput(response);
  if (res && res.data && res.data.results) {
    res.data.results.forEach((obj: any) => {
      obj.id = prefixIdByType(obj.id, obj.type);
      processAuthorAndLike(obj);
      processBlankValues[obj.type](obj);
    });

    if (res.data.results.length) {
      const array: string[] = [];
      const feedsObj: {[key: string]: any} = {
        replaceReduxState: this.payload.replaceReduxState
      };
      const repoObjects: {[key: string]: any} = {
        [REPOSITORIES.DEALS_REPOSITORY]: {},
        [REPOSITORIES.FUNCTIONS_REPOSITORY]: {},
        [REPOSITORIES.GROUPS_REPOSITORY]: {}
      };
      res.data.results.forEach((obj: any) => {
        const {mainObj, feedObj} = separateFeedApiObject(obj);
        feedsObj[obj.type] = Object.assign(feedsObj[obj.type] || {}, {
          [obj.id]: feedObj
        });
        array.push(feedsObj[obj.type][obj.id] && obj.id);
        if (obj.type && REPO_MAP[obj.type] in repoObjects && mainObj) {
          repoObjects[REPO_MAP[obj.type]][obj.type] = Object.assign(
            repoObjects[REPO_MAP[obj.type]][obj.type] || {},
            {
              [obj[TYPE_TO_ID_FIELD_MAP[obj.type]]]: mainObj
            }
          );
        }
      });
      return {
        [REPOSITORIES.FEEDS_REPOSITORY]: feedsObj,
        ...repoObjects,
        data: {
          next: res.data.next,
          previous: res.data.previous,
          count: res.data.count,
          data: array
        }
      };
    } else throw new NoDataFoundError('No incoming data');
  }

  return res;
}

export function createGetFeeds() {
  return function getFeeds({
    page,
    userId,
    feedsType,
    facetState
  }: FeedsPayload) {
    const {query} = makeUrlVariables([], ['page', ...Object.keys(facetState)], {
      page,
      ...facetStateToPayload(facetState, [FACET_KEY_TYPE, 'type'])
    });
    const requestObj = createAPI(false)(
      `v1/api/users/${userId}/feeds/${feedsType}${query}` //TODO:Make generic function
    );
    requestObj.processOutput = denormalizeFeedsOutput;
    return requestObj;
  };
}
