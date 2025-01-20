// index.css
import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import RootLayout from './layouts/root-layout'
import DashboardLayout from './layouts/dashboard-layout'
import SignInPage from './routes/sign-in'
import SignUpPage from './routes/sign-up'

import Home from './home/Home'
import AdsPage from './home/ads-description/homePage';
import WebPage from './home/spaces-description/homePage'
import TermsAndConditions from './home/terms_conditions'
import PrivacyPolicy from './home/privacy_policy'

import Dashboard from './dashboard'
import Request from './register/request'

import Select from './register/import/Select'
import Business from './register/import/Business'
import Advertisers from './register/import/Websites'
import Categories from './register/import/Categories'
import ImportAd from './register/import/Spaces'
import Templates from './register/import/Templates'
import AdPreview from './register/import/AdPreview'
import AdSuccess from './register/import/AdSuccess'

import ApprovedAdDetail from './ads/ApprovedAdDetail'

import Projects from './projects'
import PendingAds from './web/contents/pendingAdsDashboardContent'
import PendingAdPreview from './web/preview/pendingAdPreview'
import WebsiteDetails from './web/contents/WebsiteDetails'
import ProjectCategories from './web/Categories'
import WebsiteCreation from './web/contents/websiteCreation'
import CategoriesCreation from './web/contents/categoriesCreation'
import SpacesCreation from './web/contents/spacesCreation'
import Wallet from './web/payouts/Wallet'

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/sign-in", element: <SignInPage /> },
      { path: "/sign-up", element: <SignUpPage /> },

      { path: "/", element: <Home /> },
      { path: "/yepper-ads", element: <AdsPage /> },
      { path: "/yepper-spaces", element: <WebPage /> },
      { path: "/terms", element: <TermsAndConditions /> },
      { path: "/privacy", element: <PrivacyPolicy /> },

      {
        element: <DashboardLayout />,
        children: [
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/request", element: <Request /> },

          { path: "/select", element: <Select /> },
          { path: "/business", element: <Business /> },
          { path: "/websites", element: <Advertisers /> },
          { path: "/categories", element: <Categories /> },
          { path: "/spaces", element: <ImportAd /> },
          { path: "/templates", element: <Templates /> },
          { path: "/ad-preview", element: <AdPreview /> },
          { path: "/ad-success", element: <AdSuccess /> },

          { path: "/approved-detail/:adId", element: <ApprovedAdDetail /> },

          { path: "/projects", element: <Projects /> },
          { path: "/pending-ads", element: <PendingAds /> },
          { path: "/pending-ad/:adId", element: <PendingAdPreview /> },
          { path: "/website/:websiteId", element: <WebsiteDetails /> },
          { path: "/categories/:id", element: <ProjectCategories /> },

          { path: "/create-website", element: <WebsiteCreation /> },
          { path: "/create-categories/:websiteId", element: <CategoriesCreation /> },
          { path: "/create-spaces", element: <SpacesCreation /> },
          { path: "/wallet", element: <Wallet /> },
        ]
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)