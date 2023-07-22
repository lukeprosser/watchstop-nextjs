import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AppProviders } from '../providers/app-providers';

// if (process.env.NODE_ENV === 'development') {
//   require('mocks');
// }

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppProviders>
      <Component {...pageProps} />
    </AppProviders>
  );
}

export default MyApp;
