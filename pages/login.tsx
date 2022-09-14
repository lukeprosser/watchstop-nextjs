import Link from 'next/link';
import React from 'react';
import Layout from '../components/Layout';

export default function Login() {
  return (
    <Layout title='Login'>
      <div className='container p-6 mx-auto'>
        <form className='max-w-xl p-6 mx-auto rounded shadow-md'>
          <h1 className='mb-8 text-lg font-semibold tracking-wide lg:text-2xl'>
            Login
          </h1>
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
            />
          </div>
          <div className='mb-8'>
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
            />
          </div>
          <div>
            <button
              type='button'
              className='w-full px-4 py-3 text-sm rounded bg-slate-900 text-slate-50 hover:bg-sky-600 lg:text-base'
            >
              Sign in
            </button>
          </div>
          <div className='mt-4 text-sm'>
            <p>
              Don't have an account?{' '}
              <Link href='/register'>
                <a className='font-medium text-sky-600 hover:text-sky-500'>
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
