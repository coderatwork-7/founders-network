import classes from './cardHeader.module.scss';
import {
  TYPE_DEALS,
  TYPE_FORUMS,
  TYPE_MEMBERS,
  TYPE_GROUPS,
  TYPE_FUNCTIONS
} from '@/utils/common/commonTypes';
interface CardHeaderPropType {
  feedsType:
    | TYPE_DEALS
    | TYPE_FUNCTIONS
    | TYPE_FORUMS
    | TYPE_MEMBERS
    | TYPE_GROUPS;
  children: any;
  className?: string;
}
export default function CardHeader({
  feedsType,
  children,
  className
}: CardHeaderPropType): JSX.Element {
  return (
    <div
      className={`${classes.header} ${classes[feedsType + 'HeaderStyles']} ${
        className ? className : ''
      }`}
    >
      {children}
    </div>
  );
}
