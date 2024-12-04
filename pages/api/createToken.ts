import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_KEY ?? '');

export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    try {
      const token = await stripe.tokens.create({
        card: {
          number: req.body.number,
          exp_month: req.body.exp_month,
          exp_year: req.body.exp_year,
          cvc: req.body.cvc,
          address_city: req.body.address_city,
          address_state: req.body.address_state,
          address_country: req.body.address_country,
          address_line1: req.body.address_line1,
          address_zip: req.body.address_zip,
          name: req.body.name
        }
      });

      res.status(200).json(token);
    } catch (error: any) {
      res.status(500).json({error: {message: error.message}});
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
