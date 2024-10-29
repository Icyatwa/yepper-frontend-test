import { Link, Outlet } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import './root.css'
 
const PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;
 
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}
 
export default function RootLayout() {
  const rootStyles = {
    fontSize: '18px', // Adjust the font size as needed
  };

  const linkStyles = {
    fontSize: '1.2em', // You can adjust the size using em, rem, px, etc.
  };

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
    >
      <div style={rootStyles}>
        <div className="userButton">
          <SignedIn>
            <UserButton afterSignOutUrl='/sign-in' />
          </SignedIn>

          <SignedOut>
            <Link to="/sign-in" style={linkStyles}>Sign In</Link>
          </SignedOut>
        </div>
        
      </div>
      <main>
        <Outlet />
      </main>
    </ClerkProvider>
  );
}
