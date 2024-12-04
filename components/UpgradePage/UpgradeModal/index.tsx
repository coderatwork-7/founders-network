import {Modal} from 'react-bootstrap';
import styles from './UpgradeModal.module.scss';
import clsx from 'clsx';

import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';

import {useSession} from 'next-auth/react';

import FnText from '@/ds/FnText';
import {Button} from '@/ds/Button';
import {useUpgradeMembershipMutation} from '@/genericApi/foundersNetwork/mutations/useUpgradeMembershipMutation';

interface IProps {
  setShowModal: (show: boolean) => void;
  showModal: boolean;
  plan: string;
}

export const UpgradePlan = {
  success: 'Successful',
  error: 'Error',
  upgrade: 'Confirm Your Upgrade'
};

export const UpgradeModal: React.FC<IProps> = ({
  setShowModal,
  showModal,
  plan
}) => {
  const handleClose = () => setShowModal(false);
  const isMobile = Breakpoint.mobile === useBreakpoint();

  const {data: session} = useSession();
  const memberId = session?.user.id;
  const memberName = session?.user.name;

  const mutation = useUpgradeMembershipMutation();

  const handleRequestUpgrade = async () => {
    try {
      mutation.mutate(
        {memberName, memberId},
        {onSuccess: () => setShowModal(false)}
      );
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      dialogClassName={styles.modal}
      contentClassName={styles.content}
      centered={!isMobile}
      fullscreen={isMobile ? true : undefined}
    >
      <Modal.Header closeButton className="border-0">
        <Modal.Title className={clsx([styles.modalTitle, 'text-truncate'])}>
          {`Ready to upgrade to the ${plan} plan?`}
        </Modal.Title>
      </Modal.Header>
      <div className={styles.body}>
        <FnText>
          Click below to have our member success team reach out to assist you in
          upgrading your membership within the next 48 hours.
        </FnText>
        <Button
          loading={mutation.isLoading}
          onClick={handleRequestUpgrade}
          className={styles.upgradeButton}
        >
          Upgrade
        </Button>
      </div>
      <Modal.Body></Modal.Body>
    </Modal>
  );
};

export default UpgradeModal;
