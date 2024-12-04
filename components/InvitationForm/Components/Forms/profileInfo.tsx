import React from 'react';

import styles from './profileInfo.module.scss';

import FNInput from '@/ds/FNInput';
import clsx from 'clsx';
import FnPhoneInput from '@/ds/FnPhoneInput';

export type PageProps = Readonly<{
  className?: string;
}>;

export function ProfileInfo({}: PageProps) {
  return (
    <div className={clsx(styles.ProfileInfo)}>
      <div className={styles.inputSection}>
        <h2>Personal info</h2>
        <div>
          <div className={styles.inputRow}>
            <FNInput
              name="profile.firstName"
              placeholder="First name"
              type="text"
              topLeftRounded
              required
            />
            <FNInput
              name="profile.lastName"
              placeholder="Last name"
              type="text"
              topRightRounded
              borderLeft={false}
              required
            />
          </div>
          <FNInput
            name="profile.email"
            inputMode="email"
            placeholder="Email"
            type="text"
            borderTop={false}
            required
            isEmail
          />

          <FnPhoneInput
            inputMode="tel"
            name="profile.phoneNumber"
            bottomLeftRounded
            bottomRightRounded
            borderTop={false}
            required
            placeholder="Phone"
          />
        </div>
      </div>
    </div>
  );
}
