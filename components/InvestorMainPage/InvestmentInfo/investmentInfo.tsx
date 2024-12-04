import {useState, useEffect} from 'react';
import Card from '@/ds/Card/card';
import styles from './investmentInfo.module.scss';
import {Button, ButtonVariants} from '@/ds/Button';
import Link from 'next/link';
import useAPI from '@/utils/common/useAPI';
import {useSelector} from 'react-redux';
import {selectInvestorInfo, selectUserInfo} from '@/store/selectors';
import ReactSelect from 'react-select';
import {Controller} from 'react-hook-form';
import makeAnimated from 'react-select/animated';
import {Spinner} from '@/ds/Spinner';

const PreferencesInfo = [
  {
    title: 'Locations',
    value: 'Barcelona'
  },
  {
    title: 'Sectors',
    value: 'Consumer'
  },
  {
    title: 'Stages',
    value: 'Seed/Angel ($150k - $1.5M) Series-A+ ($1.5M+)'
  },
  {
    title: 'Range',
    value: '$500K - $3M'
  }
];

const monetizationStrategyOptions = [
  {value: 'Select', label: 'Select'},
  {value: 'SaaS or Subscription', label: 'SaaS or Subscription'},
  {
    value: 'In-App Purchases',
    label: 'In-App Purchases'
  },
  {
    value: 'Marketplace',
    label: 'Marketplace'
  },
  {
    value: 'Advertising',
    label: 'Advertising'
  },
  {
    value: 'Physical Product',
    label: 'Physical Product'
  },
  {
    value: 'Licensing',
    label: 'Licensing'
  },
  {
    value: 'On-Premises Software',
    label: 'On-Premises Software'
  },
  {
    value: 'eCommerce',
    label: 'eCommerce'
  }
];

interface SelectOption {
  value: string;
  label: string;
}
// const makeApiCall = useAPI();
//  const userInfo = useSelector(selectUserInfo());
//  console.log("userInfo", userInfo)

// const fetchSavePreferences = async () => {
//     return makeApiCall('getSavePreferences', {
//       userId: userInfo?.id,
//     });
//   };
//   useEffect(() => {
//     if (userInfo?.id) fetchSavePreferences();
//   }, [userInfo?.id]);

