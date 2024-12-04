export type TYPE_MEMBERS = 'members';
export type TYPE_GROUPS = 'groups';
export type TYPE_FUNCTIONS = 'functions';
export type TYPE_DEALS = 'deals';
export type TYPE_FORUMS = 'forums';
export type TYPE_ALL = 'all';

export type TYPE_GROUP = 'group';
export type TYPE_FUNCTION = 'function';
export type TYPE_DEAL = 'deal';
export type TYPE_FORUM = 'forum';
export type TYPE_MEMBER = 'member';

export type FEEDS =
  | TYPE_ALL
  | TYPE_GROUPS
  | TYPE_FUNCTIONS
  | TYPE_DEALS
  | TYPE_FORUMS
  | TYPE_MEMBERS;

export type TYPE_POST = 'post';
export type TYPE_RSVP = 'rsvp';
export type TYPE_QUESTION = 'question';

export type TYPE_ANGEL = 'Angel';
export type TYPE_LIFETIME = 'Lifetime';
export type TYPE_SERIESAPLUS = 'Series-A+';
export type TYPE_BOOTSTRAP = 'Bootstrap';

export interface FacetState {
  [facetKey: string]: FacetValues;
}

export interface FacetValues {
  [facetValueKey: string]: FacetValue;
}

export interface FacetValue {
  facetValueKey: string;
  facetValueName: string;
}

export interface FacetProps<T extends FacetValue> {
  facetName: string;
  facetKey: string;
  facetValueOnClick: (obj: FacetState, isMultiselect: boolean) => void; // eslint-disable-line no-unused-vars
  selectedItems: FacetState;
  facetValues?: T[];
}

export interface FacetPayload {
  userId: string | number;
  page: number;
  facetState: FacetState;
}

export interface PageFacetsProps {
  apply: (state: FacetState, navigate?: boolean) => void; // eslint-disable-line no-unused-vars
}
