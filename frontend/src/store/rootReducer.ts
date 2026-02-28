import { combineReducers } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlice';
import checkoutReducer from './slices/checkoutSlice';
import transactionReducer from './slices/transactionSlice';

const rootReducer = combineReducers({
  products: productsReducer,
  checkout: checkoutReducer,
  transaction: transactionReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
