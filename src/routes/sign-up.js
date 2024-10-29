import { SignUp } from "@clerk/clerk-react";
import './auth.css';

export default function SignUpPage() {
  return (
    <div className="authCtn">
      <div className="authBackground">
        <div className="authContent">
          <h1>Create an Account</h1>
          <SignUp />
        </div>
      </div>
    </div>
  );
}
