import { ReactElement, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { deleteCookie } from 'cookies-next';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { ClockIcon } from '@heroicons/react/24/solid';
import useStore from '../hooks/useStore';
import useClickOutside from '../hooks/useClickOutside';
import { IProductOrder } from '../constants';

const Badge = ({ cartItems }: { cartItems: IProductOrder[] }) => {
  return (
    <span
      className="absolute w-4 h-4 text-center rounded-full bg-skin-fill-accent md:right-0 text-xxs md:top-4"
      style={{ lineHeight: '15px' }}
    >
      {cartItems.reduce((prev, curr) => prev + curr.quantity, 0)}
    </span>
  );
};

const AccountOptions = ({
  showAccountOptions,
  setShowAccountOptions,
  dispatch,
  admin,
}: {
  showAccountOptions: boolean;
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
    <div
      aria-label="account-menu"
      className={`${
        showAccountOptions ? `scale-100` : `scale-0`
      } transition origin-[10%_top] md:origin-[75%_top] ease-in-out duration-100 bg-skin-fill-inverted cursor-pointer top-10 absolute z-10 w-32 p-4 border rounded drop-shadow-lg md:right-0 border-skin-base md:py-2 md:text-right md:top-12 before:absolute before:bg-skin-fill-inverted before:content-[""] before:rotate-45 before:rounded-tl before:-top-2 before:left-3 before:w-4 before:h-4 before:border-t-inherit before:border-l-inherit before:md:left-[90px]`}
    >
      <ul
        className="text-sm font-light divide-y text-skin-base"
        aria-label="account-menu-nav"
      >
        {admin && (
          <li className="py-2 hover:text-skin-muted">
            <Link href="/admin/dashboard">
              <a>Dashboard</a>
            </Link>
          </li>
        )}
        <li className="py-2 hover:text-skin-muted">
          <Link href="/account">
            <a>Account</a>
          </Link>
        </li>
        <li className="py-2 hover:text-skin-muted">
          <Link href="/order-history">
            <a>Orders</a>
          </Link>
        </li>
        <li>
          <button className="py-2 hover:text-skin-muted" onClick={handleLogout}>
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

  // Workaround to prevent hydration error by forcing re-render
  useEffect(() => {
    setCartItemsExist(true);
    setUserInfoExists(true);
  }, []);

  return (
    <header className="text-lg text-skin-inverted bg-skin-fill md:py-0">
      <div className="container flex flex-wrap items-center justify-between px-4 py-4 mx-auto md:py-2">
        <Link href="/">
          <a className="flex items-center text-xl font-semibold tracking-wider">
            WATCHST
            <ClockIcon className="w-5 h-5" />P
          </a>
        </Link>
        {showMobileNav ? (
          <button
            className="block w-6 h-6 cursor-pointer md:hidden"
            aria-label="close-btn"
            onClick={() => setShowMobileNav(!showMobileNav)}
          >
            <XMarkIcon />
          </button>
        ) : (
          <button
            className="block w-6 h-6 cursor-pointer md:hidden"
            aria-label="hamburger-btn"
            onClick={() => setShowMobileNav(!showMobileNav)}
          >
            <Bars3Icon />
          </button>
        )}
        <nav
          className={`${
            showMobileNav ? '' : 'hidden'
          } w-full md:flex md:items-center md:w-auto`}
        >
          <ul className="pt-4 text-base tracking-wider text-skin-inverted-muted md:flex md:justify-between md:pt-0">
            <li className="relative">
              <Link href="/cart">
                <a className="block py-2 md:p-4 hover:text-skin-inverted">
                  Cart
                  {cartItemsExist && cartItems.length > 0 && (
                    <Badge cartItems={cartItems} />
                  )}
                </a>
              </Link>
            </li>
            <li ref={accountMenuRef} className="relative">
              {userInfoExists && userInfo ? (
                <>
                  <button
                    type="button"
                    className="py-2 tracking-wider md:p-4 hover:text-skin-inverted"
                    onClick={() => setShowAccountOptions(!showAccountOptions)}
                  >
                    {userInfo.name}
                  </button>
                  <AccountOptions
                    showAccountOptions={showAccountOptions}
                    setShowAccountOptions={setShowAccountOptions}
                    dispatch={dispatch}
                    admin={userInfo.admin}
                  />
                </>
              ) : (
                <Link href="/login">
                  <a className="block py-2 md:p-4 hover:text-skin-inverted">
                    Login
                  </a>
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
