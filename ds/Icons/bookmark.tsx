import BookmarkSvg from '@/public/svgIcons/bookmark_Inactive.svg';
import classes from './icons.module.scss';
import Image from 'next/image';
interface BookmarkPropsType {
  count?: number | string;
}

export const BookmarkIcon: React.FC<BookmarkPropsType> = ({
  count
}: BookmarkPropsType) => {
  return (
    <>
      <Image src={BookmarkSvg} alt="not bookmarked" className={classes.icon} />
      {count && <span>{count}</span>}
    </>
  );
};
