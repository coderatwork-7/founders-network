import clsx from 'clsx';
import classes from './functionEditforms.module.scss';
import {ChangeEvent, RefObject, useRef, useState} from 'react';
import {usePlacesWidget} from 'react-google-autocomplete';
import DatePicker from 'react-datepicker';
import {BasicSelect, SelectWithAdd} from '../components/ReactSelect';
import {Checkbox, CheckboxSize} from '@/ds/Checkbox';
import {FunctionEditor} from '../components/FunctionEditor/functionEditor';
import {LEAD, LIFETIME, PAYMENT_PLAN, SCALE} from '@/utils/common/constants';
import {SelectOptionsType} from '../hooks/useAdminFunctionTags';
import {setValueByKeyString} from '@/utils/common/helper';
import {ImageUpload} from '@/ds/ImageUpload';
import {SelectOptionType} from '../FunctionEditPage';

type FormSelectedValues = {
  tags?: SelectOptionType;
  chapter?: SelectOptionType;
  timezone?: SelectOptionType;
  stageGate?: SelectOptionType;
  functionType?: SelectOptionType;
  lockFunctionSubgroup?: SelectOptionType;
};

export interface FunctionDetailsForm {
  title: string;
  location: {
    address: string;
    chapter?: SelectOptionType;
    displayName: string;
  };
  timezone?: SelectOptionType;
  stageGate?: SelectOptionType;
  endDateTime: string;
  functionType?: SelectOptionType;
  onlineEvent: boolean;
  startDateTime: string;
  headerImageUrl: string;
  inPersonEvent: boolean;
  allowQuestions: boolean;
  directoryImageUrl: string;
  tags: SelectOptionType[];
  functionDescription: string;
  lockFunctionSubgroup?: SelectOptionType;
}

interface FunctionDetailsProps {
  tagsLoading: boolean;
  data: FunctionDetailsForm;
  chapterOptions: SelectOptionsType;
  timezoneOptions: SelectOptionsType;
  functionTagOptions: SelectOptionsType;
  functionTypeOptions: SelectOptionsType;
  functionSubgroupOptions: SelectOptionsType;
  handleFileUpload: (file: Blob) => Promise<any>;
  setData: React.Dispatch<React.SetStateAction<FunctionDetailsForm>>;
}

const stageOptions: SelectOptionsType = [
  {
    label: SCALE,
    value: PAYMENT_PLAN.ANGEL
  },
  {
    label: LEAD,
    value: PAYMENT_PLAN.SERIES_A
  },
  {
    label: LIFETIME,
    value: PAYMENT_PLAN.LIFETIME
  }
];

