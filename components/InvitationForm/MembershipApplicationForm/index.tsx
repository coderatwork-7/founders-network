import React, {useState} from 'react';

import styles from './MembershipApplicationForm.module.scss';
import {FormProvider, useForm} from 'react-hook-form';
import {ProfileInfo} from '../Components/Forms/profileInfo';

import {Button, ButtonVariants} from '@/ds/Button';
import {ReviewAndConfirm} from '../Components/Forms/reviewAndConfirm';
import {CompanyInfo} from '../Components/Forms/companyInfo';
import {ApiData} from '../helper';
import {ApplicationFormValues} from '../applicationFormResolver';
import CheckoutForm from '../Components/CustomStripeIntegration/CheckoutForm';
import {useElements, useStripe} from '@stripe/react-stripe-js';
import handleApi from '@/utils/common/handleApi';
import {toast} from 'react-toastify';
import {useRouter} from 'next/router';

interface IProps {
  apiData: ApiData;
}

export const MembershipApplicationForm: React.FC<IProps> = props => {
  const {apiData} = props;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const api = handleApi();
  const router = useRouter();

  const stripe = useStripe();
  const elements = useElements();

  const methods = useForm<ApplicationFormValues>({
    mode: 'onBlur'
  });

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
        setIsSubmitting(false);
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

  const onSubmit = async (data: ApplicationFormValues) => {
    const {profile, company, plan} = data;
    setIsSubmitting(true);

    try {
      const sessionId = await getCustomerId();
      if (sessionId) {
        const result = await api(
          'postApplicationForm',
          {},
          {
            method: 'POST',
            data: {
              profile: {
                email: profile.email,
                firstName: profile.firstName,
                lastName: profile.lastName,
                phoneNumber: `${data.countryCode.value.split?.('_')?.[1]}${
                  profile.phoneNumber
                }`,
                nominator: '',
                tags: []
              },
              company: {
                startUpName: company.startUpName,
                companyDescription: '',
                dontHaveWebsites: !company.website ? true : false,
                city: company.city,
                website: company.website,
                companyAddress: company.companyAddress,
                state: company.state,
                country: company.country,
                zipCode: company.zipCode,
                industrySectors: [],
                employmentTypes: 'Full-Time'
              },
              plan: {
                paymentPlanId: plan.membership.value
              },
              sessionId
            }
          }
        );

        if (result) {
          setIsSubmitting(false);
          toast.error('Something went wrong');
        }
        if (result.data) {
          setIsSubmitting(false);
          router.push('https://foundersnetwork.com/apply-ok/');
        }
      }
    } catch (err) {
      setIsSubmitting(false);
      console.warn(err);
      //@ts-ignore
      toast.info(err?.error?.message);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <ProfileInfo />
        <CompanyInfo />
        <ReviewAndConfirm apiData={apiData} />
        <CheckoutForm />

        <div className={styles.submitButtonContainer}>
          <Button
            variant={ButtonVariants.Primary}
            type="submit"
            style={{width: 'auto'}}
            loading={isSubmitting}
          >
            SUBMIT MY APPLICATION
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default MembershipApplicationForm;
