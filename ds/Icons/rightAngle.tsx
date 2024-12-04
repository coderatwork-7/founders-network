import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faAngleRight} from '@fortawesome/free-solid-svg-icons';
import {IconProp} from '@fortawesome/fontawesome-svg-core';
const faAngleRightDS = faAngleRight as IconProp;

export const RightAngleIcon: React.FC = props => {
  return <FontAwesomeIcon icon={faAngleRight} {...props} />;
};
