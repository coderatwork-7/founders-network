import {selectUserInfo} from '@/store/selectors';
import useAPI from '@/utils/common/useAPI';
import {useCallback} from 'react';
import {useSelector} from 'react-redux';

function useDeclineTickets() {
  const userInfo = useSelector(selectUserInfo());
  const api = useAPI();

  return useCallback(
    (functionId: string) => {
      return (async () => {
        if (!userInfo?.id) return;
        await api(
          'postDeclineFunction',
          {
            userId: userInfo.id,
            functionId
          },
          {method: 'POST'}
        );
      })();
    },
    [userInfo, api]
  );
}

export default useDeclineTickets;
