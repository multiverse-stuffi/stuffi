import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import Stripe from 'stripe';
import { getItem, getUserByEmail } from 'utils/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = withApiAuthRequired(async (req, res) => {
  const {
    user: { email },
  } = getSession(req, res);

  const user = await getUserByEmail(email);

  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeId,
    return_url: process.env.CLIENT_URL,
  });

  res.send({
    url: session.url,
  });
});
