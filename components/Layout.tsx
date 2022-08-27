import React, { ReactNode, ReactElement } from 'react';
import Head from 'next/head';
import Navbar from './Navbar';
import Footer from './Footer';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps): ReactElement {
  return (
    <>
      <Head>
        <title>WatchStop</title>
        <meta name='description' content='WatchStop' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Navbar />
      <main className='min-h-screen'>
        <div>{children}</div>
      </main>
      <Footer />
    </>
  );
}
