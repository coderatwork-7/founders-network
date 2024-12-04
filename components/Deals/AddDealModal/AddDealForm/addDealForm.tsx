import Select from 'react-select';
import classes from './addDealForm.module.scss';
import React, {useEffect, useState} from 'react';
import {DealListRequest} from '../DealListRequest/dealListRequest';
import {Button, ButtonVariants} from '@/ds/Button';
import {format} from 'date-fns';
import {useSelector} from 'react-redux';
import {selectAllDealTags, selectUserInfo} from '@/store/selectors';
import useAPI from '@/utils/common/useAPI';
import clsx from 'clsx';
import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';
import {CONCURRENCY_CONTROL} from '@/genericApi/apiEndpoints';
import ImageUpload from '../../ImageUpload/imageUpload';
import {isObjectEmpty} from '@/utils/common/helper';
import {AddDealStatus} from '../addDealModal';

const PointOfContactFields = [
  {
    name: 'firstName',
    placeholder: 'First Name',
    type: 'text',
    minLenngth: 3,
    maxLength: 50
  },
  {
    name: 'lastName',
    placeholder: 'Last Name',
    type: 'text',
    minLenngth: 3,
    maxLength: 50
  },
  {
    name: 'title',
    placeholder: 'Title',
    type: 'text',
    minLenngth: 3,
    maxLength: 50
  },
  {
    name: 'phone',
    placeholder: 'Phone',
    type: 'text',
    pattern: '[0-9]{10}',
    minLength: 10,
    maxLength: 10
  },
  {
    name: 'email',
    placeholder: 'Email',
    type: 'email',
    minLenth: 3,
    maxLength: 50
  }
];

const OfferFields = [
  {
    name: 'promotionalOffer',
    placeholder: 'Promotional Offer',
    type: 'text'
  },
  {
    name: 'redemptionLink',
    placeholder: 'Redemption Link',
    type: 'url'
  },
  {
    name: 'redemptionCode',
    placeholder: 'Redemption Code',
    type: 'text'
  }
];

interface AddDealFormPropTypes {
  setCurrentStatus: any;
  setMessage: any;
}

