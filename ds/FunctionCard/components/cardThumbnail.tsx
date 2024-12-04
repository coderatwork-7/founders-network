import React, {MouseEvent} from 'react';
import {CardImg} from 'react-bootstrap';
import classes from '../functionCard.module.scss';
import {CardBadges} from './cardBadges';
import classNames from 'classnames';
import {IconWrapper} from '@/ds/Icons';
import {faPlayCircle} from '@fortawesome/free-regular-svg-icons';
import Link from 'next/link';

interface CardThumbnailProps {
  imageSrc?: string;
  altText?: string;
  videoLink?: string;
  eventBadge?: string[];
  handleVideoModal?: (
    event: MouseEvent<HTMLDivElement>,
    videoLink: string
  ) => void;
  handleThumbnailClick: () => void;
  bannerLink?: string;
}

export const CardThumbnail: React.FC<CardThumbnailProps> = ({
  imageSrc,
  altText,
  videoLink,
  eventBadge = [],
  handleVideoModal,
  handleThumbnailClick,
  bannerLink
}) => {
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (videoLink) {
      handleVideoModal?.(event, videoLink);
    } else {
      handleThumbnailClick();
    }
  };

  const overlayClass = classNames(
    'position-absolute',
    'w-100',
    'd-flex',
    classes.overlay
  );
  const thumbnailImageClass = classNames(classes['thumbnail-image']);
  const badgesClass = classNames(
    'position-absolute',
    'd-flex',
    'gap-2',
    classes.badges
  );

  return (
    <div
      className={classNames(
        'position-relative',
        classes['thumbnail-container']
      )}
    >
      <div onClick={handleClick}>
        {imageSrc &&
          (bannerLink ? (
            <Link href={bannerLink}>
              <CardImg
                width={'auto'}
                variant="top"
                src={imageSrc}
                alt={altText}
                className={thumbnailImageClass}
              />
            </Link>
          ) : (
            <CardImg
              width={'auto'}
              variant="top"
              src={imageSrc}
              alt={altText}
              className={thumbnailImageClass}
            />
          ))}
        {videoLink && (
          <div className={overlayClass}>
            <IconWrapper icon={faPlayCircle} />
          </div>
        )}
      </div>
      <div className={badgesClass}>
        {eventBadge.map((badgeName: string) => (
          <CardBadges key={badgeName} badgeName={badgeName} hrefLink="raise" />
        ))}
      </div>
    </div>
  );
};
