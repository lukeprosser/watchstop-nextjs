import React, { useContext, useEffect, useReducer } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import Layout from '../../components/Layout';
import { Store } from '../../utils/Store';
import { getErrorMsg } from '../../utils/error';

interface IProduct {
  _id: string;
  name: string;
  brand: string;
  category: string;
  rating: number;
  price: number;
  stockCount: number;
}

interface IState {
  loading: boolean;
  error?: string;
  products: IProduct[];
  loadingCreate: boolean;
  loadingDelete: boolean;
  deleteId: string;
  successDelete: boolean;
}

interface IAction {
  type: string;
  payload?: any;
}

function reducer(state: IState, action: IAction) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, products: action.payload, error: '' };
    case 'FETCH_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreate: false };
    case 'CREATE_FAILURE':
      return { ...state, loadingCreate: false };
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

function AdminProducts() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();

  const value = useContext(Store);
  if (!value) throw new Error('Store context must be defined.');
  const { state } = value;
  const { userInfo } = state;

  const [
    {
      loading,
      error,
      products,
      loadingCreate,
      loadingDelete,
      deleteId,
      successDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    products: [],
    error: '',
    loadingCreate: false,
    loadingDelete: false,
    deleteId: '',
    successDelete: false,
  });

  useEffect(() => {
    if (!userInfo) router.push('/login');

    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/products`, {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAILURE', payload: getErrorMsg(error) });
      }
    };

    // After successful deletion, fetch product data again (but only run once)
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [router, userInfo, successDelete]);

  const handleProductCreate = async () => {
    closeSnackbar();

    if (!window.confirm('Are you sure you want to create a product?')) return;

    try {
      dispatch({ type: 'CREATE_REQUEST' });
      const { data } = await axios.post(
        '/api/admin/products',
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'CREATE_SUCCESS' });
      enqueueSnackbar('Product created successfully.', { variant: 'success' });
      router.push(`/admin/product/${data.product._id}`);
    } catch (error) {
      dispatch({ type: 'CREATE_FAILURE' });
      enqueueSnackbar(getErrorMsg(error), { variant: 'error' });
    }
  };

  const handleProductDelete = async (id: string) => {
    closeSnackbar();

    if (!window.confirm('Are you sure you want to delete this product?'))
      return;

    try {
      dispatch({ type: 'DELETE_REQUEST', payload: id });
      await axios.delete(`/api/admin/products/${id}`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: 'DELETE_SUCCESS' });
      enqueueSnackbar('Product deleted successfully.', { variant: 'success' });
    } catch (error) {
      dispatch({ type: 'DELETE_FAILURE' });
      enqueueSnackbar(getErrorMsg(error), { variant: 'error' });
    }
  };

  return (
    <Layout title='Products'>
      <div className='container p-6 mx-auto'>
        <div className='grid-cols-6 md:grid'>
          <aside className='col-span-1 py-4 mb-4 border-b-2 md:pr-6 md:border-b-0 md:border-r-2 md:mb-0 border-slate-300'>
            <ul className='text-sm font-light tracking-wide divide-y lg:text-base'>
              <li className='pt-2 pb-4'>
                <Link href='/admin/dashboard'>
                  <a className='hover:text-sky-500'>Dashboard</a>
                </Link>
              </li>
              <li className='py-4'>
                <Link href='/admin/orders'>
                  <a className='hover:text-sky-500'>Orders</a>
                </Link>
              </li>
              <li className='py-4'>
                <Link href='/admin/products'>
                  <a className='text-sky-600 hover:text-sky-500'>Products</a>
                </Link>
              </li>
              <li className='py-4'>
                <Link href='/admin/users'>
                  <a className='hover:text-sky-500'>Users</a>
                </Link>
              </li>
            </ul>
          </aside>
          <div className='col-span-5 py-4 mb-6 md:pl-8 md:mb-0'>
            <div className='flex justify-between mb-6 items-center'>
              <h1 className='text-xl font-semibold tracking-wide lg:text-2xl'>
                Products
              </h1>
              <button
                type='button'
                className='w-max px-3 py-2 text-sm rounded bg-slate-900 text-slate-50 hover:bg-sky-600'
                onClick={handleProductCreate}
              >
                {loadingCreate ? (
                  <div className='flex items-center justify-center'>
                    <ArrowPathIcon className='inline w-5 h-5 mr-2 animate-spin' />
                    Processing...
                  </div>
                ) : (
                  'Create'
                )}
              </button>
            </div>
            {loading ? (
              <div className='flex items-center justify-center'>
                <ArrowPathIcon className='inline w-5 h-5 mr-2 animate-spin' />
                Loading...
              </div>
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
                      <th className='px-4 py-2'>Brand</th>
                      <th className='px-4 py-2'>Category</th>
                      <th className='px-4 py-2'>Rating</th>
                      <th className='px-4 py-2'>Price</th>
                      <th className='px-4 py-2'>Stock</th>
                      <th className='px-4 py-2'></th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product: IProduct) => (
                      <tr
                        key={product._id}
                        className='text-sm border-t border-slate-300 first:border-none'
                      >
                        <td className='px-4 py-3'>{product._id}</td>
                        <td className='px-4 py-3'>{product.name}</td>
                        <td className='px-4 py-3'>{product.brand}</td>
                        <td className='px-4 py-3'>{product.category}</td>
                        <td className='px-4 py-3'>{product.rating}</td>
                        <td className='px-4 py-3'>£{product.price}</td>
                        <td className='px-4 py-3'>{product.stockCount}</td>
                        <td className='px-4 py-3'>
                          <div className='flex gap-2'>
                            <Link href={`/admin/product/${product._id}`}>
                              <a className='w-1/2 p-2 text-xs text-center rounded bg-slate-200 hover:bg-slate-900 hover:text-slate-50'>
                                Edit
                              </a>
                            </Link>
                            <button
                              className='w-1/2 p-2 text-xs rounded bg-slate-200 hover:bg-slate-900 hover:text-slate-50'
                              onClick={() => handleProductDelete(product._id)}
                            >
                              {loadingDelete && deleteId === product._id ? (
                                <div className='flex items-center justify-center'>
                                  <ArrowPathIcon className='inline w-4 h-4 mr-2 animate-spin' />
                                </div>
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

export default dynamic(() => Promise.resolve(AdminProducts), { ssr: false });