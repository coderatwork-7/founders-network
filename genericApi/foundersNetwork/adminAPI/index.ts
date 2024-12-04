import {RequestObject} from '@/genericApi/apiEndpointFactory';
import {NoDataFoundError} from '@/genericApi/errors';
import {createAPI} from '@/genericApi/foundersNetwork/apiEndpoints';
import {processOutput} from '@/genericApi/helper';
import {REPOSITORIES} from '@/utils/common/constants';

export function createGetSiteFeedback() {
  function denormalizeOutput(this: RequestObject, response: any) {
    if (response instanceof NoDataFoundError) return response;
    const res = processOutput(response);

    if (res.data) {
      return {
        [REPOSITORIES.ADMIN_REPOSITORY]: {
          siteFeedback: res.data
        }
      };
    }

    return res;
  }
  return function (payload: {userId: number}) {
    const {userId} = payload;
    const requestObj = createAPI(false)(
      `/v1/api/users/${userId}/site-feedback`
    );
    requestObj.processOutput = denormalizeOutput;
    return requestObj;
  };
}

export function createGetFunctionRSVP() {
  function denormalizeOutput(this: RequestObject, response: any) {
    if (response instanceof NoDataFoundError) return response;
    const res = processOutput(response);

    if (res.data) {
      const functionId = this?.payload?.functionId;
      return {
        [REPOSITORIES.ADMIN_REPOSITORY]: {
          functions: {
            [functionId]: res.data
          }
        }
      };
    }

    return res;
  }
  return function (payload: {userId: number; functionId: string}) {
    const {userId, functionId} = payload;
    const requestObj = createAPI(false)(
      `/v1/api/users/${userId}/functions/${functionId}/rsvp-list`
    );
    requestObj.processOutput = denormalizeOutput;
    return requestObj;
  };
}

export function createGetFunctionDeclineReasons() {
  function denormalizeOutput(this: RequestObject, response: any) {
    if (response instanceof NoDataFoundError) return response;
    const res = processOutput(response);

    if (res.data) {
      return {
        [REPOSITORIES.ADMIN_REPOSITORY]: {
          functions: {
            declineReasons: res.data
          }
        }
      };
    }

    return res;
  }
  return function (payload: {userId: number; functionId: string}) {
    const {userId, functionId} = payload;
    const requestObj = createAPI(false)(
      `/v1/api/users/${userId}/functions/${functionId}/decline-reasons`
    );
    requestObj.processOutput = denormalizeOutput;
    return requestObj;
  };
}

export function createPostFunctionEmailListing() {
  return function (payload: {userId: number; functionId: string}) {
    const {userId, functionId} = payload;
    return createAPI(false)(
      `/v1/api/users/${userId}/functions/${functionId}/email-list`
    );
  };
}

export function createGetFunctionRSVPList() {
  return function (payload: {
    userId: number;
    functionId: string;
    type: string;
  }) {
    const {userId, functionId, type} = payload;
    return createAPI(false)(
      `/v1/api/users/${userId}/functions/${functionId}/download-csv?type=${type}`
    );
  };
}

export function createGetAllMembersList() {
  function denormalizeOutput(this: RequestObject, response: any) {
    if (response instanceof NoDataFoundError) return response;
    const res = processOutput(response);

    if (res.data) {
      return {
        [REPOSITORIES.ADMIN_REPOSITORY]: {
          functions: {
            allMembers: res.data
          }
        }
      };
    }

    return res;
  }
  return function (payload: {userId: number; functionId: string}) {
    const {userId, functionId} = payload;
    const requestObj = createAPI(false)(
      `/v1/api/users/${userId}/functions/${functionId}/invite-members-list`
    );
    requestObj.processOutput = denormalizeOutput;
    return requestObj;
  };
}

const addPersonForFunction = (
  allRsvp: Record<string, any>,
  postBodyData: Record<string, any>,
  userDetail: Record<string, any>
) => {
  const type = postBodyData.type ?? postBodyData.newRSVP;
  if (type == 'declined') {
    allRsvp['declined'].list.push(userDetail);
    allRsvp['declined'].count = allRsvp['declined'].list.length;
  } else if (userDetail.role == 'Guest') {
    if (type == 'attending') {
      allRsvp['guestAttending'].list.push(userDetail);
      allRsvp['guestAttending'].count = allRsvp['guestAttending'].list.length;
    } else {
      allRsvp['guestDialin'].list.push(userDetail);
      allRsvp['guestDialin'].count = allRsvp['guestDialin'].list.length;
    }
    allRsvp['all'].list.push(userDetail);
    allRsvp['all'].count = allRsvp['all'].list.length;
  } else {
    if (type == 'attending') {
      allRsvp['membersAttending'].list.push(userDetail);
      allRsvp['membersAttending'].count =
        allRsvp['membersAttending'].list.length;
    } else {
      allRsvp['membersDialingIn'].list.push(userDetail);
      allRsvp['membersDialingIn'].count =
        allRsvp['membersDialingIn'].list.length;
    }
    allRsvp['all'].list.push(userDetail);
    allRsvp['all'].count = allRsvp['all'].list.length;
  }
};

