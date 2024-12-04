import React, {useEffect, useState} from 'react';
import Card from '@/ds/Card/card';
import Link from 'next/link';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import styles from './informationCard.module.scss';
import {faArrowUpRightFromSquare} from '@fortawesome/free-solid-svg-icons';
import {ProfileData} from '@/types/profile';
// import Avatar from '@/ds/Avatar/avatar';
import useAPI from '@/utils/common/useAPI';
import Image from 'next/image';
// import PitchDeck from '@/components/Pitchdeck/PitchDeck';

interface InformationCardProps {
  profileData: ProfileData;
}

const InformationCard: React.FC<InformationCardProps> = ({profileData}) => {
  const api = useAPI();
  const [companyData, setCompanyData] = useState<any>(null);

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        if (profileData && profileData.id) {
          const data: any = await api('getCompanyProfile', {
            profileId: profileData?.id
          });
          setCompanyData(data);
        } else {
          console.log('Profile data or profile id is not available.');
        }
      } catch (error) {
        console.error('Error fetching company profile data:', error);
      }
    };

    fetchCompanyProfile();
  }, [api, profileData?.id]);

  const handleClick = (event: any) => {
    event.preventDefault(); // Prevent the default behavior of the click event
  };

  return (
    <Card className={styles.informationCard}>
      <div className={styles.leftContainer}>
        <h4>Expertise</h4>
        <ul>
          {profileData?.expertise &&
            profileData?.expertise.map(
              (expertiseData: {id: number; name: string}) => (
                <Link
                  href={`/members/?expertise=${expertiseData?.id}`}
                  onClick={handleClick}
                >
                  <li className="container-box-shadow" key={expertiseData.id}>
                    {expertiseData.name}
                  </li>
                </Link>
              )
            )}
        </ul>
      </div>

      <div className={styles.rightContainer}>
        <div className={styles.bioContainer}>
          <h4>Bio</h4>
          <Card className={styles.bioCard}>
            <p>{profileData?.background && `${profileData?.background}`}</p>
          </Card>
        </div>
        <div className={styles.bioContainer}>
          <h4>Current Startup</h4>
          <Card className={styles.bioCard}>
            <a
              target="_blank"
              href={`${profileData?.company?.url}`}
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 10,
                textDecoration: 'none',
                color: 'inherit',
                fontWeight: 'bolder'
              }}
              onMouseEnter={e =>
                (e.currentTarget.style.textDecoration = 'underline')
              }
              onMouseLeave={e =>
                (e.currentTarget.style.textDecoration = 'none')
              }
            >
              <h5 style={{fontWeight: 'bold'}}>
                {profileData?.company?.name && `${profileData?.company.name}`}
              </h5>
              <FontAwesomeIcon size="1x" icon={faArrowUpRightFromSquare} />
            </a>
            <p>
              {profileData?.company?.shortDescription &&
                `${profileData?.company.shortDescription}`}
            </p>

            <div className="d-flex flex-row justify-content-between">
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  border: 'none',
                  gap: 20
                }}
              >
                <strong>Company Logo:</strong>
                {companyData?.data?.companyLogoUrl && (
                  <div className={styles.imageWrapper}>
                    <a href={companyData?.data?.companyLogoUrl} target="_blank">
                      <Image
                        src={companyData?.data?.companyLogoUrl}
                        alt="Company Logo"
                        width={130}
                        height={130}
                        className={styles.companyLogo}
                      />
                    </a>
                  </div>
                )}
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  border: 'none',
                  gap: 20
                }}
              >
                <strong>Pitch Deck:</strong>

                {/* {companyData?.data?.pitchDeckUrl && (
                  <PitchDeck url={companyData?.data?.pitchDeckUrl} />
                )} */}
              </div>
            </div>

            <div className={styles.companyContainer}>
              <h4>Company Detail</h4>
              {/* <div className={styles.companyRow}>
            <div className={styles.companyColumn}>
              <strong>Company Name:</strong>
              <p>{companyData?.data?.companyName}</p>
            </div>
            <div className={styles.companyColumn}>
              <strong>Company Website:</strong>
              <a href={companyData?.data?.websiteUrl} target="_blank">
                <p>{companyData?.data?.websiteUrl}</p>
              </a>
            </div>
          </div> */}
              {/* <div className={styles.companyRow}>
            <div className={styles.companyColumn}>
              <strong>Company Logo:</strong>
              {companyData?.data?.companyLogoUrl && (
                <div className={styles.imageWrapper}>
                  <Image
                    src={companyData?.data?.companyLogoUrl}
                    alt="Company Logo"
                    width={100}
                    height={100}
                  />
                </div>
              )}
            </div>
            <div className={styles.companyColumn}>
              <strong>Pitch Deck:</strong>
              {companyData?.data?.pitchDeckUrl && (
                <div className={styles.imageWrapper}>
                  {companyData?.data?.pitchDeckUrl
                    .toLowerCase()
                    .endsWith('.pdf') ? (
                    // Display PDF in embed
                    <embed
                      src={companyData?.data?.pitchDeckUrl}
                      width="130"
                      height="130"
                    />
                  ) : (
                    // Display image
                    <Image
                      src={companyData?.data?.pitchDeckUrl}
                      alt="Pitch Deck"
                      width={100}
                      height={100}
                    />
                  )}
                </div>
              )}
            </div>
          </div> */}
              <div className={styles.companyRow}>
                <div className={styles.companyColumn}>
                  <strong>Location:</strong>
                  <p>{companyData?.data?.location?.name}</p>
                </div>
                <div className={styles.companyColumn}>
                  <strong>Tech Sectors:</strong>
                  <div className="d-flex gap-2">
                    {companyData?.data?.sectors?.map((sector: any) => (
                      <p key={sector.id}>{sector.name},</p>
                    ))}
                  </div>
                </div>
              </div>
              <div className={styles.companyRow}>
                <div className={styles.companyColumn}>
                  <strong>Industry:</strong>
                  <div className="d-flex gap-2">
                    {companyData?.data?.investmentSector?.map((sector: any) => (
                      <p key={sector.id}>{sector.name}, hey</p>
                    ))}
                  </div>
                </div>
                <div className={styles.companyColumn}>
                  <strong>Accelerator:</strong>
                  <div className="d-flex gap-2">
                    {companyData?.data?.accelerator?.map((acce: any) => (
                      <p key={acce}>{acce},</p>
                    ))}
                  </div>
                </div>
                {/* <div className={styles.companyColumn}>
              <strong>Current Monthly Revenue :</strong>
              <p>{companyData?.data?.currentMonthlyRevenue}</p>
            </div> */}
                {/* <div className={styles.companyColumn}>
              <strong>Blog:</strong>
              <p>{companyData?.data?.companyBlog}</p>
            </div> */}
              </div>
              <div className={styles.companyRow}>
                <div className={styles.companyColumn}>
                  <strong>Stage:</strong>
                  <p>{companyData?.data?.stage}</p>
                </div>
                <div className={styles.companyColumn}>
                  <strong>Current Investors:</strong>
                  <p>{companyData?.data?.currentMonthlyRevenue}</p>
                </div>
              </div>
              {/* <div className={styles.companyRow}>
            <div className={styles.companyColumn}>
              <strong>Monetization Strategy:</strong>
              <p>{companyData?.data?.monetizationStrategy}</p>
            </div>
            <div className={styles.companyColumn}>
              <strong>Target Market:</strong>
              <p>{companyData?.data?.targetMarket}</p>
            </div>
          </div> */}
              {/* <div className={styles.companyRow}>
            <div className={styles.companyColumn}>
              <strong>Revenue Growth Rate MoM:</strong>
              <p>{companyData?.data?.revenueGrowthRateMoM}</p>
            </div>
            <div className={styles.companyColumn}>
              <strong>New User Growth Rate MoM:</strong>
              <p>{companyData?.data?.newUserGrowthRateMoM}</p>
            </div>
          </div> */}
              {/* <div className={styles.companyRow}>
            <div className={styles.companyColumn}>
              <strong>Current Monthly Revenue:</strong>
              <p>{companyData?.data?.currentMonthlyRevenue}</p>
            </div>
            <div className={styles.companyColumn}>
              <strong>Priorities:</strong>
              <p>{companyData?.data?.priorities}</p>
            </div>
          </div> */}
              {/* <div className={styles.companyRow}>

            <div className={styles.companyColumn}>
              <strong>Looking to raise:</strong>
              <p>{companyData?.data?.lookingToRaise}</p>
            </div>
          </div> */}
              {/* <div className={styles.companyRow}>
            <div className={styles.companyColumn}>
              <strong>Customers:</strong>
              <p>{companyData?.data?.customers}</p>
            </div>
            <div className={styles.companyColumn}>
              <strong>Annual Revenue:</strong>
              <p>{companyData?.data?.revenue}</p>
            </div>
          </div> */}
              <div className={styles.companyRow}>
                {/* <div className={styles.companyColumn}>
              <strong>Current Funding:</strong>
              <p>{companyData?.data?.currentFunding}</p>
            </div> */}
                <div className={styles.companyColumn}>
                  <strong>Launch Date:</strong>
                  <p>
                    {companyData?.data?.launchDate
                      ? `${companyData.data.launchDate.split('/')[1]}/${
                          companyData.data.launchDate.split('/')[0]
                        }/${companyData.data.launchDate.split('/')[2]}`
                      : null}
                  </p>
                </div>

                {/* <div className={styles.companyColumn}>
                  <strong>Company Description:</strong>
                  <p>{companyData?.data?.companyDescription}</p>
                </div> */}
              </div>
            </div>
            {/* <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    border: 'none'
                  }}
                >
                  <strong>Linkedin Account</strong>
                  <p>{profileData?.socialLinks?.linkedin}</p>
                </div> */}
          </Card>
        </div>
        <div className={styles.bioContainer}>
          <h4>Notable Founder Stats</h4>
          <Card className={styles.bioCard}>
            <div
              className={styles.dataContainer}
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}
            >
              <div
                className={styles.statsLeftContainer}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%'
                }}
              >
                {profileData?.noteableFoundersStats?.map(
                  (notableStat: {name: string; value: number | string}) => {
                    // Exclude "Capital Raised" and "Value of Exits" from being mapped
                    if (
                      notableStat.name !== 'Capital Raised' &&
                      notableStat.name !== 'Value of Exits'
                    ) {
                      return (
                        <p key={notableStat.name}>
                          {/* Adding a key prop is a good practice */}
                          <strong>{`${notableStat.name}`}:&nbsp;&nbsp;</strong>
                          {`${notableStat.value}`}
                        </p>
                      );
                    }
                    return null; // Return null for excluded items
                  }
                )}
              </div>

              {/* <div className={styles.statsRightContainer}>
              {profileData?.pitchDeck[0]?.imgUrl ? (
                <Avatar
                  newDesign={true}
                  avatarUrl={profileData?.pitchDeck?.[0]?.imgUrl}
                  altText={profileData?.pitchDeck[0]?.name}
                  imageHeight={150}
                  imageWidth={150}
                  badge="none"
                />
              ) : (
                <div className={styles.statsOfferHelp}>
                  No pitch deck image.
                </div>
              )}
            </div> */}
            </div>
          </Card>
        </div>

        {/* <div className={styles.statsContainer}>
          <h4>Notable Founder Stats</h4>
          <div className={styles.dataContainer}>
            <div className={styles.statsLeftContainer}>
              {profileData?.noteableFoundersStats?.map(
                (notableStat: {name: string; value: number | string}) => {

                  if (
                    notableStat.name !== 'Capital Raised' &&
                    notableStat.name !== 'Value of Exits'
                  ) {
                    return (
                      <p key={notableStat.name}>
                        {' '}

                        <strong>{`${notableStat.name}`}:&nbsp;&nbsp;</strong>
                        {`${notableStat.value}`}
                      </p>
                    );
                  }
                  return null;
                }
              )}
            </div>

            <div className={styles.statsRightContainer}>
              {profileData?.pitchDeck[0]?.imgUrl ? (
                <Avatar
                  newDesign={true}
                  avatarUrl={profileData?.pitchDeck?.[0]?.imgUrl}
                  altText={profileData?.pitchDeck[0]?.name}
                  imageHeight={150}
                  imageWidth={150}
                  badge="none"
                />
              ) : (
                <div className={styles.statsOfferHelp}>
                  No pitch deck image.
                </div>
              )}
            </div>
          </div>
        </div> */}
        {/* <div className={styles.companyContainer}>
          <h4>Company Detail</h4>
          <div className={styles.companyRow}>
            <div className={styles.companyColumn}>
              <strong>Company Name:</strong>
              <p>{companyData?.data?.companyName}</p>
            </div>
            <div className={styles.companyColumn}>
              <strong>Company Website:</strong>
              <a href={companyData?.data?.websiteUrl} target="_blank">
                <p>{companyData?.data?.websiteUrl}</p>
              </a>
            </div>
          </div>
          <div className={styles.companyRow}>
            <div className={styles.companyColumn}>
              <strong>Company Logo:</strong>
              {companyData?.data?.companyLogoUrl && (
                <div className={styles.imageWrapper}>
                  <Image
                    src={companyData?.data?.companyLogoUrl}
                    alt="Company Logo"
                    width={100}
                    height={100}
                  />
                </div>
              )}
            </div>
            <div className={styles.companyColumn}>
              <strong>Pitch Deck:</strong>
              {companyData?.data?.pitchDeckUrl && (
                <div className={styles.imageWrapper}>
                  {companyData?.data?.pitchDeckUrl
                    .toLowerCase()
                    .endsWith('.pdf') ? (
                    // Display PDF in embed
                    <embed
                      src={companyData?.data?.pitchDeckUrl}
                      width="130"
                      height="130"
                    />
                  ) : (
                    // Display image
                    <Image
                      src={companyData?.data?.pitchDeckUrl}
                      alt="Pitch Deck"
                      width={100}
                      height={100}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
          <div className={styles.companyRow}>
            <div className={styles.companyColumn}>
              <strong>Location:</strong>
              <p>{companyData?.data?.location?.name}</p>
            </div>
            <div className={styles.companyColumn}>
              <strong>Tech Sectors:</strong>
              <div className="d-flex gap-2">
                {companyData?.data?.sectors?.map((sector: any) => (
                  <p key={sector.id}>{sector.name},</p>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.companyRow}>
            <div className={styles.companyColumn}>
              <strong>Industry:</strong>
              <div className="d-flex gap-2">
                {companyData?.data?.investmentSector?.map((sector: any) => (
                  <p key={sector.id}>{sector.name},</p>
                ))}
              </div>
            </div>
            <div className={styles.companyColumn}>
              <strong>Accelerator:</strong>
              <div className="d-flex gap-2">
                {companyData?.data?.accelerator?.map((acce: any) => (
                  <p key={acce.id}>{acce.name},</p>
                ))}
              </div>
            </div>
            <div className={styles.companyColumn}>
              <strong>Current Monthly Revenue :</strong>
              <p>{companyData?.data?.currentMonthlyRevenue}</p>
            </div>
            <div className={styles.companyColumn}>
              <strong>Blog:</strong>
              <p>{companyData?.data?.companyBlog}</p>
            </div>
          </div>
          <div className={styles.companyRow}>
            <div className={styles.companyColumn}>
              <strong>Stage:</strong>
              <p>{companyData?.data?.stage}</p>
            </div>
            <div className={styles.companyColumn}>
              <strong>Current Investors:</strong>
              <p>{companyData?.data?.currentMonthlyRevenue}</p>
            </div>
          </div>
          <div className={styles.companyRow}>
            <div className={styles.companyColumn}>
              <strong>Monetization Strategy:</strong>
              <p>{companyData?.data?.monetizationStrategy}</p>
            </div>
            <div className={styles.companyColumn}>
              <strong>Target Market:</strong>
              <p>{companyData?.data?.targetMarket}</p>
            </div>
          </div>
          <div className={styles.companyRow}>
            <div className={styles.companyColumn}>
              <strong>Revenue Growth Rate MoM:</strong>
              <p>{companyData?.data?.revenueGrowthRateMoM}</p>
            </div>
            <div className={styles.companyColumn}>
              <strong>New User Growth Rate MoM:</strong>
              <p>{companyData?.data?.newUserGrowthRateMoM}</p>
            </div>
          </div>
          <div className={styles.companyRow}>
            <div className={styles.companyColumn}>
              <strong>Current Monthly Revenue:</strong>
              <p>{companyData?.data?.currentMonthlyRevenue}</p>
            </div>
            <div className={styles.companyColumn}>
              <strong>Priorities:</strong>
              <p>{companyData?.data?.priorities}</p>
            </div>
          </div>
          <div className={styles.companyRow}>

            <div className={styles.companyColumn}>
              <strong>Looking to raise:</strong>
              <p>{companyData?.data?.lookingToRaise}</p>
            </div>
          </div>
          <div className={styles.companyRow}>
            <div className={styles.companyColumn}>
              <strong>Customers:</strong>
              <p>{companyData?.data?.customers}</p>
            </div>
            <div className={styles.companyColumn}>
              <strong>Annual Revenue:</strong>
              <p>{companyData?.data?.revenue}</p>
            </div>
          </div>
          <div className={styles.companyRow}>
            <div className={styles.companyColumn}>
              <strong>Current Funding:</strong>
              <p>{companyData?.data?.currentFunding}</p>
            </div>
            <div className={styles.companyColumn}>
              <strong>Launch Date:</strong>
              <p>
                {companyData?.data?.launchDate
                  ? `${companyData.data.launchDate.split('/')[1]}/${
                      companyData.data.launchDate.split('/')[0]
                    }/${companyData.data.launchDate.split('/')[2]}`
                  : null}
              </p>
            </div>

            <div className={styles.companyColumn}>
              <strong>Company Description:</strong>
              <p>{companyData?.data?.companyDescription}</p>
            </div>
          </div>
        </div> */}
      </div>
    </Card>
  );
};

export default InformationCard;
