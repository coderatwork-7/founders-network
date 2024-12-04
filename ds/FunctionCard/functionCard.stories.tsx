import type {Meta, StoryObj} from '@storybook/react';
import {FunctionCard} from './functionCard';

const meta: Meta<typeof FunctionCard> = {
  title: 'Components/FunctionCard',
  component: FunctionCard
};

export default meta;
type Story = StoryObj<typeof FunctionCard>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const PastEvent: Story = {
  args: {
    data: {
      id: 2817,
      type: 'function',
      subtype: 'post',
      title:
        'fnGlobal Keynote & Roundtables with SafetyPay Co-Founder Barbara Bibas Montero (April 27, 2023)',
      creationTimestamp: '2023-04-04T07:57:04.817123Z',
      location: '',
      eventLink: 'https://us02web.zoom.us/j/86007624331',
      media: {
        imageSrc:
          'https://fnprofileimages3.s3.amazonaws.com/production/files/n09lo2a/FN_Syndicate_Funding_Pitch_-_FN_Directory_1.png',
        altText: '',
        videoLink:
          '<iframe src="//www.youtube.com/embed/tS4iWFfMJNA" width="100%" height="100%" allowfullscreen="allowfullscreen"></iframe>'
      },
      details: {
        startDate: '2023-04-27T16:30:35.166018Z',
        startTimePT: '09:30:35 PDT',
        startTimeET: '12:30:35 EDT',
        endDate: '2023-04-27T18:30:35.166079Z',
        endTimePT: '11:30:35 PDT',
        endTimeET: '14:30:35 EDT'
      },
      attendeesCount: '125',
      addToCalendar: {ical: '#', outlook: '#', google: '#'},
      badge: ['seriesa', 'angel'],
      addTicketsBtn: true,
      removeTicketBtn: true,
      isDeclined: false
    }
  }
};

export const Default: Story = {
  args: {
    data: {
      id: 2817,
      type: 'function',
      subtype: 'post',
      title:
        'fnGlobal Keynote & Roundtables with SafetyPay Co-Founder Barbara Bibas Montero (April 27, 2023)',
      creationTimestamp: '2023-04-04T07:57:04.817123Z',
      location: '',
      eventLink: 'https://us02web.zoom.us/j/86007624331',
      media: {
        imageSrc:
          'https://fnprofileimages3.s3.amazonaws.com/production/files/n09lo2a/FN_Syndicate_Funding_Pitch_-_FN_Directory_1.png',
        altText: '',
        videoLink: ''
      },
      details: {
        startDate: '2023-07-27T16:30:35.166018Z',
        startTimePT: '09:30:35 PDT',
        startTimeET: '12:30:35 EDT',
        endDate: '2023-07-27T18:30:35.166079Z',
        endTimePT: '11:30:35 PDT',
        endTimeET: '14:30:35 EDT'
      },
      addToCalendar: {ical: '#', outlook: '#', google: '#'},
      badge: ['seriesa', 'angel'],
      attendeesCount: '125',
      addTicketsBtn: true,
      removeTicketBtn: true,
      isDeclined: false
    }
  }
};

export const VideoCard: Story = {
  args: {
    data: {
      id: 2817,
      type: 'function',
      subtype: 'post',
      title:
        'fnGlobal Keynote & Roundtables with SafetyPay Co-Founder Barbara Bibas Montero (April 27, 2023)',
      creationTimestamp: '2023-04-04T07:57:04.817123Z',
      location: '',
      eventLink: 'https://us02web.zoom.us/j/86007624331',
      media: {
        imageSrc:
          'https://fnprofileimages3.s3.amazonaws.com/production/files/1urmz5c/orientation%20fn%20dir%20pic.jpg',
        altText: '',
        videoLink:
          '<iframe src="//player.vimeo.com/video/70446472?title=0&amp;byline=0&amp;portrait=0&amp;color=336699" width="100%" height="100%" frameborder="0" allowfullscreen="allowfullscreen"></iframe>'
      },
      details: {
        startDate: '2023-07-27T16:30:35.166018Z',
        startTimePT: '09:30:35 PDT',
        startTimeET: '12:30:35 EDT',
        endDate: '2023-07-27T18:30:35.166079Z',
        endTimePT: '11:30:35 PDT',
        endTimeET: '14:30:35 EDT'
      },
      addToCalendar: {ical: '#', outlook: '#', google: '#'},
      badge: [],
      attendeesCount: '125',
      addTicketsBtn: true,
      removeTicketBtn: true,
      isDeclined: false
    }
  }
};
