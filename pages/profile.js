import { useSession, signIn, signOut } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]';
import Image from 'next/image';

export default function Component() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        Signed in as {session?.user.email} <br />
        <Image src={session?.user.image} alt='user avatar' /> <br />
        Signed in as {session?.user.name} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    //redirect to login page
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    };
  }
  return {
    props: {
      session,
    },
  };
}
