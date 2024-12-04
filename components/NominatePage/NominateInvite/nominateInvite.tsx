import Card from '@/ds/Card/card';
import styles from './nominateInvite.module.scss';
import {Button, ButtonVariants} from '@/ds/Button';
import {useState} from 'react';

import {
  NominateAPIProps,
  withNominateApi
} from '@/components/Nominations/HOC/withNominateApi';

import {useSelector} from 'react-redux';
import {selectApiState} from '@/store/selectors';

import useAPI from '@/utils/common/useAPI';

import FNInput from '@/ds/FNInput';
import {FormProvider, useForm} from 'react-hook-form';
import FnText from '@/ds/FnText';
import {NOMINATIONS_INFINTIE} from '@/utils/common/constants';

interface INominationFormProps {
  name: string;
  email: string;
  note: string;
}

interface NominateInvitePropType extends NominateAPIProps {
  remainingNomination: number;
  requestedNomination: boolean;
  cohort: string;
  userId: number;
}

export const NominateInvite = withNominateApi(
  ({
    remainingNomination,
    requestedNomination,
    cohort,
    userId
  }: NominateInvitePropType) => {
    const makeApiCall = useAPI();
    const methods = useForm<INominationFormProps>();
    const loading = useSelector(selectApiState('postNominations'));
    const requesting = useSelector(selectApiState('postNominationsRequest'));

    const isInfinteNomination = remainingNomination === NOMINATIONS_INFINTIE;

    const [showNominateForm, setShowNominateForm] = useState(
      remainingNomination > 0 ? true : false
    );

    const handleFormSubmit = async (data: INominationFormProps) => {
      const nominateRequestBody = [
        {
          ...data,
          cohort
        }
      ];

      const res = await makeApiCall(
        'postNominations',
        {userId: userId ?? ''},
        {method: 'POST', data: nominateRequestBody}
      );
      if (!res.data[0]?.status?.iserror) {
        setShowNominateForm(false);
      }
      if (res.data[0]?.status?.iserror) {
        methods.setError('email', {
          type: 'custom',
          message: res.data[0]?.status?.message
        });
      }
    };

    const handleSubmitAnother = () => {
      setShowNominateForm(true);
    };

    const handleNominationRequest = async () => {
      await makeApiCall(
        'postNominationsRequest',
        {userId: userId ?? ''},
        {method: 'POST'}
      );
    };

    return (
      <div className={styles.nominateInvite}>
        <FormProvider {...methods}>
          <Card
            className={styles.nominateCard}
            containerClassName={styles.cardContainer}
          >
            <FnText className={styles.heading} type="heading-xSmall" bold>
              Nominate a new member to join Founder's Network
            </FnText>
            {showNominateForm ? (
              <form
                onSubmit={methods.handleSubmit(handleFormSubmit)}
                className={styles.nominateForm}
              >
                <div className={styles.formRow}>
                  <FNInput
                    bottomLeftRounded
                    topLeftRounded
                    label="Full Name"
                    name="name"
                  />
                  <FNInput
                    topRightRounded
                    bottomRightRounded
                    borderLeft={false}
                    label="Email"
                    name="email"
                  />
                </div>
                <FNInput
                  label="Note to staff & your nominee"
                  name="endorsement"
                  topLeftRounded
                  topRightRounded
                  bottomLeftRounded
                  bottomRightRounded
                  type="textarea"
                  placeholder="Let the staff and the nominee know why you are nominating them."
                />
                {!isInfinteNomination && remainingNomination === 0 ? (
                  <Button
                    variant={ButtonVariants.Tertiary}
                    disabled={requestedNomination}
                    className={styles.submitButton}
                    onClick={handleNominationRequest}
                    loading={requesting}
                    loadingChildren={'Requesting'}
                  >
                    {requestedNomination ? 'Request Sent' : 'Request More'}
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className={styles.submitButton}
                    textUppercase
                    loading={loading}
                    disabled={loading}
                    loadingChildren="Submiting"
                    variant={ButtonVariants.Primary}
                  >
                    Submit
                  </Button>
                )}
              </form>
            ) : (
              <div className={styles.nominationSubmitted}>
                {remainingNomination > 0 ? (
                  <div className={styles.afterNominationMessage}>
                    <FnText className={styles.nominatedMessage}>
                      Your nomination was submitted. You can nominate
                      {
                        <span style={{fontWeight: 'bold'}}>
                          {` ${remainingNomination} `}
                        </span>
                      }
                      more {remainingNomination > 1 ? 'people' : 'person'} this
                      month.
                    </FnText>
                    <Button
                      onClick={handleSubmitAnother}
                      variant={ButtonVariants.Primary}
                      className={styles.submitButton}
                    >
                      Submit another
                    </Button>
                  </div>
                ) : (
                  <div className={styles.afterNominationMessage}>
                    <FnText className={styles.nominateMessage}>
                      {requestedNomination
                        ? 'Your request for more nominations has been sent. A member of our team will reach out soon!'
                        : 'You have reached your limit of nominations. Would you like to request more?'}
                    </FnText>
                    <Button
                      variant={ButtonVariants.Primary}
                      disabled={requestedNomination}
                      className={styles.submitButton}
                      onClick={handleNominationRequest}
                      loading={requesting}
                      loadingChildren={'Requesting'}
                    >
                      {requestedNomination ? 'Request Sent' : 'Request More'}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Card>
        </FormProvider>
      </div>
    );
  }
);
