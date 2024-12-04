import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEllipsisVertical} from '@fortawesome/free-solid-svg-icons';
import classes from './icons.module.scss';
import clsx from 'clsx';
interface VerticalEllipsisProps {
  count?: number | string;
}

export const VerticalEllipsisIcon: React.FC<VerticalEllipsisProps> = ({
  count,
  ...props
}: VerticalEllipsisProps) => {
  return (
    <>
      <FontAwesomeIcon
        icon={faEllipsisVertical}
        className={clsx(classes.icon, classes.verticalEllipsis)}
        // size="2xl"
        {...props}
      />
      {count !== undefined && <span>{count}</span>}
    </>
  );
};
