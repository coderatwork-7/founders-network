export interface IInvestmentSector {
  id: number;
  name: string;
}

export interface ILocation {
  id: number;
  name: string;
}

type TSectors =
  | 'AI/ML'
  | 'AR/VR'
  | 'Adtech'
  | 'Agtech'
  | 'Artificial Intelligence/Machine Learning'
  | 'Civic & Social Organization'
  | 'Clean Tech'
  | 'Cloud'
  | 'Construction'
  | 'Consumer Internet'
  | 'Crypto Currency'
  | 'DevOps'
  | 'Digital Health'
  | 'EdTech, Self-improvement, LatAm'
  | 'Edtech'
  | 'Enterprise Software'
  | 'Fashion'
  | 'Fintech'
  | 'Gaming'
  | 'HR/Human Capital'
  | 'Hardware'
  | 'Healthcare'
  | 'Information Technology'
  | 'Internet of Things'
  | 'Marketplace'
  | 'Media'
  | 'Medical Device'
  | 'Mobile'
  | 'Mobility'
  | 'Other'
  | 'Pharmaceutical'
  | 'Professional Services'
  | 'Real Estate'
  | 'Recruitment'
  | 'Retail & eCommerce'
  | 'Security'
  | 'Social Networking'
  | 'Sports'
  | 'Transportation'
  | 'Travel & Hospitality';

export interface ICompany {
  //     accelerator
  // :
  // [],
  burnRate: string;
  cashOnHands: string;
  companyBlog: string;
  companyDescription: string;
  companyLogoUrl: string;
  companyName: string;
  companyUpdates: string;
  currentFunding: string;
  currentMonthlyRevenue: string;
  customers: string;
  employeesHired: string;
  investmentSector: IInvestmentSector[];
  investors: string;
  launchDate: string;
  location: ILocation;
  lookingForCofounder: boolean;
  lookingToRaise: string;
  monetizationStrategy: TSectors;
  monthsOfRunway: string;
  newUserGrowthRateMoM: string;
  pitchDeckUrl: string;
  pogressStatus: number;
  priorities: string;
  revenue: string;
  revenueGrowthRateMoM: string;
  sectors: any;
  stage: string;
  targetMarket: string;
  totalUsers: number;
  websiteUrl: string;
}
