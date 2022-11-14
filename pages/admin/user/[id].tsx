import React, { useEffect, useReducer, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import useStore from '../../../hooks/useStore';
import { getErrorMsg } from '../../../utils/error';
import Layout from '../../../components/Layout';
import Sidebar from '../../../components/Sidebar';
import { adminSidebarItems, responses } from '../../../constants';
import FormField from '../../../components/FormField';
import Spinner from '../../../components/Spinner';
import { IAction, IParams } from '../../../constants';

interface IState {
  loading: boolean;
  error?: string;
  loadingUpdate: boolean;
}

interface IFormInput {
  name: string;
  admin: boolean;
}

function reducer(state: IState, action: IAction) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, error: '' };
    case 'FETCH_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true, errorUpdate: '' };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false, errorUpdate: '' };
    case 'UPDATE_FAILURE':
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };
    default:
      return state;
  }
}

function UserEdit({ params }: { params: IParams }) {
  const userId = params.id;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IFormInput>();

  const [admin, setAdmin] = useState(false); // Checkbox not part of react-hook-form

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const router = useRouter();

  const storeValue = useStore();
  const { state } = storeValue;
  const { userInfo } = state;

  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    loadingUpdate: false,
  });

  useEffect(() => {
    if (!userInfo) router.push('/login');

    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/users/${userId}`, {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        });
        dispatch({ type: 'FETCH_SUCCESS' });
        // Fill form fields if values exist in request result
        setValue('name', data.name);
        setAdmin(data.admin);
      } catch (error) {
        dispatch({ type: 'FETCH_FAILURE', payload: getErrorMsg(error) });
      }
    };
    fetchData();
  }, [router, setValue, userId, userInfo]);

  const handleFormSubmit: SubmitHandler<IFormInput> = async ({ name }) => {
    closeSnackbar();
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `/api/admin/users/${userId}`,
        {
          name,
          admin,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({ type: 'UPDATE_SUCCESS' });
      enqueueSnackbar(responses.userUpdated, { variant: 'success' });
      router.push('/admin/users');
    } catch (error) {
      dispatch({ type: 'UPDATE_FAILURE' });
      enqueueSnackbar(getErrorMsg(error), { variant: 'error' });
    }
  };

  return (
    <Layout title='Edit User'>
      <div className='container p-6 mx-auto'>
        <div className='grid-cols-6 md:grid'>
          <Sidebar items={adminSidebarItems} activeItem='users' />
          <div className='col-span-5 py-4 mb-6 md:pl-8 md:mb-0'>
            <h1 className='mb-6 text-xl font-semibold tracking-wide lg:text-2xl'>
              Edit User
            </h1>
            <h2 className='mb-8 tracking-wide'>ID: {userId}</h2>
            {loading ? (
              <Spinner size='5' message='Loading...' />
            ) : error ? (
              <span className='text-lg font-light tracking-wider text-skin-error'>
                Error: {error}
              </span>
            ) : (
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
                <input
                  type='checkbox'
                  name='admin'
                  checked={admin}
                  onChange={(e) => setAdmin(e.target.checked)}
                  disabled={admin}
                  className={admin ? 'cursor-not-allowed' : ''}
                />
                <label
                  htmlFor={'admin'}
                  className={`ml-2 font-medium tracking-wide ${
                    admin
                      ? 'text-skin-disabled cursor-not-allowed'
                      : 'text-skin-muted'
                  }`}
                >
                  Admin
                </label>
                <div className='mt-8'>
                  <button
                    type='submit'
                    className='w-full px-4 py-3 text-sm rounded bg-skin-fill-accent text-skin-inverted hover:bg-skin-fill-accent-hover lg:text-base'
                  >
                    {loadingUpdate ? (
                      <Spinner size='5' message='Processing...' />
                    ) : (
                      'Update'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params }: { params: IParams }) {
  return {
    props: { params },
  };
}

export default dynamic(() => Promise.resolve(UserEdit), { ssr: false });
