//URLS
export const LOGIN_API_URL = '/v1/api/auth/login';
export const REFRESH_JWT_TOKEN_API_URL = '/v1/api/auth/refresh-token';
export const LEARN_MORE_URL = 'https://foundersnetwork.com/benefits/';
export const TESTIMONIALS_URL = 'https://foundersnetwork.com/testimonials/';
export const MEMBERSHIP_PLAN_MEETING_URL =
  'https://meetings.hubspot.com/kevin296/membership-plan-upgrade';
export const FORGOT_PASSWORD = 'Forgot Your Password?';
export const LOGIN_PAGE_TEXT = 'Login Page';
export const FOUNDERS_NETWORK = 'Founders Network';
export const HOME_PAGE_TITLE = `Home Feed | ${FOUNDERS_NETWORK}`;
export const LOGIN_PAGE_TITLE = `Login | ${FOUNDERS_NETWORK}`;
export const FORGOT_PASSWORD_PAGE_TITLE = `Forgot Password | ${FOUNDERS_NETWORK}`;
export const RESET_PASSWORD_PAGE_TITLE = `Reset Password | ${FOUNDERS_NETWORK}`;
export const RAISE_PAGE_TITLE = `Upgrade | ${FOUNDERS_NETWORK}`;
export const NOMINATE_PAGE_TITLE = `Nominate | ${FOUNDERS_NETWORK}`;
export const FUNCTIONS_DETAILS_PAGE_TTITLE = `Functions Details | ${FOUNDERS_NETWORK}`;
export const INVESTOR_OVERVIEW_PAGE_TITLE = `Investor Overview | ${FOUNDERS_NETWORK}`;
export const LIBRARY_DETAILS_PAGE_TTITLE = `Library | ${FOUNDERS_NETWORK}`;
export const REQUEST_INVITATION_PAGE_TITLE = `Application | ${FOUNDERS_NETWORK}`;
export const INVESTOR_PAGE_TITLE = `Investor | ${FOUNDERS_NETWORK}`;
export const LIBRARY_PAGE_TITLE = `Library | ${FOUNDERS_NETWORK}`;
export const NOT_MEMBER_TEXT = 'Not a member?';
export const LEARN_MORE_TEXT = 'Learn More!';
export const ERROR_MESSAGE_TEXT =
  'No active account found with the given credentials.';
export const CANCEL_TEXT = 'CANCEL';
export const EMAIL_ADDRESS_TEXT = 'Email address';
export const GO_BACK_TO_TEXT = 'Go back to';
export const SERVER_ERROR_TEXT = 'We are facing some technical issues.';

export const GO_BACK_TO = 'Go back to ';

export const CONST_INVESTORS = 'investors';
export const CONST_MEMBERS = 'members';
export const CONST_PARTNERS = 'partners';
export const CONST_GROUPS = 'groups';
export const CONST_FUNCTIONS = 'functions';
export const CONST_DEALS = 'deals';
export const CONST_FORUMS = 'forums';
export const CONST_ALL = 'all';
export const CONST_OPPORTUNITIES = 'opportunities';
export const CONST_GROUPS_MEMBERS = 'groups_members';
export const CONST_GROUPS_FUNCTIONS = 'groups_functions';
export const CONST_GROUPS_FORUMS = 'groups_forum';
export const CONST_INVESTOR_LOGIN = 'investor_login';

export const CONST_INVESTOR = 'investor';
export const CONST_MEMBER = 'member';
export const CONST_PARTNER = 'partner';
export const CONST_GROUP = 'group';
export const CONST_FUNCTION = 'function';
export const CONST_DEAL = 'deal';
export const CONST_FORUM = 'forum';

export const CONST_POST = 'post';
export const CONST_RSVP = 'rsvp';
export const CONST_QUESTION = 'question';

export const SCALE = 'Scale';
export const LEAD = 'Lead';
export const LAUNCH = 'Launch';
export const LIFETIME = 'Lifetime';
export const CHARTER = 'Charter';
export const GUEST = 'Guest';

export const CONST_SERIESAPLUS_LABEL = 'Series A+';

export const NO_OF_POSTS_LOAD_PER_REQUEST = 10;

export const POST_FUNCTION_TITLE_LIMIT = 150;
export const FUNCTION_CONTENT_TITLE_LIMIT = 150;

export const DEALS_NO_OF_DISPLAYED_MEMBERS = 7;
export const FUNCTION_RSVP_TITLE_NAMES_LIMIT = 7;
export const CURRENT_FOUDNER_COUNT = 600;

export const BADGE_HEIGHT = 24;
export const BADGE_WIDTH = 24;

export const INVESTOR_DEFAULT_SEARCH_PARAM = 'matchSettings';
export const DEFAULT_TIMEZONE = 'America/Los Angeles';

