// eslint-disable-next-line no-unused-vars
import NextAuth from 'next-auth';

declare module 'next-auth' {
  // eslint-disable-next-line no-unused-vars
  interface Session {
    user: {
      id: number;
      profileId: number;
      name: string;
      avatarUrl: string;
      title: string;
      company_name: string;
      company_id: number;
      role: string;
      optInBeta: boolean;
      messageCount: number;
      notificationCount: number;
      paymentPlan: string;
      rsvpFunctionDetailsUrl?: string;
      tokens: {
        access: string;
        accessExpirationTime: string;
        refresh: string;
        refreshExpirationTime: string;
      };
      onboarding?: {
        status?: {
          completed?: boolean;
          aborted?: boolean;
          welcome?: boolean;
          vision?: boolean;
          values?: boolean;
          fourm?: boolean;
          functions?: boolean;
          objectives?: boolean;
          deals?: boolean;
          profile?: boolean;
          investors?: boolean;
          addon?: boolean;
          growTheNetwork?: boolean;
          rewards?: boolean;
        };
        messages: {
          forum?: string;
          functions?: string;
          objectives?: string;
          partner?: string;
          profile?: string;
          investors?: string;
          addon?: string;
          deals?: string;
          growTheNetwork?: string;
          rewards?: string;
        };
      };
    };
  }
}
