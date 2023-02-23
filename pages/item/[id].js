import { getItems, getItemById } from '@utils/db';
import Link from 'next/link';

const ItemPage = ({ item: { item, price, tags } }) => {
  const isFree = price === 0 || price === 'null';

  return (
    <div>
      <h2>{item}</h2>
      <ul>
        {tags.map(({ tag, i }) => (
          <li key={tag.id}>
            <Link href={`/tag/${tag.id}`}>
              <a>
                {i + 1}. {tag.tag}
                {isFree && <span> (Free)</span>}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const getStaticPaths = async () => {
  const items = await getItems();

  const paths = items.map(({ id }) => ({
    params: { id: id.toString() },
  }));
  return { paths, fallback: false };
};

export const getStaticProps = async ({ params }) => {
  const { id } = params;

  console.log(id);

  const item = await getItemById(id);

  return {
    props: {
      item: JSON.parse(JSON.stringify(item)),
    },
  };
};

export default ItemPage;
