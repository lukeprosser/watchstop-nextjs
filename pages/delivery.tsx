import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { setCookie } from 'cookies-next';
import { useForm, SubmitHandler } from 'react-hook-form';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import styleHelpers from '../styles/helpers';

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
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className='max-w-xl p-6 mx-auto border rounded shadow-md border-slate-200'
        >
          <h1 className='mb-8 text-lg font-semibold tracking-wide lg:text-2xl'>
            Delivery Information
          </h1>
          <div className='mb-4'>
            <label htmlFor='fullName' className={styleHelpers.label}>
              Full name
            </label>
            <input
              className={`${styleHelpers.inputBase} ${
                errors.fullName
                  ? styleHelpers.inputOutlineError
                  : styleHelpers.inputOutline
              }`}
              id='fullName'
              type='text'
              placeholder='Full name'
              {...register('fullName', {
                required: true,
                minLength: 2,
              })}
            />
            {errors.fullName ? (
              <span className={styleHelpers.errorMessage}>
                {errors.fullName.type === 'minLength'
                  ? 'Full name must be at least two characters.'
                  : 'Full name is required.'}
              </span>
            ) : (
              ''
            )}
          </div>
          <div className='mb-4'>
            <label htmlFor='address' className={styleHelpers.label}>
              Address
            </label>
            <input
              className={`${styleHelpers.inputBase} ${
                errors.address
                  ? styleHelpers.inputOutlineError
                  : styleHelpers.inputOutline
              }`}
              id='address'
              type='text'
              placeholder='Address'
              {...register('address', {
                required: true,
                minLength: 5,
              })}
            />
            {errors.address ? (
              <span className={styleHelpers.errorMessage}>
                {errors.address.type === 'minLength'
                  ? 'Address must be at least twenty characters.'
                  : 'Address is required.'}
              </span>
            ) : (
              ''
            )}
          </div>
          <div className='mb-4'>
            <label htmlFor='city' className={styleHelpers.label}>
              City
            </label>
            <input
              className={`${styleHelpers.inputBase} ${
                errors.city
                  ? styleHelpers.inputOutlineError
                  : styleHelpers.inputOutline
              }`}
              id='city'
              type='text'
              placeholder='City'
              {...register('city', {
                required: true,
                minLength: 2,
              })}
            />
            {errors.city ? (
              <span className={styleHelpers.errorMessage}>
                {errors.city.type === 'minLength'
                  ? 'City must be at least two characters.'
                  : 'City is required.'}
              </span>
            ) : (
              ''
            )}
          </div>
          <div className='mb-4'>
            <label htmlFor='postcode' className={styleHelpers.label}>
              Postcode
            </label>
            <input
              className={`${styleHelpers.inputBase} ${
                errors.postcode
                  ? styleHelpers.inputOutlineError
                  : styleHelpers.inputOutline
              }`}
              id='postcode'
              type='text'
              placeholder='Postcode'
              {...register('postcode', {
                required: true,
                minLength: 5,
              })}
            />
            {errors.postcode ? (
              <span className={styleHelpers.errorMessage}>
                {errors.postcode.type === 'minLength'
                  ? 'Postcode must be at least five characters.'
                  : 'Postcode is required.'}
              </span>
            ) : (
              ''
            )}
          </div>
          <div className='mb-4'>
            <label htmlFor='country' className={styleHelpers.label}>
              Country
            </label>
            <input
              className={`${styleHelpers.inputBase} ${
                errors.country
                  ? styleHelpers.inputOutlineError
                  : styleHelpers.inputOutline
              }`}
              id='country'
              type='text'
              placeholder='Country'
              {...register('country', {
                required: true,
                minLength: 2,
              })}
            />
            {errors.country ? (
              <span className={styleHelpers.errorMessage}>
                {errors.country.type === 'minLength'
                  ? 'Country must be at least two characters.'
                  : 'Country is required.'}
              </span>
            ) : (
              ''
            )}
          </div>
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
