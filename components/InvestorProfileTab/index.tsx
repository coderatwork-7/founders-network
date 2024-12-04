import React, {useEffect, useState} from 'react';
import Select from 'react-select';
import {sectorOptions} from '@/utils/data/sectorOptions';

import styles from './InvestorProfileTab.module.scss';
import FnText from '@/ds/FnText';
import {
  useCompanyQuery,
  useInvestmentSectorsQuery,
  useInvestorOverviewQuery,
  useLocationQuery
} from '@/genericApi/foundersNetwork/queries';
import {useSession} from 'next-auth/react';

import FNInput from '@/ds/FNInput';
import {Controller, FormProvider, useForm} from 'react-hook-form';
import {Button} from '@/ds/Button';
import {useInvestorOverviewMutation} from '@/genericApi/foundersNetwork/mutations/useInvestorOverviewMutation';
import {Spinner} from '@/ds/Spinner';
import {investmentStageOptions} from '@/utils/data/investmentStageOptions';
import FnDescriptionList from '@/ds/FnDescriptionList';
import FnDescriptionListItem from '@/ds/FnDescriptionListItem';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPencil} from '@fortawesome/free-solid-svg-icons';
import {investmentSectorOptions} from '@/utils/data/investmentSectorOptions';

interface IProps {}

