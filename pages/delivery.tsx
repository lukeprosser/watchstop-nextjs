import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { setCookie } from 'cookies-next';
import { useForm, SubmitHandler } from 'react-hook-form';
import Layout from '../components/Layout';
import Stepper from '../components/Stepper';
import FormField from '../components/FormField';
import { Store } from '../utils/Store';

interface IFormInput {
  fullName: string;
  address: string;
  city: string;
  postcode: string;
  country: string;
}

export default function Delivery() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IFormInput>();

  const router = useRouter();

  const value = useContext(Store);
  if (!value) throw new Error('Store context must be defined.');
  const { state, dispatch } = value;
  const {
    userInfo,
    cart: { deliveryInfo },
  } = state;

  useEffect(() => {
    if (!userInfo) router.push('/login?redirect=/delivery');

    if (deliveryInfo) {
      // Fill form fields for persistance
      setValue('fullName', deliveryInfo.fullName);
      setValue('address', deliveryInfo.address);
      setValue('city', deliveryInfo.city);
      setValue('postcode', deliveryInfo.postcode);
      setValue('country', deliveryInfo.country);
    }
  }, []);

  const handleFormSubmit: SubmitHandler<IFormInput> = ({
    fullName,
    address,
    city,
    postcode,
    country,
  }) => {
    dispatch({
      type: 'SAVE_DELIVERY_INFO',
      payload: { fullName, address, city, postcode, country },
    });
    setCookie(
      'deliveryInfo',
      JSON.stringify({ fullName, address, city, postcode, country })
    );
    router.push('/payment');
  };

  return (
    <Layout title='Delivery'>
      <div className='container p-6 mx-auto'>
        <Stepper
          steps={['Login', 'Delivery Address', 'Payment Method', 'Place Order']}
          activeStep={1}
        />
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className='max-w-xl p-6 mx-auto mt-4 border rounded shadow-md border-slate-200'
        >
          <h1 className='mb-8 text-lg font-semibold tracking-wide lg:text-2xl'>
            Delivery Information
          </h1>
          <FormField
            id='fullName'
            label='Full name'
            type='text'
            placeholder='Full name'
            errors={errors}
            register={register('fullName', {
              required: true,
              minLength: 2,
            })}
            validationError={
              errors?.fullName?.type === 'minLength'
                ? 'Name must be at least two characters.'
                : 'Name is required.'
            }
          />
          <FormField
            id='address'
            label='Address'
            type='text'
            placeholder='Address'
            errors={errors}
            register={register('address', {
              required: true,
              minLength: 5,
            })}
            validationError={
              errors?.address?.type === 'minLength'
                ? 'Address must be at least five characters.'
                : 'Address is required.'
            }
          />
          <FormField
            id='city'
            label='City'
            type='text'
            placeholder='City'
            errors={errors}
            register={register('city', {
              required: true,
              minLength: 2,
            })}
            validationError={
              errors?.city?.type === 'minLength'
                ? 'City must be at least two characters.'
                : 'City is required.'
            }
          />
          <FormField
            id='postcode'
            label='Postcode'
            type='text'
            placeholder='Postcode'
            errors={errors}
            register={register('postcode', {
              required: true,
              minLength: 5,
            })}
            validationError={
              errors?.postcode?.type === 'minLength'
                ? 'Postcode must be at least five characters.'
                : 'Postcode is required.'
            }
          />
          <FormField
            id='country'
            label='Country'
            type='text'
            placeholder='Country'
            errors={errors}
            register={register('country', {
              required: true,
              minLength: 2,
            })}
            validationError={
              errors?.country?.type === 'minLength'
                ? 'Country must be at least two characters.'
                : 'Country is required.'
            }
          />
          <div className='mt-8'>
            <button
              type='submit'
              className='w-full px-4 py-3 text-sm rounded bg-slate-900 text-slate-50 hover:bg-sky-600 lg:text-base'
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
