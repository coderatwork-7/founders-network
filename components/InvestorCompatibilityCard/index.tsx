import React from 'react';

import styles from './InvestorCompatibilityCard.module.scss';

import FnText from '@/ds/FnText';
import FnDescriptionList from '@/ds/FnDescriptionList';
import FnDescriptionListItem from '@/ds/FnDescriptionListItem';
import Card from '@/ds/Card/card';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import {Button, ButtonVariants} from '@/ds/Button/button';

interface IProps {
  userStage?: string;
  stageIsCompatible?: boolean;
  userSectors?: {name: string; id: number}[];
  sectorsIsCompatible?: boolean;
  userLocation?: string;
  locationIsCompatible?: boolean;
  isCompatible?: boolean;
  userLookingToRaise?: string;
  setShowIntroForm: (value: boolean) => void;
}

export const InvestorCompatibilityCard: React.FC<IProps> = props => {
  const {
    isCompatible,
    stageIsCompatible,
    sectorsIsCompatible,
    locationIsCompatible,
    setShowIntroForm,
    userLocation,
    userLookingToRaise,
    userSectors,
    userStage
  } = props;

  return (
    <Card className={styles.InvestorCompatibilityCard}>
      <div className={styles.header}>
        <FnText type="heading-xSmall" bold>
          Investor compatibility
        </FnText>
        {isCompatible ? (
          <Button
            variant={ButtonVariants.Primary}
            onClick={() => setShowIntroForm(true)}
            style={{minHeight: 'unset', margin: '0 1rem'}}
          >
            Request Introduction
          </Button>
        ) : (
          <FnText className={styles.notCompatible}>Not Compatible</FnText>
        )}
      </div>
      <FnDescriptionList>
        <FnDescriptionListItem
          leadingIcon={
            stageIsCompatible ? (
              <CheckCircleOutlineIcon style={{color: '#336666'}} />
            ) : !!stageIsCompatible ? (
              <ErrorOutlineIcon style={{color: '#b80000'}} />
            ) : undefined
          }
          success={stageIsCompatible}
          error={!!stageIsCompatible}
          title=" Your Stage"
          description={userStage}
        />
        <FnDescriptionListItem
          leadingIcon={
            locationIsCompatible ? (
              <CheckCircleOutlineIcon style={{color: '#336666'}} />
            ) : !!locationIsCompatible ? (
              <ErrorOutlineIcon style={{color: '#b80000'}} />
            ) : undefined
          }
          success={locationIsCompatible}
          error={!!locationIsCompatible}
          title=" Looking to raise"
          description={userLookingToRaise}
        />
        <FnDescriptionListItem
          success={sectorsIsCompatible}
          error={!!sectorsIsCompatible}
          leadingIcon={
            sectorsIsCompatible ? (
              <CheckCircleOutlineIcon style={{color: '#336666'}} />
            ) : !!sectorsIsCompatible ? (
              <ErrorOutlineIcon style={{color: '#b80000'}} />
            ) : undefined
          }
          title=" Your Sector"
          description={
            userSectors?.length
              ? userSectors
                  .map((sector: {name: string; id: number}) => sector.name)
                  .join(', ')
              : ''
          }
        />
        <FnDescriptionListItem
          leadingIcon={
            locationIsCompatible ? (
              <CheckCircleOutlineIcon style={{color: '#336666'}} />
            ) : !!locationIsCompatible ? (
              <ErrorOutlineIcon style={{color: '#b80000'}} />
            ) : undefined
          }
          success={locationIsCompatible}
          error={!!locationIsCompatible}
          title=" Your Location"
          description={userLocation}
        />
      </FnDescriptionList>
    </Card>
  );
};

export default InvestorCompatibilityCard;