export const InvestmentInfo = () => {
  const [loading, setLoading] = useState(false);
  const userInfo = useSelector(selectUserInfo());
  const api = useAPI();
  const makeApiCall = useAPI();
  const [response, setResponse] = useState<{[key: string]: any}>();
  const [sector, setSector] = useState<SelectOption[]>([]);
  const [satgesData, setStagesData] = useState<SelectOption[]>([]);
  const [locationData, setLocationData] = useState<SelectOption[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<SelectOption[]>(
    []
  );
  const [selectedSectors, setSelectedSectors] = useState<SelectOption[]>([]);
  const [selectedStages, setSelectedStages] = useState<SelectOption[]>([]);
  const [investmentRange, setInvestmentRange] = useState({
    min: '',
    max: ''
  });
  const [show, setShow] = useState(false);
  const animatedComponents = makeAnimated();

  useEffect(() => {
    if (response && response.data && response.data.ranges) {
      const rangeParts = response.data.ranges.split('-');
      setInvestmentRange({
        min: rangeParts[0] || '',
        max: rangeParts[1] || ''
      });
    }
  }, [response]);

  //  console.log('first info user', userInfo)

  // const fetchSavePreferences = () => {
  //     void (async () => {
  //       setLoading(true);
  //      const response = await api('getSavePreferences', {
  //       method: 'GET',
  //       profileId: userInfo?.profileId,
  //       });
  //       console.log("getSavePreferences data", response)
  //       setResponse(response)
  //       setLoading(false);
  //     })();
  //   };

  // useEffect(()=>{
  //   fetchSavePreferences();
  // },[])

  const fetchSavePreferences = async () => {
    try {
      setLoading(true);
      const res = await makeApiCall('getSavePrefrences', {
        profileId: userInfo?.profileId
      });
      const response = res;
      console.log('API response:', response);
      setResponse(response);
    } catch (error) {
      console.error('Error fetching preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const showEditModel = () => {
    setShow(true);
  };

  const savePreferencesModel = () => {
    setShow(false);
    savePreferences();
  };

  const fetchSectorData = async () => {
    try {
      setLoading(true);
      const res = await makeApiCall('getSectorsData', {
        userId: userInfo?.id
      });
      const response = res;
      console.log('Sector API response:', response?.data);

      // Transform the response data into the appropriate format
      const formattedData = response?.data.map((sector: any) => ({
        value: sector.id,
        label: sector.name
      }));

      setSector(formattedData);
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
      console.log('Sector API response:', response?.data);

      // Transform the response data into the appropriate format
      const formattedData = response?.data.map((stages: any) => ({
        value: stages.id,
        label: stages.name
      }));

      setStagesData(formattedData);
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
      console.log('Location API response:', response?.data);

      // Transform the response data into the appropriate format
      const formattedData = response?.data.map((location: any) => ({
        value: location.id,
        label: location.name
      }));

      setLocationData(formattedData);
    } catch (error) {
      console.error('Error fetching preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationChange = (selectedOptions: any) => {
    setSelectedLocations(selectedOptions);
  };

  const handleSectorChange = (selectedOptions: any) => {
    setSelectedSectors(selectedOptions);
  };

  const handleStageChange = (selectedOptions: any) => {
    setSelectedStages(selectedOptions);
  };

  const savePreferences = async () => {
    const locationsToSave =
      selectedLocations.length > 0
        ? selectedLocations.map(location => location.value)
        : response?.data?.locations.map((location: any) => location.id) || [];
    const sectorsToSave =
      selectedSectors.length > 0
        ? selectedSectors.map(sector => sector.value)
        : response?.data?.sectors.map((sector: any) => sector.id) || [];
    const stagesToSave =
      selectedStages.length > 0
        ? selectedStages.map(stage => stage.value)
        : response?.data?.stages.map((stage: any) => stage.id) || [];

    try {
      setLoading(true);
      const data = {
        locations: locationsToSave,
        sectors: sectorsToSave,
        stages: stagesToSave,
        range: `${investmentRange.min}-${investmentRange.max}`
      };

      const res = await makeApiCall(
        'putSavePreferences',
        {profileId: userInfo?.profileId},
        {method: 'PUT', data: data}
      );
      fetchSavePreferences();
      console.log('Preferences saved successfully:', res);
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const rangeParts = (response?.data?.ranges || '').split('-');

  useEffect(() => {
    if (userInfo?.profileId) fetchSavePreferences();
    fetchSectorData();
    fetchStagesData();
    fetchLocationData();
  }, [userInfo?.profileId]);

  return (
    <Card>
      <div style={{backgroundColor: '#fafafa'}}>
        <div className="px-1 py-2">
          <h5 className="my-0">Your Preferences</h5>
        </div>
        <hr className="my-1" />
        {show ? (
          <div>
            <div className="pt-2" style={{width: '90%', marginLeft: 10}}>
              <h6 style={{color: '#999', fontSize: '16px'}}>Location :</h6>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <ReactSelect
                  // {...register('monetizationStrategy')}
                  placeholder="Select all that apply"
                  options={locationData}
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isMulti
                  className={styles.selectInput}
                  defaultValue={
                    response?.data?.locations.map((location: any) => ({
                      value: location.id,
                      label: location.name
                    })) || []
                  }
                  onChange={handleLocationChange} // Add onChange event handler
                />
              </div>
            </div>
            <div className="pt-2" style={{width: '90%', marginLeft: 10}}>
              <h6 style={{color: '#999', fontSize: '16px'}}>Sector :</h6>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <ReactSelect
                  // {...register('monetizationStrategy')}
                  placeholder="Select all that apply"
                  options={sector}
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isMulti
                  className={styles.selectInput}
                  defaultValue={
                    response?.data?.sectors.map((sector: any) => ({
                      value: sector.id,
                      label: sector.title
                    })) || []
                  }
                  onChange={handleSectorChange}
                />
              </div>
            </div>
            <div className="pt-2" style={{width: '90%', marginLeft: 10}}>
              <h6 style={{color: '#999', fontSize: '16px'}}>Stages :</h6>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <ReactSelect
                  // {...register('monetizationStrategy')}
                  placeholder="Select all that apply"
                  options={satgesData}
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isMulti
                  className={styles.selectInput}
                  defaultValue={
                    response?.data?.stages.map((stage: any) => ({
                      value: stage.id,
                      label: stage.title
                    })) || []
                  }
                  onChange={handleStageChange}
                />
              </div>
            </div>
            <div className="pt-2 pb-3" style={{marginLeft: '30px'}}>
              <h6 style={{color: '#999', fontSize: '16px'}}>Range:</h6>
              <div className="d-flex flex-row justify-content-start gap-2 ">
                <input
                  type="text"
                  placeholder="$"
                  style={{width: '80px', height: '25px'}}
                  value={
                    investmentRange.min !== undefined ? investmentRange.min : ''
                  }
                  onChange={e =>
                    setInvestmentRange(prevRange => ({
                      ...prevRange,
                      min: e.target.value
                    }))
                  }
                />
                <span>-</span>
                <input
                  type="text"
                  placeholder="$"
                  style={{width: '80px', height: '25px'}}
                  value={
                    investmentRange.max !== undefined ? investmentRange.max : ''
                  }
                  onChange={e =>
                    setInvestmentRange(prevRange => ({
                      ...prevRange,
                      max: e.target.value
                    }))
                  }
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-3 px-3 py-2">
            {loading ? (
              <div>
                <Spinner size="sm" />
              </div>
            ) : (
              <div className="d-flex flex-column ">
                <div className="d-flex flex-wrap">
                  <span className="fw-bold">Invests In :</span>
                  {response?.data?.stages?.map((ele: any) => (
                    <div key={ele.id} className="">
                      <p>{ele.title},</p>
                    </div>
                  ))}
                </div>
                <div className="d-flex flex-wrap">
                  <span className="fw-bold">Investment Locations :</span>
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
        )}
        <hr className="my-0" />
        <div className="py-2 px-2">
          {show ? (
            <Button
              variant={ButtonVariants.CardPrimary}
              textUppercase
              className={styles.editButton}
              onClick={savePreferencesModel}
            >
              save Preferences
            </Button>
          ) : (
            <Link href={''}>
              <Button
                variant={ButtonVariants.CardPrimary}
                textUppercase
                className={styles.editButton}
                onClick={showEditModel}
              >
                edit Preferences
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
};
