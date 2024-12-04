import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEllipsis} from '@fortawesome/free-solid-svg-icons';
import classes from './icons.module.scss';

interface EllipsisPropsType {
  count?: number | string;
}

export const EllipsisIcon: React.FC<EllipsisPropsType> = ({
  count,
  ...props
}: EllipsisPropsType) => {
  return (
    <>
      <FontAwesomeIcon
        className={classes.ellipsis}
        icon={faEllipsis}
        size="xl"
        {...props}
      />
      {count !== undefined && <span>{count}</span>}
    </>
  );
};
