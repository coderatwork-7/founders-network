import clsx from 'clsx';
import classes from './cardContent.module.scss';
interface CardContentPropTypes {
  children: any;
  className?: string;
}
export default function CardContent({
  children,
  className
}: CardContentPropTypes): JSX.Element {
  return <div className={clsx(classes.content, className)}>{children}</div>;
}
