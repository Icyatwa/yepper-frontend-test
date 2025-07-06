// sign-up.js
import React, { useState } from 'react';

import { SignUp } from "@clerk/clerk-react";
import { useLocation } from 'react-router-dom';
import './auth.css';
import axios from 'axios';

const authAppearance = {
  layout: {
    socialButtonsPlacement: 'bottom',
    logoPlacement: 'none',
    showOptionalFields: false,
  },
  variables: {
    colorPrimary: '#00B4D8',
    colorBackground: 'transparent',
    colorText: '#0A2342',
    colorInputText: '#0A2342',
    colorInputBackground: '#F0F4F8',
    colorInputBorder: '#CBD5E1',
    borderRadius: '1rem',
  },
  elements: {
    card: 'shadow-2xl rounded-3xl p-8 w-full max-w-md mx-auto border-2 border-cyan-100/30 bg-white backdrop-blur-lg transform transition-all hover:scale-[1.02]',
    formFieldInput: 'px-4 py-3.5 border-2 border-cyan-200/50 rounded-xl bg-cyan-50/30 focus:ring-4 focus:ring-cyan-500/40 focus:border-cyan-500 transition-all duration-300 placeholder-gray-500',
    formFieldLabel: 'text-sm font-bold uppercase tracking-wider text-cyan-900 mb-2 block',
    formFieldAction: 'text-cyan-600 hover:text-cyan-800 font-semibold text-sm transition-colors',
    formButtonPrimary: 'w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg',
    socialButtonsBlockButton: 'flex items-center justify-center gap-3 py-3.5 rounded-xl border-2 border-gray-300/50 hover:bg-gray-100/50 transition-all group',
    socialButtonsBlockButtonText: 'text-gray-700 group-hover:text-black font-semibold',
    dividerLine: 'bg-gray-300/50',
    dividerText: 'text-gray-500 px-4 text-sm font-medium',
    rootBox: 'w-full',
    form: 'space-y-5',
  }
};

export default function SignUpPage() {
  const location = useLocation();
  const [isRecordingReferral, setIsRecordingReferral] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const referralCode = searchParams.get('ref');

  const handleSignUpComplete = async (user) => {
    if (referralCode) {
      try {
        setIsRecordingReferral(true);
        const response = await axios.post(`http://localhost:5000/api/referrals/record-referral`, {
          referralCode,
          referredUserId: user.id,
          userType: 'website_owner',
          referredUserDetails: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.primaryEmailAddress?.emailAddress,
            createdAt: new Date()
          }
        });
        
        // Store both the code and the user ID
        localStorage.setItem('referralCode', referralCode);
        localStorage.setItem('referredUserId', user.id);
        
      } catch (error) {
        console.error('Failed to record referral:', error);
      } finally {
        setIsRecordingReferral(false);
      }
    }
  };
  
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Create Your Account</h1>
            <p>Start your advertising transformation</p>
          </div>
          <SignUp 
            redirectUrl="/dashboard" 
            appearance={authAppearance}
            onSignUpComplete={handleSignUpComplete}
          />
        </div>
        <div className="auth-illustration">
          <div className="illustration-content">
            <h2>Transform Your Advertising Strategy</h2>
            <p>Innovative tools for modern marketers</p>
          </div>
        </div>
      </div>
    </div>
  );
}