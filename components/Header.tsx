import { useEffect } from 'react';
import { ReactElement, useState, useContext } from 'react';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Store } from '../utils/Store';

export default function Header(): ReactElement {
  const value = useContext(Store);
  if (!value) throw new Error('Store context must be defined.');
  const { state } = value;
  const {
    cart: { cartItems },
  } = state;
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showCartItems, setShowCartItems] = useState(false);

  // Workaround to prevent hydration error
  useEffect(() => {
    setShowCartItems(true);
  }, []);

  return (
    <header className='text-lg text-slate-50 bg-slate-900 md:py-0'>
      <div className='container flex flex-wrap items-center justify-between px-4 py-2 mx-auto'>
        <Link href='/'>
          <a className='text-xl font-semibold text-slate-50'>WatchStop</a>
        </Link>
        {showMobileNav ? (
          <XMarkIcon
            className='block w-6 h-6 cursor-pointer md:hidden'
            role='button'
            onClick={() => setShowMobileNav(!showMobileNav)}
          />
        ) : (
          <Bars3Icon
            className='block w-6 h-6 cursor-pointer md:hidden'
            role='button'
            onClick={() => setShowMobileNav(!showMobileNav)}
          />
        )}

        <nav
          className={`${
            showMobileNav ? '' : 'hidden'
          } w-full md:flex md:items-center md:w-auto`}
        >
          <ul className='pt-4 text-base text-slate-200 md:flex md:justify-between md:pt-0'>
            <li className='relative'>
              <Link href='/cart'>
                <a className='block py-2 md:p-4 hover:text-slate-50'>
                  Cart
                  {showCartItems && cartItems.length > 0 && (
                    <span
                      className='absolute w-4 h-4 text-center bg-red-600 rounded-full md:right-0 text-xxs md:top-4'
                      style={{ lineHeight: '15px' }}
                    >
                      {cartItems.reduce(
                        (prev, curr) => prev + curr.quantity,
                        0
                      )}
                    </span>
                  )}
                </a>
              </Link>
            </li>
            <li>
              <Link href='/login'>
                <a className='block py-2 md:p-4 hover:text-slate-50'>Login</a>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
