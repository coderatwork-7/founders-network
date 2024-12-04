import {format} from 'date-fns';
import moment from 'moment-timezone';
import {FacetState, FacetValues} from './commonTypes';
import {ReadonlyURLSearchParams} from 'next/navigation';
import {FEEDS_TYPE, MENTION_HEIGHT, MENTION_WIDTH, PREFIXES} from './constants';
import {FacetUtils} from '@/components/Common/Facets/useFacetState';
import {RootState} from '@/store';
import {FEED_MAPS} from './apiToStoreMaps';
import {DropdownItem} from '@/types/dropdown';
import {produce} from 'immer';

export const safelyExtractIntegerFromString = (
  str: string | number | undefined | null
) => `${str}`.match(/[^\d]*(\d+)[^\d]*/)?.[1] ?? '';

export const checkURL = (URL: string | null | undefined) => {
  if (URL?.startsWith('http')) return URL;
  else return '';
};
const getValueByKeyString = (
  object: Record<string, any>,
  keyString: string
): any => {
  const keys = keyString.split('.');
  let value: any = object;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return undefined;
    }
  }

  return value;
};

export const setValueByKeyString = (
  object: Record<string, any>,
  keyString: string,
  value: any
): Record<string, any> => {
  return produce(object, draft => {
    const keys = keyString.split('.');
    let currentObj = draft;

    for (const key of keys.slice(0, -1)) {
      if (key in currentObj && typeof currentObj[key] === 'object') {
        currentObj = currentObj[key];
      } else {
        currentObj[key] = {};
        currentObj = currentObj[key];
      }
    }

    const lastKey = keys[keys.length - 1];
    currentObj[lastKey] = value;
  });
};

/**
 * Format Start and End Date
 * "MMMM d'th' yyyy h:mm a" - "h:mm a"
 * @param {startDate, endDate} Start and End date
 * @returns Formatted date string
 */
export const displayDateTime = ({
  startDate,
  endDate
}: {
  startDate: string;
  endDate: string;
}) => {
  const formattedStartDate = format(
    new Date(startDate),
    "MMMM d'th' yyyy h:mm a"
  );
  const formattedEndDate = endDate && format(new Date(endDate), 'h:mm a');

  return `${formattedStartDate} - ${formattedEndDate}`;
};

/**
 * To extract value from URL Parameter.
 * @param {link, param} Pass link and parameter to be extracted
 * @returns value of parameter
 */
export const extractUrlParams = ({
  link,
  param
}: {
  link: string;
  param: string;
}) => {
  const url = new URL(link);

  const params = new URLSearchParams(url.search);
  return params.get(param);
};

export const getDifferenceInMinutes = (
  date1: Date,
  date2: Date = new Date()
): number => {
  const timeDifferenceInMilliseconds = Math.abs(
    date2.getTime() - date1.getTime()
  );
  return timeDifferenceInMilliseconds / (1000 * 60);
};

export const convertLocalTimeToUtc = (): string => {
  const localDate: Date = new Date();
  const utcDate: Date = new Date(
    localDate.getTime() + localDate.getTimezoneOffset() * 60 * 1000
  );
  return utcDate.toISOString();
};

export const convertUtcToLocalTime = (utcDateString: string): Date => {
  const utcDate = new Date(utcDateString);
  return new Date(utcDate.toLocaleString());
};

export const getDateFiveMinutesAhead = (): Date => {
  const currentDate = new Date();
  return new Date(currentDate.getTime() + 5 * 60 * 1000);
};

export const getTokenExpirationTimeInMinutes = (
  pacificDateTimeString: string
): number => {
  if (!pacificDateTimeString) {
    return -1;
  }

  const date = moment.parseZone(`${pacificDateTimeString}`);
  const latime = moment()
    .tz('America/Los_Angeles')
    .format('YYYY-MM-DDTHH:mm:ss');
  const parseLaTime = moment.parseZone(latime);
  const differenceInMinutes = date.diff(parseLaTime, 'minutes');
  return differenceInMinutes - 1;
};
export const retrieveSingleFacetStateKey = (
  facetState: FacetState,
  facetKey: string
) => {
  if (facetState?.[facetKey]) {
    const facetValue = Object.values(facetState[facetKey]);
    if (facetValue.length) return facetValue[0];
  }
  return undefined;
};

export const pascalCase = (str: string) =>
  str ? str[0].toUpperCase() + str.slice(1) : str;

export function facetStateFromUrl(
  query: ReadonlyURLSearchParams | URLSearchParams
): FacetState {
  const facetState: FacetState = {};
  query.forEach((value, key) =>
    Object.assign(facetState, {
      [key]: value.split('|').reduce(
        (acc, facetValueKey) =>
          Object.assign(acc, {
            [facetValueKey]: {
              facetValueKey
            }
          }),
        {}
      )
    })
  );
  return facetState;
}

