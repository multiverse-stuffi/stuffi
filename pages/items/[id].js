import Image from 'next/image';
import Layout from '@/components/Layout';
import { prisma } from '@/lib/prisma';
import { useRouter } from 'next/router';

const ListedItem = (item = null) => {
  const router = useRouter();

  if (router.isFallback) {
    return 'Loading...';

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
                  <span>{item?.description ?? 0} description</span>
                  <span aria-hidden='true'> · </span>
                </li>
                <li>
                  <span>{item?.imgUrl ?? 0} image</span>
                  <span aria-hidden='true'> · </span>
                </li>
                <li>
                  <span>{item?.url ?? 0} link</span>
                </li>
              </ol>
            </div>
          </div>

          <div className='mt-6 relative aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg shadow-md overflow-hidden'>
            {item?.image ? (
              <Image
                src={item.image}
                alt={item.item}
                layout='fill'
                objectFit='cover'
              />
            ) : null}
          </div>
          <p className='mt-8 text-lg'>{item?.description ?? ''}</p>
        </div>
      </Layout>
    );
  }
};

export async function getStaticPaths() {
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
  const item = await prisma.item.findUnique({
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

export default ListedItem;
