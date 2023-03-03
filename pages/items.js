import Layout from '@/components/Layout';
import Grid from '@/components/Grid';
import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const items = await prisma.item.findMany({
    where: { owner: { email: session.user.email } },
    orderBy: { createdAt: 'desc' },
  });
  return {
    props: {
      homes: JSON.parse(JSON.stringify(items)),
    },
  };
}

const Items = ({ items = [] }) => {
  return (
    <Layout>
      <h1 className='text-xl font-medium text-gray-800'>
        Your Stuff
      </h1>
      <p className='text-gray-500'>
        Manage your stuff and update your info.
      </p>
      <div className='mt-8'>
        <Grid items={items} />
      </div>
    </Layout>
  );
};

export default Items;
