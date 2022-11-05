import React, { createContext, useEffect, useReducer } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import useStore from '../../../hooks/useStore';
import { getErrorMsg } from '../../../utils/error';
import Layout from '../../../components/Layout';
import Sidebar from '../../../components/Sidebar';
import { adminSidebarItems } from '../../../constants';
import FormField from '../../../components/FormField';
import Spinner from '../../../components/Spinner';

interface IState {
  loading: boolean;
  error?: string;
  loadingUpdate: boolean;
  loadingUpload: boolean;
}

interface IAction {
  type: string;
  payload?: any;
}

interface IParams {
  id: string;
}

interface IFormInput {
  name: string;
  slug: string;
  brand: string;
  category: string;
  image: string;
  price: number;
  stockCount: number;
  description: string;
}

interface ContextType {
  handleFileUpload: Function;
  loading: boolean;
}

export const UploadContext = createContext<ContextType | null>(null);

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
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return { ...state, loadingUpload: false, errorUpload: '' };
    case 'UPLOAD_FAILURE':
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    default:
      return state;
  }
}

function ProductEdit({ params }: { params: IParams }) {
  const productId = params.id;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IFormInput>();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const router = useRouter();

  const storeValue = useStore();
  const { state } = storeValue;
  const { userInfo } = state;

  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
      loadingUpdate: false,
      loadingUpload: false,
    });

  useEffect(() => {
    if (!userInfo) router.push('/login');

    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/products/${productId}`, {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        });
        dispatch({ type: 'FETCH_SUCCESS' });
        // Fill form fields if values exist in request result
        setValue('name', data.name);
        setValue('slug', data.slug);
        setValue('brand', data.brand);
        setValue('category', data.category);
        setValue('image', data.image);
        setValue('price', data.price);
        setValue('stockCount', data.stockCount);
        setValue('description', data.description);
      } catch (error) {
        dispatch({ type: 'FETCH_FAILURE', payload: getErrorMsg(error) });
      }
    };
    fetchData();
  }, [router, setValue, productId, userInfo]);

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post('/api/admin/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: 'UPLOAD_SUCCESS' });
      setValue('image', data.secure_url);
      enqueueSnackbar('Image uploaded successfully.', { variant: 'success' });
    } catch (error) {
      dispatch({ type: 'UPLOAD_FAILURE', payload: getErrorMsg(error) });
      enqueueSnackbar(getErrorMsg(error), { variant: 'error' });
    }
  };

  const handleFormSubmit: SubmitHandler<IFormInput> = async ({
    name,
    slug,
    brand,
    category,
    image,
    price,
    stockCount,
    description,
  }) => {
    closeSnackbar();
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `/api/admin/products/${productId}`,
        {
          name,
          slug,
          brand,
          category,
          image,
          price,
          stockCount,
          description,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({ type: 'UPDATE_SUCCESS' });
      enqueueSnackbar('Product updated successfully.', { variant: 'success' });
      router.push('/admin/products');
    } catch (error) {
      dispatch({ type: 'UPDATE_FAILURE' });
      enqueueSnackbar(getErrorMsg(error), { variant: 'error' });
    }
  };

  const uploadValue = {
    handleFileUpload: handleImageUpload,
    loading: loadingUpload,
  };

  return (
    <Layout title='Edit Product'>
      <div className='container p-6 mx-auto'>
        <div className='grid-cols-6 md:grid'>
          <Sidebar items={adminSidebarItems} activeItem='products' />
          <div className='col-span-5 py-4 mb-6 md:pl-8 md:mb-0'>
            <h1 className='mb-6 text-xl font-semibold tracking-wide lg:text-2xl'>
              Edit Product
            </h1>
            <h2 className='mb-8 tracking-wide'>ID: {productId}</h2>
            {loading ? (
              <Spinner size='5' message='Loading...' />
            ) : error ? (
              <span className='text-lg font-light tracking-wider text-red-600'>
                Error: {error}
              </span>
            ) : (
              <UploadContext.Provider value={uploadValue}>
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
                    id='slug'
                    label='Slug'
                    type='text'
                    placeholder='Slug'
                    errors={errors}
                    register={register('slug', {
                      required: true,
                      minLength: 2,
                    })}
                    validationError={
                      errors?.slug?.type === 'minLength'
                        ? 'Slug must be at least two characters.'
                        : 'Slug is required.'
                    }
                  />
                  <FormField
                    id='brand'
                    label='Brand'
                    type='text'
                    placeholder='Brand'
                    errors={errors}
                    register={register('brand', {
                      required: true,
                      minLength: 2,
                    })}
                    validationError={
                      errors?.brand?.type === 'minLength'
                        ? 'Brand must be at least two characters.'
                        : 'Brand is required.'
                    }
                  />
                  <FormField
                    id='category'
                    label='Category'
                    type='text'
                    placeholder='Category'
                    errors={errors}
                    register={register('category', {
                      required: true,
                      minLength: 2,
                    })}
                    validationError={
                      errors?.category?.type === 'minLength'
                        ? 'Category must be at least two characters.'
                        : 'Category is required.'
                    }
                  />
                  <FormField
                    id='image'
                    label='Image'
                    type='text'
                    placeholder='Image'
                    errors={errors}
                    register={register('image', {
                      required: true,
                      minLength: 2,
                    })}
                    validationError={
                      errors?.image?.type === 'minLength'
                        ? 'Image must be at least two characters.'
                        : 'Image is required.'
                    }
                  />
                  <FormField
                    id='price'
                    label='Price'
                    type='number'
                    placeholder='Price'
                    step='.01'
                    errors={errors}
                    register={register('price', {
                      required: true,
                    })}
                    validationError={errors?.price ? 'Price is required.' : ''}
                  />
                  <FormField
                    id='stockCount'
                    label='Stock'
                    type='number'
                    placeholder='Stock'
                    errors={errors}
                    register={register('stockCount', {
                      required: true,
                    })}
                    validationError={
                      errors?.stockCount ? 'Stock is required.' : ''
                    }
                  />
                  <FormField
                    id='description'
                    label='Description'
                    type='textarea'
                    placeholder='Description'
                    errors={errors}
                    register={register('description', {
                      required: true,
                      minLength: 10,
                    })}
                    validationError={
                      errors?.description?.type === 'minLength'
                        ? 'Description must be at least ten characters.'
                        : 'Description is required.'
                    }
                  />
                  <div className='mt-8'>
                    <button
                      type='submit'
                      className='w-full px-4 py-3 text-sm rounded bg-slate-900 text-slate-50 hover:bg-sky-600 lg:text-base'
                    >
                      {loadingUpdate ? (
                        <Spinner size='5' message='Processing...' />
                      ) : (
                        'Update'
                      )}
                    </button>
                  </div>
                </form>
              </UploadContext.Provider>
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

export default dynamic(() => Promise.resolve(ProductEdit), { ssr: false });
