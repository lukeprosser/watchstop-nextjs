import { useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import axios from 'axios';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import Layout from '../components/Layout';
import db from '../utils/db';
import { Store } from '../utils/Store';
import Product from '../models/Product';

export interface IProduct {
  _id: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  slug: string;
  category: string;
  image: string;
  quantity: number;
  price: number;
  brand: string;
  rating: number;
  numReviews: number;
  stockCount: number;
  description: string;
}

export default function Home({ products }: { products: Array<IProduct> }) {
  const router = useRouter();
  const value = useContext(Store);
  if (!value) throw new Error('Store context must be defined.');
  const { state, dispatch } = value;

  const handleAddToCart = async (product: IProduct) => {
    const existingItem = state.cart.cartItems.find(
      (item) => item._id === product._id
    );
    const quantity = existingItem ? existingItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.stockCount < quantity) {
      window.alert('Sorry, this product is no longer in stock.');
      return;
    }
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });
    router.push('/cart');
  };

  return (
    <Layout title='WatchStop'>
      <div className='container p-6 mx-auto'>
        <h1 className='mb-4 text-xl font-semibold tracking-wide lg:text-2xl'>
          Products
        </h1>
        <div className='flex flex-wrap items-center justify-center gap-8'>
          {products.map((product) => (
            <div
              key={product._id}
              className='max-w-xs overflow-hidden border rounded shadow-md border-slate-300 lg:max-w-sm'
            >
              <Link href={`/product/${product.slug}`}>
                <a>
                  <Image
                    src={product.image}
                    alt={product.name}
                    width='1280'
                    height='853'
                  />
                  <h3 className='p-2 font-medium tracking-wide'>
                    {product.name}
                  </h3>
                </a>
              </Link>
              <div className='flex items-center justify-between p-2 mt-1'>
                <span className='font-light'>£{product.price}</span>
                <button
                  type='button'
                  className='p-1 text-sm rounded bg-slate-900 text-slate-50 hover:bg-red-600'
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingBagIcon className='w-6 h-6' role='button' />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

// eval error caused by fetching props - not sure why. Doesn't affect user experience.
export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find({}).lean();
  await db.disconnect();
  return {
    props: {
      products: products.map(db.formatDocValues),
    },
  };
}
