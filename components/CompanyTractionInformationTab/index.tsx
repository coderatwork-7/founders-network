import React from 'react';

import styles from './CompanyTractionInformationTab.module.scss';
import {FormItem} from '../FormItem';
import {
  useAcceleratorQuery,
  useCompanyQuery
} from '@/genericApi/foundersNetwork/queries';

import {targetMarketOptions} from '@/utils/data/targetMarketOptions';

import {businessModelOptions} from '@/utils/data/businessModelOptions';

interface IProps {}

export const CompanyTractionInformationTab: React.FC<IProps> = props => {
  const {} = props;

  const {data: companyData} = useCompanyQuery();

  const {data: acceleratorData} = useAcceleratorQuery();
  const acceleratorOptions = acceleratorData?.map(
    (option: {id: number; name: string}) => {
      return {value: option.id, label: option.name};
    }
  );

  return (
    <div className={styles.CompanyTractionInformationTab}>
      <FormItem
        endpoint="company"
        title="Company update"
        value={companyData?.companyUpdates}
        name="companyUpdates"
        type="textarea"
        description="Please share recent growth e.g. Funding, Revenue, Key Customers, Product, Team, Partnerships or Awards and Recognition, Milestones and Achievements."
      />
      <FormItem
        endpoint="company"
        description="How many employees do you currently have?"
        title="Current headcount"
        name="employeesHired"
        type="number"
        value={companyData?.employeesHired}
      />
      <FormItem
        endpoint="company"
        description="Click here to find members who are also looking for co-founders."
        title="Are you looking for a co-founder?"
        name="lookingForCofounder"
        value={companyData?.lookingForCofounder}
        type="radio"
        radioValues={[
          {label: 'Yes', value: 'true'},
          {label: 'No', value: 'false'}
        ]}
      />
      {/* <FormItem
        endpoint="company"
        description="What stage is your startup in?"
        title="Startup stage"
        name="stage"
        value={companyData?.stage}
        options={stageOptions}
      /> */}
      <FormItem
        endpoint="company"
        description="What is your company's primary business model?"
        title="Business model"
        name="monetizationStrategy"
        value={companyData?.monetizationStrategy}
        options={businessModelOptions}
      />
      <FormItem
        endpoint="company"
        description="What is your company's target market?"
        title="Target market"
        name="targetMarket"
        value={companyData?.targetMarket}
        options={targetMarketOptions}
      />
      <FormItem
        endpoint="company"
        description="How many customers or users do you have? Include paid and unpaid users. If none, please enter 0."
        title="Total users"
        name="totalUsers"
        type="number"
        value={companyData?.totalUsers}
        required
      />
      <FormItem
        endpoint="company"
        description="How many months of runway do you have? Runway (in months) = Cash On Hand / Monthly Burn Rate"
        title="Runway"
        name="monthsOfRunway"
        type="number"
        value={companyData?.monthsOfRunway}
        required
      />
      <FormItem
        title="Accelerator"
        description="Select from the following list of accelerators"
        endpoint="company"
        name="accelerator"
        options={acceleratorOptions}
        value={companyData?.accelerator}
        isMulti
      />
      <FormItem
        title="Target round size"
        description="How much capital are you looking to raise?"
        endpoint="company"
        name="lookingToRaise"
        value={companyData?.lookingToRaise}
        type="currency"
      />
      {/* <FormItem
        endpoint="company"
        description="What is your current annual revenue?  If none, please enter 0."
        title="Annual revenue"
        name="revenue"
        value={companyData?.revenue}
        type="currency"
      /> */}
      <FormItem
        endpoint="company"
        description="How much have you raised? If none, please enter 0."
        title="Current funding"
        name="currentFunding"
        value={companyData?.currentFunding}
        type="currency"
      />
      <FormItem
        endpoint="company"
        description="What is your current monthly revenue? If none, please enter 0."
        title="Current monthly revenue"
        name="currentMonthlyRevenue"
        type="currency"
        value={companyData?.currentMonthlyRevenue}
      />
      <FormItem
        endpoint="company"
        description="What are your monthly expenses? "
        title="Burn rate"
        name="burnRate"
        type="currency"
        value={companyData?.burnRate}
      />
      <FormItem
        endpoint="company"
        description="What is your company's revenue growth rate as a percentage?"
        title="Revenue growth rate MoM (%)"
        name="revenueGrowthRateMoM"
        type="percentage"
        value={`${companyData?.revenueGrowthRateMoM}`}
      />
      <FormItem
        endpoint="company"
        description="What is your company's new user growth rate as a percentage?"
        title="New user growth rate MoM (%)"
        name="newUserGrowthRateMoM"
        value={`${companyData?.newUserGrowthRateMoM}`}
        type="percentage"
      />
      <FormItem
        endpoint="company"
        description="Please list notable investors in your startup(s)"
        title="Current investors"
        name="investors"
        value={`${companyData?.investors}`}
        type="textarea"
      />
    </div>
  );
};

export default CompanyTractionInformationTab;
