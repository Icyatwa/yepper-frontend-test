// index.js
import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom'
import { ThemeProvider } from './components/ThemeContext'
import RootLayout from './layouts/root-layout'
import DashboardLayout from './layouts/dashboard-layout'
import SignInPage from './routes/sign-in'
import SignUpPage from './routes/sign-up'

import Home from './home/Home'
import Videos from './home/videos'
import Video from './home/video'
import Pricing from './home/Pricing'
import AdsPage from './home/ads-description/homePage';
import WebPage from './home/spaces-description/homePage'
import TermsAndConditions from './home/terms_conditions'
import PrivacyPolicy from './home/privacy_policy'

import Dashboard from './dashboard'
import Request from './register/request'

import DirectAdvertise from './register/import/DirectAdvertise'
import Select from './register/import/Select'
import Business from './register/import/Business'
import Advertisers from './register/import/Websites'
import Categories from './register/import/Categories'
import AdSuccess from './register/import/AdSuccess'

import ApprovedAdDetail from './ads/ApprovedAdDetail'
import PaymentStatus from './ads/PaymentStatus'

import Projects from './projects'
import PendingAds from './web/contents/pendingAdsDashboardContent'
import PendingAdPreview from './web/preview/pendingAdPreview'
import WebsiteDetails from './web/contents/WebsiteDetails'
import ProjectCategories from './web/Categories'
import WebsiteCreation from './web/contents/websiteCreation'
import CategoriesCreation from './web/contents/categoriesCreation'
import Wallet from './web/payouts/Wallet'

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/sign-in", element: <SignInPage /> },
      { path: "/sign-up", element: <SignUpPage /> },

      { path: "/", element: <Home /> },
      { path: "/videos", element: <Videos /> },
      { path: "/video/:id", element: <Video /> },
      { path: "/pricing", element: <Pricing />},
      { path: "/yepper-ads", element: <AdsPage /> },
      { path: "/yepper-spaces", element: <WebPage /> },
      { path: "/terms", element: <TermsAndConditions /> },
      { path: "/privacy", element: <PrivacyPolicy /> },

      {
        element: <DashboardLayout />,
        children: [

          { path: "/dashboard", element: <Dashboard /> },
          { path: "/request", element: <Request /> },
          
          { path: "/direct-ad", element: <DirectAdvertise /> },
          { path: "/select", element: <Select /> },
          { path: "/business", element: <Business /> },
          { path: "/websites", element: <Advertisers /> },
          { path: "/categories", element: <Categories /> },
          { path: "/ad-success", element: <AdSuccess /> },

          { path: "/approved-detail/:adId", element: <ApprovedAdDetail /> },
          { path: "/approved-ads", element: <PaymentStatus /> },

          { path: "/projects", element: <Projects /> },
          { path: "/pending-ads", element: <PendingAds /> },
          { path: "/pending-ad/:adId", element: <PendingAdPreview /> },
          { path: "/website/:websiteId", element: <WebsiteDetails /> },
          { path: "/categories/:id", element: <ProjectCategories /> },

          { path: "/create-website", element: <WebsiteCreation /> },
          { path: "/create-categories/:websiteId", element: <CategoriesCreation /> },
          { path: "/wallet", element: <Wallet /> },
        ]
      },
      {
        path: "/ref/:code",
        element: <Navigate to={location => `/sign-up?ref=${location.params.code}`} replace />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
)