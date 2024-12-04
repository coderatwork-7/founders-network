import React, {useState} from 'react';
import classes from './reservationConfirmed.module.scss';
import modalStyles from '../modalStyles.module.scss';
import {ReservationSubModals} from '../reservationWidget';
import {Modal} from 'react-bootstrap';
import clsx from 'clsx';
import useAPI from '@/utils/common/useAPI';
import {useSelector} from 'react-redux';
import {selectApiState, selectUserInfo} from '@/store/selectors';
import {AddToCalendar} from '@/components/AddToCalendar';
import {Button, ButtonVariants} from '@/ds/Button';

interface ReservationConfirmedModalProps {
  setVisibleModal: (modal: ReservationSubModals) => void;
  functionId: string;
  handleClose: () => void;
}

export const ReservationConfirmedModal: React.FC<
  ReservationConfirmedModalProps
> = ({setVisibleModal, functionId, handleClose}) => {
  const api = useAPI();
  const userInfo = useSelector(selectUserInfo());
  const [question, setQuestion] = useState('');
  const [posted, setPosted] = useState(false);
  const loading = !!useSelector(selectApiState('postFunctionQuestion'));

  const handleSubmit = () => {
    (async () => {
      await api(
        'postFunctionQuestion',
        {
          userId: userInfo?.id,
          functionId
        },
        {method: 'POST', data: {question}}
      );
    })()
      .then(() => setPosted(true))
      .catch(_ => setVisibleModal(ReservationSubModals.None));
  };
  return (
    <Modal
      show={true}
      onHide={handleClose}
      animation={false}
      centered
      dialogClassName={clsx([modalStyles.modal, classes.modal])}
      contentClassName={clsx([modalStyles.content, classes.content])}
    >
      <Modal.Header closeButton className="pt-3 pb-2 border-0">
        <Modal.Title
          className={clsx([modalStyles.modalTitle, 'text-truncate'])}
        >
          We've reserved your spot.
        </Modal.Title>
      </Modal.Header>
      <div className={classes.helpText}>
        Add this function to your calendar:
      </div>
      <div className={classes.calendarPopover}>
        <AddToCalendar
          showPopover={false}
          functionId={functionId}
          iconClass={classes.calendarIcons}
          className="justify-content-center mt-2"
        />
      </div>
      <div className={classes.question}>
        {posted ? (
          <div className="text-center fs-4 fw-bold text-black mb-3">
            Successfully Posted!
          </div>
        ) : (
          <>
            <label>Post a Question for the Featured Guest</label>
            <textarea
              placeholder="Your Question"
              value={question}
              onChange={e => setQuestion(e.target.value)}
            ></textarea>
            <div
              className={clsx([modalStyles.btnConatiner, classes.btnConatiner])}
            >
              <Button
                type="submit"
                variant={ButtonVariants.BluePrimary}
                className={modalStyles.btnResponsive}
                disabled={!question.trim() || loading}
                onClick={handleSubmit}
                loadingChildren={'Posting'}
                loading={loading}
                textUppercase
              >
                Post
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
