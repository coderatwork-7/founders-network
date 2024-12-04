import React from 'react';

import styles from './PitchdeckEditor.module.scss';

interface IProps {}

export const PitchdeckEditor: React.FC<IProps> = props => {
  const {} = props;

  return <div className={styles.PitchdeckEditor}></div>;
};

export default PitchdeckEditor;
