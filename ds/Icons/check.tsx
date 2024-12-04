import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck} from '@fortawesome/free-solid-svg-icons';
import {IconProp} from '@fortawesome/fontawesome-svg-core';
const faCheckDS = faCheck as IconProp;

export const CheckIcon: React.FC<any> = ({...props}): any => {
  return <FontAwesomeIcon icon={faCheck} {...props} />;
};
