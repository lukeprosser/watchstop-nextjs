import { useEffect } from 'react';
import { ReactElement, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { deleteCookie } from 'cookies-next';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import useStore from '../hooks/useStore';
import useClickOutside from '../hooks/useClickOutside';
import { IProduct } from '../pages';

const Badge = ({ cartItems }: { cartItems: IProduct[] }) => {
  return (
    <span
      className='absolute w-4 h-4 text-center bg-red-600 rounded-full md:right-0 text-xxs md:top-4'
      style={{ lineHeight: '15px' }}
    >
      {cartItems.reduce((prev, curr) => prev + curr.quantity, 0)}
    </span>
  );
};

const AccountOptions = ({
  setShowAccountOptions,
  dispatch,
  admin,
}: {
  setShowAccountOptions: Function;
  dispatch: Function;
  admin: boolean;
}) => {
  const router = useRouter();

  const handleLogout = () => {
    setShowAccountOptions(false);
    dispatch({ type: 'USER_LOGOUT' });
    deleteCookie('userInfo');
    deleteCookie('cartItems');
    router.push('/');
  };

  return (
    <div className='absolute z-10 w-32 p-4 border rounded shadow-lg md:right-0 bg-slate-100 border-slate-700 md:py-2 md:text-right md:top-12'>
      <ul className='text-sm divide-y text-slate-900'>
        {admin && (
          <li className='py-2 hover:text-slate-600'>
            <Link href='/admin/dashboard'>
              <a>Dashboard</a>
            </Link>
          </li>
        )}
        <li className='py-2 hover:text-slate-600'>
          <Link href='/account'>
            <a>Account</a>
          </Link>
        </li>
        <li className='py-2 hover:text-slate-600'>
          <Link href='/order-history'>
            <a>Orders</a>
          </Link>
        </li>
        <li>
          <button className='py-2 hover:text-slate-600' onClick={handleLogout}>
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default function Header(): ReactElement {
  const value = useStore();
  const { state, dispatch } = value;
  const {
    cart: { cartItems },
    userInfo,
  } = state;
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showAccountOptions, setShowAccountOptions] = useState(false);
  const [cartItemsExist, setCartItemsExist] = useState(false);
  const [userInfoExists, setUserInfoExists] = useState(false);

  const accountMenuRef = useClickOutside(() => setShowAccountOptions(false));

  // Workaround to prevent hydration error
  useEffect(() => {
    setCartItemsExist(true);
    setUserInfoExists(true);
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
                  {cartItemsExist && cartItems.length > 0 && (
                    <Badge cartItems={cartItems} />
                  )}
                </a>
              </Link>
            </li>
            <li ref={accountMenuRef} className='relative'>
              {userInfoExists && userInfo ? (
                <button
                  type='button'
                  className='py-2 md:p-4 hover:text-slate-50'
                  onClick={() => setShowAccountOptions(!showAccountOptions)}
                >
                  {userInfo.name}
                </button>
              ) : (
                <Link href='/login'>
                  <a className='block py-2 md:p-4 hover:text-slate-50'>Login</a>
                </Link>
              )}
              {showAccountOptions && (
                <AccountOptions
                  setShowAccountOptions={setShowAccountOptions}
                  dispatch={dispatch}
                  admin={userInfo.admin}
                />
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
