import React, {useState} from 'react';
import Card from '../Card/card';
import {BadgeTypes, badgeMapping} from '../Avatar/avatar';
import classes from './groupsCard.module.scss';
import clsx from 'clsx';
import Link from 'next/link';
import Image from 'next/image';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faArrowTrendUp,
  faKey,
  faLocationDot,
  faPieChart,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import {BADGE_HEIGHT, BADGE_WIDTH} from '@/utils/common/constants';
import {setAndMergeFacetState} from '@/utils/common/helper';
import Parse from 'html-react-parser';
import {GroupButton} from './components/groupButton';
import {FacetState} from '@/utils/common/commonTypes';
import {faEnvelope} from '@fortawesome/free-regular-svg-icons';
import {FacetUtils} from '@/components/Common/Facets/useFacetState';
import {processAnchorTagAndEmoji} from '@/utils/common/help';

export enum JOIN_TYPES {
  OPEN = 'open',
  CLOSE = 'Close',
  PRIVATE = 'private',
  NONE = 'None'
}

type memberType = {
  profileId: string;
  name: string;
  badge: BadgeTypes;
  avatarUrl: string;
};

const VIRTUAL = 'Virtual';

const handleFilterClick = (
  type: string,
  id: string,
  name: string,
  setSelectedFacetValues?: FacetUtils['setSelectedFacetValues'],
  setApplyFacets?: FacetUtils['setApplyFacets']
) => {
  setAndMergeFacetState(
    setSelectedFacetValues,
    type,
    {[id]: {facetValueKey: id, facetValueName: name}},
    setApplyFacets
  );
};

const getLinks = (
  list: any[],
  facetName: string,
  setSelectedFacetValues?: FacetUtils['setSelectedFacetValues'],
  setApplyFacets?: FacetUtils['setApplyFacets'],
  idGetter = (item: any) => item.id,
  nameGetter = (item: any) => item.name
) =>
  list.map((filterItem, index) => (
    <React.Fragment key={idGetter(filterItem)}>
      <a
        className="text-link"
        onClick={() =>
          handleFilterClick(
            facetName,
            idGetter(filterItem),
            nameGetter(filterItem),
            setSelectedFacetValues,
            setApplyFacets
          )
        }
      >
        {nameGetter(filterItem)}
      </a>
    </React.Fragment>
  ));

export interface GroupsCardData {
  id: string;
  title: string;
  detailUrl: string;
  imgSrc: string;
  email: string;
  descritption: string;
  members: memberType[];
  isInviteRequested: boolean;
  isJoined: boolean;
  isPrivate: boolean;
  stage: {
    name: string;
    id: string;
  };
  sector: {
    name: string;
    id: string;
  }[];
  city: {
    id: string;
    name: string;
  };
  isVirtual: boolean;
  joinType: JOIN_TYPES;
}

interface GroupsCardProps {
  data: GroupsCardData;
  setSelectedFacetValues: React.Dispatch<React.SetStateAction<FacetState>>;
  setApplyFacets?: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
  handleJoinGroup: (groupId: string, isPrivate: boolean) => Promise<any>;
}

export const GroupsCard: React.FC<GroupsCardProps> = ({
  data: {
    id,
    title,
    email,
    imgSrc,
    descritption,
    members,
    isInviteRequested,
    isJoined,
    isPrivate,
    stage,
    sector,
    city,
    isVirtual,
    joinType
  },
  setSelectedFacetValues,
  setApplyFacets,
  isMobile,
  handleJoinGroup
}) => {
  const sectorLinks = getLinks(
    sector,
    'sector',
    setSelectedFacetValues,
    setApplyFacets
  );
  const stageLink = getLinks(
    [stage],
    'stage',
    setSelectedFacetValues,
    setApplyFacets
  );
  const cityLink = getLinks(
    [city],
    'city',
    setSelectedFacetValues,
    setApplyFacets,
    item => (isVirtual ? VIRTUAL : item.name ?? ''),
    item => (isVirtual ? VIRTUAL : item.name ?? '')
  );

  return (
    <Card className="position-relative overflow-hidden">
      <div className={classes.cardConatiner}>
        <div className={classes.cardInfo}>
          <div className={classes.cardImageConatiner}>
            <div className={classes.cardImage}>
              <Image
                alt="fnGroup"
                src={
                  imgSrc ||
                  'https://members.foundersnetwork.com/static/fnsite/assets/img/groups/fnStage.png'
                }
                fill
              />
            </div>
          </div>
          <div className={clsx([classes.cardContent])}>
            <Link href={`/group/${id}`} className={classes.title}>
              {title}
            </Link>
            <div className={classes.email}>
              <FontAwesomeIcon
                icon={faEnvelope}
                className={isMobile ? 'fs-6' : 'fs-5'}
              />
              <a href={`mailto:${email}`} className="restrict1Line">
                {email}
              </a>
            </div>
            <p
              className={clsx([
                classes.description,
                !isMobile && 'restrict3Lines'
              ])}
            >
              {/* TODO: limit parsed content height*/}
              {Parse(descritption ?? '', {
                replace: processAnchorTagAndEmoji
              })}
            </p>
          </div>
        </div>
        <div className={classes.photoGrid}>
          {members.slice(0, isMobile ? 12 : 9).map((member, index) => (
            <UserImage key={`${index}.${member.profileId}`} member={member} />
          ))}
        </div>
      </div>
      <div className={classes.footer}>
        <div className={classes.footerInfo}>
          {(city.name || isVirtual) && (
            <div className={classes.footerItem}>
              <FontAwesomeIcon icon={faLocationDot} />
              {cityLink}
            </div>
          )}
          {!!sector.length && (
            <div className={classes.footerItem}>
              <FontAwesomeIcon icon={faPieChart} />
              <span>Sector:</span>
              {sectorLinks}
            </div>
          )}
          {stage.name && (
            <div className={classes.footerItem}>
              <FontAwesomeIcon icon={faArrowTrendUp} />
              <span>Stage:</span>
              {stageLink}
            </div>
          )}
          {joinType && (
            <div className={classes.footerItem}>
              <FontAwesomeIcon icon={faKey} />
              {joinType}
            </div>
          )}
        </div>
        <div className={classes.footerBtnContainer}>
          <GroupButton
            groupId={id}
            isPrivate={isPrivate}
            isInviteRequested={isInviteRequested}
            isJoined={isJoined}
            joinType={joinType}
            joinGroup={handleJoinGroup}
          />
        </div>
      </div>
    </Card>
  );
};

const UserImage = ({member}: {member: memberType}) => {
  const [err, setErr] = useState(false);
  const {path, alt} = badgeMapping[member.badge] ?? {};
  return err ? (
    <div className={clsx([classes.gridImg, 'text-center pt-2'])}>
      <FontAwesomeIcon icon={faUser} size="3x" />
    </div>
  ) : (
    <div className={classes.gridImg}>
      <Image
        alt={alt ?? ''}
        src={member.avatarUrl}
        className={classes.userImg}
        sizes="(min-height: 0px) 200px"
        fill
        onError={() => {
          setErr(true);
        }}
      />
      {path && (
        <Image
          src={`/images/${badgeMapping[member.badge]?.path}`}
          alt={badgeMapping[member.badge]?.alt ?? ''}
          width={BADGE_WIDTH}
          height={BADGE_HEIGHT}
          className={classes.badge}
        />
      )}
    </div>
  );
};