export const REPOSITORIES = {
  API_REPOSITORY: 'apiRepository',
  FEEDS_REPOSITORY: 'feedsRepository',
  FUNCTIONS_REPOSITORY: 'functionsRepository',
  NOMINATION_REPOSITORY: 'nominationRepository',
  FACETS_REPOSITORY: 'facetsRepository',
  MEMBERS_REPOSITORY: 'membersRepository',
  PARTNERS_REPOSITORY: 'partnersRepository',
  INVESTORS_REPOSITORY: 'investorsRepository',
  GROUPS_REPOSITORY: 'groupsRepository',
  USER_REPOSITORY: 'userRepository',
  CHAT_REPOSITORY: 'chatRepository',
  PROFILE_REPOSITORY: 'profileRepository',
  SETTINGS_REPOSITORY: 'settingsRepository',
  DEALS_REPOSITORY: 'dealsRepository',
  MEMBERSHIP_PLAN_REPOSITORY: 'membershipPlanRepository',
  LIBRARY_REPOSITORY: 'libraryRepository',
  ADMIN_REPOSITORY: 'adminRepository'
};

export const STATE_UPDATE_FLAGS = {
  DELETE: 'deleteFromState'
};

export const GROUP_ACTIVE_TAB = 'groupActiveTab';

export const BREAKPOINTS = {mobile: 0, tablet: 768, desktop: 1024};
export const ROLES = {
  ADMIN: 'Admin',
  CHARTER: 'Charter',
  GUEST: 'Guest',
  INVESTOR: 'Investor',
  MEMBER: 'Member',
  PARTNER_LIMITED: 'Limited Partner',
  PARTNER_FULL_ACCESS: 'Partner Full Access',
  PARTNER: 'Partner'
};

export const PARTNER_ROLES = [
  ROLES.PARTNER_LIMITED,
  ROLES.PARTNER_FULL_ACCESS,
  ROLES.PARTNER
];

/* eslint-disable no-unused-vars */
export enum PAYMENT_PLAN {
  BOOTSTRAP = 'bootstrap',
  ANGEL = 'angel',
  SERIES_A = 'seriesa',
  LIFETIME = 'lifetime'
}

export enum FEEDS_TYPE {
  FORUMS = CONST_FORUMS,
  FUNCTIONS = CONST_FUNCTIONS,
  MEMBERS = CONST_MEMBERS,
  GROUPS = CONST_GROUPS,
  DEALS = CONST_DEALS,
  INVESTORS = CONST_INVESTORS,
  PARTNERS = CONST_PARTNERS
}
/* eslint-enable no-unused-vars */

export const PREFIXES: any = {
  [FEEDS_TYPE.FORUMS]: 'fr',
  [FEEDS_TYPE.FUNCTIONS]: 'fn',
  [FEEDS_TYPE.MEMBERS]: 'mm',
  [FEEDS_TYPE.GROUPS]: 'gp',
  [FEEDS_TYPE.DEALS]: 'dl'
};

export const NOTIFICATION_TYPES: {[key: string]: string} = {
  FnRsvp: 'rsvp',
  ForumPost: 'post',
  FnDeal: 'deal',
  Notification: 'notification',
  InvestorIntroduction: 'introduction'
};

export const PAYMENT_PLAN_BENEFITS = {
  [PAYMENT_PLAN.ANGEL]: '1,000',
  [PAYMENT_PLAN.SERIES_A]: '2,500',
  [PAYMENT_PLAN.LIFETIME]: '5,000'
};

export const AUTH_STATUS = {
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated',
  LOADING: 'loading'
};

export const NAVLINKS = {
  forum: {
    label: 'Forum',
    href: '/forum'
  },
  functions: {
    label: 'Functions',
    href: '/function/all'
  },
  members: {
    label: 'Members',
    href: '/members'
  },
  deals: {
    label: 'Deals',
    href: '/deals'
  },
  nominate: {
    label: 'Nominate',
    href: '/nominate'
  },
  partners: {
    label: 'Partners',
    href: '/partners'
  },
  investors: {
    label: 'Investors',
    href: `/investors?${INVESTOR_DEFAULT_SEARCH_PARAM}`
  },
  groups: {
    label: 'Groups',
    href: '/group/all'
  },
  library: {
    label: 'Library',
    href: '/library'
  },
  foundersEdge: {
    label: 'Founders Edge Blog',
    href: 'https://foundersnetwork.com/blog',
    external: true
  },
  contactUs: {
    label: 'Contact Us',
    href: ''
  },
  aboutUs: {
    label: 'About Us',
    href: 'https://foundersnetwork.com/blog/about-us',
    external: true
  },
  login: {
    label: 'Login',
    href: '/accounts/login'
  }
};

