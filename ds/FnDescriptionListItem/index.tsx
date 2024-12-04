import React from 'react';

import styles from './FnDescriptionListItem.module.scss';
import clsx from 'clsx';

interface IProps {
  leadingIcon?: any;
  trailingIcon?: any;
  title: string;
  success?: boolean;
  error?: boolean;
  titleColor?: string;
  description?: string | number;
  descriptionColor?: string;
  number?: boolean;
  url?: boolean;
}

export const FnDescriptionListItem: React.FC<IProps> = props => {
  const {
    title,
    titleColor,
    description,
    descriptionColor,
    error,
    success,
    leadingIcon,
    trailingIcon,
    number,
    url
  } = props;

  const dtStyles = {
    color: titleColor
  };
  const ddStyles = {
    color: descriptionColor
  };

  const dtClassname = clsx(styles.dt, {
    [styles.error]: error,
    [styles.success]: success
  });
  const ddClassname = clsx({[styles.error]: error, [styles.success]: success});

  return (
    <div className={styles.FnDescriptionListItem}>
      <dt className={dtClassname} style={dtStyles}>
        {title}
      </dt>
      <div className={styles.descriptionContainer}>
        {leadingIcon}
        <dd className={ddClassname} style={ddStyles}>
          {number ? (
            description?.toLocaleString()
          ) : url && description ? (
            <a href={description as string} target="_blanks">
              {description}
            </a>
          ) : (
            description
          )}
        </dd>
        {trailingIcon}
      </div>
    </div>
  );
};

export default FnDescriptionListItem;
