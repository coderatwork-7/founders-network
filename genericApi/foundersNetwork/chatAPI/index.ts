import {makeUrlVariables, processOutput} from '@/genericApi/helper';
import {REPOSITORIES} from '@/utils/common/constants';
import {createAPI} from '@/genericApi/foundersNetwork/apiEndpoints';
import {RequestObject} from '@/genericApi/apiEndpointFactory';
import {InvokeApiClientSidePayload} from '@/genericApi/apiEndpoints';
import {NoDataFoundError} from '@/genericApi/errors';

export function createGetChatUsers() {
  function denormalizeOutput(response: any, state: any) {
    const res = processOutput(response);
    if (res?.data?.results) {
      return {
        [REPOSITORIES.CHAT_REPOSITORY]: {
          info: {
            data: {
              pageNum:
                (state[REPOSITORIES.CHAT_REPOSITORY]?.info?.data?.pageNum ??
                  0) + 1,
              hasMore: !!res?.data?.next
            }
          },
          ...res.data.results.reduce(
            (acc: any, user: any) =>
              Object.assign(acc, {
                [user.userId]: {info: {...user, isLoading: false}}
              }),
            {}
          )
        },
        data: {
          firstUser:
            res?.data?.results?.find(
              (conv: any) => conv?.info?.unreadCount === 0
            )?.userId ??
            res?.data?.results[0]?.userId ??
            null
        }
      };
    }
    return res;
  }

  return function getChatUsers(payload: InvokeApiClientSidePayload) {
    const {userId, query} = makeUrlVariables(['userId'], ['page'], payload);
    const requestObj = createAPI(false)(
      `${process.env.NEXT_PUBLIC_API_VERSION_V1}/users/${userId}/chat/users${query}`
    );

    requestObj.processOutput = denormalizeOutput;
    return requestObj;
  };
}

export function createGetUserMessages() {
  function denormalizeOutput(this: RequestObject, response: any, state: any) {
    const res = processOutput(response);

    if (!res?.data?.results?.length)
      throw new NoDataFoundError('No data found');

    const chatUserId = this?.additionalParameter?.chatUserId;
    const messages =
      state[REPOSITORIES.CHAT_REPOSITORY]?.[chatUserId]?.messages?.data || [];
    const lastPage =
      state[REPOSITORIES.CHAT_REPOSITORY]?.[chatUserId]?.info?.pageNum ?? 1;

    if (res?.data?.results && this.additionalParameter?.page == lastPage) {
      return {
        [REPOSITORIES.CHAT_REPOSITORY]: {
          [chatUserId]: {
            messages: {
              data: [...messages, ...res.data.results]
            },
            info: {
              hasMore: !!res.data.next,
              pageNum: +this.additionalParameter?.page + 1,
              isLoading: false
            }
          }
        }
      };
    }
    return res;
  }

  return function getUserMessages(payload: InvokeApiClientSidePayload) {
    const {
      userId,
      chatUserId,
      page = 1
    } = makeUrlVariables(['userId', 'chatUserId', 'page'], [], payload);
    const requestObj = createAPI(false)(
      `${process.env.NEXT_PUBLIC_API_VERSION_V1}/users/${userId}/chat/users/${chatUserId}/messages?page=${page}`
    );

    requestObj.processOutput = denormalizeOutput;
    requestObj.additionalParameter = {chatUserId, page};
    return requestObj;
  };
}

export function createGetMembers() {
  return function getMembers(payload: InvokeApiClientSidePayload) {
    const {searchTerm} = makeUrlVariables(['searchTerm'], [], payload);
    return createAPI(false)(
      `${process.env.NEXT_PUBLIC_API_VERSION_V1}/chat/members?search=${searchTerm}`
    );
  };
}

export function createPostMessage() {
  function denormalizeOutput(this: RequestObject, response: any, state: any) {
    const processMsg = (msg: any) => ({
      ...msg,
      attachments: msg.attachments.map((att: any) => ({
        filename: att.fileName,
        url: att.url
      }))
    });

    const res = processOutput(response);
    const chatUserId = this?.additionalParameter?.chatUserId;
    const msgId = this?.additionalParameter?.msgId;
    const messages =
      state[REPOSITORIES.CHAT_REPOSITORY]?.[chatUserId].messages?.data || [];

    if (!res?.data?.messageId) {
      return {
        [REPOSITORIES.CHAT_REPOSITORY]: {
          [chatUserId]: {
            messages: {
              data: messages.filter((msg: any) => msg.messageId !== msgId)
            }
          }
        }
      };
    }

    if (res?.data) {
      return {
        [REPOSITORIES.CHAT_REPOSITORY]: {
          [chatUserId]: {
            messages: {
              data: messages.map((msg: any) => {
                if (msg.messageId === msgId) return processMsg(res.data);
                return msg;
              })
            },
            info: {
              lastMessageTimeStamp: res.data.timestamp,
              messageSample: res.data.message
            }
          }
        }
      };
    }
    return res;
  }

  return function postMessage(payload: InvokeApiClientSidePayload) {
    const {userId, chatUserId, msgId} = makeUrlVariables(
      ['userId', 'chatUserId', 'msgId'],
      [],
      payload
    );
    const requestObj = createAPI(false)(
      `${process.env.NEXT_PUBLIC_API_VERSION_V1}/users/${userId}/chat/users/${chatUserId}/messages`
    );

    requestObj.processOutput = denormalizeOutput;
    requestObj.additionalParameter = {chatUserId, msgId};

    return requestObj;
  };
}

export function createGetViewMessage() {
  function denormalizeOutput(this: RequestObject, response: any) {
    const chatUserId = this?.additionalParameter?.chatUserId;
    const res = processOutput(response);
    if (res?.data) {
      return {
        [REPOSITORIES.CHAT_REPOSITORY]: {
          [chatUserId]: {
            info: {
              unreadCount: 0
            }
          }
        }
      };
    }
    return res;
  }

  return function getViewMessage(payload: InvokeApiClientSidePayload) {
    const {userId, chatUserId} = makeUrlVariables(
      ['userId', 'chatUserId'],
      [],
      payload
    );
    const requestObj = createAPI(false)(
      `${process.env.NEXT_PUBLIC_API_VERSION_V1}/users/${userId}/chat/users/${chatUserId}/view/messages`
    );

    requestObj.processOutput = denormalizeOutput;
    requestObj.additionalParameter = {chatUserId};

    return requestObj;
  };
}

export function createGetAllViewMessage() {
  function denormalizeOutput(this: RequestObject, response: any) {
    const res = processOutput(response);
    if (res?.data) {
      return {
        [REPOSITORIES.CHAT_REPOSITORY]: {
          info: {
            unreadCount: 0
          }
        }
      };
    }
    return res;
  }

  return function getAllViewMessage(payload: InvokeApiClientSidePayload) {
    const {userId} = makeUrlVariables(['userId'], [], payload);
    const requestObj = createAPI(false)(
      `${process.env.NEXT_PUBLIC_API_VERSION_V1}/users/${userId}/messages/view`
    );

    requestObj.processOutput = denormalizeOutput;

    return requestObj;
  };
}
