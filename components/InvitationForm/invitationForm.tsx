import clsx from 'clsx';
import classes from './invitationForm.module.scss';
import styles from './invitationForm.module.scss';

import {ApiData, changeApiData} from './helper';

import {useEffect, useMemo, useState} from 'react';

import {store} from '@/store';
import {toast} from 'react-toastify';
import {useRouter} from 'next/router';
import {Spinner} from '@/ds/Spinner';

import Image from 'next/image';
import bannerImage from '../../public/images/apply-banner-founders3.jpg';

import {loadStripe} from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';

import MembershipApplicationForm from './MembershipApplicationForm';

export function InvitationForm() {
  const [apiData, setApiData] = useState<ApiData>({} as ApiData);
  const [profileId, setProfileId] = useState<string>('');

  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const requests: {apiName: string; field: string}[] = [
      {
        apiName: 'getApplicationFormTags',
        field: 'tags'
      },
      {
        apiName: 'getTestimonials',
        field: 'testimonials'
      }
    ];
    const makeRequests = async () => {
      try {
        const results = await Promise.all(
          requests.map(request => store.invokeApi(request.apiName, {}))
        );
        changeApiData(setApiData, {
          profile: {tags: results[0].data, testimonials: results[1].data}
        });
      } catch (err) {
        toast.error('Error, please reload the page.', {theme: 'dark'});
      }
    };
    makeRequests();
  }, []);

  useEffect(() => {
    const apiCalls: {apiName: string; payload: any}[] = [
      {
        apiName: 'getSectors',
        payload: {type: 'industry-sector'}
      },
      {
        apiName: 'getSectors',
        payload: {type: 'tech-sector'}
      },
      {
        apiName: 'getPaymentPlans',
        payload: {}
      }
    ];

    const makeRequests = async () => {
      try {
        const results = await Promise.all(
          apiCalls.map(request =>
            store.invokeApi(request.apiName, request.payload)
          )
        );

        changeApiData(setApiData, {
          company: {
            industorySectors: results[0].data,
            techSectors: results[1].data,
            stage: results[2].data.map((e: any) => ({
              label: e.name,
              value: e.id
            }))
          },
          payment: {paymentDetails: results[2].data}
        });
      } catch (err) {
        toast.error('Error, please reload the page.', {theme: 'dark'});
      }
    };
    makeRequests();
  }, []);

  useEffect(() => {
    if (router.isReady) {
      const makeRequest = async (profileId: string) => {
        try {
          const result = await store.invokeApi('getProfileIdData', {profileId});
          setApiData(prev => ({...prev, all: result.data}));
          setProfileId(profileId);
        } catch (err) {
          const errorState = {...(err as any)?.errorObj?.error};
          toast.error('Error, please reload the page.', {theme: 'dark'});
        } finally {
          setLoading(false);
        }
      };
      const {profileId: profileIdInURL} = router.query;
      if (profileIdInURL && !profileId) makeRequest(profileIdInURL as string);
      else setLoading(false);
    }
  }, [router.isReady]);

  const stripePromise = useMemo(
    () => loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY ?? ''),
    []
  );

  return (
    <div className="position-relative">
      {loading ? (
        <div className="text-center">
          <Spinner />
        </div>
      ) : (
        <div className={clsx(classes.container)}>
          <div className={styles.imageContainer}>
            <Image
              src={bannerImage}
              alt="Person attending meeting"
              fill
              style={{objectFit: 'cover'}}
            />
            <div className={styles.imageOverlayContainer}>
              <div className={styles.imageOverlay}>
                <h2>SOLVING PROBLEMS TOGETHER</h2>
                <p>
                  With over 600 members in the Founders Network community,
                  there's always someone who can answer your startup questions.
                  <span style={{display: 'block'}}>
                    -Adam Cheyer, Co-Founder SIRI
                    <br />
                    Founders Network Membership Committee Member
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className={styles.rightCard}>
            <div className={styles.header}>
              <h1>Membership Application</h1>
            </div>
            <div className={styles.formContainer}>
              {stripePromise && (
                <Elements
                  stripe={stripePromise}
                  options={{mode: 'setup', currency: 'usd'}}
                >
                  <MembershipApplicationForm apiData={apiData} />
                </Elements>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
