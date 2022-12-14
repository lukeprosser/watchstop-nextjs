import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios, { AxiosError } from 'axios';
import { setCookie } from 'cookies-next';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import Layout from '../components/Layout';
import FormField from '../components/FormField';
import useStore from '../hooks/useStore';
import { getErrorMsg } from '../utils/error';
import { responses } from '../constants';

interface IFormInput {
  name: String;
  email: String;
  password: String;
  passwordConfirm: String;
}

export default function Register() {
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
    if (userInfo && !redirect) {
      router.push('/');
    }
  }, [router, userInfo, redirect]);

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
      const { data } = await axios.post('/api/users/register', {
        name,
        email,
        password,
      });
      dispatch({ type: 'USER_LOGIN', payload: data });
      setCookie('userInfo', JSON.stringify(data));
      router.push(typeof redirect === 'string' ? redirect : '/');
    } catch (error) {
      if (
        error instanceof AxiosError &&
        error?.response?.data.match('duplicate')
      ) {
        enqueueSnackbar('User already exists.', { variant: 'error' });
      } else {
        enqueueSnackbar(getErrorMsg(error), { variant: 'error' });
      }
    }
  };

  return (
    <Layout title='Register'>
      <div className='container p-6 mx-auto'>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className='max-w-xl p-6 mx-auto border rounded shadow-md border-skin-muted'
        >
          <h1 className='mb-8 text-xl font-semibold tracking-wide lg:text-2xl'>
            Register
          </h1>
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
              required: true,
              minLength: 8,
            })}
            validationError={
              errors?.password?.type === 'minLength'
                ? 'Password must be at least eight characters.'
                : 'Password is required.'
            }
          />
          <FormField
            id='passwordConfirm'
            label='Confirm password'
            type='password'
            placeholder='Password'
            errors={errors}
            register={register('passwordConfirm', {
              required: true,
              minLength: 8,
            })}
            validationError={
              errors?.passwordConfirm?.type === 'minLength'
                ? 'Password must be at least eight characters.'
                : 'Password confirmation is required.'
            }
          />
          <div className='mt-8'>
            <button
              type='submit'
              className='w-full px-4 py-3 text-sm rounded bg-skin-fill-accent text-skin-inverted hover:bg-skin-fill-accent-hover lg:text-base'
            >
              Sign up
            </button>
          </div>
          <div className='mt-4 text-sm'>
            <p>
              Already have an account?{' '}
              <Link href={`/login?redirect=${redirect || '/'}`}>
                <a className='font-medium text-skin-accent hover:text-skin-accent-hover'>
                  Sign in
                </a>
              </Link>
            </p>
          </div>
        </form>
      </div>
    </Layout>
  );
}
