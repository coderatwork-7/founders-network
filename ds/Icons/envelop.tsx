import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEnvelope} from '@fortawesome/free-solid-svg-icons';
import {IconProp} from '@fortawesome/fontawesome-svg-core';
const faEnvelopeDS = faEnvelope as IconProp;

export const EnvelopIcon: React.FC = props => {
  return <FontAwesomeIcon icon={faEnvelope} {...props} />;
};
