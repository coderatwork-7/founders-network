import {Form} from 'react-bootstrap';
import {
  IntroData,
  applyLabel,
  change,
  gridColumnExtendTwo
} from './introRequestForm';
import {Dispatch, SetStateAction} from 'react';
import {NOT_SET, notValid} from './helper';
interface UpperHalfFormProps {
  state: IntroData;
  setState: Dispatch<SetStateAction<IntroData>>;
  submitted: boolean;
}
const UpperHalfForm: React.FC<UpperHalfFormProps> = ({
  setState,
  state,
  submitted
}) => {
  return (
    <>
      {applyLabel(
        'How many startups have you been part of ?',
        <Form.Control
          type="number"
          onChange={e => change(setState, 'numberOfStartupsRun', 'user', e)}
          value={state?.user?.numberOfStartupsRun ?? ''}
          required
        ></Form.Control>,
        'w-100',
        submitted && notValid(state?.user?.numberOfStartupsRun ?? '')
      )}
      {applyLabel(
        'Total value of all of your exits',
        <Form.Control
          type="text"
          value={state?.user?.totalValueOfExits ?? ''}
          onChange={e => change(setState, 'totalValueOfExits', 'user', e)}
          required
        ></Form.Control>,
        'w-100',
        submitted && notValid(state?.user?.totalValueOfExits ?? '')
      )}
      {applyLabel(
        'Current Headcount',
        <Form.Select
          value={state?.user?.numberOfEmployeesHired ?? ''}
          onChange={e => change(setState, 'numberOfEmployeesHired', 'user', e)}
          required
        >
          <option>{NOT_SET}</option>
          <option value="1-5">1-5</option>
          <option value="5-25">5-25</option>
          <option value="25-50">25-50</option>
          <option value="50-100">50-100</option>
          <option value="500-1000">500-1000</option>
          <option value="1000+">1000+</option>
        </Form.Select>,
        'w-100',
        submitted && notValid(state?.user?.numberOfEmployeesHired)
      )}
      {applyLabel(
        'Total funding you have ever raised',
        <Form.Control
          value={state?.user?.totalFundingRaised ?? ''}
          onChange={e => change(setState, 'totalFundingRaised', 'user', e)}
          type="text"
          required
        ></Form.Control>,
        'w-100',
        submitted && notValid(state?.user?.totalFundingRaised)
      )}
      {applyLabel(
        'Accomplishments and Pedigree',
        <Form.Control
          value={state?.user?.accomplishments ?? ''}
          onChange={e => change(setState, 'accomplishments', 'user', e)}
          as="textarea"
          required
        />,
        gridColumnExtendTwo,
        submitted && notValid(state?.user?.accomplishments ?? '')
      )}
      {applyLabel(
        'Exciting Updates',
        <Form.Control
          value={state?.user?.excitingUpdates ?? ''}
          onChange={e => change(setState, 'excitingUpdates', 'user', e)}
          as="textarea"
          required
        />,
        gridColumnExtendTwo,
        submitted && notValid(state?.user?.excitingUpdates ?? '')
      )}
    </>
  );
};
export {UpperHalfForm};
