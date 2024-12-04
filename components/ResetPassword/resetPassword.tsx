import {useState, useEffect} from 'react';
import classes from './resetPassword.module.scss';
import useIsMobile from '@/utils/common/useIsMobile';
import {FormControl} from '@/ds/FormControl';
import {Button} from '@/ds/Button';
import {Spinner} from '@/ds/Spinner';
import {FNLogo} from '@/ds/FNLogo';
import {
  FORGOT_PASSWORD,
  LOGIN_PAGE_TEXT,
  SERVER_ERROR_TEXT,
  GO_BACK_TO
} from '@/utils/common/constants';
import {Form, OverlayTrigger, Tooltip} from 'react-bootstrap';
import axios from 'axios';
import Link from 'next/link';
import {ButtonVariants} from '@/ds/Button/button';

const RESET_PASSWORD_TEXT = 'RESET PASSWORD';
const NEW_PASSWORD_TEXT = 'New Password';
const CONFIRM_PASSWORD_TEXT = 'Confirm Password';
const RESET_PASSWORD_TITLE_TEXT = 'Set New Password';
const PASSWORD_POLICY_TEXT = `Password must be at least 8 characters long, contain at least one
      uppercase letter, one lowercase letter, one number, and one special
      character(!@#$^&).`;
const TOKEN_EXPIRED_ERROR_TEXT =
  'The reset password link either expired or invalid. Please request a new link.';
const NEW_CONFIRM_PASSWORD_ERROR_TEXT =
  'New Password and Confirm Password should be same.';
const PASSWORD_RESET_MESSAGE =
  'Password updated! You may now log in using your new password.';

const RESET_PASSWORD_API_URL = '/v1/api/auth/reset-password';
const VERIFY_JWT_TOKEN_API_URL = '/v1/api/auth/verify-token';

function getToken() {
  const url = new URL(location.href);
  return url.searchParams.get('token')!;
}

export function ResetPassword(): JSX.Element {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setconfirmNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isTokenExpire, setIsTokenExpire] = useState(false);
  const [isTokenExpireChecked, setIsTokenExpireChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const isMobile = useIsMobile();

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setIsError(false);
    if (newPassword !== confirmNewPassword) {
      setIsError(true);
      setErrorMessage(NEW_CONFIRM_PASSWORD_ERROR_TEXT);
      return false;
    }
    setIsLoading(true);
    setIsPasswordReset(false);
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_DOMAIN_URL}${RESET_PASSWORD_API_URL}`,
        {
          token: getToken(),
          password: newPassword
        }
      )
      .then(response => {
        setErrorMessage('');
        setIsPasswordReset(true);
      })
      .catch(error => {
        setIsError(true);
        setErrorMessage(SERVER_ERROR_TEXT);
        return error.data;
      });
    setIsLoading(false);
  };

  let containerClass = `${classes.loginContainer} ${
    isMobile ? classes.mobileLoginContainer : ''
  }`;
  let errorClass = `${classes.errorMessage} ${
    isError ? 'visible' : 'invisible'
  }`;

  useEffect(() => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_DOMAIN_URL}${VERIFY_JWT_TOKEN_API_URL}`,
        {
          token: getToken()
        }
      )
      .then(response => {
        setIsTokenExpire(false);
        setIsTokenExpireChecked(true);
      })
      .catch(error => {
        setIsTokenExpire(true);
        setIsTokenExpireChecked(true);
      });
  }, []);

  const passwordPolicyMessage = <Tooltip>{PASSWORD_POLICY_TEXT}</Tooltip>;
  const tooltipPlacement = isMobile ? 'top' : 'right';
  const passwordRegex =
    '^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$^&]).{8,}$';

  return (
    <div className={`${containerClass}`}>
      <FNLogo width={300} height={110} altText="FN Logo" />
      <div className={classes.pageTitle}>
        <span>{RESET_PASSWORD_TITLE_TEXT}</span>
      </div>

      {!isTokenExpireChecked && (
        <div className={classes.loading}>
          <Spinner animation={'border'} className="me-1" />
        </div>
      )}
      {isTokenExpireChecked && !isTokenExpire && !isPasswordReset && (
        <form onSubmit={handleSubmit}>
          <div className={errorClass}>
            <span>{errorMessage}</span>
          </div>
          <div className={classes.inputContainer}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <div className={classes.labels}>
                <Form.Label>{NEW_PASSWORD_TEXT}</Form.Label>
              </div>
              <OverlayTrigger
                placement={tooltipPlacement}
                overlay={passwordPolicyMessage}
              >
                <FormControl
                  floatingLabel={false}
                  placeholder={''}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  type="password"
                  showLabel="Show"
                  hideLabel="Hide"
                  disabled={isLoading}
                  pattern={passwordRegex}
                  id="password-input"
                  name="password-input"
                ></FormControl>
              </OverlayTrigger>
            </Form.Group>
          </div>
          <div className={classes.inputContainer}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <div className={classes.labels}>
                <Form.Label>{CONFIRM_PASSWORD_TEXT}</Form.Label>
              </div>
              <FormControl
                floatingLabel={false}
                placeholder={''}
                value={confirmNewPassword}
                onChange={e => setconfirmNewPassword(e.target.value)}
                required
                type="password"
                showLabel="Show"
                hideLabel="Hide"
                disabled={isLoading}
                pattern={passwordRegex}
                id="confirm-password-input"
                name="confirm-password-input"
              ></FormControl>
            </Form.Group>
          </div>
          <div className={classes.buttonContainer}>
            <Button
              variant={
                isMobile
                  ? ButtonVariants.Primary
                  : ButtonVariants.OutlinePrimary
              }
              type="submit"
            >
              {RESET_PASSWORD_TEXT}{' '}
              {isLoading && (
                <Spinner animation={'border'} size="sm" className="me-1" />
              )}
            </Button>
          </div>
        </form>
      )}

      {isTokenExpire && isTokenExpireChecked && (
        <div className={`${classes.errorMessage} ${classes.tokenExpire}`}>
          <span>{TOKEN_EXPIRED_ERROR_TEXT}</span> {GO_BACK_TO}
          <Link href="/accounts/forgot-password">{FORGOT_PASSWORD}</Link>
        </div>
      )}
      {isPasswordReset && (
        <div className={classes.successMessage}>
          <span>
            {PASSWORD_RESET_MESSAGE} {GO_BACK_TO}
          </span>
          <Link href="/accounts/login">{LOGIN_PAGE_TEXT}</Link>
        </div>
      )}
    </div>
  );
}