export const AddDealForm: React.FC<AddDealFormPropTypes> = ({
  setCurrentStatus,
  setMessage
}) => {
  const [files, setFiles] = useState<File | null>(null);
  const userInfo = useSelector(selectUserInfo());
  const isMobile = Breakpoint.mobile === useBreakpoint();
  const [submitting, setSubmitting] = useState(false);
  const makeApiCall = useAPI();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const allDealTags = useSelector(selectAllDealTags());
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData({...formData, [name]: value});
  };

  async function uploadFile(file: File) {
    const fileData = new FormData();
    fileData.append('s3file', file);

    try {
      const attachment: any = await makeApiCall(
        'postFile',
        {},
        {
          method: 'POST',
          data: fileData
        }
      );

      return {
        id: attachment.data.id,
        name: attachment.data.fileName,
        url: attachment.data.locationUrl
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  }

  const formatDate = (inputDate: string) => {
    const date = new Date(inputDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const requestObj: Record<string, any> = {};
    requestObj['pointOfContact'] = {};
    PointOfContactFields.forEach(value => {
      const key = value?.name;
      requestObj['pointOfContact'][key] = formData?.[key];
    });
    OfferFields.forEach(value => {
      const key = value?.name;
      requestObj[key] = formData?.[key];
    });
    requestObj.companyName = formData?.companyName;
    requestObj.value = formData?.upToValue?.toString();
    requestObj.website = formData?.websiteLink;
    requestObj.expiration = {
      date: formatDate(formData?.expiryDate),
      time: `${formData?.expiryHours}.${formData?.expiryMinutes} ${formData?.timeSession} PDT`
    };
    requestObj.tags = formData?.tags.map(
      (item: {label: string; value: string}) => item.value
    );

    requestObj.ccDetails = {
      number: formData?.creditCardNo,
      cvv: formData?.cvv,
      expirationMonth: formData?.expiryMonth,
      expirationYear: formData?.expiryYear
    };
    console.log(requestObj, '!!');
    try {
      const createTokenResponse = await fetch('/api/createToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          number: formData?.creditCardNo,
          exp_month: formData?.expiryMonth,
          exp_year: formData?.expiryYear,
          cvc: formData?.cvv,
          address_city: null,
          address_state: null,
          address_country: null,
          address_line1: null,
          address_zip: null,
          name: `${formData?.firstName} ${formData?.lastName}`
        })
      });
      if (!createTokenResponse.ok) {
        throw new Error('Card Validation Failed');
      }
      const stripe_info = await createTokenResponse.json();
      requestObj.stripe_info = stripe_info;
      let fileData: any;
      if (files) fileData = await uploadFile(files);
      requestObj.logoId = fileData?.id.toString();
      requestObj.name = fileData?.name;
      let response: any;
      if (fileData?.id) {
        response = await makeApiCall(
          'postAddDeal',
          {
            userId: userInfo?.id
          },
          {
            method: 'POST',
            data: requestObj
          }
        );
      }
      setCurrentStatus(AddDealStatus.success);
      setMessage(response.data);
      setSubmitting(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      setCurrentStatus(AddDealStatus.error);
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (userInfo?.id && isObjectEmpty(allDealTags)) {
      makeApiCall('getAllDealTags', {
        userId: userInfo?.id,
        concurrencyControl: CONCURRENCY_CONTROL.takeFirstRequest
      });
    }
  }, [userInfo?.id, allDealTags]);

  return (
    <form onSubmit={handleSubmit} className={classes.formContainer}>
      <div className={classes.fieldInfo}>
        <span className={classes.warning}>*All fields are required </span>
      </div>
      <div className={classes.companyContainer}>
        <div className={classes.companyInputContainer}>
          <div>Company Name</div>
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            maxLength={50}
            onChange={handleChange}
            required
          />
        </div>
        <div className={classes.companyInputContainer}>
          <div>Company Logo</div>
          <ImageUpload setFiles={setFiles} />
        </div>
      </div>
      <div className={classes.pointContactContainer}>
        <div>Point of contact</div>
        <div className={classes.pointContactInput}>
          {PointOfContactFields?.map(item => {
            return (
              <input
                key={item?.name}
                name={item?.name}
                placeholder={item?.placeholder}
                type={item?.type}
                minLength={item?.minLenngth}
                maxLength={item?.maxLength}
                onChange={handleChange}
                pattern={item?.pattern}
                required
              />
            );
          })}
        </div>
      </div>
      {OfferFields?.map(item => {
        return (
          <div key={item?.name} className={classes.offerContainer}>
            <div>{item?.placeholder}</div>
            <input
              name={item?.name}
              placeholder={item?.placeholder}
              type={item?.type}
              onChange={handleChange}
              required
            />
          </div>
        );
      })}
      <div className="my-3">
        <div className="my-1">Value</div>
        <div>
          <label>Up To: </label>
          <input
            name="upToValue"
            placeholder="$"
            className="mx-2"
            type="number"
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="my-3">
        <div className="my-1">Website</div>
        <input
          type="url"
          name="websiteLink"
          placeholder="Website URL"
          className="w-100"
          onChange={handleChange}
          required
        />
      </div>
      <div className="my-3">
        <div className="my-1">Expiration</div>
        <div>
          <input
            type="date"
            name="expiryDate"
            min={format(new Date(), 'yyyy-MM-dd')}
            onChange={handleChange}
            required
          />
          <div className={clsx(!isMobile && 'd-flex gap-2')}>
            <div className=" d-flex gap-2 my-2">
              <div>
                <div>Hour</div>
                <Select
                  className={classes.timeInput}
                  options={Array.from({length: 12}, (_, index) => {
                    let value = index.toString();
                    if (index < 10) {
                      value = '0' + value;
                    }
                    return {label: index, value: value};
                  })}
                  onChange={e => {
                    setFormData({...formData, expiryHours: e?.value});
                  }}
                  placeholder="Hour"
                  required
                />
              </div>
              <div>
                <div>Minute</div>
                <Select
                  options={Array.from({length: 60}, (_, index) => {
                    let value = index.toString();
                    if (index < 10) {
                      value = '0' + value;
                    }
                    return {label: index, value: value};
                  })}
                  onChange={e => {
                    setFormData({...formData, expiryMinutes: e?.value});
                  }}
                  className={classes.timeInput}
                  placeholder="Minute"
                  required
                />
              </div>
            </div>
            <div className="my-2">
              <div>
                <div>
                  AM/PM <span className={classes.warning}>*</span>(PDT)
                </div>
                <Select
                  options={[
                    {value: 'AM', label: 'AM'},
                    {value: 'PM', label: 'PM'}
                  ]}
                  onChange={e => {
                    setFormData({...formData, timeSession: e?.value});
                  }}
                  placeholder="AM/PM"
                  required
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="my-3">
        <div className="my-1">Tags</div>
        <Select
          isMulti
          options={
            allDealTags
              ? Object?.keys(allDealTags)?.map((ele: any) => {
                  const currentTag = allDealTags[ele];
                  return {
                    value: currentTag?.id,
                    label: `${currentTag?.name}`
                  };
                })
              : []
          }
          onChange={e => {
            setFormData({...formData, tags: e});
          }}
          required
        />
      </div>
      <hr className={classes.lineBreak} />

      <div>
        <DealListRequest
          formData={formData}
          setFormData={setFormData}
          handlInputChange={handleChange}
        />
      </div>

      <div className="my-3">This deal listing will renew annually.</div>

      <div className={classes.buttonContainer}>
        <Button
          variant={ButtonVariants.CardPrimary}
          textUppercase
          type="submit"
          disabled={submitting}
          loading={submitting}
        >
          add deal
        </Button>
      </div>
    </form>
  );
};
