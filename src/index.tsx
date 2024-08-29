import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // או './styles/globals.css' אם זה הנתיב הנכון
import App from './App';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);