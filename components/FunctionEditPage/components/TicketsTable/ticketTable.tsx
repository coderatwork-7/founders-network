import React, {useState, ChangeEvent} from 'react';
import {SelectOptionsType} from '../../hooks/useAdminFunctionTags';
import {BasicSelect, FUNCTION_SELECT_CLASSES} from '../ReactSelect';
import {SelectOptionType} from '../../FunctionEditPage';
import classes from './ticketsTable.module.scss';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {Button, ButtonVariants} from '@/ds/Button';

export enum TicketTypes {
  guestTicketPrice = 'guestTicketPrice',
  angelTicketPrice = 'angelTicketPrice',
  seriesaTicketPrice = 'seriesaTicketPrice',
  partnerTicketPrice = 'partnerTicketPrice',
  charterTicketPrice = 'charterTicketPrice',
  investorTicketPrice = 'investorTicketPrice',
  lifetimeTicketPrice = 'lifetimeTicketPrice',
  bootstrapTicketPrice = 'bootstrapTicketPrice'
}

export const DEFAULT_TICKETS = [
  {
    label: 'Bootstrap Ticket',
    name: TicketTypes.bootstrapTicketPrice
  },
  {
    label: 'Angel Ticket',
    name: TicketTypes.angelTicketPrice
  },
  {
    label: 'Series A+ Ticket',
    name: TicketTypes.seriesaTicketPrice
  },
  {
    label: 'Lifetime Ticket',
    name: TicketTypes.lifetimeTicketPrice
  },
  {
    label: 'Guest Ticket',
    name: TicketTypes.guestTicketPrice
  },
  {
    label: 'Partner Ticket',
    name: TicketTypes.partnerTicketPrice,
    disableDialIn: true
  },
  {
    label: 'Charter Ticket',
    name: TicketTypes.charterTicketPrice,
    disableDialIn: true
  },
  {
    label: 'Investor Ticket',
    name: TicketTypes.investorTicketPrice,
    disableDialIn: true
  }
];

export type TableTicket = {
  key: number;
  label?: string;
  removable: boolean;
  dialIn: number | '';
  name?: string | null;
  inPerson: number | '';
  expected: number | '';
  disableDialIn?: boolean;
  selectedMember?: SelectOptionType;
};

interface TicketsTableProps {
  data: TableTicket[];
  tagsLoading: boolean;
  featuredMemberOptions: SelectOptionsType;
  setData: React.Dispatch<React.SetStateAction<TableTicket[]>>;
}

const TicketsTable: React.FC<TicketsTableProps> = ({
  data,
  setData,
  tagsLoading,
  featuredMemberOptions
}) => {
  const [counter, setCounter] = useState(data.length);

  const handleSelectChange = (key: number) => (value: SelectOptionType) => {
    const tickets = [...data];
    const ticketToUpdate = tickets.find(t => t.key === key);
    if (ticketToUpdate) ticketToUpdate.selectedMember = value;
    setData(tickets);
  };

  const handleInputChange =
    (key: number, field: 'inPerson' | 'dialIn' | 'expected') =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const tickets = [...data];
      const ticketToUpdate = tickets.find(t => t.key === key);
      if (ticketToUpdate) ticketToUpdate[field] = e.target.valueAsNumber || '';
      setData(tickets);
    };

  const handleDeleteRow = (index: number) => {
    setData(tickets => tickets.filter(ticket => ticket.key !== index));
  };

  const handleAddRow = () => {
    const newData = [
      ...data,
      {
        label: '',
        expected: '',
        dialIn: 0,
        inPerson: 0,
        name: null,
        removable: true,
        key: counter
      } as TableTicket
    ];
    setCounter(counter + 1);
    setData(newData);
  };

  return (
    <div className={classes.tableContainer}>
      <table>
        <thead>
          <tr>
            <th>Membership Level</th>
            <th>Inperson</th>
            <th>Dial-In</th>
            <th>Expected</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.key}>
              <td>
                {row.label ? (
                  row.label
                ) : (
                  <BasicSelect
                    required
                    placeholder=""
                    isLoading={tagsLoading}
                    className={classes.select}
                    value={row.selectedMember}
                    options={featuredMemberOptions}
                    menuPortalTarget={document.body}
                    onChange={handleSelectChange(row.key)}
                    classNames={{
                      ...FUNCTION_SELECT_CLASSES,
                      control: () => classes.control,
                      valueContainer: () => classes.value,
                      indicatorsContainer: () => classes.indicatorsContainer
                    }}
                  />
                )}
              </td>
              <td>
                <span className={classes.dollar}>$ </span>
                <input
                  type="number"
                  value={row.inPerson}
                  disabled={!row.selectedMember && row.removable}
                  onChange={handleInputChange(row.key, 'inPerson')}
                />
              </td>
              <td>
                {row.disableDialIn ? (
                  <></>
                ) : (
                  <>
                    <span className={classes.dollar}>$ </span>
                    <input
                      type="number"
                      value={row.dialIn}
                      disabled={!row.selectedMember && row.removable}
                      onChange={handleInputChange(row.key, 'dialIn')}
                    />
                  </>
                )}
              </td>
              <td>
                {row.removable ? (
                  <button
                    type="button"
                    className={classes.deleteButton}
                    onClick={() => handleDeleteRow(row.key)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                ) : (
                  <input
                    type="number"
                    value={row.expected}
                    onChange={handleInputChange(row.key, 'expected')}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="d-flex">
        <Button
          type="button"
          textUppercase
          onClick={handleAddRow}
          variant={ButtonVariants.BluePrimary}
          className={classes.specialChargeBtn}
        >
          Add Special Charge
        </Button>
      </div>
    </div>
  );
};

export default TicketsTable;
