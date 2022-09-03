import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import data from '../../utils/data';
import Layout from '../../components/Layout';

export default function Product() {
  const router = useRouter();
  const { slug } = router.query;
  const product = data.products.find((product) => product.slug === slug);

  if (!product)
    return (
      <div>
        <h1>Product not found.</h1>
      </div>
    );

  return (
    <Layout title={product.name} description={product.description}>
      <div className='container p-6 mx-auto'>
        <Link href='/'>
          <a className='block mb-8 text-sm text-slate-500 hover:text-slate-700 lg:text-base'>
            <ChevronLeftIcon className='inline-block w-4 h-4 cursor-pointer' />
            Back to products
          </a>
        </Link>
        <div className='grid grid-cols-1 gap-8 2xl:items-center md:grid-cols-2'>
          <div className='image-wrapper'>
            <Image
              src={product.image}
              alt={product.name}
              width='1280'
              height='853'
              layout='responsive'
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
            <button className='w-full px-4 py-3 text-sm rounded bg-slate-900 text-slate-50 hover:bg-red-600 lg:text-base'>
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