export function createPostFunctionAddRSVP() {
  function denormalizeOutput(this: RequestObject, response: any, state: any) {
    if (response instanceof NoDataFoundError) return response;
    const res = processOutput(response);
    if (res.data && !res.data?.exists) {
      const postBodyData = this.options?.data;
      const userDetail = res.data;
      const functionId = this?.payload?.functionId;
      const allRsvp = JSON.parse(
        JSON.stringify(
          state[REPOSITORIES.ADMIN_REPOSITORY]?.functions?.[functionId]
        )
      );
      addPersonForFunction(allRsvp, postBodyData, userDetail);

      return {
        [REPOSITORIES.ADMIN_REPOSITORY]: {
          functions: {
            [functionId]: {...allRsvp}
          }
        }
      };
    }

    return res;
  }
  return function (payload: {userId: number; functionId: string}) {
    const {userId, functionId} = payload;
    const requestObj = createAPI(false)(
      `/v1/api/users/${userId}/functions/${functionId}/add-rsvp  `
    );
    requestObj.processOutput = denormalizeOutput;
    return requestObj;
  };
}

export function createPostFunctionManageRSVP() {
  function denormalizeOutput(this: RequestObject, response: any, state: any) {
    if (response instanceof NoDataFoundError) return response;
    const res = processOutput(response);
    if (res.data) {
      const postBodyData = this.options?.data;
      const userDetail = this.payload?.userDetail;
      const functionId = this?.payload?.functionId;
      const allRsvp = JSON.parse(
        JSON.stringify(
          state[REPOSITORIES.ADMIN_REPOSITORY]?.functions?.[functionId]
        )
      );

      Object.keys(allRsvp).map(ele => {
        const newList = allRsvp[ele]?.list?.filter(
          (person: Record<string, any>) => {
            return person.profileId != userDetail.profileId;
          }
        );
        allRsvp[ele] = {
          list: newList,
          count: newList.length
        };
      });
      addPersonForFunction(allRsvp, postBodyData, userDetail);
      return {
        [REPOSITORIES.ADMIN_REPOSITORY]: {
          functions: {
            [functionId]: {...allRsvp}
          }
        }
      };
    }

    return res;
  }
  return function (payload: {
    userId: number;
    functionId: string;
    userDetail: Record<string, any>;
  }) {
    const {userId, functionId, userDetail} = payload;
    const requestObj = createAPI(false)(
      `/v1/api/users/${userId}/functions/${functionId}/manage-rsvp`
    );
    requestObj.additionalParameter = {...userDetail};
    requestObj.processOutput = denormalizeOutput;
    return requestObj;
  };
}

export function createPostFunctionRemoveMember() {
  function denormalizeOutput(this: RequestObject, response: any, state: any) {
    if (response instanceof NoDataFoundError) return response;
    const res = processOutput(response);
    const postBody = this.options?.data;
    const functionId = this.payload?.functionId;
    const currentState = JSON.parse(JSON.stringify(state));
    const functionData =
      currentState[REPOSITORIES.ADMIN_REPOSITORY].functions[functionId];
    functionData['invited']?.list.filter(
      (ele: Record<string, any>) => ele.profileId !== postBody?.profileId
    );
    functionData['invited'].count = functionData['invited'].list.length;

    if (res.data) {
      return {
        [REPOSITORIES.ADMIN_REPOSITORY]: {
          functions: {
            [functionId]: {
              ...functionData
            }
          }
        }
      };
    }

    return res;
  }
  return function (payload: {userId: number; functionId: string}) {
    const {userId, functionId} = payload;
    const requestObj = createAPI(false)(
      `/v1/api/users/${userId}/functions/${functionId}/remove-member`
    );
    requestObj.processOutput = denormalizeOutput;
    return requestObj;
  };
}
