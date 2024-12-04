import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faXmark} from '@fortawesome/free-solid-svg-icons';
import {IconProp} from '@fortawesome/fontawesome-svg-core';
const faCloseDS = faXmark as IconProp;

export const CloseIcon: React.FC = props => {
  return <FontAwesomeIcon icon={faXmark} {...props} />;
};
