const express = require('express');
const all = require('./all.json');
const forums = require('./forum.json');
const functions = require('./function.json');
const members = require('./members.json');
const groups = require('./groups.json');
const deals = require('./deals.json');
const dealInfo = require('./dealInfo.json');
const searchSuggestions = require('./searchSuggestions.json');
const mailingList = require('./mailingList.json');
const tags = require('./tags.json');
const events = require('./event-calendar.json');
const memberProfile = require('./memberProfile.json');
const cors = require('cors');
const bodyParser = require('body-parser');
const facets = require('./facets.json');
const functionPageData = require('./mockFunctionData.json');
const upgradePlanData = require('./upgradePlan.json');
const functionDetail = require('./functionDetail.json');
const functionDetailAttendees = require('./functionDetailDyanmic.json');
const forumDetail = require('./fourmDetail.json');
const analytics = require('./analytics.json');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json({limit: '50mb', type: 'application/json'}));

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex]
    ];
  }

  return array;
}

let id = 2553;
function filter(array, filters) {
  const page = parseInt(filters['page'] ?? '1');
  const offset = (page - 1) * 10;
  const limit = 10;
  return filters['sortby'] || filters['q']
    ? shuffle(array.slice()).slice(offset, offset + limit)
    : array.slice(offset, offset + limit);
}

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  setTimeout(next, 1000);
});

