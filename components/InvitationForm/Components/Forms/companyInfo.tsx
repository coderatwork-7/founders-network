import {useFormContext} from 'react-hook-form';
import FNInput from '@/ds/FNInput';

import styles from './CompanyInfo.module.scss';

interface IProps {}
export const CompanyInfo: React.FC<IProps> = () => {
  const {
    formState: {errors}
  } = useFormContext();

  return (
    <div className={styles.CompanyInfo}>
      <div className={styles.inputSection}>
        <h2>Company info</h2>
        <div>
          <div className={styles.inputSection}>
            <FNInput
              name="company.startUpName"
              type="text"
              placeholder="Company name"
              topLeftRounded
              topRightRounded
              required
            />
            <FNInput
              name="company.website"
              type="url"
              inputMode="url"
              placeholder="Website"
              borderTop={false}
              required={false}
            />
            <FNInput
              name="company.companyAddress"
              placeholder="Street address"
              borderTop={false}
              required
            />
            <div className={styles.inputRow}>
              <FNInput
                name="company.city"
                placeholder="City"
                borderTop={false}
                required
              />
              <FNInput
                name="company.state"
                placeholder="State or province"
                borderTop={false}
                borderLeft={false}
                required
              />
            </div>
            <div className={styles.inputRow}>
              <FNInput
                name="company.country"
                placeholder="Country or region"
                borderTop={false}
                bottomLeftRounded
                required
              />
              <FNInput
                name="company.zipCode"
                inputMode="numeric"
                placeholder="Postal code"
                borderTop={false}
                borderLeft={false}
                bottomRightRounded
                required
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
