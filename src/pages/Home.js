// Home.js — restyled to match Yepper design system
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Grid } from '../components/components';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import WebsiteCard from '../components/WebsiteCard';
import AdsCard from '../components/AdsCard';
import MarketingAssistant from '../components/MarketingAssistant';
import api from '../utils/api';

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedFilter] = useState('all');
  const [searchQuery] = useState('');
  const [filteredAds, setFilteredAds] = useState([]);
  const [filteredWebsites, setFilteredWebsites] = useState([]);
  const [showAssistant, setShowAssistant] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);

  const { data: mixedAds, error } = useQuery({
    queryKey: ['mixedAds', user?._id || user?.id],
    queryFn: async () => {
      const userId = user?._id || user?.id;
      const response = await api.get(`/api/web-advertise/mixed/${userId}`);
      return response.data;
    },
    enabled: isAuthenticated && !!(user?._id || user?.id),
    onSuccess: (data) => setFilteredAds(data || []),
  });

  const { data: websites } = useQuery({
    queryKey: ['websites', user?._id || user?.id],
    queryFn: async () => {
      const userId = user?._id || user?.id;
      const response = await api.get(`/api/websites/${userId}`);
      return response.data;
    },
    enabled: isAuthenticated && !!(user?._id || user?.id),
    onSuccess: (data) => setFilteredWebsites(data || []),
  });

  useEffect(() => {
    if (!mixedAds) return;
    const query = searchQuery.toLowerCase().trim();
    const statusFiltered = selectedFilter === 'all'
      ? mixedAds
      : mixedAds.filter(ad => ad.websiteSelections?.some(ws =>
          selectedFilter === 'approved' ? ws.approved : !ws.approved));
    if (!query) { setFilteredAds(statusFiltered); return; }
    setFilteredAds(statusFiltered.filter(ad => {
      const fields = [ad.businessName?.toLowerCase(), ad.adDescription?.toLowerCase(),
        ...(ad.websiteSelections?.map(ws => ws.websiteId?.websiteName?.toLowerCase()) || [])];
      return fields.some(f => f?.includes(query));
    }));
  }, [searchQuery, selectedFilter, mixedAds]);

  useEffect(() => {
    if (!websites) return;
    const query = searchQuery.toLowerCase().trim();
    const statusFiltered = selectedFilter === 'all' ? websites
      : websites.filter(w => w.status === selectedFilter);
    if (!query) { setFilteredWebsites(statusFiltered); return; }
    setFilteredWebsites(statusFiltered.filter(w =>
      [w.websiteName?.toLowerCase(), w.websiteLink?.toLowerCase()].some(f => f?.includes(query))));
  }, [searchQuery, selectedFilter, websites]);

  if (error) return (
    <div className="yp-bg" style={{ padding: 40 }}>
      <div className="yp-aura-a" aria-hidden="true" />
      <div className="yp-card" style={{ maxWidth: 480, margin: '0 auto', padding: 32, textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700,
          color: 'var(--yp-ink)', marginBottom: 10 }}>Error loading data</h2>
        <p style={{ color: 'var(--yp-ink-soft)', marginBottom: 20 }}>{error.message}</p>
        <button className="yp-btn yp-btn-solid" onClick={() => navigate(-1)}>Go back</button>
      </div>
    </div>
  );

  /* ── Marketing assistant view ── */
  if (showAssistant) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden',
        background: 'var(--yp-white)' }}>
        <Navbar />

        <div style={{ background: 'rgba(245,248,252,.9)', borderBottom: '1px solid var(--yp-line)',
          padding: '8px 20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowAssistant(false)}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px',
              borderRadius: 999, border: '1.5px solid var(--yp-line)', background: 'var(--yp-white)',
              cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--yp-ink)' }}>
            <X size={15} /> Close assistant
          </button>
        </div>

        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <MarketingAssistant user={user} isAuthenticated={isAuthenticated} />
          </div>

          <button
            onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
            style={{
              position: 'absolute', top: '50%', transform: 'translateY(-50%)',
              right: isRightSidebarOpen ? 320 : 0,
              background: 'var(--yp-white)', border: '1px solid var(--yp-line)',
              borderRight: 'none', borderRadius: '8px 0 0 8px',
              padding: '8px 6px', cursor: 'pointer', boxShadow: 'var(--yp-shadow-sm)',
              zIndex: 10,
            }}>
            {isRightSidebarOpen ? <ChevronRight size={18} color="var(--yp-ink-soft)" />
              : <ChevronLeft size={18} color="var(--yp-ink-soft)" />}
          </button>

          <div style={{ width: isRightSidebarOpen ? 320 : 0, overflow: 'hidden',
            transition: 'width .3s ease', display: 'flex', flexDirection: 'column' }}>
            {isRightSidebarOpen && (
              <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Link to="/add-website" style={{ textDecoration: 'none' }}>
                    <button className="yp-btn yp-btn-solid"
                      style={{ width: '100%', justifyContent: 'center', gap: 8 }}>
                      Run Ads on Websites <ArrowRight size={15} />
                    </button>
                  </Link>
                  <WebsiteCard filteredWebsites={filteredWebsites} searchQuery={searchQuery} compact={true} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Link to="/advertise" style={{ textDecoration: 'none' }}>
                    <button className="yp-btn yp-btn-orange"
                      style={{ width: '100%', justifyContent: 'center', gap: 8 }}>
                      Advertise Products <ArrowRight size={15} />
                    </button>
                  </Link>
                  <AdsCard filteredAds={filteredAds} searchQuery={searchQuery} compact={true} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ── Unauthenticated landing ── */
  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <div className="yp-bg" style={{ minHeight: 'calc(100vh - 64px)' }}>
          <div className="yp-aura-a" aria-hidden="true" />
          <div className="yp-aura-b" aria-hidden="true" />

          <div style={{ maxWidth: 900, margin: '0 auto', padding: '80px 6vw 60px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 48 }}>

            {/* Hero copy */}
            <div style={{ textAlign: 'center', maxWidth: 580 }}>
              <span className="yp-kicker" style={{ marginBottom: 14, display: 'block' }}>
                Rwanda's advertising platform
              </span>
              <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700,
                fontSize: 'clamp(34px,5vw,54px)', letterSpacing: '-.03em',
                color: 'var(--yp-ink)', lineHeight: 1.05, margin: '0 0 16px' }}>
                Ads that work on every Rwandan site.
              </h1>
              <p style={{ color: 'var(--yp-ink-soft)', fontSize: 18, lineHeight: 1.6,
                margin: '0 0 32px' }}>
                Run display ads on top Rwandan publishers, or monetise your own site —
                with a live dashboard that shows exactly who you're reaching.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/register" style={{ textDecoration: 'none' }}>
                  <button className="yp-btn yp-btn-solid yp-btn-lg">Get started free</button>
                </Link>
                <Link to="/about-yepper" style={{ textDecoration: 'none' }}>
                  <button className="yp-btn yp-btn-ghost yp-btn-lg">Learn more</button>
                </Link>
              </div>
            </div>

            {/* Two action cards */}
            <Grid cols={2} gap={6} className="w-full" style={{ maxWidth: 740 }}>
              <Link to="/add-website" style={{ textDecoration: 'none' }}>
                <div className="yp-card" style={{ padding: '28px 24px', cursor: 'pointer',
                  transition: 'transform .25s, box-shadow .25s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)';
                    e.currentTarget.style.boxShadow='0 32px 64px -28px rgba(11,27,43,.32)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform='';
                    e.currentTarget.style.boxShadow=''; }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: 12 }}>
                    <span className="yp-kicker">Publishers</span>
                    <ArrowLeft size={16} color="var(--yp-ink-soft)" />
                  </div>
                  <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700,
                    fontSize: 20, color: 'var(--yp-ink)', margin: '0 0 8px' }}>
                    Run Ads on your Website
                  </h3>
                  <p style={{ color: 'var(--yp-ink-soft)', fontSize: 14, margin: 0 }}>
                    Add our script, choose your placements, and start earning.
                  </p>
                </div>
              </Link>

              <Link to="/advertise" style={{ textDecoration: 'none' }}>
                <div className="yp-card" style={{ padding: '28px 24px', cursor: 'pointer',
                  background: 'var(--yp-ink)', borderColor: 'transparent',
                  transition: 'transform .25s, box-shadow .25s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)';
                    e.currentTarget.style.boxShadow='0 32px 64px -28px rgba(11,27,43,.5)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform='';
                    e.currentTarget.style.boxShadow=''; }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: 12 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                      letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--yp-orange)' }}>
                      Advertisers
                    </span>
                    <ArrowRight size={16} color="rgba(255,255,255,.5)" />
                  </div>
                  <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700,
                    fontSize: 20, color: '#fff', margin: '0 0 8px' }}>
                    Advertise your Product
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 14, margin: 0 }}>
                    Place your brand on Rwanda's most-read sites, with live analytics.
                  </p>
                </div>
              </Link>
            </Grid>

            {/* AI Assistant CTA */}
            <div style={{ textAlign: 'center' }}>
              <button onClick={() => setShowAssistant(true)}
                className="yp-btn yp-btn-orange"
                style={{ gap: 8 }}>
                <span className="yp-live-dot" />
                Use Yepper AI Marketing Assistant
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ── Authenticated dashboard ── */
  return (
    <>
      <Navbar />
      <div className="yp-bg" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <div className="yp-aura-a" aria-hidden="true" />
        <div className="yp-aura-b" aria-hidden="true" />

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '56px 6vw 60px' }}>
          {/* Greeting */}
          <div style={{ marginBottom: 40 }}>
            <span className="yp-kicker" style={{ display: 'block', marginBottom: 8 }}>
              Dashboard
            </span>
            <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700,
              fontSize: 'clamp(26px,3.5vw,40px)', letterSpacing: '-.03em',
              color: 'var(--yp-ink)', margin: 0 }}>
              Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}.
            </h1>
          </div>

          <Grid cols={2} gap={8} className="mb-10">
            {/* Websites column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Link to="/add-website" style={{ textDecoration: 'none' }}>
                <button className="yp-btn yp-btn-solid"
                  style={{ width: '100%', justifyContent: 'center', gap: 8 }}>
                  <ArrowLeft size={15} />
                  Run Ads on your Website
                </button>
              </Link>
              <WebsiteCard filteredWebsites={filteredWebsites} searchQuery={searchQuery} />
            </div>

            {/* Ads column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Link to="/advertise" style={{ textDecoration: 'none' }}>
                <button className="yp-btn yp-btn-orange"
                  style={{ width: '100%', justifyContent: 'center', gap: 8 }}>
                  Advertise your Product
                  <ArrowRight size={15} />
                </button>
              </Link>
              <AdsCard filteredAds={filteredAds} searchQuery={searchQuery} />
            </div>
          </Grid>

          {/* AI assistant CTA */}
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
            <button onClick={() => setShowAssistant(true)}
              className="yp-btn yp-btn-orange"
              style={{ gap: 8 }}>
              <span className="yp-live-dot" />
              Use Yepper AI Marketing Assistant
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
