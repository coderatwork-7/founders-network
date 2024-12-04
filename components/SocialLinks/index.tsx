import React from 'react';

import styles from './SocialLinks.module.scss';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import {
  faAngellist,
  faFacebookF,
  faLinkedinIn,
  faXTwitter
} from '@fortawesome/free-brands-svg-icons';

export interface ISocialLinks {
  angelListUrl: string;
  facebookUrl: string;
  linkedInUrl: string;
  twitterUrl: string;
}

interface IProps {
  socialLinks: ISocialLinks;
}

const SocialLinksMapping: any = {
  twitter: faXTwitter,
  linkedin: faLinkedinIn,
  angelList: faAngellist,
  facebook: faFacebookF
};

export const SocialLInks: React.FC<IProps> = props => {
  const {socialLinks} = props;

  return (
    <div className={styles.SocialLinks}>
      {socialLinks &&
        Object?.entries(socialLinks)?.map(link => {
          if (link[1])
            return (
              <a
                key={`k-${link[1]}`}
                href={link[1]}
                className={styles.link}
                target="_blank"
              >
                <FontAwesomeIcon icon={SocialLinksMapping[link[0]]} />
              </a>
            );
        })}
    </div>
  );
};

export default SocialLInks;
