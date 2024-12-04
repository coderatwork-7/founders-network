import React, {PropsWithChildren} from 'react';

import styles from './FnText.module.scss';
import clsx from 'clsx';

export type TFnText =
  | 'heading-xxSmall'
  | 'heading-xSmall'
  | 'heading-sm'
  | 'heading-md'
  | 'heading-lg'
  | 'heading-xl'
  | 'body'
  | 'legend'
  | 'link';

interface IProps extends PropsWithChildren {
  type?: TFnText;
  underline?: boolean;
  bold?: boolean;
  color?: 'red' | 'green' | 'white';
  className?: string;
  url?: string;
  italic?: boolean;
}

export const FnText: React.FC<IProps> = props => {
  const {bold, className, color, italic, type, underline, url, children} =
    props;

  const textClassname = clsx(
    styles.FnText,
    {
      [styles.underline]: underline,
      [styles.bold]: bold,
      [styles.italic]: italic,
      [styles.green]: color === 'green'
    },
    className
  );

  const textStyles = {
    color: color === 'red' ? 'red' : undefined
  };

  switch (type) {
    case 'heading-xl':
      return <h1 className={textClassname}>{children}</h1>;
    case 'heading-lg':
      return (
        <h2 className={textClassname} style={textStyles}>
          {children}
        </h2>
      );
    case 'heading-md':
      return (
        <h3 className={textClassname} style={textStyles}>
          {children}
        </h3>
      );
    case 'heading-sm':
      return (
        <h4 className={textClassname} style={textStyles}>
          {children}
        </h4>
      );
    case 'heading-xSmall':
      return (
        <h5 className={textClassname} style={textStyles}>
          {children}
        </h5>
      );
    case 'heading-xxSmall':
      return (
        <h6 className={textClassname} style={textStyles}>
          {children}
        </h6>
      );
    case 'body':
      return (
        <p className={textClassname} style={textStyles}>
          {children}
        </p>
      );
    case 'legend':
      return (
        <legend className={textClassname} style={textStyles}>
          {children}
        </legend>
      );
    case 'link':
      return (
        <a
          className={textClassname}
          style={textStyles}
          href={url}
          target="_blank"
        >
          {children}
        </a>
      );
    default:
      return (
        <p className={textClassname} style={textStyles}>
          {children}
        </p>
      );
  }
};

export default FnText;
