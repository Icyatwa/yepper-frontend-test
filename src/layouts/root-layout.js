// root-layout.js
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react';
import { NotificationProvider } from '../components/NotificationContext';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../store/query-client';
import ApiSetup from '../components/ApiSetup';
import { useNavigate, useLocation, Outlet, Navigate } from 'react-router-dom';
import { useEffect } from 'react';

const PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

export default function RootLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const publicRoutes = ['/', '/yepper-ads', '/yepper-spaces','/videos','/pricing', '/terms', '/privacy', '/sign-in', '/sign-up'];

  useEffect(() => {
    const isAuthPage = ['/sign-in', '/sign-up'].includes(location.pathname);
    
    if (isAuthPage) {
      return; // Let ClerkProvider handle auth page redirects
    }
  }, [location.pathname, navigate]);

  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <NotificationProvider>
          <div className="root-layout">
            <main className="main-content">
              <SignedIn>
                <ApiSetup>
                  <Outlet />
                </ApiSetup>
              </SignedIn>
              <SignedOut>
                {publicRoutes.includes(location.pathname) ? (
                  <Outlet />
                ) : (
                  <Navigate to="/sign-in" replace />
                )}
              </SignedOut>
            </main>
          </div>
        </NotificationProvider>
      </ClerkProvider>
    </QueryClientProvider>
  );
}