import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { setCookie } from 'cookies-next';
import useStore from '../hooks/useStore';
import { getErrorMsg } from '../utils/error';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import { responses, userSidebarItems } from '../constants';
import FormField from '../components/FormField';

interface IFormInput {
  name: String;
  email: String;
  password: String;
  passwordConfirm: String;
}

function Account() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IFormInput>();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const router = useRouter();

  const value = useStore();
  const { state, dispatch } = value;
  const { userInfo } = state;

  useEffect(() => {
    if (userInfo) {
      // Fill form fields if values exist in store context
      setValue('name', userInfo.name);
      setValue('email', userInfo.email);
    } else {
      router.push('/login');
    }
  }, [router, setValue, userInfo]);

  const handleFormSubmit: SubmitHandler<IFormInput> = async ({
    name,
    email,
    password,
    passwordConfirm,
  }) => {
    closeSnackbar();

    if (password !== passwordConfirm) {
      enqueueSnackbar(responses.passwordConfirm, {
        variant: 'error',
      });
      return;
    }

    try {
      const { data } = await axios.put(
        '/api/users/account',
        {
          name,
          email,
          password,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({ type: 'USER_LOGIN', payload: data });
      setCookie('userInfo', JSON.stringify(data));
      enqueueSnackbar('Account updated successfully.', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(getErrorMsg(error), { variant: 'error' });
    }
  };

  return (
    <Layout title='Account'>
      <div className='container p-6 mx-auto'>
        <div className='grid-cols-6 md:grid'>
          <Sidebar items={userSidebarItems} activeItem='account' />
          <div className='col-span-5 py-4 mb-6 md:pl-8 md:mb-0'>
            <h1 className='mb-6 text-xl font-semibold tracking-wide lg:text-2xl'>
              Account
            </h1>
            <p className='mb-8 font-light'>Update your account details:</p>
            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className='max-w-xl'
            >
              <FormField
                id='name'
                label='Name'
                type='text'
                placeholder='Name'
                errors={errors}
                register={register('name', {
                  required: true,
                  minLength: 2,
                })}
                validationError={
                  errors?.name?.type === 'minLength'
                    ? 'Name must be at least two characters.'
                    : 'Name is required.'
                }
              />
              <FormField
                id='email'
                label='Email'
                type='email'
                placeholder='Email address'
                errors={errors}
                register={register('email', {
                  required: true,
                  pattern: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                })}
                validationError={
                  errors?.email?.type === 'pattern'
                    ? 'Email is not valid.'
                    : 'Email is required.'
                }
              />
              <FormField
                id='password'
                label='Password'
                type='password'
                placeholder='Password'
                errors={errors}
                register={register('password', {
                  validate: (value) => value === '' || value.length >= 8,
                })}
                validationError={
                  errors?.password
                    ? 'Password must be at least eight characters.'
                    : ''
                }
              />
              <FormField
                id='passwordConfirm'
                label='Confirm password'
                type='password'
                placeholder='Password'
                errors={errors}
                register={register('passwordConfirm', {
                  validate: (value) => value === '' || value.length >= 8,
                })}
                validationError={
                  errors?.passwordConfirm
                    ? 'Password must be at least eight characters.'
                    : ''
                }
              />
              <div className='mt-8'>
                <button
                  type='submit'
                  className='w-full px-4 py-3 text-sm rounded bg-skin-fill-accent text-skin-inverted hover:bg-skin-fill-accent-hover lg:text-base'
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(Account), { ssr: false });
