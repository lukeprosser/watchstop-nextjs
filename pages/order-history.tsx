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
  paidAt: Date;
  delivered: boolean;
  deliveredAt: Date;
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
        <div className='grid-cols-4 gap-6 lg:gap-8 md:grid'>
          <div className='col-span-1 p-4 mb-6 border-r-2 md:mb-0 border-slate-300'>
            <ul>
              <li>
                <Link href='/profile'>
                  <a>Profile</a>
                </Link>
              </li>
              <li>
                <Link href='/order-history'>
                  <a>Order History</a>
                </Link>
              </li>
            </ul>
          </div>
          <div className='col-span-3 p-6 mb-6 md:mb-0'>
            <h1 className='mt-6 mb-4 text-xl font-semibold tracking-wide lg:text-2xl'>
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
              <table className='w-full table-auto'>
                <thead className='border-b-2 border-slate-300'>
                  <tr>
                    <th className='py-2'>Order No.</th>
                    <th className='py-2'>Date</th>
                    <th className='py-2'>Total</th>
                    <th className='py-2'>Paid</th>
                    <th className='py-2'>Delivered</th>
                    <th className='py-2'></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order: IOrder) => (
                    <tr
                      key={order._id}
                      className='text-sm border-t border-slate-300 first:border-none'
                    >
                      <td className='px-2 py-3'>
                        {order._id.substring(20, 24)}
                      </td>
                      <td className='px-2 py-3'>{order.createdAt}</td>
                      <td className='px-2 py-3 text-right'>£{order.total}</td>
                      <td className='px-2 py-3 text-right'>
                        £{order.paid ? `Paid on ${order.paidAt}` : 'Pending'}
                      </td>
                      <td className='px-2 py-3 text-right'>
                        {order.delivered
                          ? `Delivered on ${order.deliveredAt}`
                          : 'Pending'}
                      </td>
                      <td className='px-2 py-3 text-center'>
                        <Link href={`/order/${order._id}`}>
                          <a>Details</a>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(OrderHistory), { ssr: false });
