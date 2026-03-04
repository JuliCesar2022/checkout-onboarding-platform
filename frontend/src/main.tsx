import { StrictMode, useState, useCallback } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store'
import { Spinner } from './shared/ui/Spinner'
import { SplashScreen } from './shared/ui/SplashScreen/SplashScreen'
import './styles/index.css'
import './styles/globals.css'
import App from './App'

function Root() {
  const [splashDone, setSplashDone] = useState(() => {
    return sessionStorage.getItem('splash_shown') === 'true';
  });

  const handleSplashDone = useCallback(() => {
    sessionStorage.setItem('splash_shown', 'true');
    setSplashDone(true);
  }, []);

  return (
    <>
      {!splashDone && <SplashScreen onDone={handleSplashDone} />}
      <Provider store={store}>
        <PersistGate loading={<Spinner />} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
