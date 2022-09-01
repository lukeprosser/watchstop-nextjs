import { ReactElement } from 'react';

const date = new Date();
const year = date.getFullYear().toString();

export default function Footer(): ReactElement {
  return (
    <footer className='m-10'>
      <p className='text-center'>{`© WatchStop ${year}`}</p>
    </footer>
  );
}
