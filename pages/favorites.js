import { getSession } from 'next-auth/react';
import Layout from '@/components/Layout';
import Grid from '@/components/Grid';
import { prisma } from '@/lib/prisma';

export async function getServerSideProps(context) {
  // Check if user is authenticated
  const session = await getSession(context);

  // If not, redirect to the homepage
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  // Get all homes from the authenticated user
  const homes = await prisma.item.findMany({
    where: {
      favoritedBy: { some: { email: session.user.email } },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Pass the data to the Homes component
  return {
    props: {
      homes: JSON.parse(JSON.stringify(items)),
    },
  };
}

const Favorites = ({ items = [] }) => {
  return (
    <Layout>
      <h1 className='text-xl font-medium text-gray-800'>
        Your Stuff
      </h1>
      <p className='text-gray-500'>
        Manage your stuff and update your info!
      </p>
      <div className='mt-8'>
        <Grid items={items} />
      </div>
    </Layout>
  );
};

export default Favorites;
