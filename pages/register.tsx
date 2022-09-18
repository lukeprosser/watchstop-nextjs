import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { setCookie } from 'cookies-next';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';

export default function Register() {
  const router = useRouter();
  // Get previous page if passed
  const { redirect } = router.query;

  const value = useContext(Store);
  if (!value) throw new Error('Store context must be defined.');
  const { state, dispatch } = value;
  const { userInfo } = state;

  useEffect(() => {
    /*
      - Redirect to home if user logged in
      - Only run once when component is initially loaded
      - Prevents further redirect to home page (e.g. to redirect back to delivery if checking out)
    */
    if (userInfo) router.push('/');
  }, []);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      alert('Passwords do not match, please try again.');
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
      if (axios.isAxiosError(error)) {
        console.log('Error message: ', error.message);
      } else {
        console.log('Unexpected error: ', error);
      }
    }
  };

  return (
    <Layout title='Register'>
      <div className='container p-6 mx-auto'>
        <form
          onSubmit={handleSubmit}
          className='max-w-xl p-6 mx-auto border rounded shadow-md border-slate-200'
        >
          <h1 className='mb-8 text-lg font-semibold tracking-wide lg:text-2xl'>
            Register
          </h1>
          <div className='mb-4'>
            <label
              htmlFor='name'
              className='block mb-2 font-medium tracking-wide text-slate-700'
            >
              Name
            </label>
            <input
              className='w-full p-2 leading-tight border rounded shadow appearance-none text-slate-700 focus:outline-slate-400'
              id='name'
              type='text'
              placeholder='Name'
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className='mb-4'>
            <label
              htmlFor='email'
              className='block mb-2 font-medium tracking-wide text-slate-700'
            >
              Email
            </label>
            <input
              className='w-full p-2 leading-tight border rounded shadow appearance-none text-slate-700 focus:outline-slate-400'
              id='email'
              type='text'
              placeholder='Email address'
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className='mb-4'>
            <label
              htmlFor='password'
              className='block mb-2 font-medium tracking-wide text-slate-700'
            >
              Password
            </label>
            <input
              className='w-full p-2 leading-tight border rounded shadow appearance-none text-slate-700 focus:outline-slate-400'
              id='password'
              type='password'
              placeholder='Password'
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className='mb-8'>
            <label
              htmlFor='password-confirm'
              className='block mb-2 font-medium tracking-wide text-slate-700'
            >
              Confirm password
            </label>
            <input
              className='w-full p-2 leading-tight border rounded shadow appearance-none text-slate-700 focus:outline-slate-400'
              id='password-confirm'
              type='password'
              placeholder='Password'
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </div>
          <div>
            <button
              type='submit'
              className='w-full px-4 py-3 text-sm rounded bg-slate-900 text-slate-50 hover:bg-sky-600 lg:text-base'
            >
              Sign up
            </button>
          </div>
          <div className='mt-4 text-sm'>
            <p>
              Already have an account?{' '}
              <Link href={`/login?redirect=${redirect || '/'}`}>
                <a className='font-medium text-sky-600 hover:text-sky-500'>
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
