import styles from './topNominateTable.module.scss';
import Avatar from '@/ds/Avatar/avatar';
import {useSelector} from 'react-redux';
import {selectNominationInfo, selectUserInfo} from '@/store/selectors';
import FnText from '@/ds/FnText';

import Image from 'next/image';
import Card from '@/ds/Card/card';

interface TopNominateTablePropsType {}

interface TopNominateListType {
  name: string;
  profileId: number;
  avatarUrl: string;
  badge: string;
  cohort: string;
  numberOfSubmissions: number;
  rank: number;
}

export const TopNominateTable = ({}: TopNominateTablePropsType) => {
  const {name: userName} = useSelector(selectUserInfo());
  const {list: topList, month} = useSelector(selectNominationInfo());

  return (
    <div className={styles.topNominateTable}>
      <Card containerClassName={styles.cardContainer}>
        <FnText type="heading-xSmall" bold>
          Top Nominators of {month}
        </FnText>

        {topList?.length !== 0 ? (
          <ul className={styles.topList}>
            {topList?.map((value: TopNominateListType) => {
              return (
                <li key={value?.profileId} className={styles.listItem}>
                  <div className={styles.nameContainer}>
                    <Avatar
                      avatarUrl={value?.avatarUrl}
                      altText={`${value?.name} Picture`}
                      badge={value?.badge}
                      newDesign
                      imageWidth={40}
                      imageHeight={40}
                    />
                    <div>
                      <FnText>
                        {value?.name}{' '}
                        {value?.name === userName ? '(you)' : null}
                      </FnText>
                      <FnText className={styles.submissionsNo}>
                        <span style={{fontWeight: 'bold'}}>
                          {value?.numberOfSubmissions}
                        </span>{' '}
                        Submitted
                      </FnText>
                      <FnText className={styles.submissionsNo}>
                        <span style={{fontWeight: 'bold'}}>{value?.rank}</span>{' '}
                        Nominator Rank
                      </FnText>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="text-center">
            <div className="mb-3">No nominations submitted yet</div>
            <div>
              Nominate tech founders to be the top nominator of the month
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
