import Layout from '@/components/Layout';
import ListingForm from '@/components/ListingForm';
import axios from 'axios';
import { getSession } from 'next-auth/react';

export async function getServerSideProps(context) {
  //check if user is authenticated
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}

const Create = () => {
  const addItem = (data) => axios.post('/api/items', data);

  return (
    <Layout>
      <div className='max-w-screen-sm mx-auto'>
        <h1 className='text-xl font-medium text-gray-800'>
          Add your stuff
        </h1>
        <p className='text-gray-500'>
          Fill out the form below to add new stuff.
        </p>
        <div className='mt-8'>
          <ListingForm
            onSubmit={addItem}
            buttonText='Add stuff'
            redirectPath='/'
          />
        </div>
      </div>
    </Layout>
  );
};

export default Create;
