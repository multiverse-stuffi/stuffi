import { PrismaClient } from '@prisma/client';
import {
  withApiAuthRequired,
  getSession
} from '@auth0/nextjs-auth0';
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const prisma = new PrismaClient();

module.exports = withApiAuthRequired(async (req, res) => {
  try {
  const { priceId } = req.query;

  const {
    user: { email },
  } = getSession(req, res);

  const item = prisma.item.findUnique({
    where: {
      id: parseInt(itemId),
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

    const lineItems = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.item,
          },
          unit_amount: item.price,
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      customer: user.stripeId,
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/payment/success`,
      cancel_url: `${process.env.CLIENT_URL}/payment/cancelled`,
    });

    res.json({ id: session.id });
  } catch (err) {
    res.send(err);
  } finally {
    await prisma.$disconnect();
  }
});