export const InvestorProfileTab: React.FC<IProps> = props => {
  const {} = props;

  const {data: session} = useSession();

  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const {data: investmentLocations} = useLocationQuery();

  const locationOptions: {value: number; label: string}[] =
    investmentLocations?.map((option: {id: number; name: string}) => {
      return {value: option.id, label: option.name};
    });

  const profileId = session?.user.id;

  const {data, isLoading} = useInvestorOverviewQuery(profileId);

  const sectors = data?.overview?.sector.split(',') ?? [];

  const sectorsValue = sectors?.map((sector: string) =>
    sectorOptions.find(
      sectorOption => sectorOption.label.toLowerCase() === sector
    )
  );

  const investmentRange = data?.overview?.investmentRange ?? '';

  const [investmentFrom, investmentTo] = investmentRange
    ?.replaceAll('$', '')
    ?.split('-')
    ?.map((item: string) => Number(item));

  let defaultValues = {...data};
  let overview = data?.overview ?? {};
  overview.investmentFrom = investmentFrom;
  overview.investmentTo = investmentTo;

  defaultValues = {...defaultValues, overview};

  const methods = useForm({defaultValues});

  useEffect(() => {
    methods.reset({...defaultValues});
  }, [data]);

  const mutation = useInvestorOverviewMutation(profileId);

  const onSubmit = async (data: any) => {
    const formattedData = () => {
      let newData = {
        ...data
      };

      delete newData?.id;
      delete newData?.investorId;
      delete newData?.avatarUrl;
      delete newData?.overview;

      const investmentTo = data?.overview.investmentTo;
      const investmentFrom = data?.overview.investmentFrom;
      const investmentRange = `$${investmentFrom} - $${investmentTo}`;
      const investsIn = Array.isArray(data?.overview?.investsIn)
        ? data?.overview?.investsIn?.map(
            (stage: {value: number; label: string}) => stage.value
          )
        : [];

      const sector = Array.isArray(data?.overview?.sector)
        ? data?.overview?.sector?.map(
            (sector: {value: number; label: string}) => sector.value
          )
        : data?.overview?.sector?.split(',').map((value: string) => {
            return investmentSectorOptions.find(option => {
              return option.label === value;
            })?.value;
          });

      const investmentLocations = Array.isArray(
        data?.overview?.investmentLocations
      )
        ? data?.overview?.investmentLocations?.map(
            (location: {value: number; label: string}) => location.value
          )
        : data?.overview?.investmentLocations
            ?.split(',')
            .map((value: string) => {
              return locationOptions.find(option => {
                return option.label === value;
              })?.value;
            });

      newData.overview = {
        insiderInformation: data.overview.insiderInformation,
        investsIn,
        sector,
        investmentRange,
        investmentLocations
      };

      return newData;
    };

    try {
      setSubmitting(true);
      mutation.mutate(formattedData(), {
        onSuccess: () => {
          setSubmitting(false);
          setShowForm(false);
        }
      });
    } catch (err) {
      setSubmitting(false);
      console.warn(err);
    }
  };

  const handleEdit = () => {
    setShowForm(prevState => !prevState);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className={styles.InvestorProfileTab}>
      <div className={styles.headerRow}>
        <FnText type="heading-xl" bold>
          Profile information
        </FnText>
        <FontAwesomeIcon icon={faPencil} onClick={handleEdit} />
      </div>
      {!showForm ? (
        <div className={styles.descriptionList}>
          <FnDescriptionList>
            <FnDescriptionListItem title="Name" description={data?.name} />
            <FnDescriptionListItem
              title="Designation"
              description={data?.designation}
            />
            <FnDescriptionListItem
              title="Company"
              description={data?.company}
            />
            <FnDescriptionListItem title="Email" description={data?.email} />
            <FnDescriptionListItem
              url
              title="Website"
              description={data?.website}
            />
            <FnDescriptionListItem
              title="Background"
              description={data?.overview?.background}
            />
            <FnDescriptionListItem
              title="Insider information"
              description={data?.overview?.insiderInformation}
            />
            <FnDescriptionListItem
              title="Investment range"
              description={data?.overview?.investmentRange}
            />
            <FnDescriptionListItem
              title="Investment sectors"
              description={data?.overview?.sector}
            />
            <FnDescriptionListItem
              title="Locations"
              description={data?.overview?.investmentLocations}
            />
          </FnDescriptionList>
        </div>
      ) : (
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className={styles.form}
          >
            <FNInput
              topLeftRounded
              topRightRounded
              bottomLeftRounded
              bottomRightRounded
              description="Enter your full legal name."
              label="Name"
              name="name"
              required
            />
            <FNInput
              topLeftRounded
              topRightRounded
              bottomLeftRounded
              bottomRightRounded
              label="Background"
              name="overview.background"
              type="textarea"
              required
            />
            <FNInput
              topLeftRounded
              topRightRounded
              bottomLeftRounded
              bottomRightRounded
              label="Designation"
              name="designation"
              required
            />
            <FNInput
              topLeftRounded
              topRightRounded
              bottomLeftRounded
              bottomRightRounded
              label="Company"
              name="company"
              required
            />
            <FNInput
              topLeftRounded
              topRightRounded
              bottomLeftRounded
              bottomRightRounded
              label="Website"
              name="website"
              required
            />
            <FNInput
              topLeftRounded
              topRightRounded
              bottomLeftRounded
              bottomRightRounded
              label="Cover image"
              name="coverImageUrl"
            />
            <FNInput
              topLeftRounded
              topRightRounded
              bottomLeftRounded
              bottomRightRounded
              label="Company name"
              name="companyName"
              required
            />
            <FNInput
              topLeftRounded
              topRightRounded
              bottomLeftRounded
              bottomRightRounded
              label="Phone number"
              name="phone"
              required
              type="phone"
            />
            {/* <FNInput
            topLeftRounded
            topRightRounded
            bottomLeftRounded
            bottomRightRounded
            label="Enable SMS reminder"
            name="enableSMSReminder"
            required
            type=''
          /> */}
            <FNInput
              topLeftRounded
              topRightRounded
              bottomLeftRounded
              bottomRightRounded
              label="Email address"
              name="email"
              required
            />
            <FNInput
              topLeftRounded
              topRightRounded
              bottomLeftRounded
              bottomRightRounded
              label="Email address"
              name="email"
              required
            />
            <FNInput
              topLeftRounded
              topRightRounded
              bottomLeftRounded
              bottomRightRounded
              label="Tweets"
              name="tweets"
              required
            />
            <FNInput
              topLeftRounded
              topRightRounded
              bottomLeftRounded
              bottomRightRounded
              label="Twitter username"
              name="socialInfo.twitterUsername"
              required
            />
            <FNInput
              topLeftRounded
              topRightRounded
              bottomLeftRounded
              bottomRightRounded
              label="Linkedin username"
              name="socialInfo.linkedinUsername"
              required
            />
            <FNInput
              topLeftRounded
              topRightRounded
              bottomLeftRounded
              bottomRightRounded
              label="Angel list username"
              name="socialInfo.angelListUsername"
              required
            />
            <FNInput
              topLeftRounded
              topRightRounded
              bottomLeftRounded
              bottomRightRounded
              label="Whatsapp number"
              name="socialInfo.whatsappNumber"
              required
            />
            <FNInput
              topLeftRounded
              topRightRounded
              bottomLeftRounded
              bottomRightRounded
              label="Insider information"
              name="overview.insiderInformation"
              required
            />
            <div>
              <FnText>Investment stage focus</FnText>
              <Controller
                control={methods.control}
                name="overview.investsIn"
                render={({field: {onChange, value}}) => {
                  const selectValue = !Array.isArray(value)
                    ? value?.split(',').map((value: string) => {
                        return investmentStageOptions.find(option => {
                          return option.label === value;
                        });
                      })
                    : value;

                  return (
                    <Select
                      className={styles.select}
                      onChange={onChange}
                      options={investmentStageOptions}
                      isMulti={true}
                      value={selectValue}
                    />
                  );
                }}
              />
            </div>
            {/* <FNInput
            topLeftRounded
            topRightRounded
            bottomLeftRounded
            bottomRightRounded
            label="Invests in"
            name="overview.investsIn"
          /> */}
            <div>
              <FnText>Investment sector</FnText>
              <Controller
                control={methods.control}
                name="overview.sector"
                render={({field: {onChange, value}}) => {
                  const selectValue = !Array.isArray(value)
                    ? value?.split(',').map((value: string) => {
                        return investmentSectorOptions.find(option => {
                          return option.label === value;
                        });
                      })
                    : value;

                  return (
                    <Select
                      className={styles.select}
                      onChange={onChange}
                      options={investmentSectorOptions}
                      isMulti={true}
                      value={selectValue}
                    />
                  );
                }}
              />
            </div>
            {/* <FNInput
            topLeftRounded
            topRightRounded
            bottomLeftRounded
            bottomRightRounded
            label="Investment locations"
            name="overview.investmentLocations"
            required
          /> */}
            <div className={styles.investmentRange}>
              <FNInput
                topLeftRounded
                topRightRounded
                bottomLeftRounded
                bottomRightRounded
                label="Investment from"
                name="overview.investmentFrom"
                type="number"
                required
              />
              <FNInput
                topLeftRounded
                topRightRounded
                bottomLeftRounded
                bottomRightRounded
                label="Investment to"
                name="overview.investmentTo"
                type="number"
                required
              />
            </div>

            <div>
              <FnText>Locations</FnText>
              <Controller
                control={methods.control}
                name="overview.investmentLocations"
                render={({field: {onChange, value}}) => {
                  const selectValue = !Array.isArray(value)
                    ? value?.split(',').map((value: string) => {
                        return locationOptions.find(option => {
                          return option.label === value;
                        });
                      })
                    : value;

                  return (
                    <Select
                      className={styles.select}
                      onChange={onChange}
                      options={locationOptions}
                      isMulti={true}
                      value={selectValue}
                    />
                  );
                }}
              />
            </div>
            <Button
              // disabled={submitting}
              // loading={submitting}
              type="submit"
            >
              Save
            </Button>
          </form>
        </FormProvider>
      )}
    </div>
  );
};

export default InvestorProfileTab;
