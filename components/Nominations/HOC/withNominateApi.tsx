import React from 'react';
import useAPI from '@/utils/common/useAPI';
import {useSelector} from 'react-redux';
import {selectUserInfo} from '@/store/selectors';

interface Nomination {
  name: string;
  email: string;
  endorsement?: string;
  cohort: string;
}

export interface NominateAPIProps {
  nominate?: (list: Array<Nomination>) => Promise<any>;
}

export const withNominateApi = <Props extends NominateAPIProps>(
  WrappedComponent: React.ComponentType<Props>
) => {
  const WithNominateApi = (props: Props) => {
    const api = useAPI();
    const userInfo = useSelector(selectUserInfo());

    const postNominations = async (nominationList: Array<Nomination>) => {
      return await api(
        'postNominations',
        {userId: userInfo?.id},
        {
          method: 'POST',
          data: nominationList
        }
      );
    };

    return <WrappedComponent {...props} nominate={postNominations} />;
  };

  return WithNominateApi;
};
