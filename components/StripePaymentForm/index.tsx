import React, {useState} from 'react';

import styles from './StripePaymentForm.module.scss';
import {PaymentElement, useElements, useStripe} from '@stripe/react-stripe-js';
import {toast} from 'react-toastify';
import {useUpdatePaymentMethodMutation} from '@/genericApi/foundersNetwork/mutations';
import {Button} from '@/ds/Button';

interface IProps {}

export const StripePaymentForm: React.FC<IProps> = props => {
  const {} = props;

  const [submitting, setSubmitting] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const {mutate} = useUpdatePaymentMethodMutation();

  const getCustomerId = async () => {
    if (stripe && elements) {
      const {error: stripeError} = await elements.submit();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN_URL}${process.env.NEXT_PUBLIC_API_VERSION_V1}/checkout-session-token`,
        {
          method: 'GET'
        }
      );

      const data = await res.json();
      const clientSecret = data.clientSecret;

      if (stripeError) {
        toast.error(stripeError.message, {theme: 'dark'});
        console.warn(stripeError);
        return;
      }

      const {error} = await stripe.confirmSetup({
        elements,
        clientSecret,
        confirmParams: {
          return_url: 'http://www.foundersnetwork.com'
        },
        redirect: 'if_required'
      });
      if (!error) {
        return clientSecret;
      }
    }
  };

  const onSubmit = async () => {
    try {
      setSubmitting(true);
      const sessionId = await getCustomerId();
      if (sessionId) {
        mutate(sessionId, {
          onSuccess: () => {
            setSubmitting(false);
            window.scrollTo(0, 0);
            toast.success('Your payment method has been updated.', {
              style: {color: 'white'}
            });
          }
        });
      }
    } catch (err) {
      setSubmitting(false);
      console.warn(err);
    }
  };

  return (
    <div className={styles.StripePaymentForm}>
      <PaymentElement id="payment-element" />
      <Button loading={submitting} disabled={submitting} onClick={onSubmit}>
        Update
      </Button>
    </div>
  );
};

export default StripePaymentForm;
