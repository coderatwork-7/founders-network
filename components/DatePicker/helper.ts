import {startOfWeek, endOfWeek, format} from 'date-fns';

export const getStartEndDateOfMonth = ({
  date,
  offset,
  flag = false
}: {
  date: Date;
  offset?: number;
  flag?: boolean; // Flag: true- Indicates previous month button click.
}) => {
  const currentDate = new Date(date);
  const months: string[] = [];
  let startOffset = flag ? -1 : 1;
  let endOffset = flag ? 0 : 2;

  if (offset) {
    startOffset = -offset;
    endOffset = offset + 1;
    for (
      let i = currentDate.getMonth() - offset;
      i <= currentDate.getMonth() + offset;
      i++
    ) {
      const tempDate = new Date(currentDate.getFullYear(), i, 1);
      const formattedMonth = format(tempDate, 'MMM-yyyy');
      months.push(formattedMonth);
    }
  } else {
    const tempDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + startOffset,
      1
    );
    months.push(format(tempDate, 'MMM-yyyy'));
  }

  const startOfMonth = startOfWeek(
    new Date(currentDate.getFullYear(), currentDate.getMonth() + startOffset),
    {weekStartsOn: 0}
  );
  const endOfMonth = endOfWeek(
    new Date(currentDate.getFullYear(), currentDate.getMonth() + endOffset),
    {weekStartsOn: 0}
  );

  return {startOfMonth, endOfMonth, months};
};
