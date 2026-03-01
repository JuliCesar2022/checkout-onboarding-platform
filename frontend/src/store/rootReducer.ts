import { combineReducers } from '@reduxjs/toolkit';
import productsReducer from '../features/products/store/productsSlice';
import checkoutReducer from '../features/checkout/store/checkoutSlice';
import transactionReducer from '../features/transaction/store/transactionSlice';

const rootReducer = combineReducers({
  products: productsReducer,
  checkout: checkoutReducer,
  transaction: transactionReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
