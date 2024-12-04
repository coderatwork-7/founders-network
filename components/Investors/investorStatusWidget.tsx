import React, {useContext, useEffect, useState} from 'react';
import Link from 'next/link';
import classes from './investorStatusWidget.module.scss';
import useAPI from '@/utils/common/useAPI';
import {useSelector} from 'react-redux';
import {
  selectApiState,
  selectFacets,
  selectInvestmentSettings,
  selectUserInfo
} from '@/store/selectors';
import clsx from 'clsx';
import {Button, ButtonVariants} from '@/ds/Button';
import {InvestorsPageFacetsContext} from '../ContextProviders/InvestorsFacetsContext';
import {FacetState} from '@/utils/common/commonTypes';
import {
  CONST_INVESTORS,
  INVESTOR_DEFAULT_SEARCH_PARAM
} from '@/utils/common/constants';
import {EditableFacetField} from './EditableFacetField';
import {useSearchParams} from 'next/navigation';
import {Spinner} from '@/ds/Spinner';
import {parseNum} from '@/utils/common/helper';
import {OnboardingTooltip} from '../Onboarding/OnboardingTooltip';
import FnText from '@/ds/FnText';
import {useRouter} from 'next/router';

const getUpdatedFacetObject = (
  newFacet: FacetState,
  facetsObj: FacetState,
  isMultiselect: boolean,
  removeIfAlreadyPresent: boolean = true
) => {
  const facetKey = Object.keys(newFacet)[0];
  const facetValueKey = Object.keys(newFacet[facetKey])[0];

  if (facetsObj?.[facetKey]?.[facetValueKey] && removeIfAlreadyPresent) {
    const {[facetValueKey]: _, ...rest} = facetsObj[facetKey];
    return {...facetsObj, [facetKey]: rest};
  } else {
    return isMultiselect
      ? {
          ...facetsObj,
          [facetKey]: {...facetsObj[facetKey], ...newFacet[facetKey]}
        }
      : {...facetsObj, [facetKey]: newFacet[facetKey]};
  }
};

const mapFacet = (obj: any) => ({
  facetValueKey: obj?.key,
  facetValueName: obj?.name
});

export const getFacets = (
  facet: any,
  type: string,
  key?: string,
  avoidMapping?: boolean
) => {
  const facetItem = facet?.find(
    (facetItem: any) => facetItem.facet.key === type
  );
  if (key) {
    return avoidMapping
      ? facetItem?.facetValues?.find((item: any) => key == item.key)
      : mapFacet(facetItem?.facetValues?.find((item: any) => key == item.key));
  }
  return facetItem;
};

