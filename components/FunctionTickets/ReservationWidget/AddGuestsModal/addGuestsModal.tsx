import React, {useMemo, useRef} from 'react';
import classes from './addGuestsModal.module.scss';
import modalStyles from '../modalStyles.module.scss';
import {Guest, ReservationSubModals} from '../reservationWidget';
import {Modal} from 'react-bootstrap';
import clsx from 'clsx';
import {Button, ButtonVariants} from '@/ds/Button';

interface AddGuestsModalProps {
  setVisibleModal: (modal: ReservationSubModals) => void;
  numberOfGuests: number;
  guestData?: Guest[];
  setGuestData?: React.Dispatch<React.SetStateAction<Guest[]>>;
  totalCost: number;
  handleSubmit: (guestData?: Array<Guest>) => void;
  submitting: boolean;
  handleClose: () => void;
}

export const AddGuestsModal: React.FC<AddGuestsModalProps> = ({
  setVisibleModal,
  numberOfGuests,
  guestData,
  setGuestData = () => {},
  totalCost,
  handleSubmit,
  submitting,
  handleClose
}) => {
  const formRef = useRef<HTMLFormElement>(null);

  const disableNavigation = useMemo(
    () => guestData?.some(guest => !!guest.error) === true,
    [guestData]
  );

  const handleEmailChange = (index: number) => {
    if (guestData?.[index]?.error)
      setGuestData((guestData: Guest[]) => {
        const data = [...guestData];
        data[index].error = '';
        return data;
      });
  };

  const saveGuestData = (validate: boolean = true) => {
    const inputs = Array.from(formRef.current?.querySelectorAll('input') ?? []);
    const guests: Guest[] = [];
    let hasError = false;

    inputs.forEach((input, index) => {
      const value = input.value.trim();
      const guestIndex = Math.floor(index / 4);

      if (validate) {
        if (value === '' && input.type !== 'checkbox') {
          input.classList.add(classes.error);
          hasError = true;
        } else {
          input.classList.remove(classes.error);
        }
      }

      guests[guestIndex] = {
        ...guests[guestIndex],
        [input.name]: input.type === 'checkbox' ? input.checked : value,
        error: guestData?.[guestIndex]?.error ?? ''
      };
    });

    if (!hasError) {
      setGuestData(guests);
    }
    return {err: hasError, data: guests};
  };

  const handleFormSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const {err, data} = saveGuestData();
    if (!err) {
      totalCost
        ? setVisibleModal(ReservationSubModals.ConfirmTickets)
        : handleSubmit(data);
    }
  };

  const renderGuestFields = () => {
    const guestFields: JSX.Element[] = [];

    for (let i = 0; i < numberOfGuests; i++) {
      const guest = guestData?.[i];
      guestFields.push(
        <div key={i} className={classes.guestInfo}>
          <div className="w-100">
            <b>Guest {i + 1} </b>
          </div>
          <div className={classes.inputGroup}>
            <div className={classes.inputField}>
              <label htmlFor={`firstName${i}`}>Guest First Name</label>
              <input
                autoComplete="off"
                id={`firstName${i}`}
                type="text"
                name="firstName"
                defaultValue={guest?.firstName ?? ''}
              />
            </div>
            <div className={classes.inputField}>
              <label htmlFor={`lastName${i}`}>Guest Last Name</label>
              <input
                autoComplete="off"
                id={`lastName${i}`}
                type="text"
                name="lastName"
                defaultValue={guest?.lastName ?? ''}
              />
            </div>
            <div className={clsx([classes.inputField, classes.mail])}>
              <label htmlFor={`email${i}`}>Guest Email</label>
              <input
                autoComplete="off"
                id={`email${i}`}
                type="email"
                name="email"
                defaultValue={guest?.email ?? ''}
                onChange={() => handleEmailChange(i)}
              />
            </div>
          </div>
          <div className={classes.nominateDetails}>
            <div className={classes.checkbox}>
              <input
                id={`nominate${i}`}
                type="checkbox"
                name="isNominated"
                defaultChecked={guest?.isNominated ?? false}
              />
              <label htmlFor={`nominate${i}`}>
                <b>Nominate</b>
              </label>
            </div>
            {guest?.error && <div className="text-danger">{guest.error}</div>}
          </div>
        </div>
      );
    }

    return guestFields;
  };

  return (
    <Modal
      show={true}
      onHide={handleClose}
      animation={false}
      centered
      dialogClassName={modalStyles.modal}
      contentClassName={modalStyles.content}
    >
      <Modal.Header closeButton className="pt-3 pb-2 border-0">
        <Modal.Title
          className={clsx([modalStyles.modalTitle, 'text-truncate'])}
        >
          Your Guest Tickets
        </Modal.Title>
      </Modal.Header>
      <div className={classes.helpText}>
        <div>Please add names and emails to your guest tickets.</div>
        <div>
          This is required. <b>Do not enter your own name.</b>
        </div>
      </div>
      <form
        ref={formRef}
        className={classes.guestDetailsForm}
        onSubmit={handleFormSubmit}
      >
        <div className={classes.ipnutContainer}>{renderGuestFields()}</div>
        <div className={modalStyles.btnConatiner}>
          <Button
            variant={ButtonVariants.BluePrimary}
            className={modalStyles.btnResponsive}
            onClick={() => {
              setVisibleModal(ReservationSubModals.SelectTicket);
              saveGuestData(false);
            }}
            textUppercase
          >
            Back
          </Button>
          <Button
            type="submit"
            variant={ButtonVariants.BluePrimary}
            className={modalStyles.btnResponsive}
            disabled={submitting || disableNavigation}
            loadingChildren={'Submitting'}
            loading={submitting}
            textUppercase
          >
            {totalCost ? 'Review & Checkout' : 'Submit'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
