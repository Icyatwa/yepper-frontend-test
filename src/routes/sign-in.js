import { SignIn } from "@clerk/clerk-react";
import './auth.css';

export default function SignInPage() {
  return (
    <div className="authCtn">
      <div className="authBackground">
        <div className="authContent">
          <h1>Welcome Back!</h1>
          <SignIn />
        </div>
      </div>
    </div>
  );
}
