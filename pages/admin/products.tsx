import React, { useContext, useEffect, useReducer, ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import Layout from '../../components/Layout';
import { Store } from '../../utils/Store';
import { getErrorMsg } from '../../utils/error';

interface IProduct {
  _id: string;
  name: string;
  brand: string;
  category: string;
  rating: number;
  price: number;
  stockCount: number;
}

interface IState {
  loading: boolean;
  error?: string;
  products: IProduct[];
}

interface IAction {
  type: string;
  payload?: any;
}

function reducer(state: IState, action: IAction) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, products: action.payload, error: '' };
    case 'FETCH_FAILURE':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

function AdminProducts() {
  const router = useRouter();

  const value = useContext(Store);
  if (!value) throw new Error('Store context must be defined.');
  const { state } = value;
  const { userInfo } = state;

  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    loading: true,
    products: [],
    error: '',
  });

  useEffect(() => {
    if (!userInfo) router.push('/login');

    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/products`, {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAILURE', payload: getErrorMsg(error) });
      }
    };

    fetchData();
  }, []);

  return (
    <Layout title='Products'>
      <div className='container p-6 mx-auto'>
        <div className='grid-cols-6 md:grid'>
          <aside className='col-span-1 py-4 mb-4 border-b-2 md:pr-6 md:border-b-0 md:border-r-2 md:mb-0 border-slate-300'>
            <ul className='text-sm font-light tracking-wide divide-y lg:text-base'>
              <li className='pt-2 pb-4'>
                <Link href='/admin/dashboard'>
                  <a className='hover:text-sky-600'>Dashboard</a>
                </Link>
              </li>
              <li className='py-4'>
                <Link href='/admin/orders'>
                  <a className='hover:text-sky-600'>Orders</a>
                </Link>
              </li>
              <li className='py-4'>
                <Link href='/admin/products'>
                  <a className='hover:text-sky-600'>Products</a>
                </Link>
              </li>
            </ul>
          </aside>
          <div className='col-span-5 py-4 mb-6 md:pl-8 md:mb-0'>
            <h1 className='mb-6 text-xl font-semibold tracking-wide lg:text-2xl'>
              Products
            </h1>
            {loading ? (
              <div className='flex items-center justify-center'>
                <ArrowPathIcon className='inline w-5 h-5 mr-2 animate-spin' />
                Loading...
              </div>
            ) : error ? (
              <span className='text-lg font-light tracking-wider text-red-600'>
                Error: {error}
              </span>
            ) : (
              <div className='overflow-auto'>
                <table className='w-full table-auto'>
                  <thead className='text-left border-b-2 border-slate-300'>
                    <tr>
                      <th className='px-4 py-2'>ID</th>
                      <th className='px-4 py-2'>Name</th>
                      <th className='px-4 py-2'>Brand</th>
                      <th className='px-4 py-2'>Category</th>
                      <th className='px-4 py-2'>Rating</th>
                      <th className='px-4 py-2'>Price</th>
                      <th className='px-4 py-2'>Stock</th>
                      <th className='px-4 py-2'></th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product: IProduct) => (
                      <tr
                        key={product._id}
                        className='text-sm border-t border-slate-300 first:border-none'
                      >
                        <td className='px-4 py-3'>{product._id}</td>
                        <td className='px-4 py-3'>{product.name}</td>
                        <td className='px-4 py-3'>{product.brand}</td>
                        <td className='px-4 py-3'>{product.category}</td>
                        <td className='px-4 py-3'>{product.rating}</td>
                        <td className='px-4 py-3'>£{product.price}</td>
                        <td className='px-4 py-3'>{product.stockCount}</td>
                        <td className='px-4 py-3'>
                          <Link href={`/admin/product/${product._id}`}>
                            <a className='p-2 text-xs rounded bg-slate-200 hover:bg-slate-900 hover:text-slate-50'>
                              Edit
                            </a>
                          </Link>
                          <Link href={`/admin/product/${product._id}`}>
                            <a className='p-2 ml-2 text-xs rounded bg-slate-200 hover:bg-slate-900 hover:text-slate-50'>
                              Delete
                            </a>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(AdminProducts), { ssr: false });
