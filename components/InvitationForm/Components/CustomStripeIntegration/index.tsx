import React, {useEffect, useMemo, useState} from 'react';

import styles from './CustomStripeIntegration.module.scss';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';

interface IProps {}

export const CustomStripeIntegration: React.FC<IProps> = props => {
  const {} = props;

  const [clientSecret, setClientSecret] = useState();

  const stripePromise = useMemo(
    () => loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY ?? ''),
    []
  );

  const appearance = {
    theme: 'stripe'
  };

  const options = {
    clientSecret
  };

  return (
    <div className={styles.CustomStripeIntegration}>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
};

export default CustomStripeIntegration;
