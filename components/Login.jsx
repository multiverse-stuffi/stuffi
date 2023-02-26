import { signIn } from 'next-auth/react';
import Image from 'next/image';

const Login = () => {
  return (
    <div className='grid place-items-center'>
      <Image
        src='https://links.papareact.com/t4i'
        height={400}
        width={400}
        objectFit='contain'
        alt='login'
      />
      <h1
        className='p-5 bg-blue-500 rounded-full text-white text-center w-1/6 cursor-pointer'
        onClick={signIn}>
        Login with Google
      </h1>
    </div>
  );
};
