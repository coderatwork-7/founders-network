import PrivateCommentSvg from '@/public/svgIcons/Private_Reply.svg';
import classes from './icons.module.scss';
import Image from 'next/image';
import {MouseEventHandler} from 'react';
import clsx from 'clsx';
interface PrivateCommentPropsType {
  count?: number | string;
  onClick?: MouseEventHandler<HTMLSpanElement>;
  size?: 'sm' | 'lg';
}

export const CommentsIcon: React.FC<PrivateCommentPropsType> = ({
  count,
  onClick,
  size = 'sm'
}: PrivateCommentPropsType) => {
  return (
    <span className="d-flex gap-2 align-items-center" onClick={onClick}>
      <Image
        src={PrivateCommentSvg}
        alt="private comment"
        className={clsx([classes.icon, size === 'lg' && classes.iconLarge])}
      />
      {count && <span>{count}</span>}
    </span>
  );
};
