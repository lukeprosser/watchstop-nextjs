import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getCookie, setCookie } from 'cookies-next';
import { useSnackbar } from 'notistack';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Store } from '../utils/Store';
import Layout from '../components/Layout';
import Stepper from '../components/Stepper';

const RadioButton = ({
  label,
  value,
  selected,
  onChange,
}: {
  label: string;
  value: string;
  selected: string;
  onChange: Function;
}) => {
  return (
    <label className=''>
      <input
        type='radio'
        name='paymentMethod'
        value={value}
        checked={value === selected}
        onChange={() => onChange(value)}
        className='mr-2 -mt-0.5 align-middle'
      />
      {label}
    </label>
  );
};

export default function Payment() {
  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [paymentMethod, setPaymentMethod] = useState('');

  const value = useContext(Store);
  if (!value) throw new Error('Store context must be defined.');
  const { state, dispatch } = value;
  const {
    cart: { deliveryInfo },
  } = state;

  useEffect(() => {
    if (!deliveryInfo?.address) {
      router.push('/delivery');
    } else {
      const paymentMethod = getCookie('paymentMethod');
      setPaymentMethod(typeof paymentMethod === 'string' ? paymentMethod : '');
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    closeSnackbar();
    e.preventDefault();

    if (!paymentMethod) {
      enqueueSnackbar('Payment method is required.', { variant: 'error' });
    } else {
      dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethod });
      setCookie('paymentMethod', paymentMethod);
      router.push('/order');
    }
  };

  return (
    <Layout title='Payment Method'>
      <div className='container p-6 mx-auto'>
        <Stepper
          steps={['Login', 'Delivery Address', 'Payment Method', 'Place Order']}
          activeStep={2}
        />
        <form
          onSubmit={handleSubmit}
          className='max-w-xl p-6 mx-auto mt-4 border rounded shadow-md border-slate-200'
        >
          <h1 className='mb-8 text-xl font-semibold tracking-wide lg:text-2xl'>
            Payment Method
          </h1>
          <fieldset>
            <div>
              <RadioButton
                label='PayPal'
                value='PayPal'
                selected={paymentMethod}
                onChange={setPaymentMethod}
              />
            </div>
            <div>
              <RadioButton
                label='Stripe'
                value='Stripe'
                selected={paymentMethod}
                onChange={setPaymentMethod}
              />
            </div>
          </fieldset>
          <div className='justify-around gap-6 mt-8 text-center md:flex md:flex-row-reverse'>
            <button
              type='submit'
              className='flex items-center justify-center flex-1 w-full px-4 py-3 mb-4 text-sm rounded md:mb-0 bg-slate-900 text-slate-50 hover:bg-sky-600 lg:text-base'
            >
              Continue
              <ChevronRightIcon className='w-4 h-4 ml-1' />
            </button>
            <Link href='/delivery'>
              <a className='flex items-center justify-center flex-1 px-4 py-3 text-sm rounded bg-slate-400 text-slate-50 hover:bg-sky-600 lg:text-base'>
                <ChevronLeftIcon className='w-4 h-4 mr-1' />
                Previous
              </a>
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
}
