import {makeUrlVariables, processOutput} from '@/genericApi/helper';
import {createAPI} from '@/genericApi/foundersNetwork/apiEndpoints';
import {InvokeApiClientSidePayload} from '@/genericApi/apiEndpoints';
import {RequestObject} from '@/genericApi/apiEndpointFactory';
import {REPOSITORIES} from '@/utils/common/constants';

export function createGetFunctionTickets() {
  function denormalizeOutput(this: RequestObject, response: any) {
    const res = processOutput(response);
    if (res?.data) {
      return {
        [REPOSITORIES.FUNCTIONS_REPOSITORY]: {
          functions: {
            [this?.payload?.functionId]: {
              tickets: res.data?.tickets,
              bookedTickets: res.data?.bookedTickets
            }
          }
        },
        [REPOSITORIES.USER_REPOSITORY]: {
          details: {
            info: {
              credits: +res.data?.info.credits?.slice(1)
            }
          }
        }
      };
    }
    return res;
  }

  return function getFunctionTickets(payload: InvokeApiClientSidePayload) {
    const {userId, functionId} = makeUrlVariables(
      ['userId', 'functionId'],
      [],
      payload
    );
    const requestObj = createAPI(false)(
      `/v1/api/users/${userId}/functions/${functionId}/tickets`
    );
    requestObj.processOutput = denormalizeOutput;
    return requestObj;
  };
}

export function createPostFunctionQuestion() {
  return function postQuestion(payload: InvokeApiClientSidePayload) {
    const {userId, functionId} = makeUrlVariables(
      ['userId', 'functionId'],
      [],
      payload
    );
    return createAPI(false)(
      `/v1/api/users/${userId}/functions/${functionId}/question`
    );
  };
}

export function createPostDeclineFunction() {
  function denormalizeOutput(this: RequestObject, response: any) {
    const res = processOutput(response);
    if (res?.data) {
      return {
        [REPOSITORIES.FUNCTIONS_REPOSITORY]: {
          functions: {
            [this?.payload?.functionId]: {
              isDeclined: true
            }
          }
        }
      };
    }
    return res;
  }

  return function postDeclineFunction(payload: InvokeApiClientSidePayload) {
    const {userId, functionId} = makeUrlVariables(
      ['userId', 'functionId'],
      [],
      payload
    );
    const requestObj = createAPI(false)(
      `/v1/api/users/${userId}/functions/${functionId}/decline`
    );
    requestObj.processOutput = denormalizeOutput;
    return requestObj;
  };
}

export const extractTickets = (tickets: any) => {
  return tickets.reduce((ticketArray: any, ticket: any) => {
    if (ticket.numberOfGuest) {
      ticket.guestDetails.map((guest: any) => {
        ticketArray.push({
          name: ticket.name,
          guestName: `${guest.firstName} ${guest.lastName}`,
          type: ticket.type
        });
      });
    } else {
      ticketArray.push({
        name: ticket.name,
        guestName: '',
        type: ticket.type
      });
    }
    return ticketArray;
  }, []);
};

export function createPostBookTickets() {
  function denormalizeOutput(this: RequestObject, response: any) {
    if (response instanceof Error) return response;
    const res = processOutput(response);
    if (res?.data) {
      return {
        [REPOSITORIES.FUNCTIONS_REPOSITORY]: {
          functions: {
            [this?.payload?.functionId]: {
              tickets: res.data.tickets,
              bookedTickets: res.data.bookedTickets,
              addTicketsBtn: !!res.data.tickets?.length,
              removeTicketBtn: true,
              userBookedTickets: extractTickets(this?.options?.data?.tickets)
            }
          }
        },
        [REPOSITORIES.USER_REPOSITORY]: {
          details: {
            info: {
              credits: +res.data?.info.credits?.slice(1)
            }
          }
        }
      };
    }
    return res;
  }

  return function postBookTickets(payload: InvokeApiClientSidePayload) {
    const {userId, functionId} = makeUrlVariables(
      ['userId', 'functionId'],
      [],
      payload
    );
    const requestObj = createAPI(false)(
      `/v1/api/users/${userId}/functions/${functionId}/book-tickets`
    );
    requestObj.additionalParameter = {functionId};
    requestObj.processOutput = denormalizeOutput;
    return requestObj;
  };
}

export function createPostRemoveTickets() {
  function denormalizeOutput(this: RequestObject, response: any) {
    const res = processOutput(response);
    if (res?.data) {
      return {
        [REPOSITORIES.FUNCTIONS_REPOSITORY]: {
          functions: {
            [this?.payload?.functionId]: {
              tickets: res.data.tickets,
              bookedTickets: res.data.bookedTickets,
              addTicketsBtn:
                !!res.data.bookedTickets?.length && !!res.data.tickets?.length,
              removeTicketBtn: !!res.data.bookedTickets?.length
            }
          }
        },
        [REPOSITORIES.USER_REPOSITORY]: {
          details: {
            info: {
              credits: +res.data?.info.credits?.slice(1)
            }
          }
        }
      };
    }
    return res;
  }

  return function (payload: InvokeApiClientSidePayload) {
    const {userId, functionId} = makeUrlVariables(
      ['userId', 'functionId'],
      [],
      payload
    );
    const requestObj = createAPI(false)(
      `/v1/api/users/${userId}/functions/${functionId}/remove-tickets`
    );
    requestObj.processOutput = denormalizeOutput;
    return requestObj;
  };
}