app.get(/v1\/users\/(.*)\/feeds\/all/, (req, res) => {
  res.json(filter(all, req.query));
});
app.get(/v1\/users\/(.*)\/feeds\/forums/, (req, res) => {
  res.json(filter(forums, req.query));
});
app.get(/v1\/users\/(.*)\/feeds\/functions/, (req, res) => {
  res.json(filter(functions, req.query));
});
app.get(/v1\/users\/(.*)\/feeds\/members/, (req, res) => {
  res.json(filter(members, req.query));
});
app.get(/v1\/users\/(.*)\/feeds\/groups/, (req, res) => {
  res.json(filter(groups, req.query));
});
app.get(/v1\/users\/(.*)\/feeds\/deals/, (req, res) => {
  res.json(filter(deals, req.query));
});
app.get(/v1\/api\/search\/typeahead/, (_, res) => {
  let obj = {};
  Object.keys(searchSuggestions).map(group => {
    obj[group] = searchSuggestions[group].filter(() => Math.random() < 0.5);
  });
  setTimeout(() => res.json(obj), 2000);
});
app.get(/v1\/api\/forum\/members/, (req, res) => {
  res.json(mailingList);
});
app.get(/v1\/api\/forum\/tags/, (req, res) => {
  res.json(tags);
});
app.get(/v1\/api\/users\/(.*)\/nominations\/info/, (_, res) => {
  let obj = {
    remainingDays: '25 Days Away',
    remainingNominations: Math.floor(Math.random() * 1),
    cohort: "May'23 Cohort",
    nominationReviewDate: '2023-08-21',
    requestedNomination: false
  };
  res.json(obj);
});
app.get(/v1\/api\/users\/(.*)\/remaining-intro-request/, (_, res) => {
  res.json({count: 4});
});
app.get(/v1\/api\/users\/(.*)\/notifications\/read/, (_, res) => {
  res.sendStatus(200);
});
app.get(
  /v1\/api\/users\/(.*)\/chat\/users\/(.*)\/view\/messages/,
  (req, res) => {
    res.sendStatus(200);
  }
);
app.get(/v1\/api\/users\/(.*)\/chat\/users\/(.*)\/messages/, (req, res) => {
  function getRandomSubstring(max) {
    const str =
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae suscipit deserunt facere cupiditate tempora totam ipsum molestias adipisci, blanditiis, ullam iure sunt consectetur! Ratione, nesciunt suscipit at minus corporis repudiandae consequatur minima error pariatur culpa nemo, ab ut quae earum eveniet sit rem, nisi hic sequi recusandae neque obcaecati. Ex, officiis. Incidunt similique a, minima ab distinctio facilis? Delectus aliquam quam dolor repudia inventore ea reprehenderit id quia aut! Earum, esse ut? Vitae tempora laborum';
    const startIndex = Math.floor(Math.random() * str.length);
    const maxLength =
      max ?? Math.floor(Math.random() * (str.length - startIndex + 1));
    const result = str.substring(startIndex, maxLength);
    return result.charAt(0).toUpperCase() + result.slice(1);
  }

  let date = new Date();
  date.setDate(date.getDate() - req.query.page);
  let messages = [];
  for (let i = 0; i < 5; i++) {
    messages.push({
      messageId: Math.random(),
      sender: Math.random() < 0.5 ? '1304' : '5898',
      recipient: '1304',
      timestamp: date.toString(),
      message: getRandomSubstring(),
      attachments:
        Math.random() < 0.5
          ? [
              {
                id: 123,
                name: `index.jpg`,
                url: 'https://fnprofileimages3.s3.amazonaws.com/dev/files/8m2m1ot/New_Text_Document.txt'
              }
            ]
          : []
    });
  }
  res.json({
    count: 20,
    next: 'true',
    prev: 'true',
    results: messages
  });
});
app.get(/v1\/api\/users\/(.*)\/functions\/(.*)\/tickets/, (req, res) => {
  res.json({
    bookedTickets: [
      {
        name: 'Bootstrap Member Ticket',
        type: 'Dial In',
        dialInSlots: [],
        isSelected: 'true/false',
        price: Math.random() < 0.5 ? 50 : 0,
        numberOfGuest: 0
      },
      {
        name: 'Guest Ticket',
        type: 'Dial In',
        dialInSlots: [],
        isSelected: 'true/false',
        price: Math.random() < 0.5 ? 80 : 0,
        numberOfGuest: 10
      }
    ],
    tickets: [
      {
        name: 'Bootstrap Member Ticket',
        type: 'Dial In',
        dialInSlots: ['10:20 am', '10:30 am'],
        isSelected: 'true/false',
        price: Math.random() < 0.5 ? 50 : 0,
        numberOfGuest: 0
      },
      {
        name: 'Guest Ticket',
        type: 'Dial In',
        dialInSlots: [],
        isSelected: 'true/false',
        price: Math.random() < 0.5 ? 80 : 0,
        numberOfGuest: 10
      }
    ],
    info: {
      credits: '$100'
    }
  });
});
app.get(/v1\/api\/users\/(.*)\/credit-card/, (req, res) => {
  res.json({number: 'xxxxxxxxxxxx1234', expiration: '08/2025'});
});
app.get(/v1\/api\/users\/(.*)\/functions\/(.*)\/calendar-links/, (req, res) => {
  res.json({google: '456', ical: '234', outlook: '345'});
});
app.post(/v1\/api\/users\/(.*)\/credit-card/, (req, res) => {
  res.json({
    number: 'x'.repeat(12) + `${req.body.number}`.substring(12),
    expiration: req.body.expiration
  });
});
app.post(/v1\/api\/users\/(.*)\/functions\/(.*)\/question/, (req, res) => {
  res.sendStatus(200);
});
app.post(/v1\/api\/users\/(.*)\/functions\/(.*)\/decline/, (req, res) => {
  res.sendStatus(200);
});
app.post(/v1\/api\/users\/(.*)\/functions\/(.*)\/book-tickets/, (req, res) => {
  res.status(400).send({
    message: 'Error Message',
    isNominationFailed: true,
    guestDetails: [
      {
        firstName: 'test1',
        lastName: 'test1',
        email: 'test1@gmail.com',
        error: 'Nomination Err for G1'
      }
    ]
  });
});
app.get(/v1\/api\/users\/(.*)\/notifications\/remove\/(.*)/, (_, res) => {
  res.sendStatus(200);
});
app.post(/v1\/api\/users\/(.*)\/notifications\/read/, (_, res) => {
  res.sendStatus(200);
});
app.post(/v1\/api\/users\/(.*)\/nominations/, (req, res) => {
  let obj = req.body;
  obj.forEach(nomination => {
    nomination.id = Math.floor(Math.random() * 10000);
    nomination.status = {
      iserror: Math.random() < 0.5,
      msg: `${nomination.name} is already nominated`
    };
  });
  res.json(obj);
});
app.post(/v1\/api\/users\/(.*)\/nomination\/(.*)\/feedback/, (req, res) => {
  res.sendStatus(200);
});
app.post(/v1\/api\/users\/(.*)\/request-nomination/, (_, res) => {
  res.sendStatus(200);
});
app.post(/v1\/test/, (req, res) => {
  console.log('Req object::', req.body);
  res.json({success: 'true', body: req.body});
});
app.post('v1/api/feeds/:param1/:param2/like', (req, res) => {
  res.json({message: 'done'});
});
app.post(/v1\/api\/fileupload/, (req, res) => {
  res.json({
    id: Math.random(),
    fileName: 'New Text Document.txt',
    contentType: 'text/plain',
    locationUrl:
      'https://fnprofileimages3.s3.amazonaws.com/dev/files/8m2m1ot/New_Text_Document.txt'
  });
});

