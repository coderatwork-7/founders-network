import React, {ForwardedRef, useState} from 'react';
import {
  FloatingLabel as RBFloatingLabel,
  Form as RBForm,
  FormControlProps as RBFormControlProps
} from 'react-bootstrap';
import {BsPrefixRefForwardingComponent} from 'react-bootstrap/helpers';

import classes from './formControl.module.scss';

export interface FormControlProps extends RBFormControlProps {
  message?: string;
  required?: boolean;
  showLabel?: string;
  hideLabel?: string;
  floatingLabel?: boolean;
}

function getFormControl(
  props: FormControlProps,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  const [showPassword, setShowPassword] = useState(false);

  // TODO Please be careful when using the remaining parameters to avoid that the prop
  //  passed in the outer layer is deconstructed and cannot be passed in,
  //  such as className!!!! (commit id: d02f3d3319bd9e819c35a508951b356452551206)
  const {
    showLabel,
    hideLabel,
    type,
    placeholder,
    floatingLabel,
    ...remainingProps
  } = {
    ...props
  };

  delete remainingProps.message;

  return (
    <>
      <RBForm.Control
        type={type === 'password' && showPassword ? 'text' : type}
        placeholder={floatingLabel === false ? placeholder : ' '}
        {...remainingProps}
        ref={ref}
        className={classes['form-control']}
      />
      <span className="input-icon" />
      {type === 'password' ? (
        <span
          className="show-button"
          tabIndex={0}
          onKeyPress={() => setShowPassword(!showPassword)}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? hideLabel : showLabel}
        </span>
      ) : (
        ''
      )}
    </>
  );
}

export const FormControl: BsPrefixRefForwardingComponent<
  'input',
  FormControlProps
> = React.forwardRef((props, ref: ForwardedRef<HTMLInputElement>) => {
  return (
    <>
      {props.floatingLabel === false ||
      props.type === 'color' ||
      props.type === 'file' ? (
        <div className={classes['input-wrapper']}>
          {getFormControl(props, ref)}
        </div>
      ) : (
        <RBFloatingLabel label={props.placeholder}>
          {getFormControl(props, ref)}
        </RBFloatingLabel>
      )}
      {props.message && (
        <RBForm.Label className={props.isInvalid ? ' is-invalid' : ''}>
          {props.message}
        </RBForm.Label>
      )}
    </>
  );
});
