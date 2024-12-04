import React, {useMemo} from 'react';
import Card from '@/ds/Card/card';
import styles from './activityCard.module.scss';
import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';
import {PopoverFacet} from '@/ds/PopoverFacet';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faComment,
  faHandshake,
  faNewspaper
} from '@fortawesome/free-regular-svg-icons';
import {
  faCalendarDays,
  faPencil,
  faPercentage,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons';
import {faTwitter} from '@fortawesome/free-brands-svg-icons';
import {ProfileData, IntroductionsData, AllUpdatesData} from '@/types/profile';
import {Session} from 'next-auth';
import {useSelector} from 'react-redux';
import {selectProfileAllUpdates} from '@/store/selectors';

interface ActivityCardProps {
  profileData: ProfileData;
  userInfo: Session['user'];
  profileIntroductions: IntroductionsData;
  profileAllUpdates: AllUpdatesData;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  profileData,
  userInfo,
  profileIntroductions
  // profileAllUpdates
}) => {
  const profileAllUpdates = useSelector(selectProfileAllUpdates());

  const mobileFacetValues = useMemo(
    () => [
      {
        facetValueColor: 'grayDarkClass',
        facetValueCount: '',
        facetValueKey: 'all',
        facetValueName: 'All Updates'
      },
      {
        facetValueColor: 'greenLightClass',
        facetValueCount: '',
        facetValueKey: 'ForumThread',
        facetValueName: 'Forum'
      },
      {
        facetValueColor: 'regentBlueClass',
        facetValueCount: '',
        facetValueKey: 'Function,FnRsvp,FunctionQuestion',
        facetValueName: 'Functions'
      },
      {
        facetValueColor: 'goldenTainoiClass',
        facetValueCount: '',
        facetValueKey: 'UserProfile,Nomination',
        facetValueName: 'Members'
      },
      {
        facetValueColor: 'grayishBlueClass',
        facetValueCount: '',
        facetValueKey: 'MemberToSubgroup',
        facetValueName: 'Groups'
      },
      {
        facetValueColor: 'lightSalomClass',
        facetValueCount: '',
        facetValueKey: 'DealRedemption,FnDeal',
        facetValueName: 'Deals'
      },
      {
        facetValueColor: 'greenLightClass',
        facetValueCount: '',
        facetValueKey: 'Tweets',
        facetValueName: 'Tweets'
      },
      {
        facetValueColor: 'regentBlueClass',
        facetValueCount: '',
        facetValueKey: 'Highlights',
        facetValueName: 'Highlights'
      }
    ],
    []
  );

  const updateFacetValue = () => {};

  const selectedFacetValues = {
    type: {
      all: {
        facetValueKey: 'all',
        facetValueName: 'All Updates'
      }
    }
  };

  const isMobile = Breakpoint.mobile === useBreakpoint();
  return (
    <Card className={styles.activityCard}>
      <h4>Activity</h4>
      <div className={styles.contentContainer}>
        <div className={styles.leftContainer}>
          {isMobile ? (
            <PopoverFacet
              key={'Menu'}
              facetKey={'Menu'}
              facetName={'Activity Menu'}
              trigger="hover"
              facetValueOnClick={updateFacetValue}
              isMultiselect={false}
              isSearchable={false}
              facetValues={mobileFacetValues.map(
                ({
                  facetValueKey,
                  facetValueName,
                  facetValueCount,
                  facetValueColor
                }) => ({
                  facetValueKey,
                  facetValueName,
                  facetValueCount,
                  facetValueColor
                })
              )}
              selectedItems={selectedFacetValues}
              startingFacet={true}
            />
          ) : (
            <>
              <div>
                <FontAwesomeIcon icon={faNewspaper} size="2x" />
                All updates
              </div>
              <div>
                <FontAwesomeIcon icon={faComment} size="2x" />
                Posts
              </div>
              <div>
                <FontAwesomeIcon icon={faCalendarDays} size="2x" />
                Functions
              </div>
              <div>
                <FontAwesomeIcon icon={faHandshake} size="2x" />
                Introductions
              </div>
              <div>
                <FontAwesomeIcon icon={faUserPlus} size="2x" />
                Nominations
              </div>
              <div>
                <FontAwesomeIcon icon={faPercentage} size="2x" />
                Deals
              </div>
              <div>
                <FontAwesomeIcon icon={faTwitter} size="2x" />
                Tweets
              </div>
              <div>
                <FontAwesomeIcon icon={faPencil} size="2x" />
                Highlights
              </div>
            </>
          )}
        </div>
        <div className={styles.rightContainer}>
          <Card className={styles.testCard}>
            <p>Testing Card Text 1</p>
          </Card>
          <Card className={styles.testCard}>
            <p>Testing Card Text 2</p>
          </Card>
          <Card className={styles.testCard}>
            <p>Testing Card Text 2</p>
          </Card>
          <Card className={styles.testCard}>
            <p>Testing Card Text 2</p>
          </Card>
          <Card className={styles.testCard}>
            <p>Testing Card Text 2</p>
          </Card>
          <Card className={styles.testCard}>
            <p>Testing Card Text 2</p>
          </Card>
          <Card className={styles.testCard}>
            <p>Testing Card Text 2</p>
          </Card>
          <Card className={styles.testCard}>
            <p>Testing Card Text 2</p>
          </Card>
        </div>
      </div>
    </Card>
  );
};

export default ActivityCard;
