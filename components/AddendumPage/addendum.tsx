import Image from 'next/image';

import ErrorImage from '@/public/images/404.png';
import Card from '@/ds/Card/card';

import styles from './addendum.module.scss';
import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';
import clsx from 'clsx';
import Link from 'next/link';
import {useSelector} from 'react-redux';
import {selectUserInfo} from '@/store/selectors';

const homeUrl = 'https://foundersnetwork.com';

const LinkMapping = [
  {
    name: 'Home',
    src: `/home`
  },
  {
    name: 'Benefits',
    src: `${homeUrl}/benefits`
  },
  {
    name: 'Testimonials',
    src: `${homeUrl}/testimonials`
  },
  {
    name: 'Forum',
    src: `/forum`
  },
  {
    name: 'Edge',
    src: `${homeUrl}/blog`
  },
  {
    name: 'Request Invitation',
    src: `${homeUrl}/request`
  }
];

export const Addendum = () => {
  const userInfo = useSelector(selectUserInfo());
  const isMobile = Breakpoint.mobile === useBreakpoint();
  return (
    <Card className={styles.mainContainer}>
      <div className={clsx(!isMobile && 'd-flex gap-5')}>
        <div>
          <h1 className={styles.oopsHeader}>Ooops!</h1>
          <h3 className={styles.doesntExistHeader}>
            The page you were looking for doesn't exist.
          </h3>
          <h6 className={styles.errorCodeHeader}>Error Code: 404</h6>

          <div className="mt-4 mb-4">Here are some helpful links instead:</div>
          <div className="mb-4">
            <ul>
              {LinkMapping.map((item: Record<string, string>) => {
                return (
                  <li>
                    <Link className={styles.listTag} href={item.src}>
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        {!isMobile && (
          <div className="d-flex align-items-center">
            <Image
              src={ErrorImage}
              alt="Error Image"
              width={200}
              height={200}
            />
          </div>
        )}
      </div>
    </Card>
  );
};
