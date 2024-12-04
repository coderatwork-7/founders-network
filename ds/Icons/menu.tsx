import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import {IconProp} from '@fortawesome/fontawesome-svg-core';
const faBarsDS = faBars as IconProp;

export const MenuIcon: React.FC = props => {
  return <FontAwesomeIcon icon={faBars} {...props} />;
};
