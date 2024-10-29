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
import PaymentSettingsForm from './documents/PaymentSettingsForm';
import PaymentForm from './documents/PaymentForm'

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
          { path: "/PaymentSettingsForm", element: <PaymentSettingsForm /> },

          { path: "/PaymentForm", element: <PaymentForm /> },
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