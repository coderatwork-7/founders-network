import React from 'react';

import styles from './CompanyFundraisingTab.module.scss';
import {FormItem} from '../FormItem';
import {
  useAcceleratorQuery,
  useCompanyQuery
} from '@/genericApi/foundersNetwork/queries';

interface IProps {}

export const CompanyFundraisingTab: React.FC<IProps> = props => {
  const {data: companyData} = useCompanyQuery();
  const {} = props;
  const {data: acceleratorData} = useAcceleratorQuery();
  const acceleratorOptions = acceleratorData?.map(
    (option: {id: number; name: string}) => {
      return {value: option.id, label: option.name};
    }
  );

  return (
    <div className={styles.CompanyFundraisingTab}>
      <FormItem
        title="Accelerator"
        description="Select from the following list of accelerators"
        endpoint="company"
        name="accelerator"
        options={acceleratorOptions}
        value={companyData?.accelerator}
      />
      <FormItem
        title="Current funding"
        description="How much funding does your company currently have?"
        endpoint="company"
        name="currentFunding"
        placeholder="How much runway do you have (in dollars)?"
        value={companyData?.currentFunding}
        type="currency"
      />
      <FormItem
        title="Investors"
        description="Please list notable investors in your startup(s)"
        endpoint="company"
        name="investors"
        placeholder="Jane Doe"
        value={companyData?.investors}
      />
      <FormItem
        title="Looking to raise"
        description="How much money are you looking to riase?"
        endpoint="company"
        name="lookingToRaise"
        value={companyData?.lookingToRaise}
        type="currency"
      />
      <FormItem
        title="Burn rate"
        description="What is your current annual burn rate?"
        endpoint="company"
        name="burnRate"
        placeholder="$10,000"
        value={companyData?.burnRate}
        type="currency"
      />
      <FormItem
        title="Cash on hand"
        description="How much runway do you have (in dollars)?"
        endpoint="company"
        name="cashOnHands"
        placeholder="$10,000"
        value={companyData?.cashOnHands}
        type="currency"
      />
      <FormItem
        title="Months of Runway"
        description="How many months of runway do you have?"
        endpoint="company"
        name="monthsOfRunway"
        placeholder="18 months"
        value={companyData?.monthsOfRunway}
      />
    </div>
  );
};

export default CompanyFundraisingTab;
