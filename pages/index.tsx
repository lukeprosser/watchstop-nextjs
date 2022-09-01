import type { NextPage } from 'next';
import Image from 'next/image';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import Layout from '../components/Layout';
import data from '../utils/data';

const Home: NextPage = () => {
  return (
    <Layout>
      <h1>Products</h1>
      <div className='flex flex-wrap items-center justify-center gap-6'>
        {data.products.map((product) => (
          <div
            key={product.id}
            className='max-w-sm border rounded shadow-md border-slate-300'
          >
            <div>
              <div className=''>
                <Image
                  src={product.image}
                  alt={product.name}
                  width='1280'
                  height='853'
                />
              </div>
              <h3 className='p-2 font-medium tracking-wide'>{product.name}</h3>
            </div>
            <div className='flex items-center justify-between p-2 mt-1'>
              <span className='font-light'>£{product.price}</span>
              <button className='p-1 text-sm rounded bg-slate-900 text-slate-50 hover:bg-red-600'>
                <ShoppingBagIcon className='w-6 h-6' role='button' />
              </button>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Home;
