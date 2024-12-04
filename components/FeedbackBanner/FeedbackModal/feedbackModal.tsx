import React, {MouseEventHandler, useRef, useState} from 'react';
import classes from '../feedbackStyles.module.scss';
import {Modal} from 'react-bootstrap';
import clsx from 'clsx';
import {Button, ButtonVariants} from '@/ds/Button';
import useAPI from '@/utils/common/useAPI';
import {useSelector} from 'react-redux';
import {selectApiState, selectUserInfo} from '@/store/selectors';
import {Rating} from '@/ds/Rating';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUpload, faXmark} from '@fortawesome/free-solid-svg-icons';
import {SURVEY_LABELS, SURVEY_QUESTIONS} from '@/utils/common/constants';
import {toast} from 'react-toastify';

interface FeedbackModalProps {
  handleCloseModal: () => void;
}

interface StarRatingProps {
  question: {
    label: string;
    options: string[];
  };
  handleRatingChange: (
    question: string,
    answer: string,
    rating: number
  ) => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  handleCloseModal
}) => {
  const api = useAPI();
  const userId = useSelector(selectUserInfo())?.id;
  const [responses, setResponses] = useState<
    {
      question: string;
      answer: string;
      rating: number;
    }[]
  >([]);
  const [additionalComments, setAdditionalComments] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const fileUploadRef = useRef<HTMLInputElement>(null);
  const loading = useSelector(selectApiState('postSiteFeedback'));

  const handleRatingChange = (
    question: string,
    answer: string,
    rating: number
  ) => {
    setResponses(prevResponses => [
      ...prevResponses.filter(response => response.question !== question),
      {question, answer: answer.toString(), rating}
    ]);
  };

  const handleAdditionalCommentsChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setAdditionalComments(event.target.value);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event?.target?.files?.[0] ?? null);
    setFileName(event?.target?.files?.[0]?.name ?? '');

    event.target.value = '';
  };

  const handleUploadClick: MouseEventHandler<HTMLButtonElement> = e => {
    e.preventDefault();
    fileUploadRef?.current?.click();
  };

  const handleRemoveUploadClick: MouseEventHandler<any> = e => {
    e.preventDefault();
    setFile(null);
    setFileName('');
  };

  const submitFormData = (data: any) => {
    return api('postSiteFeedback', {userId}, {method: 'POST', data});
  };

  const handleSubmit = () => {
    const formData = new FormData();

    const feedbacks = [
      ...responses,
      ...(additionalComments.trim() && [
        {
          question: SURVEY_LABELS.ADDITIONAL_COMMENT,
          answer: additionalComments
        }
      ])
    ];

    formData.append('feedback', JSON.stringify(feedbacks));
    file && formData.append('file', file);

    submitFormData(formData)
      .then(() => {
        handleCloseModal();
        toast.success('Feedback Submitted Successfully!', {
          theme: 'dark'
        });
      })
      .catch(() => {
        toast.error('Error Submitting Feedback, Please Try Again.', {
          theme: 'dark'
        });
      });
  };

  return (
    <Modal
      show={true}
      onHide={handleCloseModal}
      animation={true}
      centered
      dialogClassName={classes.modal}
      contentClassName={classes.content}
    >
      <Modal.Header closeButton className={classes.header}>
        <Modal.Title className={clsx([classes.modalTitle, 'text-truncate'])}>
          Website Feedback
        </Modal.Title>
      </Modal.Header>

      <div className={classes.formContainer}>
        <form className={classes.form}>
          {SURVEY_QUESTIONS.map(question => (
            <StarRating
              key={question.label}
              question={question}
              handleRatingChange={handleRatingChange}
            />
          ))}

          <div className={clsx(classes.formGroup, classes.comments)}>
            <div className={classes.question}>
              {SURVEY_LABELS.ADDITIONAL_COMMENT}
            </div>
            <textarea
              className={classes.commentBox}
              value={additionalComments}
              onChange={handleAdditionalCommentsChange}
            />
            <input
              type="file"
              ref={fileUploadRef}
              accept="image/*, video/*"
              onChange={handleFileUpload}
              hidden
            />
            {file ? (
              <button
                className={clsx(classes.uploadBtn, classes.removeBtn)}
                onClick={handleRemoveUploadClick}
              >
                <span className="me-2">{fileName}</span>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            ) : (
              <button className={classes.uploadBtn} onClick={handleUploadClick}>
                <FontAwesomeIcon icon={faUpload} />
                <span className="ms-2">Upload Supporting Image/Video</span>
              </button>
            )}
          </div>
        </form>
      </div>

      <Modal.Footer className={classes.footer}>
        <Button
          variant={ButtonVariants.Primary}
          textUppercase
          className={classes.btn}
          onClick={handleSubmit}
          loading={loading}
          disabled={loading}
          loadingChildren={'Submitting'}
        >
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const StarRating: React.FC<StarRatingProps> = ({
  question,
  handleRatingChange
}) => {
  const [rating, setRating] = useState(0);

  const handleRate = (val: number) => {
    setRating(val);
    handleRatingChange(question.label, question.options[val], val);
  };

  return (
    <div className={classes.formGroup}>
      <div className={classes.question}>{question.label}</div>
      <div className={classes.optionGroup}>
        <Rating
          rating={rating}
          SVGstorkeWidth="1"
          fillColor="#f7bb0d"
          emptyColor="#d7d7d7"
          SVGstrokeColor="transparent"
          containerClass="d-flex flex-column fs-4 align-items-center"
          onClick={handleRate}
          ratingTextClass={classes.ratingText}
          labels={question.options}
          iconsCount={question.options.length - 1}
          showTooltip={false}
          size={34}
          allowFraction={false}
        />
      </div>
    </div>
  );
};
