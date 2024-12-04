import React, {
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  useEffect,
  useState
} from 'react';
import classes from './popover.module.scss';
import {OverlayTrigger, Popover as PopoverBS} from 'react-bootstrap';
import {OverlayTriggerType} from 'react-bootstrap/esm/OverlayTrigger';
import clsx from 'clsx';
import {Placement} from 'react-bootstrap/esm/types';

export type PopoverPlacement = Placement;

export interface PopoverProps {
  placement?: Placement;
  children: ReactElement<any, string | JSXElementConstructor<any>>;
  popover?: ReactNode;
  mode?: 'hover' | 'click';
  hideArrow?: boolean;
  hideOnBlur?: boolean;
  showDropdown?: boolean;
  popoverClass?: string;
  show?: boolean;
  setShow?: React.Dispatch<React.SetStateAction<boolean>>;
  flatTop?: boolean;
  fixedPosition?: boolean;
  forceClose?: boolean;
  closeOnClick?: boolean;
  offset?: number[];
  container?: any;
  flip?: boolean;
}

export const Popover = ({
  placement = 'bottom',
  children,
  popover,
  mode = 'click',
  hideArrow = false,
  hideOnBlur = false,
  showDropdown = false,
  popoverClass = '',
  show: showProp,
  setShow: setShowProp,
  flatTop = false,
  fixedPosition = false,
  forceClose = false,
  closeOnClick = false,
  offset,
  container,
  flip
}: PopoverProps) => {
  const [showInternal, setShowInternal] = useState(false);
  let show = showProp ?? showInternal,
    setShow = setShowProp ?? setShowInternal;
  let hoverProps = {};
  let clickProps = {};
  let trigger;
  if (mode === 'hover') {
    trigger = ['hover', 'focus'];
    hoverProps = {
      onMouseEnter: () => setShow(true),
      onMouseLeave: () => setShow(false)
    };
  } else if (mode === 'click') {
    trigger = 'click';
    clickProps = {
      onClick: () => {
        if (popover) {
          children.props.onClick?.();
          setShow(v => !v);
        }
      }
    };
  }
  useEffect(() => {
    if (!forceClose && show) {
      setShow(false);
    }
  }, [forceClose, mode]);

  const backdrop =
    !forceClose && show && hideOnBlur && !container ? (
      <div
        onClick={() => setShow(false)}
        onKeyDown={() => setShow(false)}
        onScroll={e => e.preventDefault()}
        className={clsx([classes.backdrop, 'offcanvas-backdrop show fade'])}
      />
    ) : (
      <></>
    );

  return (
    <>
      <OverlayTrigger
        placement={placement}
        overlay={
          popover ? (
            <PopoverBS
              className={clsx([
                hideArrow && classes.hideArrow,
                popoverClass,
                flatTop && classes.flatTop,
                'container-border'
              ])}
              onClick={closeOnClick ? () => setShow(false) : undefined}
              {...hoverProps}
            >
              {popover}
            </PopoverBS>
          ) : (
            <></>
          )
        }
        flip={flip}
        container={container}
        show={!forceClose && show}
        trigger={trigger as OverlayTriggerType}
        popperConfig={
          fixedPosition
            ? {
                strategy: 'fixed',
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset
                    }
                  }
                ]
              }
            : undefined
        }
      >
        {React.cloneElement(children, {
          ...hoverProps,
          ...clickProps,
          ...{
            className: clsx([
              showDropdown && classes.dropdown,
              show && classes.show,
              children.props.className
            ])
          }
        })}
      </OverlayTrigger>
      {backdrop}
    </>
  );
};
