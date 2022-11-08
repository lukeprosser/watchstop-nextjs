import React, { useEffect, useReducer } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import Layout from '../../components/Layout';
import Sidebar from '../../components/Sidebar';
import { adminSidebarItems } from '../../constants';
import Spinner from '../../components/Spinner';
import useStore from '../../hooks/useStore';
import { getErrorMsg } from '../../utils/error';
import { IAction, IUser } from '../../constants';

interface IState {
  loading: boolean;
  error?: string;
  users: IUser[];
  loadingDelete: boolean;
  deleteId: string;
  successDelete: boolean;
}

function reducer(state: IState, action: IAction) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, users: action.payload, error: '' };
    case 'FETCH_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, deleteId: action.payload };
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'DELETE_FAILURE':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
}

function AdminUsers() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();

  const value = useStore();
  const { state } = value;
  const { userInfo } = state;

  const [
    { loading, error, users, loadingDelete, deleteId, successDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    users: [],
    error: '',
    loadingDelete: false,
    deleteId: '',
    successDelete: false,
  });

  useEffect(() => {
    if (!userInfo) router.push('/login');

    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/users`, {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAILURE', payload: getErrorMsg(error) });
      }
    };

    // After successful deletion, fetch user data again (but only run once)
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [router, userInfo, successDelete]);

  const handleUserDelete = async (id: string) => {
    closeSnackbar();

    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      dispatch({ type: 'DELETE_REQUEST', payload: id });
      await axios.delete(`/api/admin/users/${id}`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: 'DELETE_SUCCESS' });
      enqueueSnackbar('User deleted successfully.', { variant: 'success' });
    } catch (error) {
      dispatch({ type: 'DELETE_FAILURE' });
      enqueueSnackbar(getErrorMsg(error), { variant: 'error' });
    }
  };

  return (
    <Layout title='Users'>
      <div className='container p-6 mx-auto'>
        <div className='grid-cols-6 md:grid'>
          <Sidebar items={adminSidebarItems} activeItem='users' />
          <div className='col-span-5 py-4 mb-6 md:pl-8 md:mb-0'>
            <h1 className='mb-6 text-xl font-semibold tracking-wide lg:text-2xl'>
              Users
            </h1>
            {loading ? (
              <Spinner size='5' message='Loading...' />
            ) : error ? (
              <span className='text-lg font-light tracking-wider text-red-600'>
                Error: {error}
              </span>
            ) : (
              <div className='overflow-auto'>
                <table className='w-full table-auto'>
                  <thead className='text-left border-b-2 border-slate-300'>
                    <tr>
                      <th className='px-4 py-2'>ID</th>
                      <th className='px-4 py-2'>Name</th>
                      <th className='px-4 py-2'>Email</th>
                      <th className='px-4 py-2'>Admin</th>
                      <th className='px-4 py-2'></th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user: IUser) => (
                      <tr
                        key={user._id}
                        className='text-sm border-t border-slate-300 first:border-none'
                      >
                        <td className='px-4 py-3'>{user._id}</td>
                        <td className='px-4 py-3'>{user.name}</td>
                        <td className='px-4 py-3'>{user.email}</td>
                        <td className='px-4 py-3'>
                          {user.admin ? 'Yes' : 'No'}
                        </td>
                        <td className='px-4 py-3'>
                          <div className='flex gap-2'>
                            <Link href={`/admin/user/${user._id}`}>
                              <a className='w-1/2 p-2 text-xs text-center rounded bg-slate-200 hover:bg-slate-900 hover:text-slate-50'>
                                Edit
                              </a>
                            </Link>
                            <button
                              className='w-1/2 p-2 text-xs rounded bg-slate-200 hover:bg-slate-900 hover:text-slate-50'
                              onClick={() => handleUserDelete(user._id)}
                            >
                              {loadingDelete && deleteId === user._id ? (
                                <Spinner size='4' message='' />
                              ) : (
                                'Delete'
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(AdminUsers), { ssr: false });
