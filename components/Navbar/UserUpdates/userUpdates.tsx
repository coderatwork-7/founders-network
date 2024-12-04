import classes from './userUpdates.module.scss';
import {Notifications} from '@/components/Notifications';
import {ChatButton} from '@/components/ChatButton';

export const UserUpdates = () => {
  return (
    <div className={classes.userUpdates}>
      <ChatButton />
      <Notifications />
    </div>
  );
};
