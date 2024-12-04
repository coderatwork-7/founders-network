import React, {
  ChangeEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState
} from 'react';
import classes from './CardInfo.module.scss';
import {Select} from '@/ds/Select';
import clsx from 'clsx';
import useAPI from '@/utils/common/useAPI';
import {useSelector} from 'react-redux';
import {selectCardInfo, selectUserInfo} from '@/store/selectors';
import {Spinner} from '@/ds/Spinner';
import {Button, ButtonVariants} from '@/ds/Button';
import valid from 'card-validator';

interface CardInterface {
  num: string;
  cvv: number;
  expiryMonth: number;
  expiryYear: number;
  isNumValid: boolean;
  isCvvValid: boolean;
  firstName: string;
  lastName: string;
}

interface CardInfoProps {
  loading: boolean;
  editing: boolean;
  setEditing: React.Dispatch<SetStateAction<boolean>>;
  isNameNeeded?: boolean;
}

export const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'June',
  'July',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

export const validateNumInput = (val: string, digits: number) => {
  return val.replace(/\D/g, '').length === digits;
};

export const getMonthNumber = (month?: string) =>
  (month ? new Date(`2000 ${month}`) : new Date()).getMonth() + 1;

const isCreditCardValid = (inputMonth: number, inputYear: number): boolean => {
  const currentDate = new Date();
  const expirationDate = new Date(inputYear, inputMonth, 0);
  return inputYear >= currentDate.getFullYear() && currentDate < expirationDate;
};
export const CardInfo: React.FC<CardInfoProps> = ({
  loading,
  editing,
  setEditing,
  isNameNeeded
}) => {
  const [isValid, setIsValid] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const cardInfo = useSelector(selectCardInfo());
  const cardDetailsRef = useRef<CardInterface>({
    firstName: cardInfo?.firstName,
    lastName: cardInfo?.lastName,
    num: '0',
    cvv: 0,
    expiryMonth: +getMonthNumber(),
    expiryYear: +new Date().getFullYear(),
    isNumValid: false,
    isCvvValid: false
  });

  const api = useAPI();
  const userInfo = useSelector(selectUserInfo());

  const setValidity = () =>
    setIsValid(
      cardDetailsRef.current.isNumValid &&
        cardDetailsRef.current.isCvvValid &&
        isCreditCardValid(
          cardDetailsRef.current.expiryMonth,
          cardDetailsRef.current.expiryYear
        )
    );
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    setErr('');
    const response: Record<string, string | number> = {};
    cardDetailsRef.current;
    response.number = cardDetailsRef.current.num;
    response.expiration = `${cardDetailsRef.current.expiryMonth}/${cardDetailsRef.current.expiryYear}`;
    response.cvv = cardDetailsRef.current.cvv;
    if (isNameNeeded) {
      response.firstName =
        cardDetailsRef?.current?.firstName ?? cardInfo?.firstName;
      response.lastName =
        cardDetailsRef?.current?.lastName ?? cardInfo?.lastName;
    }
    fetch('/api/createToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        number: response.number,
        exp_month: cardDetailsRef.current.expiryMonth,
        exp_year: cardDetailsRef.current.expiryYear,
        cvc: response.cvv,
        address_city: null,
        address_state: null,
        address_country: null,
        address_line1: null,
        address_zip: null,
        name: `${cardDetailsRef?.current?.firstName ?? cardInfo?.firstName} ${
          cardDetailsRef?.current?.lastName ?? cardInfo?.lastName
        }`
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('Card Validation Failed.');
        return res.json();
      })
      .then(stripe_info =>
        api(
          'creditCardInfo',
          {
            userId: userInfo?.id
          },
          {
            method: 'POST',
            data: {
              ...response,
              stripe_info
            }
          }
        )
      )
      .then(_ => {
        setErr(null);
        setEditing(false);
      })
      .catch(err => {
        setIsValid(false);
        setErr(err?.message ?? 'Card Validation Failed');
      });
  };

  const handleCardNumChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.replace(/\D/g, '');

    if (valid.number(e.target.value).isValid) {
      e.target.classList.remove(classes.err);
      cardDetailsRef.current.num = e.target.value;
      cardDetailsRef.current.isNumValid = true;
    } else {
      e.target.classList.add(classes.err);
      cardDetailsRef.current.isNumValid = false;
    }
    setValidity();
  };

  const handleCvvChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.replace(/\D/g, '');

    if (
      validateNumInput(e.target.value, 3) ||
      validateNumInput(e.target.value, 4)
    ) {
      e.target.classList.remove(classes.err);
      cardDetailsRef.current.cvv = +e.target.value;
      cardDetailsRef.current.isCvvValid = true;
    } else {
      e.target.classList.add(classes.err);
      cardDetailsRef.current.isCvvValid = false;
    }
    setValidity();
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    cardDetailsRef.current[e.target.id] = e.target.value;
    if (e.target.value !== '') {
      e.target.classList.remove(classes.err);
    } else {
      e.target.classList.add(classes.err);
    }
  };

  if (!cardInfo?.number && !editing) setEditing(true);
  useEffect(() => {
    if (userInfo?.id && !cardInfo) {
      api('creditCardInfo', {
        userId: userInfo?.id
      }).then(_ => setEditing(false));
    }
  }, [userInfo]);

  useEffect(() => {
    if (!cardInfo?.number && !editing) setEditing(true);
  }, [cardInfo]);

  return (
    <div className={classes.cardInfo}>
      {err && <div className="text-danger mt-2 ms-3">{err}</div>}
      <div className={classes.helpText}>
        Please Verify Your Credit Card Information
      </div>
      {loading && (
        <div className="d-flex justify-content-center mt-4">
          <Spinner />
        </div>
      )}
      {editing ? (
        <div className={clsx(loading && 'd-none')}>
          <div className={classes.editDetails}>
            {isNameNeeded && (
              <div className={classes.nameContainer}>
                <div className={classes.nameInput}>
                  <label htmlFor="cardNum">First Name:</label>
                  <input
                    id="firstName"
                    type="text"
                    className={classes.input}
                    onChange={handleNameChange}
                    min={3}
                    defaultValue={cardInfo?.firstName}
                    required
                  />
                </div>
                <div className={classes.nameInput}>
                  <label htmlFor="cardNum">Last Name:</label>
                  <input
                    id="lastName"
                    type="text"
                    className={classes.input}
                    onChange={handleNameChange}
                    defaultValue={cardInfo?.lastName}
                    required
                  />
                </div>
              </div>
            )}
            <div
              className={clsx(
                classes.cardField,
                isNameNeeded && classes.cardNumberSpecial
              )}
            >
              <label htmlFor="cardNum">Credit Card:</label>
              <input
                id="cardNum"
                autoComplete="off"
                type="text"
                className={classes.input}
                onChange={handleCardNumChange}
                maxLength={19}
              />
            </div>
            <div className={clsx([classes.cardField, classes.cvv])}>
              <label htmlFor="cvv">CVV:</label>
              <input
                id="cvv"
                autoComplete="off"
                type="text"
                className={classes.input}
                onChange={handleCvvChange}
                maxLength={4}
              />
            </div>
            <div className={clsx([classes.cardField, classes.expiryField])}>
              <label htmlFor="expiry">Expiration Date:</label>
              <div className={classes.expiry}>
                <Select
                  items={MONTHS}
                  onChange={val => {
                    cardDetailsRef.current.expiryMonth =
                      MONTHS.indexOf(val) + 1;
                    setValidity();
                  }}
                  className={classes.input}
                  defaultVal={MONTHS[+new Date().getMonth()]}
                  itemClass="ps-2"
                />
                <Select
                  items={Array.from(
                    {length: 7},
                    (_, index) => +new Date().getFullYear() + index
                  )}
                  onChange={val => {
                    cardDetailsRef.current.expiryYear = val;
                    setValidity();
                  }}
                  className={classes.input}
                  defaultVal={+new Date().getFullYear()}
                  itemClass="ps-2"
                />
              </div>
            </div>
          </div>
          <div className={classes.btnContainer}>
            <Button
              variant={ButtonVariants.BluePrimary}
              className={classes.btn}
              disabled={!isValid}
              onClick={handleSubmit}
              textUppercase
            >
              Update
            </Button>
            {!!cardInfo?.number && (
              <Button
                variant={ButtonVariants.BluePrimary}
                className={classes.btn}
                onClick={() => {
                  cardDetailsRef.current.isNumValid = false;
                  cardDetailsRef.current.isCvvValid = false;
                  setEditing(false);
                  setErr(null);
                }}
                textUppercase
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className={classes.cardDetails}>
          {isNameNeeded && (
            <>
              <div>
                First Name: <b>{cardInfo?.firstName}</b>
              </div>
              <div>
                Last Name: <b>{cardInfo?.lastName}</b>
              </div>
            </>
          )}
          <div>
            Credit Card Number: <b>{cardInfo?.number ?? ''}</b>
          </div>
          <div>
            Expiration: <b>{cardInfo?.expiration ?? ''}</b>
          </div>
          <button
            className={classes.editBtn}
            onClick={() => {
              setEditing(true);
              setIsValid(false);
              cardDetailsRef.current.isCvvValid = false;
              cardDetailsRef.current.isNumValid = false;
            }}
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
};
