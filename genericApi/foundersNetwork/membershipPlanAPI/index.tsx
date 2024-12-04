import {RequestObject} from '@/genericApi/apiEndpointFactory';
import {createAPI} from '../apiEndpoints';
import {NoDataFoundError} from '@/genericApi/errors';
import {processOutput} from '@/genericApi/helper';
import {REPOSITORIES} from '@/utils/common/constants';

function denormalizeMembershipPlanOutput(this: RequestObject, response: any) {
  if (response instanceof NoDataFoundError) return response;
  const res = processOutput(response);
  if (res?.data) {
    return {
      [REPOSITORIES.MEMBERSHIP_PLAN_REPOSITORY]: {
        [this?.payload?.membershipPlanName]: {
          [res.data.id]: res.data
        }
      }
    };
  }

  return res;
}

export function createMembershipPlan() {
  return function getMembershipPlan({
    userId,
    membershipPlanName
  }: {
    userId: number;
    membershipPlanName: string;
  }) {
    const requestObj = createAPI(false)(
      `/v1/api/users/${userId}/upgrade/${membershipPlanName}`
    );
    requestObj.processOutput = denormalizeMembershipPlanOutput;
    return requestObj;
  };
}

export function createMembershipUpgradePlan() {
  return function getMembershipUpgradePlan({
    userId,
    membershipId
  }: {
    userId: number;
    membershipId: number;
  }) {
    const requestObj = createAPI(false)(
      `/v1/api/users/${userId}/upgrade?plan=${membershipId}`
    );
    return requestObj;
  };
}

export function updateMembershipUpgradePlan() {
  return function postMembershipUpgradePlan({
    userId,
    membershipId
  }: {
    userId: number;
    membershipId: number;
  }) {
    const requestObj = createAPI(false)(
      `/v1/api/users/${userId}/upgrade?plan=${membershipId}`
    );
    return requestObj;
  };
}
