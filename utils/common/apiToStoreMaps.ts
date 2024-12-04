import {FEEDS_TYPE} from './constants';

export const FEED_MAPS: any = {
  [FEEDS_TYPE.DEALS]: {
    dealId: 'id',
    datetime: 'datetime',
    details: {
      dealProvider: 'company.name',
      title: 'title',
      image: 'company.logo',
      allowedTo: 'allowedTo'
    },
    value: 'value',
    isRedeemed: 'isRedeemed',
    dealDetailsURL: 'dealDetailsURL'
  },
  [FEEDS_TYPE.FUNCTIONS]: {
    functionId: 'id',
    creationTimestamp: 'creationTimestamp',
    title: 'title',
    details: 'details',
    location: 'location',
    eventLink: 'eventLink',
    addToCalendar: 'addToCalendar',
    attendeesCount: 'attendeesCount',
    addTicketsBtn: 'addTicketsBtn',
    isDeclined: 'isDeclined',
    removeTicketBtn: 'removeTicketBtn'
  },
  [FEEDS_TYPE.GROUPS]: {
    groupId: 'id',
    groupName: 'title',
    detail: {
      content: 'description'
    },
    isPrivate: 'isPrivate',
    isJoined: 'isJoined',
    isInviteRequested: 'isInviteRequested',
    joinType: 'joinType'
  }
};

export const DEALS_PAGE_MAP = {
  id: 'id',
  name: 'company.name',
  url: 'url',
  title: 'title',
  imgSrc: 'company.logo',
  rating: 'rating',
  description: 'description',
  tags: 'tags',
  recommendations: 'recommendations',
  isfeatured: 'isfeatured',
  isRedeemed: 'isRedeemed',
  upgradeNeeded: 'upgradeNeeded',
  value: 'value',
  isRatedByUser: 'isRatedByUser'
};

export const DEALS_MODAL_INFO_MAP = {
  company: 'company',
  offer: 'title',
  tags: 'tags',
  userRating: 'userRating',
  improve: 'improve',
  improveText: 'improveText'
};

export const FUNCTION_DETAILS_MAP = {
  addTicketsBtn: 'addTicketsBtn',
  isDeclined: 'isDeclined',
  removeTicketBtn: 'removeTicketBtn',
  summary: 'summary',
  reviews: 'reviews',
  featured: 'featured',
  attendees: 'attendees',
  discussions: 'discussions',
  tickets: {
    include: 'ticketsInclude'
  },
  details: {
    dateTime: 'dateTime',
    location: 'eventLocation',
    descritption: 'descritption',
    zoomLink: 'zoomLink'
  }
};

export const INVESTOR_FUNDRAISING_FORM_INFO_MAP = {
  nextSend: 'funcdraising.nextSend',
  isOptOut: 'funcdraising.isOptOut',
  matchedInvestorsCount: 'funcdraising.matchedInvestorsCount',
  investorsViewedYou: 'funcdraising.investorsViewedYou',
  investorMessagedYou: 'funcdraising.investorMessagedYou',
  monthlyUpdates: 'funcdraising.monthlyUpdates',

  revenueGrowthRate: 'company.revenueGrowthRateMOM',
  newUserGrowthRate: 'company.newUserGrowthRateMOM',
  currentMonthlyRevenue: 'company.currentMonthlyRevenue',
  lookingToRaise: 'company.lookingToRaise',
  currentFunding: 'company.currentFunding',
  notableInvestors: 'company.notableInvestors',
  pitchDeckImageUrl: 'company.pitchDeckLinkUrl'
};

export const PROFILE_API_MEMBER_MAP = {
  id: 'id',
  userId: 'userId',
  firstName: 'firstName',
  lastName: 'lastName',
  badge: 'badge',
  avatarUrl: 'profileAvatarUrl',
  role: 'role',
  company: {
    name: 'companyName',
    url: 'company.url',
    shortDescription: 'company.shortDescription'
  },
  socialLinks: 'socialLinks',
  chapter: 'chapter',
  phone: 'phone',
  email: 'email',
  expertise: 'expertise',
  background: 'background',
  noteableFoundersStats: 'noteableFoundersStats',
  pitchDeck: 'pitchDeck',
  cohortNominator: 'cohort',
  objectives: 'objectivesArr',
  datetime: 'datetime',
  introRequested: 'introRequested'
};

export const MINI_PROFILE_API_MEMBER_MAP = {
  id: 'id',
  userId: 'userId',
  firstName: 'firstName',
  lastName: 'lastName',
  badge: 'badge',
  avatarUrl: 'avatarUrl',
  datetime: {creationDate: 'datetime.creationDate'},
  designation: 'designation',
  role: 'role',
  companyName: 'companyName',
  introRequested: 'introRequested',
  expertise: 'expertise',
  objectives: 'objectivesMap',
  priorities: 'priorities',
  city: 'city',
  stage: 'stage',
  sector: 'sector',
  cohort: 'cohort'
};

export const PROFILE_API_PARTNER_MAP = {
  id: 'id',
  userId: 'userId',
  firstName: 'firstName',
  lastName: 'lastName',
  badge: 'badge',
  avatarUrl: 'profileAvatarUrl',
  role: 'role',
  company: {
    name: 'companyName',
    url: 'company.url',
    shortDescription: 'priorities'
  },
  socialLinks: 'socialLinks',
  chapter: 'chapter',
  phone: 'phone',
  email: 'email',
  expertise: 'expertise',
  background: 'background',
  noteableFoundersStats: 'noteableFoundersStats',
  pitchDeck: 'pitchDeck',
  cohortNominator: 'cohort',
  objectives: 'objectivesArr',
  datetime: 'datetime',
  introRequested: 'introRequested'
};

export const MINI_PROFILE_API_PARTNER_MAP = {
  id: 'id',
  userId: 'userId',
  firstName: 'firstName',
  lastName: 'lastName',
  badge: 'badge',
  avatarUrl: 'avatarUrl',
  datetime: {creationDate: 'datetime.creationDate'},
  designation: 'designation',
  role: 'role',
  companyName: 'companyName',
  introRequested: 'introRequested',
  expertise: 'expertise',
  objectives: 'objectivesMap',
  priorities: 'priorities',
  city: 'city',
  stage: 'stage',
  sector: 'sector',
  cohort: 'cohort'
};
