import clsx from 'clsx';
import classes from './functionEditforms.module.scss';
import {BasicSelect} from '../components/ReactSelect';
import {SelectOptionsType} from '../hooks/useAdminFunctionTags';
import {SelectOptionType} from '../FunctionEditPage';

export interface FeaturedProfilesForm {
  guest: SelectOptionType[];
  member: SelectOptionType[];
  investor?: SelectOptionType;
  functionChairs: SelectOptionType[];
  connectedPartnerCompany?: SelectOptionType;
}

interface FeaturedProfilesProps {
  tagsLoading: boolean;
  data: FeaturedProfilesForm;
  partnerCompanyOptions: SelectOptionsType;
  featuredMemberOptions: SelectOptionsType;
  featuredInvestorOptions: SelectOptionsType;
  setData: React.Dispatch<React.SetStateAction<FeaturedProfilesForm>>;
}

export const FeaturedProfiles: React.FC<FeaturedProfilesProps> = ({
  data,
  setData,
  tagsLoading,
  partnerCompanyOptions,
  featuredMemberOptions,
  featuredInvestorOptions
}) => {
  const handleSelectChange = (name: string) => (option: any) => {
    setData(prevData => ({...prevData, [name]: option}));
  };

  return (
    <div className={classes.form}>
      <div className={classes.field}>
        <div className={classes.label}>Featured Members</div>

        <div className={classes.fieldInput}>
          <BasicSelect
            isMulti
            isClearable={false}
            options={featuredMemberOptions}
            className={classes.editorContainer}
            placeholder=""
            onChange={handleSelectChange('member')}
            value={data.member}
            isLoading={tagsLoading}
          />
        </div>
      </div>

      <div className={clsx(classes.field, 'd-flex gap-4')}>
        <div className={classes.sub3Field}>
          <div className={classes.label}>Featured Investor</div>

          <div className={classes.fieldInput}>
            <BasicSelect
              options={featuredInvestorOptions}
              value={data.investor ?? null}
              isLoading={tagsLoading}
              placeholder=""
              isClearable
              onChange={handleSelectChange('investor')}
            />
          </div>
        </div>
      </div>

      <div className={classes.field}>
        <div className={classes.label}>Featured Guests</div>

        <div className={classes.fieldInput}>
          <BasicSelect
            isMulti
            isClearable={false}
            options={featuredMemberOptions}
            className={classes.editorContainer}
            placeholder=""
            onChange={handleSelectChange('guest')}
            value={data.guest}
            isLoading={tagsLoading}
          />
        </div>
      </div>

      <div className={clsx(classes.field, 'd-flex gap-4')}>
        <div className={classes.sub3Field}>
          <div className={classes.label}>Connected Partner Company</div>

          <div className={classes.fieldInput}>
            <BasicSelect
              options={partnerCompanyOptions}
              value={data.connectedPartnerCompany ?? null}
              isLoading={tagsLoading}
              placeholder=""
              isClearable
              onChange={handleSelectChange('connectedPartnerCompany')}
            />
          </div>
        </div>
      </div>

      <div className={classes.field}>
        <div className={classes.label}>Function Chairs</div>

        <div className={classes.fieldInput}>
          <BasicSelect
            isMulti
            options={featuredMemberOptions}
            className={classes.editorContainer}
            placeholder=""
            onChange={handleSelectChange('functionChairs')}
            value={data.functionChairs}
            isLoading={tagsLoading}
            isClearable={false}
          />
        </div>
      </div>
    </div>
  );
};