app.post(/v1\/api\/users\/(.*)\/chat\/users\/(.*)\/messages/, (req, res) => {
  let msg = req.body;
  res.json({
    messageId: Math.random(),
    sender: '5898',
    recipient: 'friend456',
    timestamp: new Date().toString(),
    message: msg.message,
    attachments: msg.attachments.map(att => ({id: Math.random(), ...att}))
  });
});

app.get('/v1/api/users/:userId/functions/event-calendar', (req, res) => {
  const {from, to} = req.query;
  let filteredDates = events;

  if (from && to) {
    filteredDates = events.filter(date => date >= from && date <= to);
  }

  res.json({dates: filteredDates});
});

app.get('/v1/api/members', (req, res) => {
  const {memberId} = req.query;
  const avatarUrls = [
    'https://res.cloudinary.com/foundersnetwork/image/upload/c_limit,f_jpg,h_110,r_4,w_110/g_south_east,l_fn_22_mw4cdy,r_0:0:4:0/v1/production/userprofile/7b00190a7c5165946c391a25014045f0.jpg',
    'https://res.cloudinary.com/foundersnetwork/image/upload/c_scale,h_70,r_4,w_70/g_south_east,h_12,l_fn_22_mw4cdy,r_0:0:4:0,w_12/v1/production/userprofile/beca49410914935037178693eec5c3df.jpg',
    'https://res.cloudinary.com/foundersnetwork/image/upload/c_scale,h_58,r_4,w_58/g_south_east,h_11,l_fn_22_mw4cdy,r_0:0:4:0,w_11/v1/production/userprofile/e44232a82a66cb7cedef4f43527bdd6b.jpg'
  ];
  const names = [
    'John',
    'Doe',
    'Sam',
    'Peter',
    'Steven',
    'Casey',
    'Cathey',
    'Mike',
    'Jack'
  ];

  const randomAvatarUrl =
    avatarUrls[Math.floor(Math.random() * avatarUrls.length)];
  const randomFirstName = names[Math.floor(Math.random() * names.length)];
  const randomLastName = names[Math.floor(Math.random() * names.length)];

  const results = {
    ...memberProfile[0],
    id: memberId,
    avatarUrl: randomAvatarUrl,
    firstName: randomFirstName,
    lastName: randomLastName
  };

  res.json({results});
});

app.listen(PORT, '127.0.0.1', err => {
  if (err) {
    return;
  }
  console.log('server running on port ' + PORT);
});

app.get('/v1/api/users/:userId/feeds/:page/facets', (req, res) => {
  res.json(facets[req.params.page]);
});

app.get('/v1/api/users/:userId/functions', (req, res) => {
  let {page} = req.query;
  if (!page) {
    return res.json({next: null});
  }
  try {
    page = parseInt(page);
    if (page <= 0 || page > 3) {
      res.json({next: null});
      return;
    }

    let responseArray = [];
    for (let i = 0; i < 10; i++) {
      responseArray.push({
        ...functionPageData[
          Math.floor(Math.random() * functionPageData.length)
        ],
        id: (++id).toString()
      });
    }
    return res.json({
      next: page === 3 ? null : 'page=' + (page + 1),
      data: responseArray
    });
  } catch (err) {
    return res.json({next: null});
  }
});
app.get(/v1\/api\/users\/(.*)\/deals\/(.*)/, (req, res) => {
  res.json(dealInfo);
});
app.post(/v1\/api\/users\/(.*)\/deals\/(.*)\/redeem/, (req, res) => {
  res.json({
    successMessage:
      'Success! You redeemed Discounted rates on weekdays (most models) + waive set up fees from  Zipcar',
    instructions: `<h5>Instructions:</h5>
      <p>
        Please visit this <a target='_blank' href="https://app.close.com/signup/?utm_source=Founders">link</a>
         to take advantage of the fnDeal 
        "FREE 3 Months on Close Professional. 14-day trial, a free migration from any CRM, and a $300 credit toward your subscription
      ".
      </p>`,
    savingsMessage: 'You saved up to $1,324 from fnDeals'
  });
});
app.post(/v1\/api\/users\/(.*)\/deals\/(.*)\/rate/, (req, res) => {
  res.json({
    rating: 5,
    improve: {
      responseTime: true,
      description: false,
      service: false,
      value: true,
      other: true
    },
    improveComment: 'test'
  });
});