export function setAndMergeFacetState(
  setSelectedFacetValues?: FacetUtils['setSelectedFacetValues'],
  facetKey?: string,
  facetValues?: FacetValues,
  setApplyFacets?: FacetUtils['setApplyFacets']
) {
  setSelectedFacetValues?.(prev => ({
    ...prev,
    [facetKey ?? 'unknown']: {...prev?.[facetKey ?? 'unknown'], ...facetValues}
  }));
  setApplyFacets?.(true);
}

export const prefixIdByType = (id: string, type: string) => {
  if (type in PREFIXES) return `${PREFIXES[type as FEEDS_TYPE]}_${id}`;
  return id;
};

export const removePrefixFromId = (id: string, type: FEEDS_TYPE) => {
  const prefix = PREFIXES[type];
  const prefixedId = id.toString();
  if (prefix && prefixedId.startsWith(prefix + '_'))
    return prefixedId.substring(prefix.length + 1);
  return prefixedId;
};

export const parseNum = (str: string) => {
  const num = parseInt(str);
  return isNaN(num) ? str : num;
};

export const htmlToText = (html = '', limit = Infinity) => {
  const filteredStr = html.replace(/<[^>]+>/g, '');
  const tempElement = document.createElement('div');
  tempElement.innerHTML = filteredStr;
  return limitString(tempElement.innerText.replace(/\s+/g, ' '), limit);
};

export const limitString = (inputString: string, maxLength: number) => {
  return typeof inputString !== 'string' || inputString.length <= maxLength
    ? inputString
    : inputString.slice(0, maxLength - 3).trim() + '...';
};

export const joinStringList = (arr: string[]) => {
  return arr.length > 1
    ? arr.slice(0, -1).join(', ') + ` and ${arr.slice(-1)[0]}`
    : arr[0];
};

export const convertObjectUsingMapping = (
  inputObject: Record<string, any>,
  mappingStructure: Record<string, any>,
  resultObject: Record<string, any> = {}
): Record<string, any> => {
  for (const key in mappingStructure) {
    if (typeof mappingStructure[key] === 'string') {
      const targetKeys = mappingStructure[key].split('.');
      const value = inputObject?.[key];
      targetKeys.reduce(
        (
          acc: {[key: string]: any},
          key: string,
          index: number,
          arr: string[]
        ) => {
          acc[key] = index === arr.length - 1 ? value : acc[key] ?? {};
          return acc[key];
        },
        resultObject
      );
    } else if (typeof mappingStructure[key] === 'object') {
      convertObjectUsingMapping(
        inputObject?.[key],
        mappingStructure[key],
        resultObject
      );
    }
  }

  return resultObject;
};

export const convertObjectUsingReverseMapping = (
  inputObject: Record<string, any>,
  mappingStructure: Record<string, any>,
  extraFields?: string[]
): Record<string, any> => {
  const resultObject: Record<string, any> = {};

  extraFields?.forEach(field => {
    resultObject[field] = inputObject[field];
  });

  for (const key in mappingStructure) {
    if (typeof mappingStructure[key] === 'string') {
      resultObject[key] = getValueByKeyString(
        inputObject,
        mappingStructure[key]
      );
    } else if (typeof mappingStructure[key] === 'object') {
      resultObject[key] = convertObjectUsingReverseMapping(
        inputObject,
        mappingStructure[key]
      );
    }
  }
  return resultObject;
};

export const getFeedData = (
  state: RootState,
  feedType: string,
  id: string | number
) => {
  if (feedType === FEEDS_TYPE.DEALS) {
    const feedsData = state.feedsRepository[feedType]?.[id];
    const objData = convertObjectUsingReverseMapping(
      state.dealsRepository.deals[feedsData.dealId],
      FEED_MAPS[feedType]
    );
    return {
      ...objData,
      ...feedsData
    };
  } else if (feedType === FEEDS_TYPE.FUNCTIONS) {
    const feedsData = state.feedsRepository[feedType]?.[id];
    const objData = convertObjectUsingReverseMapping(
      state.functionsRepository.functions[feedsData.functionId],
      FEED_MAPS[feedType]
    );
    return {
      ...objData,
      ...feedsData
    };
  } else if (feedType === FEEDS_TYPE.GROUPS) {
    const feedsData = state.feedsRepository[feedType]?.[id];
    const objData = convertObjectUsingReverseMapping(
      state.groupsRepository.groups?.[feedsData.groupId],
      FEED_MAPS[feedType]
    );
    return {
      ...feedsData,
      ...objData
    };
  }
  return state.feedsRepository?.[feedType]?.[id];
};

