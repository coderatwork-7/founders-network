import React, {useEffect, useMemo, useState} from 'react';
import classes from './FeedbacksPage.module.scss';
import {FeedbacksTable} from '../FeedbacksTable';
import useAPI from '@/utils/common/useAPI';
import {CONCURRENCY_CONTROL} from '@/genericApi/apiEndpoints';
import {selectAdminFeedbacks, selectUserInfo} from '@/store/selectors';
import {useSelector} from 'react-redux';
import {Spinner} from '@/ds/Spinner';
import {CanceledError} from 'axios';

type FeedBack = {
  userId: number;
  profileId: number;
  avatarUrl: string;
  badge: string;
  name: string;
  feedback: Question | string;
  file?: {
    name: string;
    url: string;
  };
};

type Question = {
  question: string;
  answer: string;
  rating?: number;
};

export type NormalisedFeedback = Omit<FeedBack, 'feedback'> & {
  [question: string]: Omit<Question, 'question'>;
};

const normaliseFeedback = (feedbacks: FeedBack[]) => {
  return feedbacks?.map(f => ({
    ...f,
    ...(
      (typeof f.feedback === 'string'
        ? JSON.parse(f.feedback)
        : f.feedback) as Question[]
    ).reduce((acc: any, {question, ...value}) => {
      acc[question] = value;
      return acc;
    }, {})
  })) as NormalisedFeedback[];
};

export const FeedbacksPage: React.FC = () => {
  const api = useAPI();
  const [err, setErr] = useState(false);
  const userInfo = useSelector(selectUserInfo());
  const data = useSelector(selectAdminFeedbacks());
  const feedbacksArr = useMemo(() => normaliseFeedback(data), [data]);

  useEffect(() => {
    const fetchSiteFeedback = async () => {
      await api('getSiteFeedback', {
        userId: userInfo?.id ?? '',
        concurrencyControl: CONCURRENCY_CONTROL.takeLastRequest
      });
    };

    if (!data && userInfo?.id) {
      fetchSiteFeedback().catch(err => {
        if (!(err.errorObj instanceof CanceledError)) setErr(true);
      });
    }
  }, [userInfo?.id]);

  const noData = err ? (
    <div className="text-danger text-center mt-4">Error Fetching Data</div>
  ) : (
    <Spinner className="mt-5" />
  );

  return (
    <div className={classes.main}>
      <div className={classes.title}>Feedback Report</div>
      <div className={classes.tableContainer}>
        {data ? <FeedbacksTable feedbacksArr={feedbacksArr} /> : noData}
      </div>
    </div>
  );
};
