import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { TicketProvider } from './context/TicketContext';
import './index.css'; // Import global styles (Tailwind)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <TicketProvider>
        <App />
      </TicketProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
