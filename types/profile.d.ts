interface objectivesData {
  name: string;
  tags: Array<string>;
}

interface pitchDeckData {
  name: string;
  imgUrl: string;
}

interface expertiseData {
  id: number;
  name: string;
}

interface noteableFoundersStatsData {
  name: string;
  value: number | string;
}

interface datesData {
  creationDate: string;
  creationTimePT: string;
  creationTimeET: string;
}

interface requestData {
  status: boolean;
  date: string;
}

export interface ProfileData {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  badge: string;
  title: string;
  avatarUrl: string;
  socialLinks: {
    linkedin: string;
    twitter: string;
    facebook: string;
    angelList: string;
  };
  role: string;
  company: {
    name: string;
    url: string;
    shortDescription: string;
  };
  chapter: string;
  cohortNominator: string;
  phone: string;
  email: string;
  expertise: Array<expertiseData>;
  background: string;
  noteableFoundersStats: Array<noteableFoundersStatsData>;
  pitchDeck: Array<pitchDeckData>;
  objectives: Array<objectivesData>;
  dateTime: datesData;
  plan: string;
  introRequested?: boolean;
}
export interface IntroductionsData {
  id: number;
  type: string;
  investor: {
    profileId: number;
    name: string;
    badge: string;
    avatarUrl: string;
  };
  requestSent: requestData;
  requestOpened: requestData;
  requestDecision: requestData;
  requestExpirationDays: number;
}
export interface AllUpdatesData {
  any;
}
