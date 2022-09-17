import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { Store } from '../utils/Store';
import Layout from '../components/Layout';

export default function Delivery() {
  const router = useRouter();
  const value = useContext(Store);
  if (!value) throw new Error('Store context must be defined.');
  const { state } = value;
  const { userInfo } = state;

  if (!userInfo) router.push('/login?redirect=/delivery');

  return (
    <Layout title='Delivery'>
      <h1 className='mb-4 text-lg font-semibold tracking-wide lg:text-2xl'>
        Delivery
      </h1>
    </Layout>
  );
}