export const handleSpecificScroll = ({
  id,
  isMobile,
  behavior = 'smooth'
}: {
  id: string;
  isMobile?: boolean;
  behavior?: ScrollOptions['behavior'];
}) => {
  const element = document.getElementById(id)?.offsetTop ?? 0;
  window.scrollTo({left: 0, top: element - (isMobile ? 100 : 0), behavior});
};

export const facetStateToFacetValueArray: // eslint-disable-next-line no-unused-vars
(facetState: FacetState) => {
  [key: string]: [string, string][];
} = facetState =>
  Object.keys(facetState ?? {}).reduce(
    (acc, facetKey) =>
      Object.assign(acc, {
        [facetKey]: Object.keys(facetState?.[facetKey] ?? {}).map(
          facetValueKey => [
            facetState?.[facetKey]?.[facetValueKey]?.facetValueName,
            facetValueKey
          ]
        )
      }),
    {}
  );

export function arrayToDropdownObject(
  array: DropdownItem[] | null | undefined
): {[key: string]: DropdownItem} {
  return (
    array?.reduce(
      (acc, item) =>
        Object.assign(acc, {
          [item?.id ?? item?.name]: {
            id: item?.id ?? item?.name,
            name: item?.name ?? item?.id
          }
        }),
      {}
    ) ?? {}
  );
}
export function dropdownArrayToFacetValues(
  array: DropdownItem[] | null | undefined
): FacetValues {
  return (
    array?.reduce(
      (acc, item) =>
        Object.assign(acc, {
          [item?.id ?? item?.name ?? item]: {
            facetValueKey: item?.id ?? item?.name ?? item,
            facetValueName: item?.name ?? item?.id ?? item
          }
        }),
      {}
    ) ?? {}
  );
}
export function isObjectEmpty(obj: object) {
  for (const key in obj) return false;
  return true;
}

export function checkAtLeastOneObjectEmpty(...objs: object[]) {
  for (const obj of objs) {
    if (isObjectEmpty(obj)) return true;
  }
  return false;
}

export const downloadBlob = (blob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(new Blob([blob]));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
};

export const capitalize = (str: string) =>
  (str && str[0].toUpperCase() + str.slice(1)) || '';

export const isQueryObjectEmpty = (urlQueryParams: URLSearchParams) => {
  for (const [_, __] of urlQueryParams) return false; // eslint-disable-line no-unused-vars
  return true;
};

export const sizeOfQueryObject = (urlQueryParams: URLSearchParams) => {
  let size = 0;
  for (const [_, __] of urlQueryParams) size++; // eslint-disable-line no-unused-vars
  return size;
};

