import React from 'react';
import {Modal as RBModal, ModalProps as RBModalProps} from 'react-bootstrap';

export interface ModalProps extends RBModalProps {
  children?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({children, ...props}) => {
  return <RBModal {...props}>{children}</RBModal>;
};
