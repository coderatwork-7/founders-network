import React from 'react';
import Card from '@/ds/Card/card';
import styles from './objectiveCard.module.scss';
import Image from 'next/image';
import ShoutIcon from '@/public/svgIcons/shout_icon.svg';
import clsx from 'clsx';
import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';
import {ProfileData} from '@/types/profile';
import FnText from '@/ds/FnText';

interface ObjectiveCardProps {
  profileData: ProfileData;
}

const ObjectiveCard: React.FC<ObjectiveCardProps> = ({profileData}) => {
  const isMobile = Breakpoint.mobile === useBreakpoint();
  return (
    <Card className={styles.objectiveCard}>
      <FnText type="heading-xSmall" bold>
        {profileData?.firstName}'s Objectives
      </FnText>
      <div className={styles.contentContainer}>
        {profileData?.objectives?.map(
          (objective: {name: string; tags: Array<string>}) => (
            <div key={objective.name} className={styles.tagsContainer}>
              <Card className={styles.tagsCard}>
                <FnText bold>{objective.name}</FnText>
                <ul>
                  {objective.tags.map((tag: string) => (
                    <li key={tag}>
                      <p>{tag}</p>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          )
        )}
      </div>
    </Card>
  );
};

export default ObjectiveCard;
