import { useContext, useEffect, useReducer } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import {
  CreateOrderData,
  CreateOrderActions,
  OnApproveData,
  OnApproveActions,
} from '@paypal/paypal-js';
import {
  usePayPalScriptReducer,
  SCRIPT_LOADING_STATE,
  PayPalButtons,
} from '@paypal/react-paypal-js';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import Layout from '../../components/Layout';
import { Store } from '../../utils/Store';
import { getErrorMsg } from '../../utils/error';
import { IOrder } from '../../models/Order';
import { IProduct } from '../../pages/index';
import { formatDate } from '../../utils/helpers';

interface IState {
  loading: boolean;
  order: IOrder;
  error: string;
  successPayment: boolean;
  loadingDeliver: boolean;
  successDeliver: boolean;
}

interface IAction {
  type: string;
  payload?: any;
}

interface IParams {
  id: string;
}

function reducer(state: IState, action: IAction) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPayment: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPayment: false, successPayment: true };
    case 'PAY_FAILURE':
      return { ...state, loadingPayment: false, errorPayment: action.payload };
    case 'PAY_RESET':
      return {
        ...state,
        loadingPayment: false,
        successPayment: false,
        errorPayment: '',
      };
    case 'DELIVER_REQUEST':
      return { ...state, loadingDeliver: true };
    case 'DELIVER_SUCCESS':
      return { ...state, loadingDeliver: false, successDeliver: true };
    case 'DELIVER_FAILURE':
      return { ...state, loadingDeliver: false, errorDeliver: action.payload };
    case 'DELIVER_RESET':
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
        errorDeliver: '',
      };
    default:
      return state;
  }
}

