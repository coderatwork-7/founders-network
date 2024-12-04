import React from 'react';
import {
  Button as RBButton,
  ButtonProps as RBButtonProps
} from 'react-bootstrap';
import classes from './button.module.scss';
import clsx from 'clsx';
import useIsMobile from '@/utils/common/useIsMobile';
import {Spinner} from '../Spinner';

export enum ButtonVariants {
  Primary = 'primary',
  Secondary = 'secondary',
  Tertiary = 'tertiary',
  Success = 'success',
  Warning = 'warning',
  Danger = 'danger',
  Info = 'info',
  Light = 'light',
  Dark = 'dark',
  OutlinePrimary = 'outline-primary',
  OutlineSecondary = 'outline-secondary',
  OutlineTertiary = 'outline-tertiary',
  OutlineSuccess = 'outline-success',
  OutlineWarning = 'outline-warning',
  OutlineDanger = 'outline-danger',
  OutlineInfo = 'outline-info',
  OutlineLight = 'outline-light',
  OutlineDark = 'outline-dark',
  OutlinePrimaryInherit = 'outline-primary-inherit',
  SquarePrimary = 'square-primary',
  CardPrimary = 'card-primary',
  BluePrimary = 'blue-primary',
  Modal = 'modal',
  Default = 'default',
  TEXT_ONLY = 'text-only'
}

export interface ButtonProps extends RBButtonProps {
  children?: React.ReactNode;
  textUppercase?: boolean;
  variant?: ButtonVariants;
  subVariant?: string;
  className?: string;
  size?: 'sm' | 'lg';
  loading?: boolean;
  colorClass?: string;
  loadingChildren?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  subVariant,
  className,
  size,
  loading = false,
  loadingChildren,
  textUppercase,
  colorClass,
  variant = ButtonVariants.Primary,
  ...props
}) => {
  const isMobile = useIsMobile();
  return (
    <RBButton
      className={clsx(
        classes.button,
        isMobile && classes.mobile,
        classes[variant],
        classes[subVariant ?? ''],
        size && classes[`btn-${size}`],
        className,
        textUppercase && 'text-uppercase',
        colorClass && classes[colorClass]
      )}
      {...props}
    >
      {loading ? (
        <>
          <Spinner size="sm" className="me-1" />
          {loadingChildren ?? children}
        </>
      ) : (
        children
      )}
    </RBButton>
  );
};
