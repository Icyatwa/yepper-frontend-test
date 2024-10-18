import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import Home from './Home';

import PaymentForm from './PaymentForm';
import PaymentSuccess from './PaymentSuccess';
import PaymentFailed from './PaymentFailed';

import CardPaymentForm from './CardPaymentForm';

// Define the router with the updated structure
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/momo',
    element: <PaymentForm />,
  },
  {
    path: '/payment-success',
    element: <PaymentSuccess />,
  },
  {
    path: '/payment-failed',
    element: <PaymentFailed />,
  },

  {
    path: '/card',
    element: <CardPaymentForm />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
