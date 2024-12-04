import {signIn} from 'next-auth/react';
import {useState} from 'react';
import Link from 'next/link';
import classes from './login.module.scss';
import useIsMobile from '@/utils/common/useIsMobile';
import {FormControl} from '@/ds/FormControl';
import {Button} from '@/ds/Button';
import {Spinner} from '@/ds/Spinner';
import {useRouter} from 'next/navigation';
import {FNLogo} from '@/ds/FNLogo';
import {FORGOT_PASSWORD} from '@/utils/common/constants';
import {ButtonVariants} from '@/ds/Button/button';
import {LoginFooter} from '../Footer';

const LOGIN_TEXT = 'LOGIN';
const LOGIN_ERROR_MESSAGE_TEXT =
  'No active account found with the given credentials.';

export function LoginForm(): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const router = useRouter();
  const isMobile = useIsMobile();
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const url = new URL(location.href);
    setIsLoading(true);
    setIsError(false);
    const result = await signIn('credentials', {
      username: email,
      password: password,
      redirect: false
    });
    result?.error && setIsError(!result.ok);
    result?.url &&
      router.push(
        url.searchParams.get('callbackUrl')
          ? `/dashboard?callbackUrl=${url.searchParams.get('callbackUrl')}`
          : '/dashboard'
      );
    setIsLoading(false);
    !result?.error && window.postMessage({email: email});
    !result?.error && setisLoggedIn(true);
  };

  let containerClass = `${classes.loginContainer} ${
    isMobile ? classes.mobileLoginContainer : ''
  }`;

  let errorClass = `${classes.errorMessage} ${
    isError ? 'visible' : 'invisible'
  }`;

  return (
    <>
      {!isLoggedIn && (
        <>
          <div className={`${containerClass}`}>
            <FNLogo width={300} height={110} altText="FN Logo" />
            <form onSubmit={handleSubmit}>
              <div className={errorClass}>
                <span>{LOGIN_ERROR_MESSAGE_TEXT}</span>
              </div>
              <div className={classes.inputContainer}>
                <FormControl
                  floatingLabel={false}
                  placeholder="Email"
                  required={true}
                  value={email}
                  type="email"
                  disabled={isLoading}
                  onChange={e => setEmail(e.target.value)}
                  id="email-input"
                  name="email-input"
                ></FormControl>
              </div>
              <div className={classes.inputContainer}>
                <FormControl
                  floatingLabel={false}
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  type="password"
                  showLabel="Show"
                  hideLabel="Hide"
                  disabled={isLoading}
                  id="password-input"
                  name="password-input"
                ></FormControl>
              </div>
              <Button variant={ButtonVariants.Primary} type="submit">
                {LOGIN_TEXT}&nbsp;
                {isLoading && (
                  <Spinner animation={'border'} size="sm" className="me-1" />
                )}
              </Button>
            </form>
            <Link
              href={`/accounts/forgot-password?username=${email}`}
              className={classes.forgotPassword}
            >
              {FORGOT_PASSWORD}
            </Link>
          </div>
          <LoginFooter />
        </>
      )}
    </>
  );
}
