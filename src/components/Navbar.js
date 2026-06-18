// Navbar.js — restyled to match Yepper design system
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Mail, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const handleLogout = () => { logout(); navigate('/'); setIsDropdownOpen(false); };
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  useEffect(() => {
    const handler = (e) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        buttonRef.current && !buttonRef.current.contains(e.target)
      ) setIsDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <nav className="yp-navbar">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 6vw' }}>
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Wordmark */}
          <Link to="/" className="yp-wordmark" style={{ textDecoration: 'none' }}>
            yepper<span className="yp-dot">.</span>
          </Link>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link to="/about-yepper" style={{ textDecoration: 'none' }}>
              <button className="yp-btn yp-btn-ghost yp-btn-sm">
                About Yepper
              </button>
            </Link>

            {isAuthenticated ? (
              <div style={{ position: 'relative' }}>
                <button
                  ref={buttonRef}
                  onClick={toggleDropdown}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '6px 10px', borderRadius: 999,
                    border: '1.5px solid var(--yp-line)',
                    background: 'var(--yp-white)',
                    cursor: 'pointer', transition: 'border-color .2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(11,27,43,.3)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--yp-line)'}
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name}
                      style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{
                      width: 30, height: 30, borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--yp-orange), var(--yp-orange-deep))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <User size={15} color="#fff" />
                    </div>
                  )}
                  <ChevronDown size={14} color="var(--yp-ink-soft)"
                    style={{ transition: 'transform .2s', transform: isDropdownOpen ? 'rotate(180deg)' : 'none' }} />
                </button>

                {/* Dropdown */}
                <div
                  ref={dropdownRef}
                  style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 10px)',
                    width: 296,
                    background: 'rgba(255,255,255,.98)',
                    borderRadius: 16,
                    border: '1px solid var(--yp-line)',
                    boxShadow: 'var(--yp-shadow)',
                    backdropFilter: 'blur(12px)',
                    overflow: 'hidden',
                    zIndex: 200,
                    transformOrigin: 'top right',
                    transition: 'opacity .25s ease, transform .25s ease',
                    opacity: isDropdownOpen ? 1 : 0,
                    transform: isDropdownOpen ? 'scale(1) translateY(0)' : 'scale(.95) translateY(-6px)',
                    pointerEvents: isDropdownOpen ? 'auto' : 'none',
                  }}
                >
                  <div style={{ padding: '20px 20px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.name}
                          style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover',
                            border: '2px solid var(--yp-line)' }} />
                      ) : (
                        <div style={{
                          width: 50, height: 50, borderRadius: '50%',
                          background: 'linear-gradient(135deg, var(--yp-orange), var(--yp-orange-deep))',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <User size={24} color="#fff" />
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700,
                          fontSize: 16, color: 'var(--yp-ink)', margin: '0 0 4px',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {user?.name || 'User'}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6,
                          color: 'var(--yp-ink-soft)', fontSize: 13 }}>
                          <Mail size={12} />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {user?.email}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--yp-line)', padding: '6px 0' }}>
                    <button
                      onClick={handleLogout}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        width: '100%', padding: '11px 20px',
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: '#ef4444', fontSize: 14, fontWeight: 500,
                        transition: 'background .15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      <LogOut size={16} />
                      <span>Log out</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <button className="yp-btn yp-btn-ghost yp-btn-sm">Log in</button>
                </Link>
                <Link to="/register" style={{ textDecoration: 'none' }}>
                  <button className="yp-btn yp-btn-solid yp-btn-sm">Sign up</button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
