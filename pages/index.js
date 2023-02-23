import { getItems } from 'utils/db';
import { useUser } from '@auth0/nextjs-auth0';
import Link from 'next/link';
import Container from '@/components/Container';

const HomePage = ({ items }) => {
  const { user } = useUser();

  return (
    <Container>
      <div>
        <div className='flex flex-wrap'>
          {items.map(({ item, id, price }) => {
            const isFree = price === 0 || price === undefined;

            return (
              <Link href={`/item/${id}`} key={id}>
                <a className='bg-white mx-2 my-2 text-gray-600 w-56 px-8 pt-8 rounded-md relative'>
                  <h1>{item.item}</h1>
                  <span
                    className={`${
                      isFree ? 'bg-green-200' : 'bg-pink-200'
                    } absolute bottom-1 right-1 rounded-md py-2 px-4 text-xs`}>
                    {isFree ? 'Free' : `$${price / 100}`}
                  </span>
                </a>
              </Link>
            );
          })}
        </div>
      </div>
    </Container>
  );
};

export const getStaticProps = async () => {
  const data = await getItems();

  return {
    props: {
      items: JSON.parse(JSON.stringify(data)),
    },
  };
};
export default HomePage;
