import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { setCookie } from 'cookies-next';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import Layout from '../components/Layout';
import FormField from '../components/FormField';
import useStore from '../hooks/useStore';
import { getErrorMsg } from '../utils/error';

interface IFormInput {
  email: String;
  password: String;
}

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const router = useRouter();
  // Get previous page if passed
  const { redirect } = router.query;

  const value = useStore();
  const { state, dispatch } = value;
  const { userInfo } = state;

  useEffect(() => {
    /*
      - Redirect to home if user logged in
      - Only run once when component is initially loaded
      - Prevents further redirect to home page (e.g. to redirect back to delivery if checking out)
    */
    if (userInfo) router.push('/');
    // Excluding userInfo from array to only check on first render - causes error in getServerSideProps check on home page
  }, [router]); // eslint-disable-line

  const handleFormSubmit: SubmitHandler<IFormInput> = async ({
    email,
    password,
  }) => {
    closeSnackbar();
    try {
      const { data } = await axios.post('/api/users/login', {
        email,
        password,
      });
      dispatch({ type: 'USER_LOGIN', payload: data });
      setCookie('userInfo', JSON.stringify(data));
      router.push(typeof redirect === 'string' ? redirect : '/');
    } catch (error) {
      enqueueSnackbar(getErrorMsg(error), { variant: 'error' });
    }
  };

  return (
    <Layout title='Login'>
      <div className='container p-6 mx-auto'>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className='max-w-xl p-6 mx-auto border rounded shadow-md border-skin-muted'
        >
          <h1 className='mb-8 text-xl font-semibold tracking-wide lg:text-2xl'>
            Login
          </h1>
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
              required: true,
              minLength: 8,
            })}
            validationError={
              errors?.password?.type === 'minLength'
                ? 'Password must be at least eight characters.'
                : 'Password is required.'
            }
          />
          <div className='mt-8'>
            <button
              type='submit'
              className='w-full px-4 py-3 text-sm rounded bg-skin-fill-accent text-skin-inverted hover:bg-skin-fill-accent-hover lg:text-base'
            >
              Sign in
            </button>
          </div>
          <div className='mt-4 text-sm'>
            <p>
              Don&apos;t have an account?{' '}
              <Link href={`/register?redirect=${redirect || '/'}`}>
                <a className='font-medium text-skin-accent hover:text-skin-accent-hover'>
                  Sign up
                </a>
              </Link>
            </p>
          </div>
        </form>
      </div>
    </Layout>
  );
}
