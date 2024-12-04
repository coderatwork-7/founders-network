import React, {useState} from 'react';
import {IconWrapper} from '../Icons';
import {IconProp} from '@fortawesome/fontawesome-svg-core';

import classes from './actionButton.module.scss';
import clsx from 'clsx';

interface ActionButtonProps {
  icon: IconProp;
  iconFilled?: IconProp;
  count?: number;
  handleCount?: boolean;
  onClick: () => void;
  isSelected?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  iconFilled,
  count,
  handleCount = false,
  isSelected = false,
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selected, setSelected] = useState(isSelected);
  const [currentCount, setCurrentCount] = useState(count || 0);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = () => {
    onClick();

    if (count !== undefined && handleCount) {
      if (selected) {
        setCurrentCount(prevCount => prevCount - 1);
      } else {
        setCurrentCount(prevCount => prevCount + 1);
      }
    }

    iconFilled && setSelected(prevSelected => !prevSelected);
  };

  return (
    <div
      className={clsx(classes.wrapper, 'd-flex gap-2')}
      role="button"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <IconWrapper
        icon={isHovered || selected ? iconFilled || icon : icon}
        className="fs-4"
      />
      {count !== undefined ? <div>{currentCount}</div> : null}
    </div>
  );
};
