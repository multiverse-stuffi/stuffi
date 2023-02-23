import React from 'react';
import { Container } from '/Container';
import NextHead from 'next/head';

import Nav from './Nav';
import Footer from './Footer';

const Layout = ({ children }) => (
  <>
    <NextHead>
      <title>Stuffi</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta name="description" content="Organize, filter, sort, and rate items" />
      <link rel="icon" href="/favicon.ico" />
    </NextHead>

    <main
      id='app'
      className='d-flex flex-column h-100'
      data-testid='layout'>
      <Nav />
      <Container>{children}</Container>
      <Footer />
    </main>
  </>
);

export default Layout;
