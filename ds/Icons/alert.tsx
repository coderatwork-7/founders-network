import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBell} from '@fortawesome/free-solid-svg-icons';
import {IconProp} from '@fortawesome/fontawesome-svg-core';
const faBellDS = faBell as IconProp;

export const AlertIcon: React.FC = props => {
  return <FontAwesomeIcon icon={faBell} {...props} />;
};
