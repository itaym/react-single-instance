import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initSingleInstance } from 'react-single-instance';
import App from './App';

initSingleInstance(); // call once at startup, before anything below renders

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