function OrderDetail({ params }: { params: IParams }) {
  const orderId = params.id;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const router = useRouter();
  const value = useContext(Store);
  if (!value) throw new Error('Store context must be defined.');
  const { state } = value;
  const { userInfo } = state;

  const [
    { loading, error, order, successPayment, loadingDeliver, successDeliver },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
    successPayment: false,
    loadingDeliver: false,
    successDeliver: false,
  });
  const {
    deliveryInfo,
    paymentMethod,
    orderItems,
    subtotal,
    delivery,
    tax,
    total,
    paid,
    paidAt,
    delivered,
    deliveredAt,
  } = order;

  useEffect(() => {
    if (!userInfo) router.push('/login');

    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAILURE', payload: getErrorMsg(error) });
      }
    };

    if (
      !order._id ||
      successPayment || // If payment successful, fetch order again to hide PayPal button
      successDeliver || // If deliver successful, fetch order again to hide deliver button
      (order._id && order._id !== orderId)
    ) {
      fetchOrder();
      if (successPayment) {
        dispatch({ type: 'PAY_RESET' });
      }
      if (successDeliver) {
        dispatch({ type: 'DELIVER_RESET' });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get('/api/keys/paypal', {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        });
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'GBP',
          },
        });
        paypalDispatch({
          type: 'setLoadingStatus',
          value: SCRIPT_LOADING_STATE.PENDING,
        });
      };
      loadPaypalScript();
    }
  }, [
    router,
    userInfo,
    orderId,
    order,
    paypalDispatch,
    successPayment,
    successDeliver,
  ]);

  function createOrder(data: CreateOrderData, actions: CreateOrderActions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: total },
          },
        ],
      })
      .then((orderID: string) => {
        return orderID;
      });
  }

  function onApprove(data: OnApproveData, actions: OnApproveActions) {
    if (actions.order) {
      return actions.order.capture().then(async function (details) {
        try {
          closeSnackbar();
          dispatch({ type: 'PAY_REQUEST' });
          const { data } = await axios.put(
            `/api/orders/${order._id}/pay`,
            details,
            {
              headers: {
                authorization: `Bearer ${userInfo.token}`,
              },
            }
          );
          dispatch({ type: 'PAY_SUCCESS', payload: data });
          enqueueSnackbar('Order paid successfully.', { variant: 'success' });
        } catch (error) {
          closeSnackbar();
          dispatch({ type: 'PAY_FAILURE', payload: getErrorMsg(error) });
          enqueueSnackbar(getErrorMsg(error), { variant: 'error' });
        }
      });
    } else {
      // Handle potentially undefined onApprove actions
      throw new Error('PayPal actions not defined.');
    }
  }

  function onError(error: Record<string, unknown>) {
    closeSnackbar();
    enqueueSnackbar(getErrorMsg(error), { variant: 'error' });
  }

  async function handleDeliverOrder() {
    try {
      dispatch({ type: 'DELIVER_REQUEST' });
      const { data } = await axios.put(
        `/api/orders/${orderId}/deliver`,
        {},
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({ type: 'DELIVER_SUCCESS', payload: data });
      enqueueSnackbar('Order status updated successfully.', {
        variant: 'success',
      });
    } catch (error) {
      dispatch({ type: 'DELIVER_FAILURE', payload: getErrorMsg(error) });
      enqueueSnackbar(getErrorMsg(error), { variant: 'error' });
    }
  }

  return (
    <Layout title='Order Details'>
      <div className='container p-6 mx-auto'>
        <h1 className='mt-6 mb-4 text-xl font-semibold tracking-wide lg:text-2xl'>
          Order Details
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
          <div className='grid-cols-3 gap-6 lg:gap-8 md:grid'>
            <div className='col-span-2 col-start-1 row-start-1 p-4 mb-6 border rounded shadow-md md:mb-0 border-slate-200'>
              <h2 className='p-2 mb-2 font-medium tracking-wider lg:text-xl'>
                Your Order: <span className='font-normal'>{orderId}</span>
              </h2>
              <table className='w-full table-auto'>
                <thead className='border-b-2 border-slate-300'>
                  <tr>
                    <th className='py-2'>Image</th>
                    <th className='py-2'>Name</th>
                    <th className='py-2'>Quantity</th>
                    <th className='py-2'>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item: IProduct) => (
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
                      <td className='px-2 py-3 text-right'>{item.quantity}</td>
                      <td className='px-2 py-3 text-right'>£{item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className='col-span-2 p-6 mb-6 border rounded shadow-md md:mb-0 border-slate-200'>
              <h2 className='mb-2 font-medium tracking-wider lg:text-xl'>
                Delivery Information
              </h2>
              <ul className='text-sm font-light'>
                <li>{deliveryInfo?.fullName}</li>
                <li>{deliveryInfo?.address}</li>
                <li>{deliveryInfo?.city}</li>
                <li>{deliveryInfo?.postcode}</li>
                <li>{deliveryInfo?.country}</li>
              </ul>
              <p className='py-2 mt-4 tracking-wider border-t'>
                Status:{' '}
                {delivered
                  ? `Delivered on ${formatDate(deliveredAt)}`
                  : 'Pending'}
              </p>
            </div>
            <div className='col-span-2 p-6 mb-6 border rounded shadow-md md:mb-0 border-slate-200'>
              <h2 className='mb-2 font-medium tracking-wider lg:text-xl'>
                Payment Method
              </h2>
              <p className='text-sm font-light '>{paymentMethod}</p>
              <p className='py-2 mt-4 tracking-wider border-t'>
                Status:{' '}
                {paid ? `Paid on ${formatDate(paidAt)}` : 'Awaiting payment'}
              </p>
            </div>
            <div className='self-start row-start-1 p-6 border rounded shadow-md bg-slate-200 md:max-h-max min-w-fit border-slate-300'>
              <h2 className='mb-4 font-medium tracking-wider lg:text-xl'>
                Order Summary
              </h2>
              <table className='w-full mb-6 table-auto'>
                <tbody>
                  <tr>
                    <td>Subtotal:</td>
                    <td>£{subtotal}</td>
                  </tr>
                  <tr>
                    <td>VAT:</td>
                    <td>£{tax}</td>
                  </tr>
                  <tr>
                    <td>Delivery::</td>
                    <td>{delivery === 0 ? 'FREE' : `£${delivery}`}</td>
                  </tr>
                  <tr className='text-lg font-semibold tracking-wide border-t border-slate-300'>
                    <td className='pt-2'>Total:</td>
                    <td className='pt-2'>£{total}</td>
                  </tr>
                </tbody>
              </table>
              {!paid && (
                <div>
                  {isPending ? (
                    <div className='flex items-center justify-center'>
                      <ArrowPathIcon className='inline w-5 h-5 mr-2 animate-spin' />
                      Loading...
                    </div>
                  ) : (
                    <PayPalButtons
                      createOrder={createOrder}
                      onApprove={onApprove}
                      onError={onError}
                    />
                  )}
                </div>
              )}
              {userInfo.admin && order.paid && !order.delivered && (
                <button
                  className='w-full px-4 py-3 text-sm rounded bg-slate-900 text-slate-50 hover:bg-sky-600 lg:text-base'
                  onClick={handleDeliverOrder}
                >
                  {loadingDeliver ? (
                    <div className='flex items-center justify-center'>
                      <ArrowPathIcon className='inline w-5 h-5 mr-2 animate-spin' />
                      Processing...
                    </div>
                  ) : (
                    'Deliver Order'
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params }: { params: IParams }) {
  return {
    props: { params },
  };
}

export default dynamic(() => Promise.resolve(OrderDetail), { ssr: false });
