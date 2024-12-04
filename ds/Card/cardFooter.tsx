import classes from './cardFooter.module.scss';
export default function CardFooter({children}: any): JSX.Element {
  return <div className={classes.footer}>{children}</div>;
}
