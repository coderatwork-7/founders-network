import clsx from 'clsx';
import classes from '../invitationForm.module.scss';
import Image from 'next/image';
import {Spinner} from '@/ds/Spinner';

export function TestimonialCard({
  avatarUrl,
  text,
  className,
  author,
  authorCompany,
  loading,
  title
}: Readonly<{
  avatarUrl: string;
  text: string;
  className: string;
  author: string;
  authorCompany: string;
  loading: boolean;
  title: string;
}>) {
  return (
    <div className={clsx('container-border bg-white', classes.card, className)}>
      {loading ? (
        <div className="text-center">
          <Spinner size="sm" />
        </div>
      ) : (
        <>
          <Image
            src={avatarUrl}
            alt="testimonial user"
            width={50}
            height={50}
            className={classes.avatar}
          ></Image>
          <p className={classes.text}>{text}</p>
          <div className={classes.author}>{author}</div>
          <div className={classes.authorCompany}>
            {title} of {authorCompany}
          </div>
        </>
      )}
    </div>
  );
}