export const FunctionDetails: React.FC<FunctionDetailsProps> = ({
  data,
  setData,
  tagsLoading,
  chapterOptions,
  timezoneOptions,
  handleFileUpload,
  functionTagOptions,
  functionTypeOptions,
  functionSubgroupOptions
}) => {
  const endDateRef = useRef<any>(null);

  const ref = usePlacesWidget({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
    onPlaceSelected: place =>
      handleChange('location.address')(place.formatted_address)
  }).ref as RefObject<any>;

  const updateData = (key: string, value: any) => {
    setData(prevData =>
      key.includes('.')
        ? (setValueByKeyString(prevData, key, value) as FunctionDetailsForm)
        : {...prevData, [key]: value}
    );
  };

  const handleSelectChange = (name: string) => (option: any) => {
    updateData(name, option);
  };

  const handleChange = (name: string) => (value: any) => {
    updateData(name, value);
  };

  const handleDateChange = (isStart: boolean) => (value: Date | null) => {
    const startDateTimeKey = 'startDateTime';
    const endDateTimeKey = 'endDateTime';

    if (value) {
      if (isStart) {
        if (!data.endDateTime || new Date(data.endDateTime) < value) {
          updateData(endDateTimeKey, value.toString());
        }
        if (
          data.startDateTime &&
          new Date(data.startDateTime).toTimeString() !== value.toTimeString()
        )
          endDateRef.current.setFocus();
      }
      if (!data.startDateTime || new Date(data.startDateTime) > value) {
        updateData(startDateTimeKey, value.toString());
      }
    }

    updateData(
      isStart ? startDateTimeKey : endDateTimeKey,
      value ? value.toString() : value
    );
  };

  const handleChangeEvent = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value: inputValue, type, checked} = e.target;
    const value = type === 'checkbox' ? checked : inputValue;
    updateData(name, value);
  };

  return (
    <div className={classes.form}>
      <div className={classes.field}>
        <div className={classes.label}>
          Function Title<span className="text-danger">*</span>
        </div>

        <div className={clsx(classes.fieldInput, classes.editorContainer)}>
          <input
            name="title"
            value={data.title}
            required
            onChange={handleChangeEvent}
          />
        </div>
      </div>

      <div className={clsx(classes.field, 'd-flex gap-4')}>
        <div className={classes.sub3Field}>
          <div>
            <div className={classes.label}>Location Address</div>
            <div className={classes.fieldInput}>
              <input
                name="location.address"
                defaultValue={data.location.address}
                ref={ref}
                placeholder=""
                disabled={!data.inPersonEvent}
              />
            </div>
          </div>

          <div className="d-flex gap-3 mt-2">
            <Checkbox
              id="onlineEvent"
              size={CheckboxSize.Small}
              checked={data.onlineEvent}
              onChange={handleChangeEvent}
              name="onlineEvent"
              className={clsx(classes.checkbox, 'gap-1')}
            >
              <div className={classes.checkLabel}>Online Event</div>
            </Checkbox>

            <Checkbox
              id="inPersonEvent"
              size={CheckboxSize.Small}
              checked={data.inPersonEvent}
              onChange={handleChangeEvent}
              name="inPersonEvent"
              className={clsx(classes.checkbox, 'gap-1')}
            >
              <div className={classes.checkLabel}>In Person Event</div>
            </Checkbox>
          </div>
        </div>

        <div className={classes.sub3Field}>
          <div className={classes.label}>Location Display Name</div>

          <div className={classes.fieldInput}>
            <input
              name="location.displayName"
              value={data.location.displayName}
              onChange={handleChangeEvent}
            />
          </div>
        </div>

        <div className={clsx(classes.sub3Field, 'flex-shrink-1')}>
          <div className={classes.label}>Chapter</div>

          <div className={classes.fieldInput}>
            <BasicSelect
              options={chapterOptions}
              value={data.location.chapter ?? null}
              isLoading={tagsLoading}
              placeholder=""
              isClearable
              onChange={handleSelectChange('location.chapter')}
            />
          </div>
        </div>
      </div>

      <div className={clsx(classes.field, 'd-flex gap-4')}>
        <div className={classes.sub3Field}>
          <div className={classes.label}>
            Starts<span className="text-danger">*</span>
          </div>

          <div className={classes.fieldInput}>
            <DatePicker
              onChange={handleDateChange(true)}
              popperClassName={clsx(classes.zIndex2, 'formDatePicker')}
              showTimeSelect
              timeIntervals={30}
              dateFormat="MMMM d, yyyy - h:mm aa"
              timeFormat="hh:mm aa"
              closeOnScroll
              selected={
                data.startDateTime ? new Date(data.startDateTime) : undefined
              }
              required
            />
          </div>
        </div>

        <div className={classes.sub3Field}>
          <div className={classes.label}>
            Ends<span className="text-danger">*</span>
          </div>

          <div className={classes.fieldInput}>
            <DatePicker
              onChange={handleDateChange(false)}
              popperClassName={clsx(classes.zIndex2, 'formDatePicker')}
              showTimeSelect
              timeIntervals={30}
              dateFormat="MMMM d, yyyy - h:mm aa"
              timeFormat="hh:mm aa"
              closeOnScroll
              selected={
                data.endDateTime ? new Date(data.endDateTime) : undefined
              }
              required
              ref={endDateRef}
            />
          </div>
        </div>
      </div>

      <div className={clsx(classes.field, 'd-flex gap-4')}>
        <div className={classes.sub3Field}>
          <div className={classes.label}>Timezone</div>

          <div className={classes.fieldInput}>
            <BasicSelect
              options={timezoneOptions}
              value={data.timezone}
              isLoading={tagsLoading}
              placeholder=""
              onChange={handleSelectChange('timezone')}
            />
          </div>
        </div>
      </div>

      <div className={classes.field}>
        <div className={classes.label}>Function Header Image</div>

        <div className={classes.headerImage}>
          <ImageUpload
            onUpload={handleChange('headerImageUrl')}
            onDelete={handleChange('headerImageUrl').bind(null, '')}
            uploadFn={handleFileUpload}
            multiple={false}
            value={data.headerImageUrl}
          />
        </div>
        <div className={classes.imgInfo}>
          Images should be at least a 2100x700 (3:1 ratio) that is no larger
          than 10MB.
        </div>
      </div>

      <div className={classes.field}>
        <div className={classes.label}>Function Directory Image</div>

        <div className={classes.directoryImage}>
          <ImageUpload
            onUpload={handleChange('directoryImageUrl')}
            onDelete={handleChange('directoryImageUrl').bind(null, '')}
            uploadFn={handleFileUpload}
            multiple={false}
            value={data.directoryImageUrl}
          />
        </div>
        <div className={classes.imgInfo}>
          Images should be cropped to a 3:2 ratio and be no larger than 10MB.
        </div>
      </div>

      <div className={classes.field}>
        <div className={classes.label}>Function Description</div>

        <div className={classes.editorContainer}>
          <FunctionEditor
            value={data.functionDescription}
            onContentChange={handleChange('functionDescription')}
          />
        </div>
      </div>

      <div className={classes.field}>
        <div className={classes.label}>Function Tags</div>

        <div className={classes.fieldInput}>
          <BasicSelect
            isMulti
            options={functionTagOptions}
            className={classes.editorContainer}
            placeholder=""
            onChange={handleSelectChange('tags')}
            value={data.tags ?? null}
            isLoading={tagsLoading}
          />
        </div>
      </div>

      <div className={clsx(classes.field, 'd-flex gap-4')}>
        <div className={classes.sub3Field}>
          <div className={classes.label}>Function Type</div>

          <div className={classes.fieldInput}>
            <BasicSelect
              options={functionTypeOptions}
              value={data.functionType ?? null}
              isLoading={tagsLoading}
              placeholder=""
              isClearable
              onChange={handleSelectChange('functionType')}
            />
          </div>
        </div>
      </div>

      <div className={clsx(classes.field, 'd-flex gap-4')}>
        <div className={classes.sub3Field}>
          <div className={classes.label}>Lock Function To a Subgroup</div>

          <div className={classes.fieldInput}>
            <BasicSelect
              options={functionSubgroupOptions}
              value={data.lockFunctionSubgroup ?? null}
              isLoading={tagsLoading}
              placeholder=""
              onChange={handleSelectChange('lockFunctionSubgroup')}
              isClearable
            />
          </div>
        </div>

        <div className={classes.sub3Field}>
          <div className={classes.label}>Stage Gate</div>

          <div className={classes.fieldInput}>
            <BasicSelect
              options={stageOptions}
              value={data.stageGate ?? null}
              isLoading={tagsLoading}
              placeholder=""
              isClearable
              onChange={handleSelectChange('stageGate')}
            />
          </div>
        </div>
      </div>

      <div className={clsx(classes.field, 'd-flex gap-4')}>
        <div className={clsx(classes.label, 'my-1')}>Allow Questions</div>

        <Checkbox
          size={CheckboxSize.Large}
          checked={data.allowQuestions}
          onChange={handleChangeEvent}
          name="allowQuestions"
          className={clsx(classes.checkbox, 'gap-2')}
        >
          <div className={clsx(classes.label, 'my-1 fw-normal')}>
            {data.allowQuestions ? 'Allowed' : 'Not Allowed'}
          </div>
        </Checkbox>
      </div>
    </div>
  );
};
