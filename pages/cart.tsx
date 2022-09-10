import React, { useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TrashIcon } from '@heroicons/react/24/outline';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';

export default function Cart() {
  const value = useContext(Store);
  if (!value) throw new Error('Store context must be defined.');
  const { state } = value;
  const {
    cart: { cartItems },
  } = state;
  return (
    <Layout title='Shopping Cart'>
      <div className='container p-6 mx-auto'>
        <h1 className='mb-4 text-lg font-semibold tracking-wide lg:text-2xl'>
          Shopping Cart
        </h1>
        {cartItems.length === 0 ? (
          <div>
            Cart is empty. <Link href='/'>View products</Link>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-8 2xl:items-center md:grid-cols-3'>
            <table className='col-span-2 table-auto'>
              <thead className='border-b-2 border-slate-300'>
                <tr>
                  <th className='py-2'>Image</th>
                  <th className='py-2'>Name</th>
                  <th className='py-2'>Quantity</th>
                  <th className='py-2'>Price</th>
                  <th className='py-2'>Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr
                    key={item._id}
                    className='border-t border-slate-300 first:border-none'
                  >
                    <td className='px-2 py-3'>
                      <div className='m-auto max-w-xxs'>
                        <Link href={`/product/${item.slug}`}>
                          <a>
                            <Image
                              src={item.image}
                              alt={item.name}
                              width='1280'
                              height='853'
                              layout='responsive'
                            />
                          </a>
                        </Link>
                      </div>
                    </td>
                    <td className='px-2 py-3 text-center'>
                      <Link href={`/product/${item.slug}`}>
                        <a>{item.name}</a>
                      </Link>
                    </td>
                    <td className='px-2 py-3 text-right'>
                      <select value={item.quantity}>
                        {Array.from(Array(item.stockCount).keys()).map((k) => (
                          <option key={k + 1} value={k + 1}>
                            {k + 1}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className='px-2 py-3 text-right'>£{item.price}</td>
                    <td className='px-2 py-3 text-center'>
                      <TrashIcon
                        className='inline-block w-6 h-6 cursor-pointer'
                        role='button'
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div>Cart options</div>
          </div>
        )}
      </div>
    </Layout>
  );
}