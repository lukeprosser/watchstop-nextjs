import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import Layout from '../components/Layout';
import db from '../utils/db';
import useStore from '../hooks/useStore';
import Product from '../models/Product';
import { IProduct, responses } from '../constants';
import { isInStock } from '../utils/helpers';

const ProductCard = ({ product }: { product: IProduct }) => {
  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const value = useStore();
  const { state, dispatch } = value;

  const [inStock, setInStock] = useState(false);

  const existingItem = state.cart.cartItems.find(
    (item) => item._id === product._id
  );
  const quantity = existingItem ? existingItem.quantity + 1 : 1;

  useEffect(() => {
    const checkStock = async () => {
      const stock = await isInStock(product._id, quantity);
      setInStock(stock);
    };
    checkStock();
  }, [product._id, quantity]);

  const handleAddToCart = async (product: IProduct) => {
    closeSnackbar();
    const inStock = await isInStock(product._id, quantity);
    if (!inStock) {
      enqueueSnackbar(responses.outOfStock, {
        variant: 'error',
      });
      return;
    }
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });
    router.push('/cart');
  };

  return (
    <div
      key={product._id}
      className='max-w-xs overflow-hidden border rounded shadow-md border-skin-muted lg:max-w-sm'
    >
      <Link href={`/product/${product.slug}`}>
        <a>
          <Image
            src={product.image}
            alt={product.name}
            width='1280'
            height='853'
          />
          <div className='p-2 flex justify-between items-center'>
            <h3 className=' font-medium tracking-wide'>{product.name}</h3>
            <p className='font-thin'>{product.category}</p>
          </div>
        </a>
      </Link>
      <div className='flex items-center justify-between p-2'>
        <span className='font-light'>£{product.price}</span>
        <button
          type='button'
          className='p-2 text-sm rounded-full bg-skin-fill-muted text-skin-inverted hover:bg-skin-fill-accent disabled:bg-skin-button-inverted disabled:text-skin-inverted-disabled disabled:cursor-not-allowed'
          onClick={() => handleAddToCart(product)}
          disabled={!inStock}
        >
          <ShoppingBagIcon
            className={`w-4 h-4 ${!inStock && 'cursor-not-allowed'}`}
            role='button'
          />
        </button>
      </div>
    </div>
  );
};

export default function Home({ products }: { products: Array<IProduct> }) {
  return (
    <Layout title='Home'>
      <div className='container p-6 mx-auto'>
        <h1 className='mb-4 text-xl font-semibold tracking-wide lg:text-2xl'>
          Products
        </h1>
        <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center items-center'>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
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
