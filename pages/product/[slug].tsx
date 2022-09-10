import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import Layout from '../../components/Layout';
import db from '../../utils/db';
import Product from '../../models/Product';
import { IProduct } from '../index';
import { useContext } from 'react';
import { Store } from '../../utils/Store';

export default function ProductDetail({ product }: { product: IProduct }) {
  const router = useRouter();
  const value = useContext(Store);
  if (!value) throw new Error('Store context must be defined.');
  const { dispatch } = value;

  if (!product)
    return (
      <div>
        <h1>Product not found.</h1>
      </div>
    );

  const addToCartHandler = async () => {
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.stockCount < 1) {
      window.alert('Sorry, this product is no longer in stock.');
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity: 1 } });
    router.push('/cart');
  };

  return (
    <Layout title={product.name} description={product.description}>
      <div className='container p-6 mx-auto'>
        <div className='mb-8'>
          <Link href='/'>
            <a className='text-sm text-slate-500 hover:text-slate-700 lg:text-base'>
              <ChevronLeftIcon className='inline-block w-4 h-4 cursor-pointer' />
              Back to products
            </a>
          </Link>
        </div>
        <div className='grid grid-cols-1 gap-8 2xl:items-center md:grid-cols-2'>
          <div className='image-wrapper'>
            <Image
              src={product.image}
              alt={product.name}
              width='1280'
              height='853'
              layout='responsive'
              priority
            />
          </div>
          <div className='lg:mx-auto lg:max-w-lg'>
            <h1 className='mb-4 text-2xl font-medium tracking-wider lg:text-3xl lg:mb-6'>
              {product.name}
            </h1>
            <ul className='mb-6 text-sm tracking-wide font-extralight text-slate-700 lg:text-base lg:mb-10'>
              <li className=''>Category: {product.category}</li>
              <li>Brand: {product.brand}</li>
              <li>
                Rating: {product.rating} ({product.numReviews} reviews)
              </li>
              <li className='mt-4 font-light lg:mt-6 text-slate-900'>
                {product.description}
              </li>
            </ul>
            <div className='flex items-end justify-between mb-2 lg:mb-4'>
              <p className='text-lg tracking-wide lg:text-xl'>
                £{product.price}
              </p>
              <p className='text-slate-500 lg:text-lg'>
                {product.stockCount} in stock
              </p>
            </div>
            <button
              className='w-full px-4 py-3 text-sm rounded bg-slate-900 text-slate-50 hover:bg-red-600 lg:text-base'
              onClick={addToCartHandler}
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;
  await db.connect();
  const product = await Product.findOne({ slug: params?.slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: db.formatDocValues(product),
    },
  };
};
