import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { deleteCookie } from 'cookies-next';
import Layout from '../components/Layout';
import Stepper from '../components/Stepper';
import Spinner from '../components/Spinner';
import useStore from '../hooks/useStore';
import { roundToTwoDec } from '../utils/helpers';
import { getErrorMsg } from '../utils/error';

function Order() {
  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const value = useStore();
  const { state, dispatch } = value;
  const {
    userInfo,
    cart: { cartItems, deliveryInfo, paymentMethod },
  } = state;
  const [loading, setLoading] = useState(false);

  const subtotal = roundToTwoDec(
    cartItems.reduce((prev, curr) => prev + curr.quantity * curr.price, 0)
  );
  const delivery = subtotal > 50 ? 0 : 9.99;
  const tax = roundToTwoDec(subtotal * 0.2);
  const total = roundToTwoDec(subtotal + delivery + tax);

  useEffect(() => {
    if (!paymentMethod) {
      router.push('/payment');
    } else if (!deliveryInfo) {
      router.push('/delivery');
    } else if (cartItems.length === 0 || !userInfo) {
      router.push('/');
    }
    // Only check on initial mount during checkout
  }, []); // eslint-disable-line

  const handlePlaceOrder = async () => {
    closeSnackbar();
    try {
      setLoading(true);
      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems: cartItems,
          deliveryInfo,
          paymentMethod,
          subtotal,
          delivery,
          tax,
          total,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({ type: 'CART_CLEAR_ITEMS' });
      deleteCookie('cartItems');
      setLoading(false);
      router.push(`/order/${data._id}`);
    } catch (error) {
      setLoading(false);
      enqueueSnackbar(getErrorMsg(error), { variant: 'error' });
    }
  };

  return (
    <Layout title='Order'>
      <div className='container p-6 mx-auto'>
        <Stepper
          steps={['Login', 'Delivery Address', 'Payment Method', 'Place Order']}
          activeStep={3}
        />
        <h1 className='mt-6 mb-4 text-xl font-semibold tracking-wide lg:text-2xl'>
          Order Confirmation
        </h1>
        <div className='grid-cols-3 gap-6 lg:gap-8 md:grid'>
          <div className='col-span-2 col-start-1 row-start-1 p-4 mb-6 border rounded shadow-md md:mb-0 border-skin-muted'>
            <h2 className='p-2 mb-2 font-medium tracking-wider lg:text-xl'>
              Your Items
            </h2>
            <table className='w-full table-auto'>
              <thead className='border-b-2 border-skin-muted'>
                <tr>
                  <th className='py-2'>Image</th>
                  <th className='py-2'>Name</th>
                  <th className='py-2'>Quantity</th>
                  <th className='py-2'>Price</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr
                    key={item._id}
                    className='text-sm border-t border-skin-muted first:border-none'
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
          <div className='col-span-2 p-6 mb-6 border rounded shadow-md md:mb-0 border-skin-muted'>
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
          </div>
          <div className='col-span-2 p-6 mb-6 border rounded shadow-md md:mb-0 border-skin-muted'>
            <h2 className='mb-2 font-medium tracking-wider lg:text-xl'>
              Payment Method
            </h2>
            <p className='text-sm font-light '>{paymentMethod}</p>
          </div>
          <div className='self-start row-start-1 p-6 border rounded shadow-md bg-skin-fill-inverted-muted md:max-h-max min-w-fit border-skin-muted'>
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
                  <td>£{tax.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Delivery::</td>
                  <td>{delivery === 0 ? 'FREE' : `£${delivery}`}</td>
                </tr>
                <tr className='text-lg font-semibold tracking-wide border-t border-skin-muted'>
                  <td className='pt-2'>Total:</td>
                  <td className='pt-2'>£{total}</td>
                </tr>
              </tbody>
            </table>
            <button
              onClick={handlePlaceOrder}
              className='w-full px-4 py-3 text-sm text-center rounded bg-skin-fill-accent text-skin-inverted hover:bg-skin-fill-accent-hover lg:text-base'
            >
              {loading ? (
                <Spinner size='5' message='Processing...' />
              ) : (
                'Place Order'
              )}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(Order), { ssr: false });
