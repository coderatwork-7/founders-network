import React, {useState} from 'react';

import styles from './IntroRequestModal.module.scss';
import FnModal from '@/ds/FnModal';
import {
  useCompanyQuery,
  useInvestorQuery
} from '@/genericApi/foundersNetwork/queries';
import {useInvestorRequestIntroMutation} from '@/genericApi/foundersNetwork/mutations';
import FnText from '@/ds/FnText';
import {Button, ButtonVariants} from '@/ds/Button';
import FnDescriptionList from '@/ds/FnDescriptionList';
import FnDescriptionListItem from '@/ds/FnDescriptionListItem';
import {useRouter} from 'next/router';
import axios from 'axios';
import {useSession} from 'next-auth/react';
import SuccessMessage from './SuccessMessage';

interface IProps {
  show: boolean;
  setShow: (value: boolean) => void;
  onHide: () => void;
  investorId: string;
  investorProfileId: string;
  memberName: string;
  investorName: string;
}

export const IntroRequestModal: React.FC<IProps> = props => {
  const {
    show,
    setShow,
    onHide,
    investorId,
    investorProfileId,
    memberName,

    investorName
  } = props;
  const {data, isLoading} = useInvestorQuery(investorProfileId);
  const [requestSent, setRequestSent] = useState(false);
  const {data: companyData} = useCompanyQuery();

  const mutation = useInvestorRequestIntroMutation();

  const router = useRouter();

  const handleUpdateClick = () => {
    router.push(`/settings?tab=company`);
  };

  const {data: session} = useSession();

  const memberId = session?.user.profileId;

  const handleRequestIntroduction = async () => {
    try {
      mutation.mutate(
        {memberName, memberId, investorName, investorId},
        {
          onSuccess: () => setRequestSent(true)
        }
      );
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <FnModal
      className={styles.IntroRequestModal}
      isOpen={show}
      onClose={onHide}
      title={
        requestSent
          ? `We'll get you connected with ${investorName}.`
          : `Want to connect with ${data?.name ?? 'this investor'}?`
      }
    >
      {requestSent ? (
        <SuccessMessage investorName={investorName} />
      ) : (
        <div className={styles.initialContent}>
          <FnText color="green">Current startup information</FnText>
          <FnText type="heading-xSmall">
            Our member success team will personally facilitate a double opt-in
            introduction. On average, 30-50% of requests are accepted within 1-3
            business days.
          </FnText>
          <div className={styles.companyInfo}>
            <FnText bold type="heading-xxSmall">{`What we'll share with ${
              data?.name ?? 'this investor'
            }:`}</FnText>
            <FnDescriptionList>
              <FnDescriptionListItem
                title={companyData?.companyName}
                description={companyData?.companyDescription}
              />
              <FnDescriptionListItem
                title="Latest updates"
                description={companyData?.companyUpdates}
              />
              <FnDescriptionListItem
                title="Number of users"
                description={companyData?.totalUsers}
                number
              />
              <FnDescriptionListItem
                title="Monthly revenue"
                description={companyData?.currentMonthlyRevenue}
                number
              />
            </FnDescriptionList>
          </div>
          <FnText type="heading-xxSmall">
            Ready to get connected or would you like to update your company
            profile before connecting?
          </FnText>
          <div className={styles.buttonsContainer}>
            <Button
              onClick={handleUpdateClick}
              variant={ButtonVariants.Tertiary}
              className={styles.updateProfileButton}
            >
              Update company profile
            </Button>
            <Button
              onClick={handleRequestIntroduction}
              className={styles.requestButton}
            >
              Request introduction
            </Button>
          </div>
        </div>
      )}
    </FnModal>
  );
};

export default IntroRequestModal;