app.post(`/v1/api/feeds/:feedsType/:id/comment/:commentId/like`, (req, res) => {
  if (Math.random() < 200) return res.status(200).json({data: 'success'});
  else return res.status(500).json({data: 'internal server error'});
});

app.put('/v1/api/feeds/forum/:commentId', (req, res) => {
  res.json({message: 'success'});
});

app.delete('/v1/api/feeds/forums/:commentId', (req, res) => {
  res.json({message: 'success'});
});

app.get('/v1/api/users/:userId/objectives', (req, res) => {
  const tags = [
    {
      key: '680',
      name: '2-Sided Marketing'
    },
    {
      key: '594',
      name: '3D Printing'
    },
    {
      key: '849',
      name: '3D Prototyping'
    }
  ];
  const randomNumber = Math.random();
  if (randomNumber < 0.25) {
    res.json([]);
    return null;
  } else if (randomNumber >= 0.25 && randomNumber < 0.5) {
    res.json([{objective: 'Raising funds', tags: shuffle(tags), key: '123'}]);
    return null;
  } else if (randomNumber >= 0.5 && randomNumber < 0.75) {
    res.json([
      {objective: 'Raising funds', tags: shuffle(tags), key: '123'},
      {objective: 'Making money', tags: shuffle(tags), key: '1337'}
    ]);
    return null;
  } else {
    res.json([
      {objective: 'Raising funds', tags: shuffle(tags), key: '123'},
      {objective: 'Making money', tags: shuffle(tags), key: '1337'},
      {objective: 'Maximizing profit', tags: shuffle(tags), key: '3554'}
    ]);
    return null;
  }
});

app.get('/v1/api/users/:userId/objectives/all-members', (req, res) => {
  res.json([
    {
      profileId: '69',
      name: 'Conor Power'
    },
    {
      profileId: '84',
      name: 'Mike Mack'
    },
    {
      profileId: '98',
      name: 'Scott Schreiman'
    },
    {
      profileId: '103',
      name: 'Neha Sampat'
    },
    {
      profileId: '178',
      name: 'Aaron Ganek'
    },
    {
      profileId: '208',
      name: 'Cody Caughlan'
    },
    {
      profileId: '211',
      name: 'Solomon Hykes'
    },
    {
      profileId: '296',
      name: 'Jelle van Geuns'
    },
    {
      profileId: '317',
      name: 'Luke Lightning'
    },
    {
      profileId: '335',
      name: 'Peter Oberdorfer'
    },
    {
      profileId: '356',
      name: 'Domingo Guerra'
    },
    {
      profileId: '398',
      name: 'Kevon Saber'
    },
    {
      profileId: '412',
      name: 'Christopher Klundt'
    },
    {
      profileId: '453',
      name: 'Neal Bram'
    },
    {
      profileId: '779',
      name: 'Brendan Fairbanks'
    },
    {
      profileId: '806',
      name: 'Pedro Neira Ferrand'
    },
    {
      profileId: '919',
      name: 'Diego Villarreal'
    },
    {
      profileId: '923',
      name: 'Hisham Anwar'
    }
  ]);
});

app.put('/v1/api/users/:userId/objectives', (req, res) => {
  let tagNo = 1;
  let objectiveKey = 1;
  res.json(
    req.body.objectives
      .filter(obj => !obj.isCompleted)
      .map(obj => ({
        objective: obj.objective,
        tags: obj.tags.map(tag => ({name: `Tag${tagNo++}`, key: tag})),
        key: objectiveKey++
      }))
  );
});

app.get('/v1/api/users/:userId/expertise', (req, res) => {
  res.json([
    {
      key: '594',
      name: '3D Printing'
    },
    {
      key: '849',
      name: '3D Prototyping'
    },
    {
      key: '631',
      name: 'A/B Testing'
    },
    {
      key: '752',
      name: 'Accelerator Program'
    },
    {
      key: '1013',
      name: 'Account Management'
    }
  ]);
});

