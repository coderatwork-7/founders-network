import Image from 'next/image';
import classes from './searchItem.module.scss';
import Link from 'next/link';
import parse from 'html-react-parser';
import clsx from 'clsx';

interface SearchItemProps {
  img?: string;
  title: string;
  sub1?: string;
  sub2?: string;
  url: string;
}

export const SearchItem: React.FC<SearchItemProps> = ({
  url,
  img,
  title,
  sub1,
  sub2
}: SearchItemProps) => {
  return (
    <Link href={url}>
      <li className={clsx([classes.searchItem, 'clearfix'])}>
        <div className={classes.imgContainer}>
          {img && <Image src={img} alt="" width={50} height={50} />}
        </div>
        <div className={classes.details}>
          <span className={classes.title}>{parse(title)}</span>
          {sub1 && <span className={classes.info}>{sub1}</span>}
          {sub2 && <span className={classes.info}>{sub2}</span>}
        </div>
      </li>
    </Link>
  );
};
