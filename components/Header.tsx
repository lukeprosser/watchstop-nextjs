import { ReactElement, useState } from 'react';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Header(): ReactElement {
  const [showMobileNav, setShowMobileNav] = useState(false);
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
            <li>
              <Link href='/cart'>
                <a className='block py-2 md:p-4 hover:text-slate-50'>Cart</a>
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
