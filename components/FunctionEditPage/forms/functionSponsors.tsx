import classes from './functionEditforms.module.scss';
import {FunctionEditor} from '../components/FunctionEditor/functionEditor';
import clsx from 'clsx';

interface FunctionSponsors {
  data: string;
  setData: React.Dispatch<React.SetStateAction<string>>;
}

export const FunctionSponsors: React.FC<FunctionSponsors> = ({
  data,
  setData
}) => {
  return (
    <div className={classes.form}>
      <div className={classes.field}>
        <div className={clsx(classes.label, 'mb-3')}>
          Sponsors Rich Text Field
        </div>

        <div className={classes.editorContainer}>
          <FunctionEditor value={data} onContentChange={setData} />
        </div>
      </div>
    </div>
  );
};
