import {RequestObject} from '@/genericApi/apiEndpointFactory';
import {InvokeApiClientSidePayload} from '@/genericApi/apiEndpoints';
import {NoDataFoundError} from '@/genericApi/errors';
import {createAPI} from '@/genericApi/foundersNetwork/apiEndpoints';
import {makeUrlVariables, processOutput} from '@/genericApi/helper';
import {FUNCTION_DETAILS_MAP} from '@/utils/common/apiToStoreMaps';
import {REPOSITORIES} from '@/utils/common/constants';
import {convertObjectUsingMapping, downloadBlob} from '@/utils/common/helper';

interface FunctionsPayloadType {
  url: {
    userId: string | number;
    limit?: number | string;
    offset?: number | string;
    from?: string;
    to?: string;
    sortby?: string;
  };
  [key: string]: any;
}

function denormalizeCalendarEventsOutput(this: RequestObject, response: any) {
  if (response instanceof NoDataFoundError) return response;
  const res = processOutput(response);

  if (res?.data) {
    const allDates = [...res.data.dates];
    const monthArray = this.payload?.month;

    if (Array.isArray(monthArray) && monthArray.length) {
      return {
        [REPOSITORIES.FUNCTIONS_REPOSITORY]: {
          [this.additionalParameter?.key || 'events']: {
            allEvents: allDates,
            monthsLoaded: monthArray
          }
        }
      };
    }
  }

  return res;
}

export function createGetCalendarEvents() {
  return function getCalendarEvents(payload: FunctionsPayloadType) {
    const {userId, query} = makeUrlVariables(
      ['userId'],
      ['from', 'to'],
      payload
    );
    const requestObj = createAPI(false)(
      `/v1/api/users/${userId}/functions/event-calendar${query}`
    );
    requestObj.additionalParameter = {key: 'calendar'};
    requestObj.processOutput = denormalizeCalendarEventsOutput;
    return requestObj;
  };
}

export function createGetFunctionCalendarLinks() {
  function denormalizeOutput(this: RequestObject, response: any) {
    const res = processOutput(response);
    if (res?.data) {
      return {
        [REPOSITORIES.FUNCTIONS_REPOSITORY]: {
          functions: {
            [this?.payload?.functionId]: {
              addToCalendar: {
                ical: res.data.ical,
                outlook: res.data.outlook,
                google: res.data.gmail
              }
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
      `/v1/api/users/${userId}/functions/${functionId}/calendar-links`
    );

    requestObj.processOutput = denormalizeOutput;
    return requestObj;
  };
}

export function createGetFuntionsDetails() {
  function denormalizeOutput(this: RequestObject, response: any) {
    const res = processOutput(response);
    if (res?.data) {
      const functionId = this?.payload?.functionId;
      return {
        [REPOSITORIES.FUNCTIONS_REPOSITORY]: {
          functions: {
            [functionId]: convertObjectUsingMapping(
              res.data,
              FUNCTION_DETAILS_MAP,
              {bookedTickets: res.data.tickets?.userBookedTickets}
            )
          }
        }
      };
    }
  }

  return function (payload: InvokeApiClientSidePayload) {
    const {functionId} = makeUrlVariables(
      ['userId', 'functionId'],
      [],
      payload
    );
    const requestObj = createAPI(false)(
      `/v1/api/function/${functionId}/attendees`
    );
    requestObj.processOutput = denormalizeOutput;
    return requestObj;
  };
}

export function createDownloadCalendar() {
  function processDownload(this: RequestObject, response: any) {
    const res = processOutput(response);
    if (res?.data) {
      return downloadBlob(res.data, 'event.ics');
    }
    return res;
  }
  return function (payload: InvokeApiClientSidePayload) {
    const {href} = makeUrlVariables(['href'], [], payload);
    const requestObj = createAPI(false)(`${href}`);

    requestObj.processOutput = processDownload;
    return requestObj;
  };
}

export function createGetAdminFunctionTags() {
  function denormalizeOutput(this: RequestObject, response: any) {
    const res = processOutput(response);
    if (res?.data) {
      const {
        chapter,
        timezone,
        tags,
        functionType,
        functionSubgroup,
        featuredMember,
        featuredInvestor,
        partnerCompany
      } = res?.data ?? {};
      return {
        [REPOSITORIES.FUNCTIONS_REPOSITORY]: {
          tags: {
            chapter: chapter.map((tag: any) => ({
              label: tag.name,
              value: tag.id
            })),
            timezone: timezone.map((tag: any) => ({label: tag, value: tag})),
            tags: tags.map((tag: any) => ({
              label: `${tag.name} (${tag.count})`,
              value: tag.id
            })),
            functionType: functionType.map((tag: any) => ({
              label: tag,
              value: tag
            })),
            functionSubgroup: functionSubgroup.map((tag: any) => ({
              label: tag.name,
              value: tag.id
            })),
            featuredMember: featuredMember.map((tag: any) => ({
              label: tag.name,
              value: tag.id
            })),
            featuredInvestor: featuredInvestor.map((tag: any) => ({
              label: tag.name,
              value: tag.id
            })),
            partnerCompany: partnerCompany.map((tag: any) => ({
              label: tag.name,
              value: tag.id
            }))
          }
        }
      };
    }
  }

  return function () {
    const requestObj = createAPI(false)(`/v1/api/functions/drop-down-options`);
    requestObj.processOutput = denormalizeOutput;
    return requestObj;
  };
}

export function createPostNewFunction() {
  return function ({userId}: InvokeApiClientSidePayload) {
    return createAPI(false)(`/v1/api/users/${userId}/functions`);
  };
}

export function createSaveFunctionDraft() {
  return function ({userId}: InvokeApiClientSidePayload) {
    return createAPI(false)(`/v1/api/users/${userId}/functions/save-draft`);
  };
}
