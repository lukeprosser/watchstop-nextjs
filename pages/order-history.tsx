import React, { useContext, useEffect, useReducer } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Link from 'next/link';
import mongoose from 'mongoose';
import axios from 'axios';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { Store } from '../utils/Store';
import { getErrorMsg } from '../utils/error';
import Layout from '../components/Layout';
import { IProduct, IDeliveryInfo, IPaymentResult } from '../models/Order';
import { formatDate } from '../utils/helpers';

interface IOrder {
  _id: string;
  createdAt: string;
  user: mongoose.Schema.Types.ObjectId;
  orderItems: IProduct[];
  deliveryInfo: IDeliveryInfo;
  paymentMethod: string;
  paymentResult: IPaymentResult;
  subtotal: number;
  delivery: number;
  tax: number;
  total: number;
  paid: boolean;
  paidAt: string;
  delivered: boolean;
  deliveredAt: string;
}

interface IState {
  loading: boolean;
  orders: IOrder[];
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
      return { ...state, loading: false, orders: action.payload, error: '' };
    case 'FETCH_FAILURE':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

function OrderHistory() {
  const router = useRouter();

  const value = useContext(Store);
  if (!value) throw new Error('Store context must be defined.');
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
  }, []);

  return (
    <Layout title='Order History'>
      <div className='container p-6 mx-auto'>
        <div className='grid-cols-6 md:grid'>
          <div className='col-span-1 py-4 mb-4 border-b-2 md:pr-6 md:border-b-0 md:border-r-2 md:mb-0 border-slate-300'>
            <ul className='text-sm font-light tracking-wide divide-y lg:text-base'>
              <li className='pt-2 pb-4'>
                <Link href='/profile'>
                  <a className='hover:text-sky-600'>Profile</a>
                </Link>
              </li>
              <li className='py-4'>
                <Link href='/order-history'>
                  <a className='hover:text-sky-600'>Order History</a>
                </Link>
              </li>
            </ul>
          </div>
          <div className='col-span-5 py-4 mb-6 md:pl-8 md:mb-0'>
            <h1 className='mb-6 text-xl font-semibold tracking-wide lg:text-2xl'>
              Order History
            </h1>
            {loading ? (
              <div className='flex items-center justify-center'>
                <ArrowPathIcon className='inline w-5 h-5 mr-2 animate-spin' />
                Loading...
              </div>
            ) : error ? (
              <h3 className='text-lg text-red-600'>{error}</h3>
            ) : (
              <div className='overflow-auto'>
                <table className='w-full table-auto'>
                  <thead className='text-left border-b-2 border-slate-300'>
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
                        className='text-sm border-t border-slate-300 first:border-none'
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
                            <a className='p-2 text-xs rounded bg-slate-200 hover:bg-slate-900 hover:text-slate-50'>
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
