import CommentSvg from '@/public/svgIcons/Reply.svg';
import classes from './icons.module.scss';
import Image from 'next/image';
import {MouseEventHandler} from 'react';
import clsx from 'clsx';
interface CommentPropsType {
  count?: number | string;
  onClick?: MouseEventHandler<HTMLSpanElement>;
  size?: 'sm' | 'lg';
}

export const CommentIcon: React.FC<CommentPropsType> = ({
  count,
  onClick,
  size = 'sm'
}: CommentPropsType) => {
  return (
    <span className="d-flex gap-2 align-items-center" onClick={onClick}>
      <Image
        src={CommentSvg}
        alt="Comment Icon"
        className={clsx([classes.icon, size === 'lg' && classes.iconLarge])}
      />
      {count && <span>{count}</span>}
    </span>
  );
};
