import clsx from 'clsx';
import classes from './functionEditforms.module.scss';
import {Checkbox, CheckboxSize} from '@/ds/Checkbox';
import {FunctionEditor} from '../components/FunctionEditor/functionEditor';
import {ChangeEvent} from 'react';

export interface FeaturedRemidersForm {
  enableDialIn: boolean;
  enable48Hours: boolean;
  enableSMS: boolean;
  hourText: string;
  smsText: string;
}

interface FeaturedRemidersProps {
  data: FeaturedRemidersForm;
  setData: React.Dispatch<React.SetStateAction<FeaturedRemidersForm>>;
}

export const FeaturedRemiders: React.FC<FeaturedRemidersProps> = ({
  data,
  setData
}) => {
  const updateData = (key: string, value: any) => {
    setData(prevData => ({...prevData, [key]: value}));
  };

  const handleChange = (name: string) => (value: any) => {
    updateData(name, value);
  };

  const handleChangeEvent = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value: inputValue, type, checked} = e.target;
    const value = type === 'checkbox' ? checked : inputValue;
    updateData(name, value);
  };

  return (
    <div className={classes.form}>
      <div className={classes.field}>
        <div className={classes.label}>Options</div>

        <Checkbox
          id="enableDialIn"
          name="enableDialIn"
          size={CheckboxSize.Small}
          checked={data.enableDialIn}
          onChange={handleChangeEvent}
          className={clsx(classes.checkbox, 'gap-2 my-3')}
        >
          <div className={classes.checkLabel}>Enable Dial In Reminder</div>
        </Checkbox>

        <Checkbox
          id="enable48Hours"
          name="enable48Hours"
          size={CheckboxSize.Small}
          checked={data.enable48Hours}
          onChange={handleChangeEvent}
          className={clsx(classes.checkbox, 'gap-2 my-3')}
        >
          <div className={classes.checkLabel}>Enable 48 Hours Reminder</div>
        </Checkbox>

        <Checkbox
          id="enableSMS"
          name="enableSMS"
          size={CheckboxSize.Small}
          checked={data.enableSMS}
          onChange={handleChangeEvent}
          className={clsx(classes.checkbox, 'gap-2 my-3')}
        >
          <div className={classes.checkLabel}>Enable SMS Reminder</div>
        </Checkbox>
      </div>

      <div className={classes.field}>
        <div className={classes.label}>48 Hours Reminder Text</div>

        <div className={classes.editorContainer}>
          <FunctionEditor
            value={data.hourText}
            onContentChange={handleChange('hourText')}
          />
        </div>
      </div>

      <div className={classes.field}>
        <div className={classes.label}>SMS Reminder Text</div>

        <div className={clsx(classes.fieldInput, classes.editorContainer)}>
          <input
            name="smsText"
            value={data.smsText}
            onChange={handleChangeEvent}
          />
        </div>
      </div>
    </div>
  );
};
