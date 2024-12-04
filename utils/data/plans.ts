export const SCALE = 'Scale';
export const LEAD = 'Lead';
export const LAUNCH = 'Launch';
export const LIFETIME = 'Lifetime';
export const CHARTER = 'Charter';
export const GUEST = 'Guest';

export type TPlan = 'SCALE' | 'LEAD' | 'LAUNCH' | 'LIFETIME';

export const plans = [
  {displayName: LAUNCH, tab: LAUNCH},
  {displayName: SCALE, tab: SCALE},
  {displayName: LEAD, tab: LEAD},
  {displayName: LIFETIME, tab: LIFETIME}
];

export const upgradePlans = [
  {displayName: SCALE, tab: SCALE},
  {displayName: LEAD, tab: LEAD},
  {displayName: LIFETIME, tab: LIFETIME}
];
