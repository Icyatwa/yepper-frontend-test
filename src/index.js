import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import RootLayout from './layouts/root-layout';
import DashboardLayout from './layouts/dashboard-layout';
import SignInPage from './routes/sign-in';
import SignUpPage from './routes/sign-up';

import Home from './Home';

import PhotoUploadForm from './PhotoUploadForm'
import PhotoList from './PhotoList';
import EarningsPage from './EarningsPage'

import PaymentForm from './PaymentForm'
import CardPayment from './CardPaymentForm'
import Success from './PaymentSuccess'
import Failed from './PaymentFailed'

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Home /> },


      { path: "/sign-in", element: <SignInPage /> },
      { path: "/sign-up", element: <SignUpPage /> },

      {
        element: <DashboardLayout />,
        children: [
          { path: "/photo", element: <PhotoUploadForm /> },
          { path: "/list", element: <PhotoList /> },
          { path: "/card", element: <CardPayment /> },
          { path: "/wallet", element: <EarningsPage /> },
          { path: "/pay", element: <PaymentForm /> },
          { path: "/success", element: <Success /> },
          { path: "/failed", element: <Failed /> },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);