export const DATA_ATTRIBS = {
  TOOLTIP: 'data-type-tooltip'
};

export const NAV_WITHOUT_LOGIN = [
  NAVLINKS.aboutUs,
  NAVLINKS.foundersEdge,
  NAVLINKS.login
];

export const NAV_LINKS_DESKTOP = [
  NAVLINKS.forum,
  NAVLINKS.functions,
  NAVLINKS.members,
  NAVLINKS.deals,
  NAVLINKS.nominate,
  {
    label: 'Resources',
    subMenu: [
      NAVLINKS.investors,
      NAVLINKS.partners,
      NAVLINKS.groups,
      NAVLINKS.library,
      NAVLINKS.foundersEdge,
      NAVLINKS.contactUs
    ]
  }
];

export const NAV_LINKS_MOBILE = [
  NAVLINKS.forum,
  NAVLINKS.functions,
  NAVLINKS.members,
  NAVLINKS.deals,
  NAVLINKS.groups,
  NAVLINKS.partners,
  NAVLINKS.investors,
  NAVLINKS.library,
  NAVLINKS.contactUs,
  NAVLINKS.nominate
];

export const REQUEST_DEBOUNCE_TIME = 100;
export const NOMINATIONS_INFINTIE = 999999999;

export const PAGES = {
  HOME: '/home',
  FUNCTIONS: '/function/all',
  FUNCTIONS_ADD: '/function/add'
};

export const ADMIN_PATH = 'fnstaff';
export const UserMenu = {
  PROFILE: 'Profile',
  SETTINGS: 'Settings',
  NOMINATE: 'Nominate',
  LOGOUT: 'Logout',
  COMMAND_CONTROL: 'Command Control',
  METRICS: 'Metrics',
  FEEDBACKS: 'Site Feedback',
  EMAIL_CENTER: 'Email Center',
  MODERATION_QUEUE: 'Moderation Queue'
};
export const UserMenuHrefs: Record<string, string> = {
  PROFILE: '_variable_',
  SETTINGS: '/settings/',
  NOMINATE: '/nominate',
  LOGOUT: '_variable_',
  COMMAND_CONTROL: `${process.env.NEXT_PUBLIC_STAFF_DOMAIN_URL}/members/`,
  METRICS: `${process.env.NEXT_PUBLIC_STAFF_DOMAIN_URL}/metrics/`,
  FEEDBACKS: `/${ADMIN_PATH}/feedbacks/`,
  EMAIL_CENTER: `${process.env.NEXT_PUBLIC_STAFF_DOMAIN_URL}/emails/`,
  MODERATION_QUEUE: `${process.env.NEXT_PUBLIC_STAFF_DOMAIN_URL}/moderation/`
};
export const FACET_KEY_TYPE = 'internal_type';
export const CONST_MARK_REMOVED = 'removed' as const;

export const MONTHLY_REVENUE_OPTIONS = [
  '< $10K',
  '$10K - $25K',
  '$25K - $100K',
  '$100K - $500K',
  '$500K - $1M',
  '$1M - $10M',
  '$10M+'
];
//also change in mention.module.scss
export const MENTION_HEIGHT = 250;
export const MENTION_WIDTH = 220;

export const SURVEY_LABELS = {
  OVERALL_EXPERIENCE: 'Overall Experience',
  PERFORMANCE: 'Performance',
  NAVIGATION: 'Navigation & Ease of Use',
  DESIGN: 'Design & Layout',
  MOBILE: 'Mobile Experience',
  ADDITIONAL_COMMENT: 'Additional Comments / Bug Reports / Feature Requests'
};

export const SURVEY_QUESTIONS = [
  {
    label: 'Overall Experience',
    options: [
      '',
      'Very Dissatisfied',
      'Dissatisfied',
      'Neutral',
      'Satisfied',
      'Very Satisfied'
    ]
  },
  {
    label: 'Performance',
    options: [
      '',
      'Very Slow / Frequent Errors',
      'Slow Loading / Some Errors',
      'Acceptable',
      'Fast and Smooth',
      'Fast Load Speed'
    ]
  },
  {
    label: 'Navigation & Ease of Use',
    options: ['', 'Very Difficult', 'Difficult', 'Neutral', 'Easy', 'Very Easy']
  },
  {
    label: 'Design & Layout',
    options: ['', 'Very Poor', 'Poor', 'Average', 'Good', 'Excellent']
  },
  {
    label: 'Mobile Experience',
    options: ['', 'Not Ideal', 'Needs Improvement', 'Okay', 'Good', 'Great']
  }
];

export const LIBRARY_ITEM_TYPES = {
  LIBRARY: 'library',
  HELP_CENTER: 'help-center'
};
