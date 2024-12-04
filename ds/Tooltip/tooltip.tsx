import React, {JSXElementConstructor, ReactElement} from 'react';
import classes from './tooltip.module.scss';
import clsx from 'clsx';
import {Popover} from '../Popover';
import {PopoverProps} from '../Popover/popover';
import {
  FontAwesomeIcon,
  FontAwesomeIconProps
} from '@fortawesome/react-fontawesome';
import {faCircleQuestion} from '@fortawesome/free-solid-svg-icons';
import {DATA_ATTRIBS} from '@/utils/common/constants';

interface TooltipProps extends Omit<PopoverProps, 'children'> {
  children?: ReactElement<any, string | JSXElementConstructor<any>>;
  faIcon?: FontAwesomeIconProps['icon'];
  containerClass?: string;
}

export const Tooltip = ({
  popover,
  children,
  faIcon,
  mode = 'click',
  containerClass,
  ...props
}: TooltipProps) => {
  return (
    <Popover
      placement="bottom"
      fixedPosition
      mode={mode}
      hideOnBlur={mode === 'click'}
      popover={
        <div
          {...{[DATA_ATTRIBS.TOOLTIP]: true}}
          className={clsx([classes.tooltip, containerClass, 'text-light'])}
        >
          {popover}
        </div>
      }
      {...props}
      popoverClass={clsx(classes.popoverDark, props.popoverClass)}
    >
      {children ?? (
        <FontAwesomeIcon
          icon={faIcon ?? faCircleQuestion}
          className={classes.icon}
        />
      )}
    </Popover>
  );
};
