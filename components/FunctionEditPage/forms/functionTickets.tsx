import clsx from 'clsx';
import classes from './functionEditforms.module.scss';
import {ChangeEvent, Dispatch, SetStateAction} from 'react';
import {FunctionEditor} from '../components/FunctionEditor/functionEditor';
import {SelectOptionsType} from '../hooks/useAdminFunctionTags';
import TicketsTable, {
  TableTicket
} from '../components/TicketsTable/ticketTable';

export type FunctionTicketsForm = {
  include: string;
  tickets: TableTicket[];
  dialInLimit: number | '';
  attendLimit: number | '';
  guestAttendLimit: number | '';
  guestDialInLimit: number | '';
};

interface FunctionTicketsProps {
  tagsLoading: boolean;
  data: FunctionTicketsForm;
  featuredMemberOptions: SelectOptionsType;
  setData: React.Dispatch<React.SetStateAction<FunctionTicketsForm>>;
}

export const FunctionTickets: React.FC<FunctionTicketsProps> = ({
  data,
  setData,
  tagsLoading,
  featuredMemberOptions
}) => {
  const updateData = (key: string, value: any) => {
    setData(prevData => ({...prevData, [key]: value}));
  };

  const handleChange = (name: keyof FunctionTicketsForm) => (value: any) => {
    updateData(name, value);
  };

  const handleChangeEvent = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    updateData(name, value);
  };

  const handleTicketsUpdate: Dispatch<SetStateAction<TableTicket[]>> = (
    update: TableTicket[] | ((prevTickets: TableTicket[]) => TableTicket[])
  ) => {
    setData(prevState => {
      const newTickets =
        typeof update === 'function' ? update(prevState.tickets) : update;
      return {...prevState, tickets: newTickets};
    });
  };

  return (
    <div className={classes.form}>
      <div className={clsx(classes.field, 'd-flex gap-4')}>
        <div className={classes.sub3Field}>
          <div className={classes.label}>Dial In Limit</div>

          <div className={classes.fieldInput}>
            <input
              name="dialInLimit"
              value={data.dialInLimit}
              onChange={handleChangeEvent}
              type="number"
            />
          </div>
        </div>

        <div className={classes.sub3Field}>
          <div className={classes.label}>Attend Limit</div>

          <div className={classes.fieldInput}>
            <input
              name="attendLimit"
              value={data.attendLimit}
              onChange={handleChangeEvent}
              type="number"
            />
          </div>
        </div>
      </div>

      <div className={clsx(classes.field, 'd-flex gap-4')}>
        <div className={classes.sub3Field}>
          <div className={classes.label}>Guest Dial In Limit</div>

          <div className={classes.fieldInput}>
            <input
              name="guestDialInLimit"
              value={data.guestDialInLimit}
              onChange={handleChangeEvent}
              type="number"
            />
          </div>
        </div>

        <div className={classes.sub3Field}>
          <div className={classes.label}>Guest Attend Limit</div>

          <div className={classes.fieldInput}>
            <input
              name="guestAttendLimit"
              value={data.guestAttendLimit}
              onChange={handleChangeEvent}
              type="number"
            />
          </div>
        </div>
      </div>

      <div className={classes.field}>
        <div className={classes.label}>Tickets</div>

        <TicketsTable
          data={data.tickets}
          setData={handleTicketsUpdate}
          tagsLoading={tagsLoading}
          featuredMemberOptions={featuredMemberOptions}
        />
      </div>

      <div className={classes.field}>
        <div className={classes.label}>Tickets Include</div>

        <div className={classes.editorContainer}>
          <FunctionEditor
            value={data.include}
            onContentChange={handleChange('include')}
          />
        </div>
      </div>
    </div>
  );
};
