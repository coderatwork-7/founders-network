import {useEffect, useState} from 'react';
import classes from './forgotPassword.module.scss';
import useIsMobile from '@/utils/common/useIsMobile';
import {FormControl} from '@/ds/FormControl';
import {Button} from '@/ds/Button';
import {Spinner} from '@/ds/Spinner';
import {useSearchParams} from 'next/navigation';
import {FNLogo} from '@/ds/FNLogo';
import axios from 'axios';
import {
  LOGIN_PAGE_TEXT,
  FOUNDERS_NETWORK,
  GO_BACK_TO_TEXT
} from '@/utils/common/constants';
import Form from 'react-bootstrap/Form';
import Link from 'next/link';
import {ButtonVariants} from '@/ds/Button/button';

const FORGOT_PASSWORD_API_URL = '/v1/api/auth/forgot-password'; //TODO: need to refactor

const SUBMIT_TEXT = 'SUBMIT';
const FORGOT_PASSWORD = 'Forgot Your Password?';
const EMAIL_ADDRESS_TEXT = 'Email address';
const USUALLY_YOUR_EMAIL_TEXT = 'Usually your email';

interface SuccessResponse {
  data: {
    message: '';
  };
}

export function ForgotPassword(): JSX.Element {
  const query = useSearchParams();
  const username = query.get('username');
  const [email, setEmail] = useState(username ?? '');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const isMobile = useIsMobile();

  useEffect(() => {
    setEmail(query.get('username') ?? email);
  }, [query]);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);
    setIsError(false);
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_DOMAIN_URL}${FORGOT_PASSWORD_API_URL}`,
        {
          username: email
        }
      )
      .then((response: SuccessResponse) => {
        return setSuccessMessage(response.data.message);
      })
      .catch(error => {
        setIsError(true);
        setErrorMessage(error.response.data.message);
      });
    setIsLoading(false);
  };

  let containerClass = `${classes.loginContainer} ${
    isMobile ? classes.mobileLoginContainer : ''
  }`;

  let errorClass = `${classes.errorMessage} ${
    isError ? 'visible' : 'invisible'
  }`;

  return (
    <div className={`${containerClass}`}>
      <FNLogo width={300} height={110} altText={FOUNDERS_NETWORK} />
      <div className={classes.pageTitle}>
        <span>{FORGOT_PASSWORD}</span>
      </div>
      {!successMessage && (
        <div className="reset-password-form">
          <form onSubmit={handleSubmit}>
            <div className={errorClass}>
              <span>{errorMessage}</span>
            </div>
            <div className={classes.inputContainer}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <div className={classes.labels}>
                  <Form.Label>{EMAIL_ADDRESS_TEXT}</Form.Label>
                  <Form.Label>{USUALLY_YOUR_EMAIL_TEXT}</Form.Label>
                </div>
                <FormControl
                  floatingLabel={false}
                  placeholder="Username"
                  required={true}
                  value={email}
                  type="email"
                  disabled={isLoading}
                  onChange={e => setEmail(e.target.value)}
                  id="email-input"
                  name="email-input"
                ></FormControl>
              </Form.Group>
            </div>
            <Button
              variant={
                isMobile
                  ? ButtonVariants.Primary
                  : ButtonVariants.OutlinePrimary
              }
              type="submit"
            >
              {SUBMIT_TEXT}&nbsp;
              {isLoading && (
                <Spinner animation={'border'} size="sm" className="me-1" />
              )}
            </Button>
          </form>
        </div>
      )}
      {successMessage && !isError && (
        <div className={classes.successMessage}>{successMessage}</div>
      )}

      <p className={classes.forgotPassword}>
        {GO_BACK_TO_TEXT} {''}
        <Link href={`/accounts/login`}>{LOGIN_PAGE_TEXT}</Link>
      </p>
    </div>
  );
}
