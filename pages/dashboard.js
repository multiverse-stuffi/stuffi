import Link from 'next/link';
import {
  withPageAuthRequired,
  getSession,
} from '@auth0/nextjs-auth0';
import Stripe from 'stripe';
import { processSubscription, loadPortal } from 'utils/payment';
import { PrismaClient } from '@prisma/client';

const Dashboard = ({ plans, dbUser }) => {
  return (
    <div>
      <h2>Subscription</h2>
      {dbUser.isSubscribed ? (
        <p>Your subscription is active</p>
      ) : (
        <p>You do not have a subscription</p>
      )}
      <button onClick={loadPortal}>Manage Subscription</button>
      <h2>Purchases</h2>
      {dbUser.items.map(({ id, item }) => (
        <Link href={`/${id}`} key={id}>
          <a>{item}</a>
        </Link>
      ))}
    </div>
  );
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps({ req, params }) {
    const {
      user: { email },
    } = await getSession(req)
    const prisma = new PrismaClient();
    const dbUser = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        items: true,
      },
    });
    await prisma.$disconnect();

    return {
      props: {
        dbUser: JSON.parse(JSON.stringify(dbUser)),
      },
    }
  },
});

export default Dashboard;
