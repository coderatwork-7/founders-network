import React, {useCallback} from 'react';

import styles from './InvestmentSettingsForm.module.scss';
import {FormProvider, useForm} from 'react-hook-form';
import FNInput from '@/ds/FNInput';
import FNSelect from '@/ds/FNSelect';
import {useSession} from 'next-auth/react';
import {useQuery} from '@tanstack/react-query';
import {Button} from 'react-bootstrap';
import {ButtonVariants} from '@/ds/Button';
import {useSelector} from 'react-redux';
import {selectUserInfo} from '@/store/selectors';
import {IInvestmentSettingsForm} from './IInvestmentSettingsForm';
import useAPI from '@/utils/common/useAPI';

interface IProps {
  setShowEditForm: (input: boolean) => void;
}

export const InvestmentSettingsForm: React.FC<IProps> = props => {
  const {setShowEditForm} = props;

  const makeApiCall = useAPI();

  const {data: session} = useSession();
  const userInfo = useSelector(selectUserInfo());

  const methods = useForm<IInvestmentSettingsForm>({mode: 'onBlur'});

  const getStageOptions = useCallback(async () => {
    if (session?.user?.profileId) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN_URL}${process.env.NEXT_PUBLIC_API_VERSION_V1}/users/${session?.user?.id}/investor/stages`,
        {
          headers: {
            authorization: `Bearer ${session?.user.tokens.access}`
          }
        }
      );
      return await res.json();
    }
  }, [session]);

  const {data: stagesData, isLoading: isStagesDataLoading} = useQuery({
    queryKey: ['stagesData'],
    queryFn: getStageOptions,
    enabled: !!session?.user?.id
  });

  const getChapterLocations = useCallback(async () => {
    if (session?.user?.profileId) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN_URL}${process.env.NEXT_PUBLIC_API_VERSION_V1}/users/${session?.user.profileId}/location`,
        {
          headers: {
            authorization: `Bearer ${session?.user.tokens.access}`
          }
        }
      );

      return await res.json();
    }
  }, [session]);

  const {data: chapterLocationData, isLoading: chapterLocationsLoading} =
    useQuery({
      queryKey: ['chapterLocations'],
      queryFn: getChapterLocations,
      enabled: !!session?.user?.id
    });

  const chapterLocations = chapterLocationData?.map(
    (chapter: {id: number; name: string}) => ({
      value: chapter.id,
      label: chapter.name
    })
  );

  const getSectors = useCallback(async () => {
    if (session?.user?.profileId) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN_URL}${process.env.NEXT_PUBLIC_API_VERSION_V1}/users/${session?.user.profileId}/sectors`,
        {
          headers: {
            authorization: `Bearer ${session?.user.tokens.access}`
          }
        }
      );

      return await res.json();
    }
  }, [session]);

  const {data: sectorData, isLoading: sectorDataLoading} = useQuery({
    queryKey: ['sectors'],
    queryFn: getSectors,
    enabled: !!session?.user?.id
  });

  const sectorOptions = sectorData?.map(
    (chapter: {id: number; name: string}) => ({
      value: chapter.id,
      label: chapter.name
    })
  );

  const stageOptions = stagesData?.map((stage: {id: number; name: string}) => ({
    value: stage.id,
    label: stage.name
  }));

  const submitPreferencesForm = async (data: IInvestmentSettingsForm) => {
    const {
      investmentLocations,
      investmentRangeMax,
      investmentRangeMin,
      stages,
      sector
    } = data;

    const locations = investmentLocations?.map(location => location.value);

    const sectors = sector?.map(sector => sector.value);

    const investmentStages = stages?.map(stage => stage.value);
    const formattedData = {
      overview: {
        locations,
        sectors,
        stages: investmentStages,
        ranges: `$${investmentRangeMin}-$${investmentRangeMax}`
      }
    };

    try {
      const res = await makeApiCall(
        'putSavePreferences',
        {profileId: userInfo?.profileId},
        {method: 'PUT', data: formattedData}
      );
      if (!res.isError) {
        setShowEditForm(false);
      }
    } catch (e) {
      console.warn('Error saving investor preferences:', e);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        className={styles.InvestmentSettingsForm}
        onSubmit={methods.handleSubmit(submitPreferencesForm)}
      >
        <FNSelect
          isMulti
          options={stageOptions}
          label="Invests in"
          name="stages"
        />
        <FNSelect
          label="Investment locations"
          name="investmentLocations"
          options={chapterLocations}
          isMulti
        />
        <FNSelect
          label="Sectors"
          name="sector"
          options={sectorOptions}
          isMulti
        />
        <label>Investment Range</label>
        <div className={styles.minMaxContainer}>
          <FNInput
            placeholder="Minimum value"
            name="investmentRangeMin"
            borderRight={false}
          />
          <FNInput placeholder="Maximum value" name="investmentRangeMax" />
        </div>

        <FNInput label="Background" name="background" type="textarea" />
        <FNInput
          label="Insider information"
          name="insiderInformation"
          type="textarea"
        />
        <Button variant={ButtonVariants.Primary} type="submit">
          Save
        </Button>
      </form>
    </FormProvider>
  );
};

export default InvestmentSettingsForm;
