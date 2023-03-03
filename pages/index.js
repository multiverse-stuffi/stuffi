import React, { useState, useEffect, useCallback } from 'react';
import prisma from '../lib/prisma';
import Login from '@/components/Login';
import Sidebar from '@/components/Sidebar';
import AuthModal from '@/components/AuthModal';
import Head from 'next/head';
import { getSession } from 'next-auth/react';
import Header from '@/components/Header';
import Feed from '@/components/Feed';

export async function getServerSideProps(context) {
  //get user & items
  const session = true
    //await getSession(context);
  const items = await prisma.item.findMany();

  return {
    props: {
      session,
      items: JSON.parse(JSON.stringify(items)),
    },
  };
}

export default function Home({ items = [], tags = [] }) {
  const [modal, showModal] = useState(false);
  const session = getSession();

  if (!session) return <Login />;

  return (
    <div className='h-screen bg-gray-100 overflow-hidden'>
      <Head />

      <Header />

      <main className='flex'>
        <Sidebar />
        <Feed items={items} />
      </main>
      <AuthModal show={false} onClose={() => {}} />
    </div>
  );
}