const InvestorStatusWidget: React.FC = () => {
  const api = useAPI();
  const userInfo = useSelector(selectUserInfo());
  const investmentData = useSelector(selectInvestmentSettings());
  const facets = useSelector(selectFacets(CONST_INVESTORS));
  const [sectorData, setSectorData] = useState<any>({});
  const [cityData, setCityData] = useState<any>({});
  const [isSectorUpdated, setIsSectorUpdated] = useState(true);
  const [isCityUpdated, setIsCityUpdated] = useState(true);
  const [amount, setAmount] = useState<string | number>(0);
  const [activeField, setActiveField] = useState<string>('');
  const loading = !!useSelector(selectApiState('investmentSettings'));
  const isInvestorMainPage = useSearchParams().has(
    INVESTOR_DEFAULT_SEARCH_PARAM
  );

  const getInvestmentSettings = () => {
    return api('investmentSettings', {userId: userInfo?.id});
  };

  const getInvestorFacets = () => {
    return api('getFacets', {
      page: CONST_INVESTORS,
      userId: userInfo?.id
    });
  };

  const {setSelectedFacetValues, setApplyFacets} = useContext(
    InvestorsPageFacetsContext
  );

  const updateInvestmentSettings = () => {
    const updatedData = {
      sector: Object.keys(sectorData.sector).map(parseNum),
      companyCityId: parseNum(Object.keys(cityData.city)?.[0] ?? ''),
      lookingToRaise: amount.toString().replace(/\$/g, '')
    };
    return api(
      'investmentSettings',
      {userId: userInfo?.id},
      {method: 'POST', data: updatedData}
    )
      .then(() => setActiveField(''))
      .catch(() => {
        setSectorData(getSectorFromInvestmentData());
        setCityData(getCityFromInvestmentData());
        setActiveField('');
      });
  };

  const getSectorFromInvestmentData = () => {
    return {
      sector: investmentData?.sector?.reduce((acc: any, obj: any) => {
        const mappedObj = getFacets(facets, 'sector', obj.id);
        if (mappedObj.facetValueKey) acc[obj.id] = mappedObj;
        return acc;
      }, {})
    };
  };

  const getCityFromInvestmentData = () => {
    const facet = getFacets(facets, 'city', investmentData?.companyCity?.id);
    return {
      city: facet?.facetValueKey ? {[facet.facetValueKey]: facet} : {}
    };
  };

  const handleSectorFacetClick = (obj: any, isMultiselect: boolean) => {
    setSectorData((prev: any) =>
      getUpdatedFacetObject(obj, prev, isMultiselect)
    );
  };

  const handleCityFacetClick = (obj: any, isMultiselect: boolean) => {
    setCityData((prev: any) => getUpdatedFacetObject(obj, prev, isMultiselect));
  };

  const handleSectorUpdate = () => {
    setIsSectorUpdated(true);
    updateInvestmentSettings();
  };
  const handleCityUpdate = () => {
    setIsCityUpdated(true);
    updateInvestmentSettings();
  };

  const handleAmountUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  useEffect(() => {
    if (!investmentData && userInfo?.id) getInvestmentSettings();
    if (!facets && userInfo?.id) getInvestorFacets();
  }, [userInfo?.id]);

  useEffect(() => {
    if (investmentData && facets) {
      const updatedSectorData = getSectorFromInvestmentData();
      const updatedCityData = getCityFromInvestmentData();
      setSectorData(updatedSectorData);
      setCityData(updatedCityData);
      setAmount(investmentData?.lookingToRaise);

      if (isInvestorMainPage) {
        setSelectedFacetValues(
          ({[INVESTOR_DEFAULT_SEARCH_PARAM]: defaultParam, ...prev}) => ({
            type: prev.type,
            sector: updatedSectorData.sector,
            city: updatedCityData.city
          })
        );
      } else {
        setSelectedFacetValues(
          ({[INVESTOR_DEFAULT_SEARCH_PARAM]: defaultParam, ...prev}) => {
            const sectorNew = isSectorUpdated
              ? {...updatedSectorData.sector, ...prev.sector}
              : prev.sector;
            const cityNew = isCityUpdated
              ? {...updatedCityData.city, ...prev.city}
              : prev.city;
            return {
              ...prev,
              sector: sectorNew,
              city: cityNew
            };
          }
        );
      }

      setIsCityUpdated(false);
      setIsSectorUpdated(false);
      setApplyFacets?.(true);
    }
  }, [investmentData, facets, isInvestorMainPage]);

  const router = useRouter();

  const handleUpdateProfile = () => {
    router.push('/settings?tab=company');
  };

  return (
    <div className={clsx([classes.widgetContainer, 'container-border'])}>
      {!(investmentData && facets) ? (
        <Spinner className="my-5 mx-auto" />
      ) : (
        <>
          <div className={classes.section}>
            <div className={classes.sectionBody}>
              <FnText type="heading-xSmall" color="green">
                Your Investment Settings
              </FnText>

              <div>
                <EditableFacetField
                  label="Stage"
                  value={investmentData?.stage}
                  defaultEditElement={
                    <div>
                      <Link href="/raise">Upgrade</Link> to change your stage
                    </div>
                  }
                  activeField={activeField}
                  setActiveField={setActiveField}
                  loading={loading}
                />
                <EditableFacetField
                  label="Sector"
                  onUpdate={handleSectorUpdate}
                  selectedFacetValues={sectorData}
                  updateValue={handleSectorFacetClick}
                  facetItem={getFacets(facets, 'sector')}
                  onCancel={() => setSectorData(getSectorFromInvestmentData())}
                  multiSelect
                  activeField={activeField}
                  setActiveField={setActiveField}
                  loading={loading}
                />
                <EditableFacetField
                  label="Company City"
                  value={investmentData?.companyCity?.name}
                  onUpdate={handleCityUpdate}
                  selectedFacetValues={cityData}
                  updateValue={handleCityFacetClick}
                  facetItem={getFacets(facets, 'city')}
                  onCancel={() => setCityData(getCityFromInvestmentData())}
                  searchable
                  activeField={activeField}
                  setActiveField={setActiveField}
                  loading={loading}
                />
                <EditableFacetField
                  label="Looking to Raise"
                  labelInfo="This is required to request an introduction from an investor."
                  value={amount}
                  onUpdate={updateInvestmentSettings}
                  onCancel={() => setAmount(investmentData?.lookingToRaise)}
                  updateValue={handleAmountUpdate}
                  activeField={activeField}
                  setActiveField={setActiveField}
                  loading={loading}
                />
              </div>
            </div>
            <div className={classes.onboarding}>
              <OnboardingTooltip type="investors" position="left" />
            </div>
          </div>
          <div className={classes.section}>
            <div className={classes.updateProfile}>
              <FnText color="green" type="heading-xSmall">
                Current startup information
              </FnText>
              <FnText>
                Is your profile updated with the latest details about your
                startup? We’ll use this information to share with investors when
                you request introductions.
              </FnText>

              <Button
                variant={ButtonVariants.CardPrimary}
                onClick={handleUpdateProfile}
              >
                UPDATE INFO
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default InvestorStatusWidget;
