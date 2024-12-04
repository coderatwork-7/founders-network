interface SelectInputsProps {
  name: string;
  id: number;
}

export interface settingsCompanyData {
  pogressStatus: number | undefined;
  companyName: string | undefined;
  websiteUrl: string | undefined;
  companyLogoUrl: string | undefined;
  pitchDeckUrl: string | undefined;
  location: SelectInputsProps | undefined;
  companyUpdates: string | undefined;
  sectors: SelectInputsProps[] | [];
  investmentSector: SelectInputsProps[] | [];
  companyBlog: string | undefined;
  stage: string | undefined;
  accelerator: string[] | [];
  monetizationStrategy: string | string[] | [] | undefined;
  targetMarket: string | undefined;
  revenueGrowthRateMoM: string | undefined;
  newUserGrowthRateMoM: string | undefined;
  currentMonthlyRevenue: string | undefined;
  priorities: string | undefined;
  investors: string | undefined;
  lookingToRaise: string | undefined;
  customers: string | undefined;
  revenue: string | undefined;
  currentFunding: string | undefined;
  employeesHired: number | undefined;
  launchDate: string | undefined;
  lookingForCofounder: string | undefined;
  burnRate: string | undefined;
  cashOnHands: string | undefined;
  monthsOfRunway: string | undefined;
  totalUsers: number | undefined;
  companyDescription: string | undefined;
}

export interface settingsProfileData {
  progressStatus: number | undefined;
  profileImageUrl: string | undefined;
  socialInfo: {
    twitterUsername: string | undefined;
    linkedinUsername: string | undefined;
    facebookUsername: string | undefined;
    angelListUsername: string | undefined;
    whatsappNumber: string | undefined;
  };
  introductionVideo: string | undefined;
  expertise: number[] | [];
  title: string | undefined;
  background: string | undefined;
  nominator: {
    id: number | undefined;
  };
  founderType: string | undefined;
  birthday: string | undefined;
  gender: string | undefined;
  accomplishmentsAndPedigree: string | undefined;
  excitingPersonalOrCompanyUpdates: string | undefined;
  universityAttended: string | undefined;
  educationLevel: string | undefined;
  usVisaStatus: string | undefined;
  careerStats: {
    startupExeperience: number | string | undefined;
    successfulExits: string | undefined;
    //employeesHired: number | undefined;
    lifetimeFundingRaised: string | undefined;
  };
  homeRegion: string | undefined;
  billingAddress: {
    billing_address: string | undefined;
    billing_city: string | undefined;
    billing_state: string | undefined;
    billing_zipcode: string | undefined;
    billing_country: string | undefined;
  };
}

export interface settingsGeneralData {
  pogressStatus: number | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  phoneNo: string | undefined;
  enableSMSReminder: boolean;
  email: string | undefined;
  secondaryEmail: string | undefined;
  password: string | undefined;
  confirmPassword: string | undefined;
  tweets: string | undefined;
  realTimeEmails: {
    posts: {
      [key: string]: boolean;
    };
    replies: {
      [key: string]: boolean | number;
    };
  };
  periodicEmails: {
    dailyDigest: boolean;
    weeklyReacp: boolean;
    upcomingFunctions: boolean;
    newCohortPosts: boolean;
  };
}
