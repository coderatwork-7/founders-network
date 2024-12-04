import React from 'react';
import {NominationModals} from '../nominationWidget';
import {Modal} from 'react-bootstrap';
import classes from './modals.module.scss';
import {format} from 'date-fns';

interface RequestAckModalProps {
  setVisibleModal: (modal: NominationModals) => void;
  reviewDate: string;
}

function formatDate(dateString: string) {
  try {
    return format(new Date(dateString), 'MMMM do');
  } catch (e) {
    return dateString;
  }
}

export function RequestAckModal({
  setVisibleModal,
  reviewDate
}: RequestAckModalProps) {
  const handleClose = () => setVisibleModal(NominationModals.None);

  return (
    <Modal
      show={true}
      animation={false}
      onHide={handleClose}
      centered
      dialogClassName={classes.modal}
    >
      <Modal.Header closeButton>
        <Modal.Title className={classes.modalTitle}>
          <div>Nomination Refill Request Sent</div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={classes.requestConfBody}>
        <div className="fs-4 mb-4">Thank you for your request</div>
        <p className="mb-4">
          The membership Committee will review your request for more nominations
          on {formatDate(reviewDate)}.
        </p>
        <p>
          The number of nominations that you are rewarded will depend on your
          engagement level in the community and how many of you past nominations
          applied and were accepted into FN.
        </p>
      </Modal.Body>
    </Modal>
  );
}
