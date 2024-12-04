import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircle} from '@fortawesome/free-solid-svg-icons';
import {IconProp} from '@fortawesome/fontawesome-svg-core';
const faCircleDS = faCircle as IconProp;

export const CircleIcon: React.FC<any> = ({...props}) => {
  return <FontAwesomeIcon icon={faCircle} {...props} />;
};
