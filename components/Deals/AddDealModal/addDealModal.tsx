import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';
import React, {Dispatch, SetStateAction, useState} from 'react';
import {Modal} from 'react-bootstrap';
import classes from './addDeal.module.scss';
import clsx from 'clsx';
import {AddDealForm} from './AddDealForm/addDealForm';

interface AddDealModalPropsType {
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

export enum AddDealStatus {
  success = 'success',
  error = 'error',
  form = 'form'
}

export const AddDealModal: React.FC<AddDealModalPropsType> = ({
  setShowModal
}) => {
  const isMobile = Breakpoint.mobile === useBreakpoint();
  const handleClose = () => {
    setShowModal(false);
  };
  const [currentStatus, setCurrentStatus] = useState(AddDealStatus.form);
  const [message, setMessage] = useState<Record<string, string>>({});
  return (
    <Modal
      show={true}
      onHide={handleClose}
      dialogClassName={classes.modal}
      contentClassName={classes.content}
      centered={!isMobile}
      fullscreen={isMobile ? true : undefined}
    >
      <Modal.Header closeButton className="border-0">
        <Modal.Title className={clsx([classes.modalTitle, 'text-truncate'])}>
          {AddDealStatus.form === currentStatus && (
            <h2>Deal Listing Request Form</h2>
          )}
          {AddDealStatus.success === currentStatus && (
            <h2>{message?.message}</h2>
          )}
          {AddDealStatus.error === currentStatus && <h2>Error</h2>}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {AddDealStatus.form === currentStatus && (
          <div className={classes.bodyContainer}>
            <AddDealForm
              setCurrentStatus={setCurrentStatus}
              setMessage={setMessage}
            />
          </div>
        )}
        {AddDealStatus.success === currentStatus && (
          <div className="text-center">{message?.info}</div>
        )}
        {AddDealStatus.error === currentStatus && (
          <div className="text-center">Error while submitting</div>
        )}
      </Modal.Body>
    </Modal>
  );
};
