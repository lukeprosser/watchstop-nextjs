import React, { useEffect, useReducer } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import useStore from '../hooks/useStore';
import { getErrorMsg } from '../utils/error';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import { userSidebarItems } from '../constants';
import Spinner from '../components/Spinner';
import { IAction, IOrder } from '../constants';
import { formatDate } from '../utils/helpers';

interface IState {
  loading: boolean;
  orders: IOrder[];
  error: string;
}

function reducer(state: IState, action: IAction) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload, error: '' };
    case 'FETCH_FAILURE':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

function OrderHistory() {
  const router = useRouter();

  const value = useStore();
  const { state } = value;
  const { userInfo } = state;

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: '',
  });

  useEffect(() => {
    if (!userInfo) router.push('/login');

    const fetchOrders = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/history`, {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAILURE', payload: getErrorMsg(error) });
      }
    };

    fetchOrders();
  }, [router, userInfo]);

  return (
    <Layout title='Order History'>
      <div className='container p-6 mx-auto'>
        <div className='grid-cols-6 md:grid'>
          <Sidebar items={userSidebarItems} activeItem='order-history' />
          <div className='col-span-5 py-4 mb-6 md:pl-8 md:mb-0'>
            <h1 className='mb-6 text-xl font-semibold tracking-wide lg:text-2xl'>
              Order History
            </h1>
            {loading ? (
              <Spinner size='5' message='Loading...' />
            ) : error ? (
              <span className='text-lg font-light tracking-wider text-skin-error'>
                Error: {error}
              </span>
            ) : (
              <div className='overflow-auto'>
                <table className='w-full table-auto'>
                  <thead className='text-left border-b-2 border-skin-muted'>
                    <tr>
                      <th className='px-4 py-2'>Order No.</th>
                      <th className='px-4 py-2'>Date</th>
                      <th className='px-4 py-2'>Total</th>
                      <th className='px-4 py-2'>Payment</th>
                      <th className='px-4 py-2'>Delivery</th>
                      <th className='px-4 py-2'></th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order: IOrder) => (
                      <tr
                        key={order._id}
                        className='text-sm border-t border-skin-muted first:border-none'
                      >
                        <td className='px-4 py-3'>{order._id}</td>
                        <td className='px-4 py-3'>
                          {formatDate(order.createdAt)}
                        </td>
                        <td className='px-4 py-3'>£{order.total}</td>
                        <td className='px-4 py-3'>
                          {order.paid ? formatDate(order.paidAt) : 'Pending'}
                        </td>
                        <td className='px-4 py-3'>
                          {order.delivered
                            ? formatDate(order.deliveredAt)
                            : 'Pending'}
                        </td>
                        <td className='px-4 py-3'>
                          <Link href={`/order/${order._id}`}>
                            <a className='p-2 text-xs rounded bg-skin-button-inverted hover:bg-skin-button-inverted-hover'>
                              Details
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

export default dynamic(() => Promise.resolve(OrderHistory), { ssr: false });
