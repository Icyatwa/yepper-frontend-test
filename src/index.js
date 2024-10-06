import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Routes,
} from 'react-router-dom';

import PaymentForm from './PaymentForm';
import PaymentSuccess from './PaymentSuccess';
import PaymentFailed from './PaymentFailed';

// Define the router with the updated structure
const router = createBrowserRouter([
  {
    path: '/',
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
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
