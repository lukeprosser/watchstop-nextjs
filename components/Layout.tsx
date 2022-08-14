import React, { ReactNode } from 'react';
import Head from 'next/head';

interface Props {
  children?: ReactNode;
}

const date = new Date();
const year = date.getFullYear();
const copyright = `© WatchStop ${year}`;

export default function Layout({ children }: Props) {
  return (
    <div>
      <Head>
        <title>WatchStop</title>
        <meta name='description' content='WatchStop' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div>
        <h1>WatchStop</h1>
      </div>
      <main className='container'>{children}</main>
      <footer>
        <p>{copyright}</p>
      </footer>
    </div>
  );
}
