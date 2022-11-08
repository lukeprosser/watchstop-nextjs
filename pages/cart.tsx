import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { TrashIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import Layout from '../components/Layout';
import useStore from '../hooks/useStore';
import { IProduct } from '../constants';

function Cart() {
  const value = useStore();
  const { state, dispatch } = value;
  const {
    cart: { cartItems },
  } = state;

  const handleQuantityUpdate = async (item: IProduct, quantity: string) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.stockCount < quantity) {
      window.alert('Sorry, this product is no longer in stock.');
      return;
    }
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity: parseInt(quantity) },
    });
  };

  const handleRemoveFromCart = async (id: string) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: id });
  };

  return (
    <Layout title='Shopping Cart'>
      <div className='container p-6 mx-auto'>
        <h1 className='mb-4 text-xl font-semibold tracking-wide lg:text-2xl'>
          Shopping Cart
        </h1>
        {cartItems.length === 0 ? (
          <div>
            Cart is empty.{' '}
            <Link href='/'>
              <a className='block px-4 py-3 mt-6 text-sm rounded w-fit bg-slate-900 text-slate-50 hover:bg-red-600 lg:text-base'>
                View products
              </a>
            </Link>
          </div>
        ) : (
          <div className='grid items-start grid-cols-1 md:gap-8 md:grid-cols-3'>
            <table className='col-span-2 mb-8 table-auto'>
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
                    className='text-sm border-t border-slate-300 first:border-none'
                  >
                    <td className='px-2 py-3'>
                      <div className='m-auto max-w-xxs'>
                        <Link href={`/product/${item.slug}`}>
                          <a>
                            <div className='image-wrapper'>
                              <Image
                                src={item.image}
                                alt={item.name}
                                width='1280'
                                height='853'
                                layout='responsive'
                              />
                            </div>
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
                      <select
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityUpdate(item, e.target.value)
                        }
                      >
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
                        onClick={() => handleRemoveFromCart(item._id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='self-start p-6 border rounded shadow-md bg-slate-200 md:max-h-max min-w-fit border-slate-300'>
              <h2 className='mb-4 font-medium tracking-wider lg:text-xl'>
                Order Summary
              </h2>
              <ul className='mb-6 font-light'>
                <li>
                  {cartItems.reduce((prev, curr) => prev + curr.quantity, 0)}{' '}
                  items in cart
                </li>
                <li className='text-lg font-medium tracking-wide'>
                  Subtotal: £
                  {cartItems
                    .reduce(
                      (prev, curr) => prev + curr.quantity * curr.price,
                      0
                    )
                    .toFixed(2)}
                </li>
              </ul>
              <Link href='/delivery'>
                <a className='block w-full px-4 py-3 text-sm text-center rounded bg-slate-900 text-slate-50 hover:bg-red-600 lg:text-base'>
                  Checkout
                </a>
              </Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(Cart), { ssr: false });
