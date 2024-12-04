const MSG_GOOD = 'What Went Well?';
const MSG_IMPROVE = 'What Could be Improved?';
const MSG_BAD = 'What Went Wrong?';
const TAGS_GOOD = [
  'responseTime',
  'point_of_contact',
  'service',
  'value',
  'other'
];
const TAGS_BAD = ['responseTime', 'description', 'service', 'value', 'other'];

export const TAG_LABELS: {[key: string]: string} = {
  responseTime: 'Response Time',
  description: 'Description',
  service: 'Service',
  value: 'Value',
  point_of_contact: 'Point-Of-Contact',
  other: 'Other'
};

export const RATING_CONFIG: {
  [key: number]: {msg: string; tags: Array<string>};
} = {
  0: {
    msg: MSG_GOOD,
    tags: TAGS_GOOD
  },
  1: {
    msg: MSG_BAD,
    tags: TAGS_BAD
  },
  2: {
    msg: MSG_BAD,
    tags: TAGS_BAD
  },
  3: {
    msg: MSG_IMPROVE,
    tags: TAGS_BAD
  },
  4: {
    msg: MSG_IMPROVE,
    tags: TAGS_GOOD
  },
  5: {
    msg: MSG_GOOD,
    tags: TAGS_GOOD
  }
};
