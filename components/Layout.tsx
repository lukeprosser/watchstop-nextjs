import React, { ReactNode, ReactElement } from 'react';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';

type LayoutProps = {
  title?: string;
  description?: string;
  children: ReactNode;
};

export default function Layout({
  title,
  description,
  children,
}: LayoutProps): ReactElement {
  return (
    <>
      <Head>
        <title>WatchStop{title ? ` - ${title}` : ''}</title>
        <meta
          name='description'
          content={description ? description : 'WatchStop'}
        />
      </Head>
      <Header />
      <main className='min-h-screen'>
        <div>{children}</div>
      </main>
      <Footer />
    </>
  );
}
