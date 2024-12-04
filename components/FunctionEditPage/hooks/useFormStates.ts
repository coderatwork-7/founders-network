import {useState} from 'react';
import {FunctionDetailsForm} from '../forms/functionDetails';
import {DEFAULT_TICKETS} from '../components/TicketsTable/ticketTable';
import {FeaturedProfilesForm} from '../forms/featuredProfiles';
import {FeaturedRemidersForm} from '../forms/featuredRemiders';
import {FunctionTicketsForm} from '../forms/functionTickets';
import {DEFAULT_TIMEZONE} from '@/utils/common/constants';

const EMPTY_STRING: number | '' = '';

const formatDateTimeToString = (date: Date) =>
  new Intl.DateTimeFormat('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true
  }).format(date);

const getInitState = (type: string) => {
  switch (type) {
    case 'detailsForm':
      return {
        title: '',
        location: {
          address: '',
          displayName: ''
        },
        onlineEvent: false,
        inPersonEvent: true,
        startDateTime: '',
        endDateTime: '',
        timezone: {
          label: DEFAULT_TIMEZONE,
          value: DEFAULT_TIMEZONE
        },
        headerImageUrl: '',
        directoryImageUrl: '',
        functionDescription: '',
        tags: [],
        allowQuestions: true
      };

    case 'ticketsForm':
      return {
        dialInLimit: EMPTY_STRING,
        attendLimit: EMPTY_STRING,
        guestAttendLimit: EMPTY_STRING,
        guestDialInLimit: EMPTY_STRING,
        include: '',
        tickets: DEFAULT_TICKETS.map((t, index) => ({
          ...t,
          key: index,
          inPerson: 0,
          dialIn: 0,
          expected: EMPTY_STRING,
          removable: false
        }))
      };

    case 'remindersForm':
      return {
        enableDialIn: true,
        enable48Hours: true,
        enableSMS: false,
        hourText: '',
        smsText: ''
      };

    case 'profilesForm':
      return {
        member: [],
        investor: undefined,
        guest: [],
        connectedPartnerCompany: undefined,
        functionChairs: []
      };

    case 'sponsorsForm':
      return '';

    case 'venueForm':
      return [];
  }
};

const useFormStates = () => {
  const [resetKey, setResetKey] = useState(0);
  const [detailsFormData, setDetailsFormData] = useState(
    () => getInitState('detailsForm') as FunctionDetailsForm
  );

  const [ticketsFormData, setTicketsFormData] = useState(
    () => getInitState('ticketsForm') as FunctionTicketsForm
  );

  const [remindersFormData, setRemindersFormData] = useState(
    () => getInitState('remindersForm') as FeaturedRemidersForm
  );

  const [profilesFormData, setProfilesFormData] = useState(
    () => getInitState('profilesForm') as FeaturedProfilesForm
  );

  const [functionSponsors, setFunctionSponsors] = useState(
    () => getInitState('sponsorsForm') as string
  );
  const [venuePhotos, setVenuePhotos] = useState(
    () => getInitState('venueForm') as string[]
  );

  const getFormData = () => {
    return {
      ...detailsFormData,
      startDateTime: formatDateTimeToString(
        new Date(detailsFormData.startDateTime)
      ),
      endDateTime: formatDateTimeToString(
        new Date(detailsFormData.endDateTime)
      ),
      location: {
        ...detailsFormData.location,
        chapter: detailsFormData.location.chapter?.value ?? ''
      },
      timezone: detailsFormData.timezone?.value ?? '',
      stageGate: detailsFormData.stageGate?.value ?? '',
      functionType: detailsFormData.functionType?.value ?? '',
      lockFunctionSubgroup: detailsFormData.lockFunctionSubgroup?.value ?? '',
      tags: detailsFormData.tags.map(t => t.value),
      tickets: {
        dialInLimit: ticketsFormData.dialInLimit || 0,
        attendLimit: ticketsFormData.attendLimit || 0,
        guestAttendLimit: ticketsFormData.guestAttendLimit || 0,
        guestDialInLimit: ticketsFormData.guestDialInLimit || 0,
        include: ticketsFormData.include,
        ...ticketsFormData.tickets.reduce(
          (obj, ticket) => {
            if (ticket.name) {
              obj[ticket.name] = {
                inPerson: ticket.inPerson,
                dialIn: ticket.dialIn,
                expected: ticket.expected || 0
              };
            } else {
              obj.specialCharge.push({
                inPerson: ticket.inPerson,
                dialIn: ticket.dialIn,
                memberId: ticket.selectedMember?.value
              });
            }
            return obj;
          },
          {specialCharge: []} as any
        )
      },
      reminders: remindersFormData,
      featuredProfiles: {
        member: profilesFormData.member.map(opt => opt.value),
        investor: profilesFormData.investor?.value ?? undefined,
        guest: profilesFormData.guest.map(opt => opt.value),
        connectedPartnerCompany:
          profilesFormData.connectedPartnerCompany?.value ?? undefined,
        functionChairs: profilesFormData.functionChairs.map(opt => opt.value)
      },
      functionSponsors,
      venuePhotos
    };
  };

  const resetFormData = () => {
    setResetKey(s => s + 1);
    setDetailsFormData(getInitState('detailsForm') as FunctionDetailsForm);
    setTicketsFormData(getInitState('ticketsForm') as FunctionTicketsForm);
    setRemindersFormData(getInitState('remindersForm') as FeaturedRemidersForm);
    setProfilesFormData(getInitState('profilesForm') as FeaturedProfilesForm);
    setFunctionSponsors(getInitState('sponsorsForm') as string);
    setVenuePhotos(getInitState('venueForm') as string[]);
  };

  return {
    detailsFormData,
    setDetailsFormData,
    ticketsFormData,
    setTicketsFormData,
    remindersFormData,
    setRemindersFormData,
    profilesFormData,
    setProfilesFormData,
    functionSponsors,
    setFunctionSponsors,
    venuePhotos,
    resetKey,
    setVenuePhotos,
    getFormData,
    resetFormData
  };
};

export default useFormStates;
