import React, {ChangeEvent, FormEvent, useRef, useState} from 'react';
import classes from './modals.module.scss';
import {Modal} from 'react-bootstrap';
import {FormControl} from '@/ds/FormControl';
import clsx from 'clsx';
import useAPI from '@/utils/common/useAPI';
import {useSelector} from 'react-redux';
import {selectUserInfo} from '@/store/selectors';
import {Spinner} from '@/ds/Spinner';
import {NominationModals} from '../nominationWidget';
interface FeedbackModalProps {
  setVisibleModal: (modal: NominationModals) => void;
  nominee: string;
}

export const FeedbackModal = ({
  nominee,
  setVisibleModal
}: FeedbackModalProps) => {
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const api = useAPI();
  const userInfo = useSelector(selectUserInfo());

  const postFeedback = async (feedback: string) => {
    return await api(
      'postFeedback',
      {userId: userInfo?.id},
      {
        method: 'POST',
        data: {data: {feedback}}
      }
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    postFeedback(feedback ?? '')
      .then(() => setVisibleModal(NominationModals.FeedbackAck))
      .catch(() => setVisibleModal(NominationModals.None));
  };

  const handleClose = () => setVisibleModal(NominationModals.None);

  const handleFeedbackChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFeedback(e.target.value);
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
          {`Thank you for nominating ${nominee}!`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={classes.modalBody}>
        <div className={classes.content}>
          <div className={clsx([classes.column, classes.formCol])}>
            <h3>Your Feedback</h3>
            <form className={classes.form} onSubmit={handleSubmit}>
              <div className={clsx([classes.inputContainer, classes.feedback])}>
                <FormControl
                  floatingLabel={false}
                  placeholder="What prompted you to nominate, and how did you talk to them about FN?"
                  type="text"
                  disabled={loading}
                  as="textarea"
                  rows={3}
                  value={feedback}
                  onChange={handleFeedbackChange}
                ></FormControl>
              </div>
              <button
                type="submit"
                className={clsx(['btn', classes.btn])}
                disabled={loading || !feedback.trim().length}
              >
                {loading && (
                  <Spinner className={classes.spinner} size="sm"></Spinner>
                )}
                Submit Feedback
              </button>
            </form>
          </div>

          <div className={clsx([classes.column, classes.tipsCol])}>
            <h3>Nomination Reminders</h3>
            <p className={classes.reminder}>
              <b>Find nominees</b> in your accelerator, alumni network, meetups,
              coworking spaces, and founders you meet.
            </p>
            <p className={classes.reminder}>
              <b>Talk to nominees</b> about your experiences in FN.
            </p>
            <p className={classes.reminder}>
              <b>60 days from now,</b> your nomination will expire. Follow up
              with them about applying.
            </p>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
