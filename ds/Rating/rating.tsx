import clsx from 'clsx';
import React, {useState} from 'react';
import classes from './rating.module.scss';
import {Rating as RatingBS, RatingProps} from 'react-simple-star-rating';

export enum RatingTextPos {
  Top = 'top',
  Bottom = 'bop',
  None = 'none'
}

export const RatingText: {[key: number]: string} = {
  0: 'Not Rated Yet',
  1: 'Highly Not Recommended',
  2: 'Not Recommended',
  3: 'Recommended with Reservation',
  4: 'Recommended',
  5: 'Highly Recommended'
};

interface RatingDSProps extends RatingProps {
  rating: number;
  ratingTextPosition?: RatingTextPos;
  containerClass?: string;
  ratingTextClass?: string;
  onClick: (v: number) => void;
  showNumWithText?: boolean;
  staticDisplay?: boolean;
  SVGclassName?: string;
  iconsCount?: number;
  labels?: string[];
}

const getRatingText = (
  ratingFloat: number,
  showNum: boolean,
  labels?: string[]
) => {
  const rating = Math.round(ratingFloat);
  const label = labels?.[rating] ?? RatingText[rating];
  return showNum && rating ? `(${rating}) ${label}` : label;
};

export const Rating: React.FC<RatingDSProps> = ({
  rating,
  ratingTextPosition = RatingTextPos.Bottom,
  SVGstorkeWidth,
  fillColor,
  emptyColor,
  SVGstrokeColor,
  transition,
  tooltipClassName,
  size,
  onClick = v => {},
  containerClass,
  ratingTextClass,
  showNumWithText = false,
  staticDisplay = false,
  SVGclassName,
  iconsCount = 5,
  labels,
  ...props
}) => {
  const [ratingText, setRatingText] = useState<string>(
    getRatingText(rating, showNumWithText, labels)
  );

  return (
    <div className={clsx([classes.rating, containerClass])}>
      {ratingTextPosition === RatingTextPos.Top && (
        <div className={clsx([classes.ratingText, ratingTextClass])}>
          {ratingText}
        </div>
      )}
      <RatingBS
        iconsCount={iconsCount}
        SVGclassName={SVGclassName}
        readonly={staticDisplay}
        SVGstorkeWidth={SVGstorkeWidth ?? 1.5}
        fillColor={fillColor ?? '#99cccc'}
        SVGstrokeColor={SVGstrokeColor ?? '#99cccc'}
        emptyColor={emptyColor ?? '#fff'}
        transition={transition ?? true}
        tooltipClassName={clsx([classes.ratingText, tooltipClassName])}
        onClick={v => {
          onClick(v);
          setRatingText(getRatingText(v, showNumWithText, labels));
        }}
        onPointerMove={v => {
          if (ratingText !== getRatingText(v, showNumWithText, labels))
            setRatingText(getRatingText(v, showNumWithText, labels));
        }}
        onPointerLeave={e => {
          if (e.pointerType === 'mouse')
            setRatingText(getRatingText(rating, showNumWithText, labels));
        }}
        size={size ?? 34}
        allowFraction
        initialValue={rating}
        {...props}
      />
      {ratingTextPosition === RatingTextPos.Bottom && (
        <div className={clsx([classes.ratingText, ratingTextClass])}>
          {ratingText}
        </div>
      )}
    </div>
  );
};
