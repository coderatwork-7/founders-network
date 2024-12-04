import React, {useMemo} from 'react';

import styles from './BillingPaymentMethodTab.module.scss';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

import FnText from '@/ds/FnText';

import StripePaymentForm from '../StripePaymentForm';

interface IProps {}

export const BillingPaymentMethodTab: React.FC<IProps> = props => {
  const {} = props;
  const stripePromise = useMemo(
    () => loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY ?? ''),
    []
  );

  return (
    <div className={styles.BillingPaymentMethodTab}>
      <FnText type="heading-xSmall">
        Update your payment method or visit your Stripe customer portal.
      </FnText>

      {stripePromise && (
        <Elements
          stripe={stripePromise}
          options={{mode: 'setup', currency: 'usd'}}
        >
          <StripePaymentForm />
        </Elements>
      )}
    </div>
  );
};

export default BillingPaymentMethodTab;
