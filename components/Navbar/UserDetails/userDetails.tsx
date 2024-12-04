import React from 'react';
import classes from './userDetails.module.scss';
import Link from 'next/link';
import {signOut} from 'next-auth/react';
import Avatar from '@/ds/Avatar/avatar';
import {Session} from 'next-auth';
import {ROLES, UserMenu, UserMenuHrefs} from '@/utils/common/constants';

interface SearchBarProps {
  user: Session['user'];
  close: () => void;
}
const allAllowed = Object.values(ROLES).reduce(
  (acc, role) => Object.assign(acc, {[role]: true}),
  {}
);

const allNotAllowed = Object.values(ROLES).reduce(
  (acc, role) => Object.assign(acc, {[role]: false}),
  {}
);

const allowed: Record<string, any> = {
  PROFILE: {...allAllowed},
  SETTINGS: {...allAllowed},
  NOMINATE: {...allNotAllowed, [ROLES.INVESTOR]: true},
  LOGOUT: {...allAllowed},
  COMMAND_CONTROL: {...allNotAllowed, [ROLES.ADMIN]: true, newTab: true},
  METRICS: {...allNotAllowed, [ROLES.ADMIN]: true, newTab: true},
  FEEDBACKS: {...allNotAllowed, [ROLES.ADMIN]: true},
  EMAIL_CENTER: {...allNotAllowed, [ROLES.ADMIN]: true, newTab: true},
  MODERATION_QUEUE: {...allNotAllowed, [ROLES.ADMIN]: true, newTab: true},
  ADMIN_SETTINGS: {...allNotAllowed, [ROLES.ADMIN]: true, newTab: true},
  OBJECTIVES_MATCH: {...allNotAllowed, [ROLES.ADMIN]: true, newTab: true}
};

export const UserDetails = ({user, close}: SearchBarProps) => {
  let role = user.role;
  if (!(role in allAllowed)) {
    role = ROLES.INVESTOR;
  }

  return (
    <div className={classes.userDetailsContainer}>
      <Link
        href={
          role === ROLES.INVESTOR ? '/investor' : `/profile/${user.profileId}`
        }
        className={classes.userImageLink}
      >
        <Avatar altText={user.name} avatarUrl={user.avatarUrl} size="lg" />
      </Link>
      <div className={classes.userInfo}>
        {user.name && (
          <div className={classes.userName}>
            <Link href={`/profile/${user.profileId}`}>{user.name}</Link>
          </div>
        )}
        <div className={classes.userTitle}>{user.title}</div>
        <Link
          className={classes.userCompany}
          href={`/company/${user.company_id}/`}
        >
          {user.company_name}
        </Link>
      </div>
      <ul className={classes.userActionsList} onClick={close}>
        {Object.entries(UserMenu).map(
          ([key, displayName]) =>
            allowed[key][role] && (
              <>
                <li key={`${key}-${displayName}`}>
                  {key === 'LOGOUT' ? (
                    <span onClick={() => signOut({callbackUrl: '/home'})}>
                      {displayName}
                    </span>
                  ) : (
                    user?.role !== ROLES.GUEST && (
                      <Link
                        legacyBehavior
                        href={
                          key === 'PROFILE'
                            ? `/profile/${user.profileId}`
                            : key === 'SETTINGS'
                            ? {pathname: '/settings', query: {tab: 'profile'}}
                            : UserMenuHrefs[key]
                        }
                      >
                        {allowed[key]['newTab'] ? (
                          <a target="_blank">{displayName} </a>
                        ) : (
                          displayName
                        )}
                      </Link>
                    )
                  )}
                </li>
                {key === 'LOGOUT' && <hr className="my-0" />}
              </>
            )
        )}
        {(user?.role === ROLES.MEMBER || user?.role === ROLES.CHARTER) &&
          user?.paymentPlan !== 'lifetime' && (
            <li key={user.id}>
              <Link href="/raise?stage=" className={classes['upgradeLink']}>
                Upgrade
              </Link>
            </li>
          )}
      </ul>
    </div>
  );
};
