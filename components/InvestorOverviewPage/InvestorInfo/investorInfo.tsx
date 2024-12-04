import React, {useCallback, useEffect, useState} from 'react';
import styles from './investorInfo.module.scss';
import Card from '@/ds/Card/card';
import {Tooltip} from '@/ds/Tooltip';
import {Breakpoint, useBreakpoint} from '@/utils/common/useBreakPoint';
import clsx from 'clsx';
import {useSelector} from 'react-redux';
import {selectInvestmentSettings, selectUserInfo} from '@/store/selectors';
import useAPI from '@/utils/common/useAPI';
import {CONCURRENCY_CONTROL} from '@/genericApi/apiEndpoints';
import ReactSelect from 'react-select';
import makeAnimated from 'react-select/animated';
import {Button, ButtonVariants} from '@/ds/Button';
import {Spinner} from '@/ds/Spinner';
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/router';
import {useQuery} from '@tanstack/react-query';

interface OverviewType {
  background: string;
  investsIn: string;
  sector: string;
  investmentLocations: string;
  isProfileMatch: boolean;
  insiderInformation: string;
}

interface InvestorInfoPropsType {
  overview: OverviewType;
  userInvestment?: boolean;
}

const UserInvestment = [
  {
    title: 'Stage',
    value: 'stage'
  },
  {
    title: 'Sector',
    value: 'sectorTitle'
  },
  {
    title: 'Location',
    value: 'companyCity.name'
  },
  {
    title: 'Looking to Raise',
    value: 'lookingToRaise'
  }
];

interface SelectOption {
  value: string;
  label: string;
}
export const InvestorInfo: React.FC<InvestorInfoPropsType> = ({
  overview,
  userInvestment
}) => {
  const isMobile = Breakpoint.mobile === useBreakpoint();
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<{[key: string]: any}>();

  const userInfo = useSelector(selectUserInfo());
  const investmentSetting = useSelector(selectInvestmentSettings());
  const makeApiCall = useAPI();

  const getInvestmentSettings = () => {
    return makeApiCall('investmentSettings', {
      userId: userInfo?.id,
      concurrency: CONCURRENCY_CONTROL.takeFirstRequest
    });
  };

  const {data: session} = useSession();

  const {investorId} = useRouter().query;

  const getInvestorOverview = useCallback(async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_DOMAIN_URL}${process.env.NEXT_PUBLIC_API_VERSION_V1}/users/${session?.user?.id}/investors/${investorId}`,
      {
        headers: {
          authorization: `Bearer ${session?.user.tokens.access}`
        }
      }
    );

    return await res.json();
  }, [session]);

  const {data: investorOverviewData} = useQuery({
    queryKey: ['investorOverview'],
    queryFn: getInvestorOverview,
    enabled: !!investorId && !!session?.user?.id
  });

  const fetchSavePreferences = async () => {
    try {
      setLoading(true);
      const res = await makeApiCall('getSavePrefrences', {
        profileId: userInfo?.profileId
      });
      const response = res;

      setResponse(response);
    } catch (error) {
      console.error('Error fetching preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSectorData = async () => {
    try {
      setLoading(true);
      const res = await makeApiCall('getSectorsData', {
        userId: userInfo?.id
      });
      const response = res;

      // Transform the response data into the appropriate format
      const formattedData = response?.data.map((sector: any) => ({
        value: sector.id,
        label: sector.name
      }));
    } catch (error) {
      console.error('Error fetching preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStagesData = async () => {
    try {
      setLoading(true);
      const res = await makeApiCall('getStagesData', {
        userId: userInfo?.id
      });
      const response = res;

      // Transform the response data into the appropriate format
      const formattedData = response?.data.map((stages: any) => ({
        value: stages.id,
        label: stages.name
      }));
    } catch (error) {
      console.error('Error fetching preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocationData = async () => {
    try {
      setLoading(true);
      const res = await makeApiCall('getLocation', {
        userId: userInfo?.id
      });
      const response = res;

      // Transform the response data into the appropriate format
      const formattedData = response?.data.map((location: any) => ({
        value: location.id,
        label: location.name
      }));
    } catch (error) {
      console.error('Error fetching preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo?.profileId) fetchSavePreferences();
    fetchSectorData();
    fetchStagesData();
    fetchLocationData();
  }, [userInfo?.profileId]);

  useEffect(() => {
    if (userInfo?.id && !investmentSetting && userInvestment) {
      getInvestmentSettings();
    }
  }, [userInfo?.id]);
  return (
    <div className={styles.infoContainer}>
      <div className={styles.contentContainer}>
        <div>
          {isLoading ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh'
              }}
            >
              <Spinner size="sm" />
            </div>
          ) : (
            <>
              <div>
                <h5 className={styles.infoHeader}>Background</h5>

                <div className="mt-4">
                  <p>{investorOverviewData?.overview?.background}</p>
                </div>

                {overview?.insiderInformation && (
                  <div className="mt-5">
                    <h5 className={styles.infoHeader}>Insider Information</h5>
                    <div className="mt-3">
                      <p>
                        {investorOverviewData?.overview?.insiderInformation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className={styles.sideInvestContainer}>
        <Card className={styles.investInfoContainer}>
          <div className="d-flex flex-wrap flex-column">
            <h5 className={clsx(styles.infoHeader, 'mb-3')}>
              {`${investorOverviewData?.name} is looking to fund:`}
            </h5>

            <div className="mb-3 px-3 py-2">
              {loading ? (
                <div
                  style={{
                    display: 'flex',
                    alignSelf: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Spinner size="sm" />
                </div>
              ) : (
                <div className="d-flex flex-column ">
                  <div className="d-flex flex-wrap">
                    <span className="fw-bold">Invests In: </span>
                    {investorOverviewData?.overview?.investsIn}
                  </div>
                  <div className="d-flex flex-wrap">
                    <span className="fw-bold">Investment Locations :</span>
                    {investorOverviewData?.overview?.investmentLocations}
                    {response?.data?.locations?.map((ele: any) => (
                      <div key={ele.id} className="">
                        <p className="lh-1 mt-1">{ele.name},</p>
                      </div>
                    ))}
                  </div>
                  <div className="d-flex flex-wrap">
                    <span className="fw-bold">Sector:</span>
                    {response?.data?.sectors?.map((ele: any) => (
                      <div key={ele.id}>
                        <p className="lh-1 mt-1">{ele.title},</p>
                      </div>
                    ))}
                  </div>
                  <div className="d-flex flex-wrap">
                    <span className="fw-bold">Investment Range:</span>
                    <p className="lh-1 mt-1">{response?.data?.ranges}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {userInvestment && (
          <Card className={clsx(styles.investInfoContainer)}>
            <div>
              <div className="d-flex gap-3 align-items-center mb-3">
                <h5 className={styles.infoHeader}>Your Profile</h5>
                <div
                  className={clsx(
                    styles.match,
                    overview?.isProfileMatch && styles.warning
                  )}
                >
                  {' '}
                  {overview?.isProfileMatch ? 'Not Match' : "It's a Match"}
                </div>
              </div>
              <div>
                {UserInvestment.map((ele: any) => {
                  let value = '';

                  if (ele.title === 'Location')
                    value = investmentSetting?.companyCity?.['name'];
                  else
                    value =
                      investmentSetting?.[ele.value as keyof OverviewType];
                  return (
                    <div key={ele.title} className="mb-1">
                      <span className="fw-bold">{ele.title + ' '}</span>:{' '}
                      {value}
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
