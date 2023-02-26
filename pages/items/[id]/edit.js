import Layout from '@/components/Layout';
import ListingForm from '@/components/ListingForm';
import { getSession, useSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export async function getServerSideProps(context) {
  const session = await getSession(context);

  const redirect = {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };

  if (!session) {
    return redirect;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { listedItems: true },
  });

  const id = context.params.id;
  const item = user?.listedItems?.find((item) => item.id === id);
  if (!item) {
    return redirect;
  }
  return {
    props: JSON.parse(JSON.stringify(item)),
  };
}

const Edit = (item = null) => {
  const router = useRouter();

  const handleOnSubmit = (data) =>
    axios.patch(`/api/items/${item.id}`, data);

  const ListedItem = (item = null) => {
    const { data: session } = useSession();
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
      (async () => {
        if (session?.user) {
          try {
            const owner = await axios.get(
              `/api/items/${item.id}/owner`
            );
            setIsOwner(owner?.id === session.user.id);
          } catch (e) {
            setIsOwner(false);
          }
        }
      })();
    }, [item.id, session.user]);

    return (
      <Layout>
        <div className='max-w-screen-sm mx-auto'>
          <h1 className='text-xl font-medium text-gray-800'>
            Edit your stuff
          </h1>
          <p className='text-gray-500'>
            Fill out the form below to edit your stuff.
          </p>
          <div className='mt-8'>
            {item ? (
              <ListingForm
                initialValues={item}
                buttonText='Edit stuff'
                redirectPath={`/items/${item.id}`}
                onSubmit={handleOnSubmit}
              />
            ) : null}
          </div>
        </div>
      </Layout>
    );
  };
};

export default Edit;