app.get(`/v1/api/users/:userId/upgrade`, (req, res) => {
  const response = upgradePlanData;
  const id = req.query.id;
  const ccDigits = Math.floor(1000 + Math.random() * 9000).toString();
  const price = '$' + Math.floor(Math.random() * 2000).toString();
  response.id = id;
  response.ccLastFourDigit = ccDigits;
  response.price = price;
  response.total.price = price;
  response.isUpgradPossible = true;
  res.json(response);
});

app.post(`/v1/api/users/:userId/upgrade`, (req, res) => {
  if (Math.random() * 200 < 100)
    return res.status(200).json({message: 'success'});
  else return res.status(500).json({error: 'internal server error'});
});
const deals_array = [
  {
    id: 289,
    name: 'Baremetrics',
    url: 'https://baremetrics.com/',
    title: '50% off for a year if MRR is more than $2.5k',
    imgSrc:
      'https://fnprofileimages3.s3.amazonaws.com/production/hidden_company/472780aa406d0d449035d62f58fccf60.png',
    rating: 4,
    description:
      'Baremetrics is Subscription Analytics and Insights: One click and you get hundreds of valuable metrics and business insights!',
    tags: [
      {
        id: 22,
        name: 'Payments'
      },
      {
        id: 76,
        name: 'Finance'
      },
      {
        id: 552,
        name: 'Subscriptions'
      },
      {
        id: 265,
        name: 'Churn'
      },
      {
        id: 50,
        name: 'SaaS'
      },
      {
        id: 314,
        name: 'Revenue'
      },
      {
        id: 333,
        name: 'Mrr'
      },
      {
        id: 335,
        name: 'Metrics'
      }
    ],
    recommendations: 'Highly Recommended',
    isfeatured: true,
    isRedeemed: true,
    upgradeNeeded: false
  },
  {
    id: 313,
    name: 'Gamerjibe (Virtual Events)',
    url: 'https://gamerjibe.com/pricing',
    title: '25% off any virtual events package for FN members',
    imgSrc:
      'https://fnprofileimages3.s3.amazonaws.com/production/files/g7soylh/gj-logo-large.png',
    rating: 3,
    description:
      'Gamerjibe is the immersive events platform for the digital generation. We built a unique events platform where brands, influencers, and fans can easily organize and attend immersive and engaging 3D events. By leveraging immersion and gamification, Gamerjibe enables you to create and run your next networking event, exhibition, or conference thatparticipants will love and can attend from their favorite web browser, all while going easy on your budget and carbon footprint.',
    tags: [
      {
        id: 7,
        name: 'Marketing & Sales'
      },
      {
        id: 8,
        name: 'Product'
      },
      {
        id: 11,
        name: 'Networking'
      },
      {
        id: 505,
        name: 'Business'
      },
      {
        id: 189,
        name: 'Event'
      },
      {
        id: 191,
        name: 'Webinar'
      },
      {
        id: 960,
        name: 'Event Management'
      }
    ],
    recommendations: 'Recommended',
    isRedeemed: false,
    upgradeNeeded: true
  }
];
app.get('/v1/api/users/:userId/deals', (req, res) => {
  const bootstrap = [],
    angel = [],
    seriesA = [],
    lifetime = [];
  function generate(upgradeNeeded) {
    return {
      ...deals_array[+(Math.random() < 0.5)],
      id: ++id,
      upgradeNeeded,
      isRedeemed: Math.random() < 0.5,
      isfeatured: Math.random() < 0.5,
      value: Math.random() < 0.5 ? '200' : '1337',
      isRatedByUser: Math.random() < 0.5
    };
  }
  for (let i = 0; i < 13; i++) {
    bootstrap.push(generate(false));
    angel.push(generate(true));
    seriesA.push(generate(true));
    lifetime.push(generate(true));
  }
  res.json({
    info: 'You’ve saved up to $1,274 out of $500k+ in fnDeals.',
    bootstrap,
    angel,
    'seriesA+': seriesA,
    lifetime
  });
});

app.get('/v1/api/function/:functionId', (req, res) => {
  res.json(functionDetail);
});

app.get('/v1/api/function/:functionId/attendees', (req, res) => {
  res.json(functionDetailAttendees);
});
app.get('/v1/api/feeds/forums/:forumId', (req, res) => {
  const response = forumDetail;
  res.json(response);
});

app.get('/v1/api/feeds/forums/:forumId/analytics', (req, res) => {
  const response = analytics;
  analytics.like.count = Math.floor(Math.random() * 100);
  res.json(response);
});
