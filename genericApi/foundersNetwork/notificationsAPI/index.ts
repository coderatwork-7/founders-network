import {makeUrlVariables, processOutput} from '@/genericApi/helper';
import {REPOSITORIES, STATE_UPDATE_FLAGS} from '@/utils/common/constants';
import {createAPI} from '@/genericApi/foundersNetwork/apiEndpoints';
import {RequestObject} from '@/genericApi/apiEndpointFactory';

interface NotificationsPayload {
  url: {userId: string | number};
  [key: string]: any;
}

export function createGetNotifications() {
  function denormalizeOutput(response: any) {
    const res = processOutput(response);
    if (res?.data) {
      return {
        [REPOSITORIES.USER_REPOSITORY]: {
          notifications: {
            ...res.data?.reduce((acc: any, obj: any) => {
              return Object.assign(acc, {
                [obj.id]: obj
              });
            }, {})
          }
        }
      };
    }
    return {
      [REPOSITORIES.USER_REPOSITORY]: {
        notifications: {
          info: {
            count: 0
          }
        }
      }
    };
  }

  return function (payload: NotificationsPayload) {
    const {userId} = makeUrlVariables(['userId'], [], payload);
    const requestObj = createAPI(false)(
      `${process.env.NEXT_PUBLIC_API_VERSION_V1}/users/${userId}/notifications`
    );

    requestObj.processOutput = denormalizeOutput;
    return requestObj;
  };
}

export function createRemoveNotification() {
  function denormalizeOutput(this: RequestObject, response: any) {
    const res = processOutput(response);
    if (res?.data) {
      const id = this?.additionalParameter?.notificationId;
      return {
        [REPOSITORIES.USER_REPOSITORY]: {
          notifications: {
            [id]: STATE_UPDATE_FLAGS.DELETE
          }
        }
      };
    }
    return res;
  }

  return function (payload: NotificationsPayload) {
    const {userId, notificationId, query} = makeUrlVariables(
      ['userId', 'notificationId'],
      ['type'],
      payload
    );
    const requestObj = createAPI(false)(
      `${process.env.NEXT_PUBLIC_API_VERSION_V1}/users/${userId}/notification/remove/${notificationId}${query}`
    );
    requestObj.additionalParameter = {notificationId: notificationId};
    requestObj.processOutput = denormalizeOutput;
    return requestObj;
  };
}

export function createMarkNotificationsChecked() {
  function denormalizeOutput() {
    return {
      [REPOSITORIES.USER_REPOSITORY]: {
        notifications: {
          info: {
            count: 0
          }
        }
      }
    };
  }

  return function (payload: NotificationsPayload) {
    const {userId} = makeUrlVariables(['userId'], [], payload);
    const requestObj = createAPI(false)(
      `${process.env.NEXT_PUBLIC_API_VERSION_V1}/users/${userId}/notifications/read`
    );
    requestObj.processOutput = denormalizeOutput;
    return requestObj;
  };
}

export function createMarkNotificationRead() {
  function denormalizeOutput(this: RequestObject, response: any) {
    const res = processOutput(response);
    if (res?.data) {
      const id = this?.additionalParameter?.notificationId;
      return {
        [REPOSITORIES.USER_REPOSITORY]: {
          notifications: {
            [id]: {
              is_read: true
            }
          }
        }
      };
    }
    return res;
  }

  return function (payload: NotificationsPayload) {
    const {userId, notificationId, query} = makeUrlVariables(
      ['userId', 'notificationId'],
      ['type'],
      payload
    );
    const requestObj = createAPI(false)(
      `${process.env.NEXT_PUBLIC_API_VERSION_V1}/users/${userId}/notifications/read${query}`
    );
    requestObj.additionalParameter = {notificationId: notificationId};
    requestObj.processOutput = denormalizeOutput;
    return requestObj;
  };
}
