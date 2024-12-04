import React from 'react';
import {
  Spinner as RBSpinner,
  SpinnerProps as RBSpinnerProps
} from 'react-bootstrap';

export const Spinner: React.FC<RBSpinnerProps> = props => {
  return <RBSpinner animation="border" {...props} />;
};
