import useAPI from '@/utils/common/useAPI';
import {FunctionRSVPCount} from '../FunctionRSVPCount/functionRSVPCount';
import {useSelector} from 'react-redux';
import {selectFunctionRSVP, selectUserInfo} from '@/store/selectors';
import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';
import {FunctionRSVPList} from '../FunctionRSVPList/functionRSVPList';
import clsx from 'clsx';
import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';
import {CONCURRENCY_CONTROL} from '@/genericApi/apiEndpoints';

interface FunctionRSVPPropType {
  functionName: string;
}

export const FunctionRSVP: React.FC<FunctionRSVPPropType> = ({
  functionName
}) => {
  const isMobile = Breakpoint.mobile == useBreakpoint();
  const makeApiCall = useAPI();
  const {functionId} = useRouter().query;
  const userInfo = useSelector(selectUserInfo());
  const functionAdminInfo = useSelector(
    selectFunctionRSVP(functionId as string)
  );

  const fetchFunctionRSVP = async () => {
    await makeApiCall('getFunctionRSVP', {
      userId: userInfo?.id,
      functionId: functionId as string,
      concurrencyControl: CONCURRENCY_CONTROL.takeFirstRequest
    });
  };

  const [currentListName, setCurrentListName] = useState<string>(`all`);

  useEffect(() => {
    if (userInfo?.id && !functionAdminInfo) fetchFunctionRSVP();
  }, [userInfo?.id, functionAdminInfo]);

  return (
    <div className={clsx('d-flex', isMobile && 'flex-column')}>
      <FunctionRSVPCount
        rsvps={functionAdminInfo}
        setListName={setCurrentListName}
        listName={currentListName}
      />
      <FunctionRSVPList
        rsvps={functionAdminInfo}
        listName={currentListName}
        functionName={functionName}
      />
    </div>
  );
};
