import React from 'react';

import styles from './FnRangeSlider.module.scss';

interface IProps {
  name: string;
  min?: number;
  max?: number;
  minValue: number;
  maxValue: number;
  label?: string;
}

export const FnRangeSlider: React.FC<IProps> = props => {
  const {name, label, min = 0, minValue, max = 100, maxValue} = props;

  return (
    <div className={styles.FnRangeSlider}>
      {label && <label htmlFor={name}>{label}</label>}
      <div className={styles.sliderContainer}>
        <input
          type="range"
          min={min}
          max={max}
          defaultValue={min}
          className={styles.minSlider}
        />
        <input
          type="range"
          min={min}
          max={max}
          defaultValue={max}
          className={styles.maxSlider}
        />
      </div>
    </div>
  );
};

export default FnRangeSlider;
