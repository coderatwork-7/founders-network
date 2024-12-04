import {useState} from 'react';

import styles from './billingTab.module.scss';

import FnText from '@/ds/FnText';
import BillingPaymentMethodTab from '@/components/BillingPaymentMethodTab';
import FnTabNavigation from '@/ds/FNTabNavigation';

import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const StripeCustomerPortalButton = () => (
  <div className={styles.buttonContainer}>
    Stripe customer portal
    <OpenInNewIcon />
  </div>
);

export const BillingTab = () => {
  const billingSections = [
    {displayName: 'Payment method', tab: 'paymentMethod'},
    {displayName: <StripeCustomerPortalButton />, tab: 'stripe', external: true}
  ];

  const [activeTab, setActiveTab] = useState('paymentMethod');

  const handleOpenStripePortal = () => {
    setActiveTab('paymentMethod');
    window.open('https://billing.stripe.com/p/login/aEU2bf8Mrg4o19u7ss');
  };

  const displayActiveTab = () => {
    switch (activeTab) {
      case 'paymentMethod':
        return <BillingPaymentMethodTab />;
      case 'stripe':
        handleOpenStripePortal();
      default:
        return <BillingPaymentMethodTab />;
    }
  };
  return (
    <div className={styles.billingSettings}>
      <FnText type="heading-xl" bold>
        Billing
      </FnText>
      <FnTabNavigation
        tabs={billingSections}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className={styles.activeTabContainer}>{displayActiveTab()}</div>
    </div>
  );
};
