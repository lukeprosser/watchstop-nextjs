import React from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

export default function Delivery() {
  const router = useRouter();
  router.push('/login');

  return (
    <Layout title='Delivery'>
      <h1 className='mb-4 text-lg font-semibold tracking-wide lg:text-2xl'>
        Delivery
      </h1>
    </Layout>
  );
}
