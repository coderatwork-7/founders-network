import axios from 'axios';

import type {NextApiRequest, NextApiResponse} from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const {memberName, memberId, investorId, investorName} = req.body;

    const message = {
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Hey Dina! <${process.env.NEXT_PUBLIC_API_DOMAIN_URL}/profile/${memberId}|${memberName}> would like you to introduce them to <${process.env.NEXT_PUBLIC_API_DOMAIN_URL}/investor/${investorId}|${investorName}>. You're the best. Founder's Network would be lost without you. Have a great day!`
          }
        }
      ]
    };

    const result = await axios.post(
      'https://hooks.slack.com/services/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',
      message,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    if (result) {
      res.status(200).json({status: 'success', message: 'Notification sent'});
    } else {
      res
        .status(500)
        .json({status: 'error', message: 'Failed to send notification'});
    }
  } else {
    res.status(405).json({status: 'error', message: 'Method not allowed'});
  }
}
