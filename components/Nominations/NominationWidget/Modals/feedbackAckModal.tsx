import React from 'react';
import {Modal} from 'react-bootstrap';
import classes from './modals.module.scss';
import {NominationModals} from '../nominationWidget';

interface FeedbackAckModalProps {
  setVisibleModal: (modal: NominationModals) => void;
}

export function FeedbackAckModal({setVisibleModal}: FeedbackAckModalProps) {
  const handleClose = () => setVisibleModal(NominationModals.None);

  return (
    <Modal
      show={true}
      animation={false}
      onHide={handleClose}
      centered
      dialogClassName={classes.modal}
    >
      <Modal.Header closeButton className="border-bottom-0">
        <Modal.Title className={classes.modalTitle}>
          <div>Thank You for your feedback!</div>
        </Modal.Title>
      </Modal.Header>
    </Modal>
  );
}
