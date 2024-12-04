import React, {useState} from 'react';
import {Session} from 'next-auth';
import classes from './userMenu.module.scss';
import {UserDetails} from '@/components/Navbar/UserDetails';
import Avatar from '@/ds/Avatar/avatar';
import {Popover} from '@/ds/Popover';

interface UserMenuProps {
  user?: Session['user'];
}

export const UserMenu = ({user}: UserMenuProps) => {
  const [show, setShow] = useState(false);

  const showUserDetails = () => {
    setShow(false);
  };

  const userDetailsElem = user && (
    <div className={classes.userDetails}>
      <UserDetails user={user} close={showUserDetails} />
    </div>
  );

  return (
    <>
      {user && (
        <Popover
          popover={userDetailsElem}
          hideArrow={true}
          hideOnBlur={true}
          popoverClass={classes.popover}
          showDropdown
          mode="click"
          placement="bottom-end"
          show={show}
          setShow={setShow}
          fixedPosition
          offset={[0, -6]}
        >
          <div className={classes.userMenu}>
            <Avatar
              altText={user.name}
              avatarUrl={user.avatarUrl}
              size="sm"
              newDesign
              imageHeight={42}
              imageWidth={42}
            />
          </div>
        </Popover>
      )}
    </>
  );
};
