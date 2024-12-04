import React, {FormEvent, useRef, useState} from 'react';
import clsx from 'clsx';
import {Modal, Spinner} from 'react-bootstrap';
import {FormControl} from '@/ds/FormControl';
import {
  withNominateApi,
  NominateAPIProps
} from '@/components/Nominations/HOC/withNominateApi';
import classes from './modals.module.scss';
import {NominationModals} from '../nominationWidget';

interface QuickNominateModalProps extends NominateAPIProps {
  setVisibleModal: (modal: NominationModals) => void;
  setNominee: (val: string) => void;
  remainingDays: string;
  cohort: string;
}

export const QuickNominateModal = withNominateApi(
  ({
    setVisibleModal,
    nominate,
    setNominee,
    remainingDays,
    cohort
  }: QuickNominateModalProps) => {
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const endorsementRef = useRef<HTMLTextAreaElement>(null);

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleClose = () => setVisibleModal(NominationModals.None);

    const handleNominate = (e: FormEvent) => {
      e.preventDefault();
      setLoading(true);
      nominate?.([
        {
          name: nameRef.current?.value ?? '',
          email: emailRef.current?.value ?? '',
          endorsement: endorsementRef.current?.value,
          cohort
        }
      ])
        .then(res => {
          if (res.data[0]?.status?.iserror) {
            setError(res.data[0]?.status?.message);
            setLoading(false);
          } else {
            setNominee(nameRef.current?.value ?? '');
            setVisibleModal(NominationModals.FeedbackForm);
          }
        })
        .catch(e => {
          setError('Please try again!');
          setLoading(false);
        });
    };

    return (
      <Modal
        show={true}
        onHide={handleClose}
        animation={false}
        centered
        dialogClassName={classes.modal}
      >
        <Modal.Header closeButton className="py-2">
          <Modal.Title className={clsx([classes.modalTitle, 'text-truncate'])}>
            Quick Nomination
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={classes.modalBody}>
          <div className={classes.banner}>
            <div className={classes.animate}>
              {remainingDays.replace('Away', '')} until the nomination deadline
            </div>
            <div className={classes.animate}>
              {`Your nominee will be applying to the ${cohort}.`}
            </div>
          </div>
          <div className={classes.content}>
            <div className={clsx([classes.column, classes.formCol])}>
              <h3>Your Nominee</h3>
              <form className={classes.form} onSubmit={handleNominate}>
                <div className={classes.inputContainer}>
                  <FormControl
                    floatingLabel={false}
                    placeholder="Full Name"
                    required={true}
                    type="text"
                    ref={nameRef}
                    disabled={loading}
                  ></FormControl>
                </div>
                <div className={classes.inputContainer}>
                  <FormControl
                    floatingLabel={false}
                    placeholder="Email"
                    required={true}
                    type="email"
                    ref={emailRef}
                    disabled={loading}
                  ></FormControl>
                </div>
                <div className={classes.inputContainer}>
                  <FormControl
                    floatingLabel={false}
                    placeholder="(Optional) Add a personal note to send to your nominee about why you are nominating them, and what FN has to offer."
                    ref={endorsementRef}
                    as="textarea"
                    disabled={loading}
                  ></FormControl>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={clsx(['btn', classes.btn])}
                >
                  {loading && (
                    <Spinner className={classes.spinner} size="sm"></Spinner>
                  )}
                  Submit Nomination
                </button>
                {error && (
                  <div className="alert alert-danger py-1 rounded-1">
                    {error}
                  </div>
                )}
              </form>
            </div>

            <div className={clsx([classes.column, classes.tipsCol])}>
              <h3>Nomination Tips</h3>
              <ul>
                <li>Full time at their tech startup</li>
                <li>They will not sell on the Forum</li>
                <li>They are expecting a nomination</li>
              </ul>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
);
