import { ReactNode } from 'react';
import { SnackbarProvider } from 'notistack';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { StoreProvider } from '../utils/Store';

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <SnackbarProvider anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <StoreProvider>
        <PayPalScriptProvider
          deferLoading={true}
          options={{ 'client-id': 'sb' }} // Initialise to sandbox due to options being required
        >
          {children}
        </PayPalScriptProvider>
      </StoreProvider>
    </SnackbarProvider>
  );
};
