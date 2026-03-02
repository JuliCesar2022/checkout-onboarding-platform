import storage from 'redux-persist/lib/storage';
import type { PersistConfig } from 'redux-persist';
import type { RootState } from './rootReducer';

// Selective persistence — CVV is never in Redux state so it's never persisted
export const persistConfig: PersistConfig<RootState> = {
  key: 'root-v3', // bumped to purge stale persisted state (category children added)
  storage,
  whitelist: ['products', 'checkout', 'transaction', 'cart'],
  // Products: cache items for 5 minutes, revalidate on stale
  // Checkout: recover step, selectedProductId, deliveryAddress, fees on refresh
  // Transaction: show result after redirect to /status
};
