import {Button, ButtonVariants} from '@/ds/Button';
import {Modal} from '@/ds/Modal';
import {ModalBody, ModalHeader, ModalTitle} from 'react-bootstrap';
import classes from '../createForumFeed.module.scss';
import clsx from 'clsx';

interface ResponseModalProps {
  showModal: boolean;
  handleCloseModal: () => void;
}

export const ResponseModal: React.FC<ResponseModalProps> = ({
  showModal,
  handleCloseModal
}) => {
  return (
    <Modal show={showModal} onHide={handleCloseModal} centered>
      <ModalHeader
        closeButton
        className={clsx('py-2 justify-content-center', classes['modal-header'])}
      >
        <ModalTitle
          className={clsx([
            classes.modalTitle,
            'text-truncate',
            'w-100',
            'text-center'
          ])}
        >
          Your post is in moderation.
        </ModalTitle>
      </ModalHeader>
      <ModalBody className={clsx('rounded-bottom', classes['modal-body'])}>
        <div
          className={clsx(
            'd-flex',
            'flex-column',
            'align-items-center',
            'gap-2',
            'p-2',
            'w-100'
          )}
        >
          <label>
            Your post has been moderated because we are optimizing your post. It
            will be reviewed by the Founders Network staff within 24 hours and
            you will be notified by email when your post goes live.
          </label>
          <Button
            size="sm"
            variant={ButtonVariants.OutlinePrimary}
            href="guidelines"
          >
            Review Forum Guidelines
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};
