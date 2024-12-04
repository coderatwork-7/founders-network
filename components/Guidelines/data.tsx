import classes from './guidelineContent.module.scss';

interface TYPE {
  header1?: string;
  header2?: string;
  content?: string;
}

export const GUIDELINE_DATA: TYPE[] = [
  {
    header1: 'FORUM GUIDELINES',
    content: `<p>Founders Network is a peer mentorship organization. We are here to help one another succeed and grow by sharing experience, warm
          introductions and moral support. The most popular and widely used resource for Founders Network members is the Forum on our Online
          Mentorship Platform. The forums are meant to create a sense of community amongst our members and provide a safe and supportive
          environment to learn and share. We strongly encourage you to dive in, share your experience and ask questions.
          <b> When in doubt, share openly and honestly, knowing you can count on your teammates to be as ready to take supportive action as you are            are yourself.
          </b><br/><br/><br/>The guidelines are intended to protect and serve the community and are subject to change at any time.<div id='anon'></div></p>`
  },
  {
    header1: 'Anonymous Posting:',
    content: `<p>Founders Network members are free to post anonymously whenever they 
          feel the need to do so. Please be assured that all anonymous posts are truly anonymous – your identity is 
          unknown to the Web Team and we are unable to notify members if their anonymous posts are rejected. 
          All anonymous posts are held for moderation and may not appear in the forums for 24 hours, although the 
          response time is usually much quicker. Note: Anonymous posts are truly anonymous; moderators cannot see 
          the original poster's name in the moderation queue.</p>
          <p>The guidelines are intended to protect and serve the community and are subject to change at any time.</p>`
  },
  {
    header1: 'FN Forums:',
    content: `<ul>
          <li>Stage Forums
            <div classname=${classes.stageForums}>
            <ul>
	          <li>All Members: this is for all discussions</li>
	          <li>Angel: this is for Angel specific discussion</li>
	          <li>Series-A: this is for Series-A and above specific discussion</li>
	        </ul>
            <div>
          </li>
          <li>Sector Forums: Sector specific conversations. Used for seeking and providing product feedback, discussing best practices, offering investor intel, coordinating conference plans, sharing resumes, discussing major exits</li>
          <li>Regional Forums: Regional specific conversations. Use cases can include local conferences, events, travel plans and coordinating ad hoc coffee meetings or happy hours with members based in the region</li>
          <li>Deals Directory: tickets, discount referrals and coupon codes, advertising and self promotion. </li>
        </ul>`
  },
  {
    header1: 'TECHNICAL INFO'
  },
  {
    header2: 'To Access the Forums:',
    content: `To view or participate in the forums, login to Founders Network. Click on the 'forums' tab to view recent discussions or search for historical threads.`
  },
  {
    header2: 'To Change your Email Preferences:',
    content: `To change the frequency of email notifications you receive, login to <u>Founders Network</u>, go to ‘Account Settings' and ‘email preferences'. Choose a radio button for the email option that suits your needs.`
  },
  {
    content: `<ul>
          <li>All Emails – you will get every question and reply as an email. </li>
          <li>Daily Digest – will send an email message with all the conversations from that day. This option will send the least number of email messages per day.</li>
          <li>Topics Only – will send every question as an email. Replies will only be available online</li>
          <li>Web Only – will not send any emails but but you can access content online at any time</li>
          </ul>`
  },
  {
    content: `Additionally, members can Mute discussions they do not want to follow and Unfollow members whose posts they do not want to receive.`
  },
  {
    header1: 'FORUM BEST PRACTICES'
  },
  {
    header2: 'DO NOT SHARE your Username and Password:',
    content: `Our community is for members only. Do not share your login credentials (username and password) with non-members such as your spouse/partner, employees or friends.`
  },
  {
    header2: 'Search the archives:',
    content: `Always search the archives before asking a question. Chances are someone else has asked the same question and there are valuable answers already available. To perform a search:`
  },
  {
    content: `<ul>
          <li>Log in to Founders Network </li>
          <li>In the box labeled "Search" type in a simple description of your search. Use general wording, if possible, and if one description isn't adequate, try using similar wording. For example, if you are learning about convertible debt search “convertible note” and “convertible debt.”</li>
          <li>Click on the magnifying glass to run the search. The results will be displayed below the search box. Click a choice in the left navigation to filter results.</li>
        </ul>`
  },
  {
    header1: 'FORUM GUIDELINES',
    content: `Forum guidelines are in place to help maintain a safe and supportive discussion environment. These guidelines outline what is allowed in the forums and what will be removed:`
  },
  {
    header2: 'Forum Etiquette',
    content: `To encourage a supportive sharing of resources in the forums, members are expected to be considerate of all members when communicating. Please make sure you can objectively answer NO to these three questions in regards to your post:`
  },
  {
    content: `<ul>
          <li>Is it destructive rather than constructive? <br>Any communication in the forums, even those expressing disagreement or negative experiences/opinions must be delivered in a manner that is respectful and serves a purpose (to ask for support, answer a question, further the discussion, etc).</li>
          <li>Is it inflammatory?<br> Regardless of intent, posts/comments that contain any hint of agitation or provocation may be removed. </li>
          <li>  Is it respectful? <br>Posts/comments that can be construed as disrespectful, discriminatory or derogatory to fellow members, customers or partners may be removed. </li>
          </ul>`
  },
  {
    content: `If you answered yes to one or more, the post is not appropriate and should not be posted.`
  },
  {
    header2: 'Advertising and Self Promotion',
    content: `You may not post a new topic to blatantly advertise your business, service, website or blog that you own or have a financial or other interest in. We have a no-selling policy. However, you can post a response to another member's current forum post. For example, you may not start a thread suggesting members use your services for Web Development. However, if a member asks for Web Development recommendations, you can reply to their post with detailed info regarding your Web Development business. You must disclose your affiliation in your response and your response must be relevant to the conversation.`
  },
  {
    content: `<ul>
          <li> Promotional messages from outside (non-member) businesses are not permitted in the forums and may not be posted by a member on behalf of the business.</li>
          <li>The Deals Directory is the proper area of the site to advertise your business with a deal or promotion. You can submit your deal <a href="https://members.foundersnetwork.com/deals/">here</a></li>
        </ul>`
  },
  {
    header2: 'Unsolicited Opinions (Positive or Negative)',
    content: `New topics containing opinions, reviews or recommendations of a business, service, or product are permitted in the forums provided they are first-hand accounts of your experience, follow forum etiquette and guidelines, and are not posted more than once.`
  },
  {
    header2: 'No Anonymous Evaluations',
    content: `Posts sharing a positive or negative experience with a specific, named vendor or person should not be posted anonymously.`
  },
  {
    header1: 'Event Postings'
  },
  {
    header2: 'No posts for events, talks, open houses, etc unless it is:',
    content: `<ul>
          <li>Sponsored by Founders Network (Upcoming Functions forum) </li>
          <li>Sponsored by a city or</li>
          <li>Is relevant to the community and there’s a discount/perk for members (if there’s a discount you could also post it to the Deals Directory for added visibility) or</li>
          <li>A fundraiser or open house benefitting a entrepreneurial or non-profit endeavor or</li>
          <li>Free and open to the public</li>
        </ul>`
  },
  {
    header2: 'MODERATION',
    content: `Reasons why the compose view of the Forum or Feed indicate that your posts will be put into moderation:`
  },
  {
    content: `<ol>
          <li>New members are put into Auto Moderation, which means that admins will review your first post and reply. If they see that you are posting and replying in a constructive and friendly way, then you will be released from moderation to interact with the community as you please.</li>
          <li>If you are not a new member, your posts and replies may have been flagged by enough community members to put you back into Moderation. In this case, admins will review your posts and/or replies to make sure that they are appropriate. If you would like to take yourself out of moderation, reach out to any staff member, or email success@foundersnetwork.com.</li>
        </ol>`
  },
  {
    content: `Please be aware, our forums are not fully moderated. Posts made by members who disclose their identity are displayed immediately after being submitted. Posts made anonymously are placed in a moderation queue and must be approved by the Web Team before they are displayed. The typical time for anonymous posts to be reviewed and displayed is within 24 hours. If you do not see your anonymous post displayed within that time frame, send an email to info@foundersnetwork.com to see if your post was rejected for being in violation of forum guidelines.`
  },
  {
    content: `Note: Anonymous posts are truly anonymous; moderators cannot see the original poster's name in the moderation queue.`
  },
  {
    header2: 'Flagging Messages',
    content: `The Success Team is responsible for moderating the forums. Due to our own blind spots, we rely on all members to notify us when they see a post that violates forum guidelines. This can be done by clicking the flag icon in the forum. When a message is flagged, a notice will appear in the moderation queue. A member of the Web Team will then review the message in question.  We strongly encourage discretion when using this option and instead recommend resolving your issues directly.`
  },
  {
    header2: 'Resolving Issues Directly ',
    content: `In the event you take issue with a fellow member's posts or series of posts, you can passively:`
  },
  {
    content: `<ol>
          <li>Mute the thread to stop receiving more emails,&nbsp;</li>
          <li>Unfollow the member to stop receiving any more of their posts, current and future.</li>
          <li>In extreme cases, anonymously flag the post. &nbsp;</li>
        </ol>`
  },
  {
    content: `<ol><li>Mute the thread to stop receiving more emails,&nbsp;</li><li>Unfollow the member to stop receiving any more of their posts, current and future.</li><li>In extreme cases, anonymously flag the post. &nbsp;</li></ol>`
  },
  {
    header2:
      'However, we strongly encourage you to take a more direct approach:',
    content: `<ol>
          <li>Privately message the member to share your concern.&nbsp;</li>
          <li>Cite the specific post and sentence(s) you take issue with and how you experienced it.</li>
          <li>Offer to be available for a call to discuss the experience and how Forum Guidelines might be better followed or improved to produce a more productive forum experience for all involved.</li>
          <li>Together, notify FN Staff of your suggested upgrades to the Forum Guidelines.</li>
        </ol>`
  }
];
