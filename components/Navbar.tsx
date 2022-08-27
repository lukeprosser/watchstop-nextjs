import { ReactElement, useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Header(): ReactElement {
  const [showMobileNav, setShowMobileNav] = useState(false);
  return (
    <nav className='flex flex-wrap items-center justify-between w-full px-4 py-4 text-lg text-slate-50 bg-slate-900 md:py-0'>
      <a href='#'>
        <span className='text-xl font-semibold text-slate-50'>WatchStop</span>
      </a>
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

      <div
        className={`${
          showMobileNav ? '' : 'hidden'
        } w-full md:flex md:items-center md:w-auto`}
      >
        <ul className='pt-4 text-base text-slate-200 md:flex md:justify-between md:pt-0'>
          <li>
            <a className='block py-2 md:p-4 hover:text-slate-50' href='#'>
              Link 1
            </a>
          </li>
          <li>
            <a className='block py-2 md:p-4 hover:text-slate-50' href='#'>
              Link 2
            </a>
          </li>
          <li>
            <a className='block py-2 md:p-4 hover:text-slate-50' href='#'>
              Link 3
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
