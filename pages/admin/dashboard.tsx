import React, { useContext, useEffect, useReducer } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { Store } from '../../utils/Store';
import { getErrorMsg } from '../../utils/error';
import Layout from '../../components/Layout';

interface IState {
  loading: boolean;
  sumnmary: { salesData: [] };
  error: string;
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
      return { ...state, loading: false, summary: action.payload, error: '' };
    case 'FETCH_FAILURE':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

function AdminDashboard() {
  const router = useRouter();

  const value = useContext(Store);
  if (!value) throw new Error('Store context must be defined.');
  const { state } = value;
  const { userInfo } = state;

  const [{ loading, error, summary }, dispatch] = useReducer(reducer, {
    loading: true,
    summary: { salesData: [] },
    error: '',
  });

  useEffect(() => {
    if (!userInfo) router.push('/login');

    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/summary`, {
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
    <Layout title='Order History'>
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
            </ul>
          </aside>
          <div className='col-span-5 py-4 mb-6 md:pl-8 md:mb-0'>
            <section className='justify-between gap-4 md:flex'>
              <div className='w-full p-4 mb-4 border rounded shadow-md md:w-1/4 border-slate-300'>
                <span>{summary.ordersPrice}</span>
                <h3>Sales</h3>
                <Link href='/admin/products'>
                  <a>View Sales</a>
                </Link>
              </div>
              <div className='w-full p-4 mb-4 border rounded shadow-md md:w-1/4 border-slate-300'>
                <span>{summary.ordersCount}</span>
                <h3>Orders</h3>
                <Link href='/admin/products'>
                  <a>View Orders</a>
                </Link>
              </div>
              <div className='w-full p-4 mb-4 border rounded shadow-md md:w-1/4 border-slate-300'>
                <span>{summary.productsCount}</span>
                <h3>Products</h3>
                <Link href='/admin/products'>
                  <a>View Products</a>
                </Link>
              </div>
              <div className='w-full p-4 mb-4 border rounded shadow-md md:w-1/4 border-slate-300'>
                <span>{summary.usersCount}</span>
                <h3>Users</h3>
                <Link href='/admin/products'>
                  <a>View Users</a>
                </Link>
              </div>
            </section>
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
              <div>
                <h2>Sales Chart</h2>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(AdminDashboard), { ssr: false });
