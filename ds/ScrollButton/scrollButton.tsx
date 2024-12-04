import {IconDefinition, faAngleUp} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useEffect, useState} from 'react';
import classes from './scrollButton.module.scss';
import clsx from 'clsx';

interface IconPropType {
  icon?: IconDefinition;
  iconClassName?: string;
}

interface ScrollButtonPropsType {
  alwaysVisible?: boolean;
  scrollVisibleHeight?: number;
  scollClassName?: string;
  iconProp?: IconPropType;
}

export const ScrollButton = ({
  alwaysVisible,
  scrollVisibleHeight,
  scollClassName,
  iconProp
}: ScrollButtonPropsType) => {
  const [scrollBool, setScrollBool] = useState<boolean>(false);

  const handleScrollOnClick = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  };

  const handleScroll = () => {
    const scrollThreshold = scrollVisibleHeight || window.innerHeight;
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    if (scrollY >= scrollThreshold) {
      setScrollBool(true);
    } else {
      setScrollBool(false);
    }
  };

  useEffect(() => {
    if (!alwaysVisible || !scrollVisibleHeight)
      window.addEventListener('scroll', handleScroll);
  }, [scrollBool]);

  return (
    <div>
      {(alwaysVisible || scrollBool) && (
        <div
          className={clsx(classes['scrollButton'], scollClassName)}
          onClick={handleScrollOnClick}
        >
          <FontAwesomeIcon
            className={clsx(classes['iconStyles'], iconProp?.iconClassName)}
            icon={iconProp?.icon ?? faAngleUp}
          />
        </div>
      )}
    </div>
  );
};