const checkHostname = (href: string | undefined | null) => {
  try {
    const url = new URL(href as string);

    return {
      url,
      matched:
        ['https:', 'http:'].includes(url.protocol) &&
        url.hostname === 'members.foundersnetwork.com'
    };
  } catch (err) {
    return {matched: false, url: null};
  }
};
export const linkConverter = (href: string | undefined | null) => {
  const trimmedHref = href?.trim?.();
  if (trimmedHref?.startsWith('/')) return {matched: true, url: trimmedHref};

  const {matched, url} = checkHostname(trimmedHref);
  if (matched) {
    return {url: `${url!.pathname}${url!.search}`, matched};
  }
  if (url !== null) return {url: trimmedHref, matched: false};

  return {url: '/' + trimmedHref, matched: true};
};
export function selectWordAtPosition(inputString: string, position: number) {
  if (
    typeof inputString !== 'string' ||
    position < 0 ||
    position >= inputString.length
  )
    return {
      mentionString: '',
      start: -1,
      inclusiveEnd: -1
    };
  let wordStart = position;
  let whitespaceFound = false;
  let colonFound = false;
  while (wordStart >= 0 && /\w|@|\s|:/.test(inputString[wordStart])) {
    if (/\s/.test(inputString[wordStart])) {
      if (whitespaceFound)
        return {
          mentionString: '',
          start: -1,
          inclusiveEnd: -1
        };
      else whitespaceFound = true;
    }
    if (/:/.test(inputString[wordStart])) {
      if (colonFound)
        return {
          mentionString: '',
          start: -1,
          inclusiveEnd: -1
        };
      else colonFound = true;
    }
    wordStart--;
    if (inputString[wordStart + 1] === '@') break;
  }
  if (wordStart >= 0 && /\w/.test(inputString[wordStart])) {
    return {
      mentionString: '',
      start: -1,
      inclusiveEnd: -1
    };
  }
  let wordEnd = position;
  while (
    wordEnd < inputString.length - 1 &&
    /\w/.test(inputString[wordEnd + 1])
  )
    wordEnd++;

  return {
    mentionString: inputString.slice(wordStart + 1, wordEnd + 1),
    start: wordStart + 1,
    inclusiveEnd: wordEnd
  };
}
function processMention(
  editor: any,
  setShow: React.Dispatch<React.SetStateAction<boolean>>,
  pluginPosition: React.MutableRefObject<{
    x: number;
    y: number;
  } | null>,
  mentionStr: React.MutableRefObject<string | undefined>,
  mentionString: string
) {
  const mceDimentions = editor?.getContainer()?.getBoundingClientRect();
  const cursorContainers = editor?.contentDocument
    ?.getSelection?.()
    ?.getRangeAt?.(0)
    ?.getClientRects?.();
  let {x: xCursor, y: yCursor} = (cursorContainers?.length
    ? cursorContainers?.[cursorContainers.length - 1]
    : editor?.contentDocument
        ?.getSelection?.()
        ?.getRangeAt?.(0)
        ?.endContainer?.getClientRects?.()?.[0]) ?? {
    x: mceDimentions?.width / 2 - MENTION_WIDTH / 2,
    y: 0
  };
  if (xCursor === 0 && yCursor === 0) {
    xCursor = mceDimentions?.width / 2 - MENTION_WIDTH / 2;
    yCursor = 0;
  }
  const windowHeight =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;

  const absX = mceDimentions?.x + xCursor;
  const absY = mceDimentions?.y + yCursor;

  const overflowX = absX + MENTION_WIDTH - mceDimentions?.right;
  const overflowY = absY + MENTION_HEIGHT - windowHeight;
  const overflowedX = overflowX >= 0;
  const prevOverflowX =
    (pluginPosition.current?.x ?? 133713371337) +
      mceDimentions?.x +
      MENTION_WIDTH >=
    mceDimentions?.right;

  if (
    pluginPosition.current === null ||
    (overflowedX !== prevOverflowX && (overflowedX || prevOverflowX)) //XOR
  ) {
    pluginPosition.current = {
      x: xCursor - Math.max(overflowX, 0),
      y: overflowY > 0 ? yCursor - MENTION_HEIGHT - 20 : yCursor
    };
  }

  mentionStr.current = mentionString;
  setShow(true);
}
export function placeMentionPlugin(
  editor: any,
  setShow: React.Dispatch<React.SetStateAction<boolean>>,
  pluginPosition: React.MutableRefObject<{
    x: number;
    y: number;
  } | null>,
  mentionStr: React.MutableRefObject<string | undefined>,
  editorRef: React.MutableRefObject<any>
) {
  editorRef.current = editor;
  const string =
    editor?.contentDocument?.getSelection()?.anchorNode?.textContent;
  const {mentionString} = selectWordAtPosition(
    string,
    editor?.contentDocument?.getSelection()?.getRangeAt(0)?.endOffset - 1
  );

  if (mentionString?.[0] === '@') {
    processMention(editor, setShow, pluginPosition, mentionStr, mentionString);
  } else {
    setShow(false);
    pluginPosition.current = null;
  }
}

export const inclusiveBetween = (l: number, r: number, value: number) =>
  value >= l && value <= r;

export const isVisible = (e: Element | null, container: Element | null) => {
  const {bottom, top} = e?.getBoundingClientRect() ?? {
    bottom: 0,
    height: 0,
    top: 0
  };
  const containerRect = container?.getBoundingClientRect() ?? {
    top: 0,
    bottom: 0
  };
  const isUp = inclusiveBetween(-10, Infinity, containerRect.top - bottom);
  const isDown = inclusiveBetween(-10, Infinity, top - containerRect.bottom);
  return {
    visible: !isUp && !isDown,
    isUp,
    isDown
  };
};

export const setEllipsisLength = (text: string, maxLen: number) =>
  text?.length > maxLen ? text.slice(0, maxLen - 2) + '..' : text;

export const removeDuplicates = (array: string[]) => {
  const present: {[key: string]: boolean} = {};
  return array.filter(str => {
    const include = !present[str];
    present[str] = true;
    return include;
  });
};

export const getMentionedArray = (data: string) =>
  removeDuplicates(
    [
      ...(data?.matchAll(
        /<a\s+[^>]*href\s*=\s*["']\s*https:\/\/members\.foundersnetwork\.com\/profile\/(\d+)\s*["'][^>]*>/g
      ) ?? [])
    ]?.map?.(match => match[1]) ?? []
  );

export const fetchSecure = async (
  url: string,
  options?: RequestInit
): Promise<Response> => {
  const headers = {
    ...(options?.headers ?? {}),
    Authorization: `Bearer ${process.env.SERVER_TOKEN}`
  };
  return fetch(url, {...options, headers});
};

export const formatChatDateTime = (targetTimestamp: string): string => {
  const targetDate = new Date(targetTimestamp);
  const currentDate = new Date();

  // If target date equals current date
  if (targetDate.toDateString() === currentDate.toDateString()) {
    return targetDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  }

  // If target year equals current year
  if (targetDate.getFullYear() === currentDate.getFullYear()) {
    return targetDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }

  // Return year with the previous format
  return targetDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};
