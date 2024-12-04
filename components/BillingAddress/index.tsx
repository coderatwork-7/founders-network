import React from 'react';

import styles from './BillingAddress.module.scss';
import FNInput from '@/ds/FNInput';

interface IProps {}

export const BillingAddress: React.FC<IProps> = props => {
  const {} = props;

  return (
    <fieldset className={styles.BillingAddress}>
      <FNInput
        name="plan.StreetAddress"
        required
        placeholder="Street address"
        topLeftRounded
        topRightRounded
      />
      <div className={styles.inputRow}>
        <FNInput
          name="plan.city"
          required
          placeholder="City"
          borderTop={false}
        />
        <FNInput
          name="plan.state"
          required
          placeholder="State or province"
          borderTop={false}
          borderLeft={false}
        />
      </div>
      <div className={styles.inputRow}>
        <FNInput
          name="plan.country"
          required
          placeholder="Country or region"
          borderTop={false}
          bottomLeftRounded
        />
        <FNInput
          name="plan.zipCode"
          inputMode="numeric"
          required
          placeholder="Postal code"
          borderTop={false}
          borderLeft={false}
          bottomRightRounded
          registerOptions={{
            pattern: {
              value: /^[0-9]+$/,
              message: 'Please enter a valid code'
            }
          }}
        />
      </div>
    </fieldset>
  );
};

export default BillingAddress;
