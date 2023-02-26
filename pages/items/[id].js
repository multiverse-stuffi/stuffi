import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Layout from '@/components/Layout';
import { prisma } from '@/lib/prisma';

export async function getStaticPaths() {
  // Get all the items IDs from the database
  const items = await prisma.item.findMany({
    select: { id: true },
  });

  return {
    paths: items.map((item) => ({
      params: { id: item.id },
    })),
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  // Get the current item from the database
  const home = await prisma.item.findUnique({
    where: { id: params.id },
  });

  if (item) {
    return {
      props: JSON.parse(JSON.stringify(item)),
    };
  }

  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };
}

const ListedItem = (item = null) => {
  const router = useRouter();

  const { data: session } = useSession();

  const [isOwner, setIsOwner] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
  }, [session?.user]);

  const deleteHome = async () => {
    let toastId;
    try {
      toastId = toast.loading('Deleting...');
      setDeleting(true);
      // Delete item from DB
      await axios.delete(`/api/items/${items.id}`);
      // Redirect user
      toast.success('Successfully deleted', { id: toastId });
      router.push('/items');
    } catch (e) {
      console.log(e);
      toast.error('Unable to delete item', { id: toastId });
      setDeleting(false);
    }
  };

  return (
    <Layout>
      <div className='max-w-screen-lg mx-auto'>
        <div className='flex flex-col sm:flex-row sm:justify-between sm:space-x-4 space-y-4'>
          <div>
            <h1 className='text-2xl font-semibold truncate'>
              {item?.item ?? ''}
            </h1>
            <ol className='inline-flex items-center space-x-1 text-gray-500'>
              <li>
                <span>{item?.item ?? 0} title</span>
                <span aria-hidden='true'> · </span>
              </li>
              <li>
                <span>{item?.imgUrl ?? 0} image</span>
                <span aria-hidden='true'> · </span>
              </li>
              <li>
                <span>{item?.url ?? 0} url</span>
              </li>
            </ol>
          </div>

          {isOwner ? (
            <div className='flex items-center space-x-2'>
              <button
                type='button'
                disabled={deleting}
                onClick={() => router.push(`/homes/${home.id}/edit`)}
                className='px-4 py-1 border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white transition rounded-md disabled:text-gray-800 disabled:bg-transparent disabled:opacity-50 disabled:cursor-not-allowed'>
                Edit
              </button>

              <button
                type='button'
                disabled={deleting}
                onClick={deleteHome}
                className='rounded-md border border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white focus:outline-none transition disabled:bg-rose-500 disabled:text-white disabled:opacity-50 disabled:cursor-not-allowed px-4 py-1'>
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          ) : null}
        </div>

        <div className='mt-6 relative aspect-video bg-gray-200 rounded-lg shadow-md overflow-hidden'>
          {item?.image ? (
            <Image
              src={item.image}
              alt={item.title}
              layout='fill'
              objectFit='cover'
            />
          ) : null}
        </div>

        <p className='mt-8 text-lg'>{item?.description ?? ''}</p>
      </div>
    </Layout>
  );
};

export default ListedItem;
