// Login.js — restyled to match Yepper design system
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Button, Input } from '../components/components';
import { authAPI } from '../utils/api';

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-3 flex-shrink-0" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');

  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address';
    return '';
  };
  const validatePassword = (password) => password ? '' : 'Password is required';

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'email' && emailError) setEmailError('');
    if (field === 'password' && passwordError) setPasswordError('');
    if (loginError) setLoginError('');
  };
  const handleInputBlur = (field, value) => {
    if (field === 'email') setEmailError(validateEmail(value));
    if (field === 'password') setPasswordError(validatePassword(value));
  };

  const handleGoogleLogin = () => { setIsGoogleLoading(true); window.location.href = authAPI.googleRedirect(); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');
    const emailErr = validateEmail(formData.email);
    const passErr  = validatePassword(formData.password);
    setEmailError(emailErr); setPasswordError(passErr);
    if (emailErr || passErr) { setIsLoading(false); return; }
    try {
      const success = await login(formData.email, formData.password);
      if (success) navigate('/');
      else setLoginError('Invalid email or password. Please try again.');
    } catch {
      setLoginError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="yp-bg" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div className="yp-aura-a" aria-hidden="true" />
      <div className="yp-aura-b" aria-hidden="true" />

      {/* Mini header */}
      <header style={{ borderBottom: '1px solid var(--yp-line)', background: 'rgba(255,255,255,.9)',
        backdropFilter: 'blur(10px)', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 6vw' }}>
          <div style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <button className="yp-btn yp-btn-ghost yp-btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <ArrowLeft size={15} /> Back
              </button>
            </Link>
            <span className="yp-wordmark" style={{ fontSize: 18 }}>
              yepper<span className="yp-dot">.</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 16px' }}>
        <div className="yp-auth-card">
          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <span className="yp-kicker" style={{ marginBottom: 10, display: 'block' }}>
              Welcome back
            </span>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700,
              fontSize: 30, letterSpacing: '-.03em', color: 'var(--yp-ink)', margin: '0 0 8px' }}>
              Sign in to Yepper
            </h2>
            <p style={{ color: 'var(--yp-ink-soft)', fontSize: 14, margin: 0, lineHeight: 1.55 }}>
              Sign in with Google to access your account and Search Console data automatically.
            </p>
          </div>

          {/* Error */}
          {loginError && (
            <div style={{ marginBottom: 16, padding: '12px 16px', background: '#fef2f2',
              border: '1px solid #fecaca', borderRadius: 10, color: '#991b1b', fontSize: 13,
              textAlign: 'center' }}>
              {loginError}
            </div>
          )}

          {/* Google CTA */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '14px 20px', border: '1.5px solid var(--yp-line)', borderRadius: 12,
              background: 'var(--yp-white)', cursor: 'pointer',
              fontWeight: 600, fontSize: 15, color: 'var(--yp-ink)',
              transition: 'border-color .2s, box-shadow .2s',
              boxShadow: '0 1px 4px rgba(11,27,43,.06)',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(11,27,43,.3)'; e.currentTarget.style.boxShadow='0 4px 14px rgba(11,27,43,.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='var(--yp-line)'; e.currentTarget.style.boxShadow='0 1px 4px rgba(11,27,43,.06)'; }}
          >
            {isGoogleLoading ? (
              <svg className="animate-spin w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : <GoogleIcon />}
            {isGoogleLoading ? 'Redirecting…' : 'Continue with Google'}
          </button>

          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--yp-ink-soft)', margin: '8px 0 0',
            fontFamily: "'JetBrains Mono', monospace" }}>
            Connects your Google Search Console automatically.
          </p>

          {/* Divider */}
          <div className="yp-divider" style={{ margin: '22px 0 16px' }}>or</div>

          {!showPasswordForm ? (
            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => setShowPasswordForm(true)}
                style={{ background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 13, color: 'var(--yp-ink-soft)',
                  textDecoration: 'underline', textUnderlineOffset: 3 }}
              >
                Sign in with email & password
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600,
                  color: 'var(--yp-ink)', marginBottom: 6 }}>Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  onBlur={e => handleInputBlur('email', e.target.value)}
                  className={`yp-input ${emailError ? 'error' : ''}`}
                />
                {emailError && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{emailError}</p>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600,
                  color: 'var(--yp-ink)', marginBottom: 6 }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={e => handleInputChange('password', e.target.value)}
                    onBlur={e => handleInputBlur('password', e.target.value)}
                    className={`yp-input ${passwordError ? 'error' : ''}`}
                    style={{ paddingRight: 44 }}
                  />
                  <button type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', color: 'var(--yp-ink-soft)',
                      display: 'flex', padding: 0 }}>
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {passwordError && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{passwordError}</p>}
              </div>

              <div style={{ textAlign: 'right' }}>
                <Link to="/forgot-password"
                  style={{ fontSize: 13, color: 'var(--yp-orange-deep)', textDecoration: 'none',
                    fontWeight: 500 }}>
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="yp-btn yp-btn-solid"
                style={{ width: '100%', justifyContent: 'center', marginTop: 2 }}
              >
                {isLoading ? (
                  <><svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>Signing in…</>
                ) : 'Sign in'}
              </button>
            </form>
          )}

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--yp-ink-soft)' }}>
            Don't have an account?{' '}
            <Link to="/register"
              style={{ color: 'var(--yp-orange-deep)', fontWeight: 600, textDecoration: 'none' }}>
              Sign up
            </Link>
          </p>

          <p style={{ fontSize: 11, color: 'var(--yp-ink-soft)', marginTop: 20, textAlign: 'center',
            fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.6 }}>
            By signing in, you agree to Yepper's Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
