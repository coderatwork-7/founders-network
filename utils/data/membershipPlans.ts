export interface IMembershipPlanBenefit {
  title: string;
  description: string;
}

export interface IMembershipPlanDescription {
  launch: {benefits: IMembershipPlanBenefit[]};
  scale: {benefits: IMembershipPlanBenefit[]};
  lead: {benefits: IMembershipPlanBenefit[]};
  lifetime: {benefits: IMembershipPlanBenefit[]};
}

export const membershipPlans = {
  launch: {
    benefits: [{title: '', description: ''}],
    quote: ``,
    author: ``,
    price: 899
  },

  scale: {
    benefits: [
      {
        title: `Investor directory`,
        description: `Gain access to a curated directory of investors and get warm introductions from our team.`
      },
      {
        title: `1-on-1 VC mentoring`,
        description: `Hone your pitch and gain valuable feedback from top VCs to secure funding.`
      },
      {
        title: `1-on-1 Strategy sessions`,
        description: `Develop a personalized success plan with our team to maximize your Founders Network experience.`
      }
    ],
    quote: `If you’ve raised an A round or later, the Funded Founder Dinners will provide a time effective and confidential sounding board on issues ranging from recruiting an executive team, scaling up, and transitioning from founder to CEO.`,
    author: `Kevin Holmes, Founder & CEO of Founders Network`,
    price: 1599
  },
  lead: {
    benefits: [
      {
        title: `Member success manager`,
        description: `Get dedicated support from our team with same-day response and quarterly strategy meetings.`
      },
      {
        title: `Thought leadership opportunities`,
        description: `Elevate your persona through speaking opportunities and engagement with our 300,000+ strong global audience.`
      },
      {
        title: `Monthly roundtables`,
        description: `Network and brainstorm solutions in facilitated roundtable discussions with proven founders.`
      }
    ],
    quote: `If you’ve raised an A round or later, the Funded Founder Dinners will provide a time effective and confidential sounding board on issues ranging from recruiting an executive team, scaling up, and transitioning from founder to CEO.`,
    author: `Kevin Holmes, Founder & CEO of Founders Network`,
    price: 4499
  },
  lifetime: {
    benefits: [
      {
        title: `Platform-wide status`,
        description: `Lifetime level member.`
      },
      {
        title: `Same day support`,
        description: `Our Success Team connects you to members who can deliver value to your startup.`
      },
      {
        title: `$2,500 worth of RSVP discounts`,
        description: `Includes a complimentary ticket, speaking opportunity and blog coverage at fnSummit - our annual 3 day retreat.`
      },
      {
        title: `Optional fnInvestor status`,
        description: `Allows you to browse, mentor, and invest in any of our 600+ member companies.`
      },
      {
        title: `Over $500,000 in group discounts`,
        description: `Deals cut your startup burn rate and recoup your dues many years over.`
      },
      {
        title: `Free deal listing`,
        description: `Shares your product with the Network in our curated deals directory.`
      },
      {
        title: `Premium nominations`,
        description: `Allow you to invite 15 tech founders into the Network.`
      }
    ],
    quote: `This option is for FN'ers who believe in our shared vision of lifelong success through peer mentorship and want to secure their membership for the rest of their career while making a meaningful contribution to the organization.`,
    author: `Kevin Holmes, Founder & CEO of Founders Network`,
    price: 10000
  }
};
