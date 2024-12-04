import React from 'react';

import styles from './CompanyGeneralTab.module.scss';
import AvatarEditor from '../AvatarEditor';

import FnText from '@/ds/FnText';
import {DateFormItem, FormItem} from '../FormItem';
import {
  useCompanyQuery,
  useInvestmentSectorsQuery,
  useSectorsQuery
} from '@/genericApi/foundersNetwork/queries';
import {businessModelOptions} from '@/utils/data/businessModelOptions';

interface IProps {}

export const CompanyGeneralTab: React.FC<IProps> = props => {
  const {} = props;

  const {data: companyData} = useCompanyQuery();
  const {data: investmentSectors} = useInvestmentSectorsQuery();
  const {data: techSectors} = useSectorsQuery();

  const investmentsOptions = investmentSectors?.map(
    (option: {id: number; name: string}) => {
      return {value: option.id, label: option.name};
    }
  );

  const sectorsOptions = techSectors?.map(
    (option: {id: number; name: string}) => {
      return {value: option.id, label: option.name};
    }
  );

  const industryValue = companyData?.investmentSector?.map(
    (option: {id: number; name: string}) => {
      return {value: option.id, label: option.name};
    }
  );

  const techSectorValue = companyData?.sectors?.map(
    (option: {id: number; name: string}) => {
      return {value: option.id, label: option.name};
    }
  );

  return (
    <div className={styles.CompanyGeneralTab}>
      <div className={styles.avatarContainer}>
        <FnText bold>Company logo</FnText>
        <AvatarEditor
          type="companyAvatar"
          imageUrl={companyData?.companyLogoUrl}
        />
      </div>
      <FormItem
        endpoint="company"
        title="Company name"
        description="Enter the name of your company."
        value={companyData?.companyName}
        placeholder="Company name"
        name="companyName"
      />
      <FormItem
        endpoint="company"
        title="Company description"
        description="Tell us about your company."
        value={companyData?.companyDescription}
        placeholder={`${companyData?.companyName} is ...`}
        name="companyDescription"
        type="textarea"
      />
      <DateFormItem
        value={companyData?.launchDate}
        title="Launch date"
        name="launchDate"
        endpoint="company"
        required
      />
      <FormItem
        endpoint="company"
        title="Industry vertical"
        description="Choose the specific niche or market segment targeted."
        name="sectors"
        value={techSectorValue}
        options={sectorsOptions}
        isMulti
      />
      <FormItem
        endpoint="company"
        description="Select the broad industry category for your business?"
        title="Primary sector"
        name="investmentSector"
        value={industryValue}
        options={investmentsOptions}
        isMulti
      />
      <FormItem
        endpoint="company"
        title="Company website"
        description="Let other Founder's Network members checkout your website."
        value={companyData?.websiteUrl}
        placeholder="www.mycompany.com"
        name="websiteUrl"
        url={companyData?.websiteUrl}
        displayType="link"
      />

      <FormItem
        endpoint="company"
        title="Ideal customer profile"
        name="customers"
        placeholder="Describe your ideal customer?"
        value={companyData?.customers}
        registerOptions={{
          maxLength: {
            value: 256,
            message: 'Character limit must not exceed 256.'
          }
        }}
      />
    </div>
  );
};

export default CompanyGeneralTab;
