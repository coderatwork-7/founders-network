import {ApiData} from '../../helper';
import Select from 'react-select';

import styles from './ReviewAndConfirm.module.scss';
import {Controller, useFormContext} from 'react-hook-form';

import {format} from 'date-fns';

import {useMemo} from 'react';

import {ErrorMessage} from '@hookform/error-message';
import InputErrorMessage from '@/ds/InputErrorMessage';

interface IProps {
  apiData: ApiData;
}

export const ReviewAndConfirm: React.FC<IProps> = ({apiData}) => {
  const {
    control,
    watch,

    formState: {errors}
  } = useFormContext();
  const membershipPlan = watch?.('plan.membership');

  const annualPrices = {
    bootstrap: '$899',
    angel: '$1,599',
    seriesA: '$4,499'
  };

  const startDate = apiData.payment?.paymentDetails[0].startDate;
  const endDate = apiData.payment?.paymentDetails[0].endDate;
  const cancelDate = apiData.payment?.paymentDetails[0].cancelDate;
  const paymentOptions = apiData.payment?.paymentDetails;

  const paymentPlanOptions = useMemo(() => {
    return [
      {
        label: `Launch (${annualPrices.bootstrap}/yr) - You're laying the groundwork for a sustainable startup.`,
        value: paymentOptions?.[0].paymentPlan[0].id
      },
      {
        label: `Scale (${annualPrices.angel}/yr) - You're focused on fundraising and scaling.`,
        value: paymentOptions?.[1].paymentPlan[0].id
      },
      {
        label: `Lead (${annualPrices.seriesA}/yr) - You've achieved some success and want to become an industry leader.`,
        value: paymentOptions?.[2].paymentPlan[0].id
      },
      {
        label: `Lifetime ($10,000) - You're a career founder investing in your future. Never pay dues again.`,
        value: paymentOptions?.[0].paymentPlan[1].id
      }
    ];
  }, [paymentOptions]);

  return (
    <div className={styles.ReviewAndConfirm}>
      <h2>Membership info</h2>
      <div className={styles.paymentPlan}>
        <label>Select membership plan</label>
        <Controller
          control={control}
          name="plan.membership"
          rules={{
            required: {value: true, message: 'Please select a membership plan.'}
          }}
          render={({field: {onChange, value}}) => {
            return (
              <div>
                <Select
                  value={value}
                  onChange={onChange}
                  options={paymentPlanOptions}
                  isSearchable={false}
                  getOptionValue={option => option.label}
                />
                <ErrorMessage
                  errors={errors}
                  name={'plan.membership'}
                  render={({message}) => (
                    <InputErrorMessage message={message} />
                  )}
                />
              </div>
            );
          }}
        />

        <div className={styles.billingPeriodInfo}>
          {membershipPlan?.label !==
            `Lifetime ($10,000) - You're a career founder investing in your future. Never pay dues again.` && (
            <p className={styles.paymentPlanDescription}>
              If approved, your dues will be{' '}
              {
                <span className={styles.redColor}>
                  {membershipPlan?.label ===
                  `Launch ($899/yr) - You're laying the groundwork for a sustainable startup.`
                    ? '$899'
                    : membershipPlan?.label ===
                      `Scale ($1,599/yr) - You're focused on fundraising and scaling.`
                    ? '$1,599'
                    : membershipPlan?.label ===
                      `Lead (${annualPrices.seriesA}/yr) - You've achieved some success and want to become an industry leader.`
                    ? '$4,499'
                    : membershipPlan?.label ===
                      `Lifetime ($10,000) - You're a career founder investing in your future. Never pay dues again.`
                    ? '$10k'
                    : '$899'}
                </span>
              }{' '}
              and your annual membership will begin{' '}
              {format(new Date(startDate ?? '0'), 'MMM dd, yyyy')} and end{' '}
              {format(new Date(endDate ?? '0'), 'MMM dd, yyyy')}. Cancel anytime
              before {format(new Date(cancelDate ?? '0'), 'MMM dd, yyyy')} to
              avoid paying for next year. We'll email a reminder 30 days before
              your plan renews.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
