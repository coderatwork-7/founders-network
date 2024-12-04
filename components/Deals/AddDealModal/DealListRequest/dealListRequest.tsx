import {
  selectCardInfo,
  selectDealListingFee,
  selectUserInfo
} from '@/store/selectors';
import Link from 'next/link';
import {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import classes from './dealListRequest.module.scss';
import Card from '@/ds/Card/card';
import Image from 'next/image';
import Lock from '@/public/images/lock_green.svg';
import clsx from 'clsx';
import useAPI from '@/utils/common/useAPI';
import {CONCURRENCY_CONTROL} from '@/genericApi/apiEndpoints';
import {Select} from '@/ds/Select';
import {
  MONTHS,
  validateNumInput
} from '@/components/FunctionTickets/ReservationWidget/CardInfo/CardInfo';
import {isObjectEmpty} from '@/utils/common/helper';
import valid from 'card-validator';

const MembershipPlan: string[] = ['bootstrap', 'angel', 'seriesa'];

const MembershipMapping: Record<string, string> = {
  'Bootstrap Members': 'bootstrap',
  'Angel Level Members': 'angel',
  'Series A Level Members': 'seriesa'
};

export const DealListRequest = ({
  formData,
  setFormData,
  handlInputChange
}: {
  formData: any;
  setFormData: Dispatch<SetStateAction<any>>;
  handlInputChange: any;
}) => {
  const cardInfo = useSelector(selectCardInfo());
  const userInfo = useSelector(selectUserInfo());
  const [cardValid, setCardValid] = useState<Record<string, boolean>>({
    cvv: false,
    creditCardNo: false
  });
  const makeApiCall = useAPI();
  const dealListingFee = useSelector(selectDealListingFee());
  const isMembershipLocked = (currentMembership: string) => {
    const userMembershipIndex = MembershipPlan.indexOf(userInfo?.paymentPlan);
    const currentMembershipIndex = MembershipPlan.indexOf(currentMembership);
    return currentMembershipIndex > userMembershipIndex;
  };

  useEffect(() => {
    if (userInfo?.id && isObjectEmpty(dealListingFee)) {
      makeApiCall('getDealsListingFee', {
        userId: userInfo?.id,
        concurrencyControl: CONCURRENCY_CONTROL.takeFirstRequest
      });
    }
  }, [userInfo?.id, dealListingFee]);

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const name = e.target.name;

    const isValid =
      name === 'cvv'
        ? validateNumInput(value, 3) || validateNumInput(value, 4)
        : valid.number(value).isValid;

    if (isValid) {
      setCardValid({...cardValid, [name]: false});
      setFormData({...formData, [name]: value});
      e.target.classList.remove(classes.warning);
    } else {
      setCardValid({...cardValid, [name]: true});
      e.target.classList.add(classes.warning);
    }
  };

  return (
    <div>
      <h3 className="text-center">Deal Listing Request Fee</h3>
      <div>
        {dealListingFee &&
          Object?.keys(dealListingFee)?.map((ele: any) => {
            const item = dealListingFee[ele];
            return (
              <Card
                key={item?.name}
                className={clsx(
                  classes.membershipContainer,
                  classes[MembershipMapping[item?.name]]
                )}
              >
                <div>
                  {item?.name}: {item?.value}
                </div>
                {isMembershipLocked(MembershipMapping[item?.name]) && (
                  <div>
                    <Image
                      src={Lock}
                      alt="Locked Icon"
                      width={30}
                      height={30}
                    />
                  </div>
                )}
              </Card>
            );
          })}
      </div>
      <div>
        <Link href={'/raise'}>Learn more</Link> about membership levels and
        Add-Ons
      </div>
      <div>Available Credits: $0.00</div>
      <div className="my-3">
        If approved this deal listing will be charged to the credit card on file
        ending in {cardInfo?.number}. Please update your credit card information
        below if neccesary.
      </div>
      <div>
        <div className="my-2">
          <div className="my-2">Credit Card Number</div>
          <input
            className="w-100"
            maxLength={19}
            name="creditCardNo"
            onChange={handleCardChange}
            required
          />
          {cardValid.creditCardNo && (
            <div className={classes.warningText}>
              Not a valid Credit Card Number
            </div>
          )}
        </div>
        <div>
          <div className="my-2">Card CVV</div>
          <input
            className={classes.cvvInput}
            maxLength={4}
            name="cvv"
            onChange={handleCardChange}
            required
          />
          {cardValid.cvv && (
            <div className={classes.warningText}>Not a valid CVV</div>
          )}
        </div>

        <div className="my-2">
          <div className="my-1">Expiration</div>
          <div className={classes.expiryField}>
            <Select
              items={MONTHS}
              onChange={val => {
                const monthIndex = MONTHS.findIndex(value => value === val);

                setFormData((prev: any) => ({
                  ...prev,
                  expiryMonth: monthIndex + 1
                }));
              }}
              className={clsx('my-2', classes.input)}
              defaultVal={MONTHS[+new Date().getMonth()]}
              itemClass="ps-2"
            />
            <Select
              items={Array.from(
                {length: 7},
                (_, index) => +new Date().getFullYear() + index
              )}
              onChange={val => {
                setFormData((prev: any) => ({...prev, expiryYear: val}));
              }}
              className={clsx('my-2', classes.input)}
              defaultVal={+new Date().getFullYear()}
              itemClass="ps-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
