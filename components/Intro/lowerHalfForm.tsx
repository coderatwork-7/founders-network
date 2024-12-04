import {Form} from 'react-bootstrap';
import {
  IntroData,
  applyLabel,
  change,
  gridColumnExtendTwo
} from './introRequestForm';
import React, {Dispatch, SetStateAction} from 'react';
import {KeywordInputFacet} from '@/ds/KeywordInputFacet';
import classes from './introRequestForm.module.scss';
import {FacetState} from '@/utils/common/commonTypes';
import {useSelector} from 'react-redux';
import {selectIntroFormDetails} from '@/store/selectors';
import {arrayToDropdownObject, isObjectEmpty} from '@/utils/common/helper';
import {DropdownItem} from '@/types/dropdown';
import clsx from 'clsx';
import {MONTHLY_REVENUE_OPTIONS} from '@/utils/common/constants';
import {NOT_SET, notValid} from './helper';
interface LowerHalfFormProps {
  state: IntroData;
  setState: Dispatch<SetStateAction<IntroData>>;
  updateFacetValue: (obj: FacetState, isMultiselect: boolean) => void;
  selectedFacetValues: FacetState;
  PitchDeck: JSX.Element;
  submitted: boolean;
}
export const dropdownArrayToOptions: (
  array: DropdownItem[] | null | undefined
) => JSX.Element = array => (
  <React.Fragment key={`123`}>
    {array?.map(item => (
      <option key={item?.id} value={item?.id ?? item?.name}>
        {item?.name}
      </option>
    ))}
  </React.Fragment>
);
const KEYWORD_INPUT_PLACEHOLDER = 'Type and press enter';
const LowerHalfForm: React.FC<LowerHalfFormProps> = ({
  setState,
  state,
  updateFacetValue,
  selectedFacetValues,
  PitchDeck,
  submitted
}) => {
  const details = useSelector(selectIntroFormDetails());
  return (
    <>
      {applyLabel(
        'Description',
        <Form.Control
          value={state?.company?.description ?? ''}
          onChange={e => change(setState, 'description', 'company', e)}
          as="textarea"
          required
        />,
        gridColumnExtendTwo,
        submitted && notValid(state?.company?.description ?? '')
      )}
      {applyLabel('', PitchDeck, clsx(classes.gridExtendTwoRows, 'mx-auto'))}
      {applyLabel(
        'Tech Sectors',
        <KeywordInputFacet
          facetKey="techSectors"
          facetName="Tech Sector"
          facetValueOnClick={updateFacetValue}
          ignoredFacetKeys={{}}
          selectedItems={{techSectors: selectedFacetValues.techSectors ?? {}}}
          innerClasses={classes.keywordInputPadding}
          maxDropdownSize={Infinity}
          facetDropdown
          dropdownItems={arrayToDropdownObject(details?.['tech-sectors'] ?? [])}
          placeholderText={'Select from list'}
          dropdownOnly
        />,
        gridColumnExtendTwo,
        submitted && isObjectEmpty(selectedFacetValues.techSectors ?? {})
      )}

      {applyLabel(
        'Website',
        <Form.Control
          value={state?.company?.website ?? ''}
          onChange={e => change(setState, 'website', 'company', e)}
          type="text"
          required
        ></Form.Control>,
        'w-100',
        submitted && notValid(state?.company?.website ?? '')
      )}
      {applyLabel(
        'Location',
        <Form.Select
          value={state?.company?.location ?? NOT_SET}
          onChange={e => change(setState, 'location', 'company', e)}
          className="w-100"
          id="intro-form-location"
          required
        >
          {[
            <option key="location-not-set">{NOT_SET}</option>,
            dropdownArrayToOptions(details?.locations)
          ]}
        </Form.Select>,
        'w-100',
        submitted && notValid(state?.company?.location ?? NOT_SET)
      )}
      <div className={classes.gridPlaceholder}>&nbsp;</div>
      {applyLabel(
        'Monetization Strategy',
        <KeywordInputFacet
          facetKey="monetizationStartegy"
          facetName="Monetization Strategy"
          facetValueOnClick={updateFacetValue}
          ignoredFacetKeys={{}}
          selectedItems={{
            monetizationStartegy: selectedFacetValues.monetizationStartegy ?? {}
          }}
          innerClasses={classes.keywordInputPadding}
          maxDropdownSize={Infinity}
          facetDropdown
          dropdownItems={arrayToDropdownObject(
            details?.['monetization-startegy'] ?? []
          )}
          placeholderText={'Select from list'}
          dropdownOnly
        />,
        gridColumnExtendTwo,
        submitted &&
          isObjectEmpty(selectedFacetValues.monetizationStartegy ?? {})
      )}
      <div className={classes.gridPlaceholder}>&nbsp;</div>
      {applyLabel(
        'Target Market',
        <Form.Select
          value={state?.company?.targetMarket ?? NOT_SET}
          onChange={e => change(setState, 'targetMarket', 'company', e)}
          className="w-100"
          required
        >
          {[
            <option key="target-market-not-set">{NOT_SET}</option>,
            dropdownArrayToOptions(details?.['target-market'])
          ]}
        </Form.Select>,
        'w-100',
        submitted && notValid(state?.company?.targetMarket ?? NOT_SET)
      )}
      {applyLabel(
        'US Visa Status',
        <Form.Select
          value={state?.company?.visaSatus ?? NOT_SET}
          onChange={e => change(setState, 'visaSatus', 'company', e)}
          className="w-100"
          required
        >
          {[
            <option key="us-visa-status-not-set">{NOT_SET}</option>,
            dropdownArrayToOptions(details?.['visa-status'])
          ]}
        </Form.Select>,
        'w-100',
        submitted && notValid(state?.company?.visaSatus ?? NOT_SET)
      )}
      <div className={classes.gridPlaceholder}>&nbsp;</div>
      {applyLabel(
        'Revenue Growth Rate MoM (%)',
        <Form.Control
          value={state?.company?.revenueGrowthRateMOM ?? ''}
          onChange={e => change(setState, 'revenueGrowthRateMOM', 'company', e)}
          type="number"
          className="w-100"
          required
        ></Form.Control>,
        'w-100',
        submitted && notValid(state?.company?.revenueGrowthRateMOM ?? '')
      )}
      {applyLabel(
        'New User Growth Rate MoM (%)',
        <Form.Control
          value={state?.company?.newUserGrowthRateMOM ?? ''}
          onChange={e => change(setState, 'newUserGrowthRateMOM', 'company', e)}
          type="number"
          className="w-100"
          required
        ></Form.Control>,
        'w-100',
        submitted && notValid(state?.company?.newUserGrowthRateMOM ?? '')
      )}
      <div className={classes.gridPlaceholder}>&nbsp;</div>
      {applyLabel(
        'Current Monthly Revenue',
        <Form.Select
          value={state?.company?.currentMonthlyRevenue ?? NOT_SET}
          onChange={e =>
            change(setState, 'currentMonthlyRevenue', 'company', e)
          }
          className="w-100"
          required
        >
          <option>{NOT_SET}</option>
          {MONTHLY_REVENUE_OPTIONS.map(value => (
            <option key={value}>{value}</option>
          ))}
        </Form.Select>,
        'w-100',
        submitted && notValid(state?.company?.currentMonthlyRevenue ?? NOT_SET)
      )}
      {applyLabel(
        'Looking to raise',
        <Form.Control
          value={state?.company?.lookingToRaise ?? ''}
          onChange={e => change(setState, 'lookingToRaise', 'company', e)}
          type="number"
          className="w-100"
          required
        ></Form.Control>,
        'w-100',
        submitted && notValid(state?.company?.lookingToRaise ?? '')
      )}
      <div className={classes.gridPlaceholder}>&nbsp;</div>
      {applyLabel(
        'Current Funding',
        <Form.Control
          value={state?.company?.currentFunding ?? ''}
          onChange={e => change(setState, 'currentFunding', 'company', e)}
          type="number"
          className="w-100"
          required
        ></Form.Control>,
        'w-100',
        submitted && notValid(state?.company?.currentFunding ?? '')
      )}
      {applyLabel(
        'Notable Investors',
        <KeywordInputFacet
          facetKey="notableInvestors"
          facetName="Notable Investors"
          facetValueOnClick={updateFacetValue}
          ignoredFacetKeys={{}}
          selectedItems={{
            notableInvestors: selectedFacetValues?.notableInvestors ?? {}
          }}
          innerClasses={classes.keywordInputPadding}
          maxDropdownSize={Infinity}
          dropdownItems={{}}
          placeholderText={KEYWORD_INPUT_PLACEHOLDER}
        />,
        'w-100'
      )}
    </>
  );
};
export {LowerHalfForm};
