import React from 'react';
import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './features/products/store/productsSlice';
import cartReducer from './features/cart/store/cartSlice';
import checkoutReducer from './features/checkout/store/checkoutSlice';
import transactionReducer from './features/transaction/store/transactionSlice';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Record<string, any>;
  store?: any;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {},
    // Exactly like the real store
    store = configureStore({
      reducer: {
        products: productsReducer,
        cart: cartReducer,
        checkout: checkoutReducer,
        transaction: transactionReducer,
      } as any,
      preloadedState,
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }): ReactElement {
    return (
      <Provider store={store}>
        <MemoryRouter>{children}</MemoryRouter>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
