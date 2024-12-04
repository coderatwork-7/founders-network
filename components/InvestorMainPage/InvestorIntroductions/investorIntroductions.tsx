import {CONCURRENCY_CONTROL} from '@/genericApi/apiEndpoints';
import {selectInvestorInfo, selectUserInfo} from '@/store/selectors';
import useAPI from '@/utils/common/useAPI';
import {useEffect} from 'react';
import {Spinner} from 'react-bootstrap';
import {useSelector} from 'react-redux';
import {IntroductionCard} from '../IntroductionCard/introductionCard';
import {isObjectEmpty} from '@/utils/common/helper';
import FnText from '@/ds/FnText';

export const InvestorIntroductions = () => {
  const userInfo = useSelector(selectUserInfo());
  const investorIntroductions = useSelector(
    selectInvestorInfo('introductions')
  );
  const makeApiCall = useAPI();
  const fetchInvestorOverview = async () => {
    return makeApiCall('getInvestorDetails', {
      userId: userInfo?.id,
      type: 'introductions',
      concurrencyControl: CONCURRENCY_CONTROL.takeFirstRequest
    });
  };

  useEffect(() => {
    if (userInfo?.id && !investorIntroductions) fetchInvestorOverview();
  }, [userInfo?.id]);
  if (isObjectEmpty(investorIntroductions)) {
    return <FnText>There are currently no introduction requests.</FnText>;
  }
  return (
    <div>
      {investorIntroductions && investorIntroductions?.length !== 0 ? (
        Object.keys(investorIntroductions)?.map((element: any) => {
          return (
            <div key={investorIntroductions?.[element]?.id} className="mb-3">
              <IntroductionCard userProfile={investorIntroductions[element]} />
            </div>
          );
        })
      ) : (
        <div>No Introductions Request</div>
      )}
    </div>
  );
};
