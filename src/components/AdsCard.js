// AdsCard.js — restyled to match Yepper design system
import React from 'react';
import { Link } from 'react-router-dom';

const AdsCard = ({ filteredAds, searchQuery, compact = false }) => {
  const height  = compact ? 200 : 280;
  const cardW   = compact ? 56  : 76;
  const cardH   = compact ? 44  : 60;
  const imgH    = compact ? 14  : 22;

  const gradients = [
    ['#60a5fa','#3b82f6'],
    ['#a78bfa','#7c3aed'],
    ['#f472b6','#ec4899'],
    ['#fb923c','var(--yp-orange)'],
  ];

  return (
    <div style={{ width: '100%' }}>
      {filteredAds.length > 0 ? (
        <Link to="/ads" style={{ textDecoration: 'none' }}>
          <div style={{ cursor: 'pointer' }}>
            <div className="yp-card" style={{ height, display: 'flex', flexDirection: 'column',
              padding: 16, overflow: 'hidden', transition: 'transform .3s, box-shadow .3s' }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)';
                e.currentTarget.style.boxShadow='0 32px 64px -28px rgba(11,27,43,.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='';
                e.currentTarget.style.boxShadow=''; }}>

              {/* Preview canvas */}
              <div style={{ flex: 1, position: 'relative', overflow: 'hidden', borderRadius: 10,
                background: 'var(--yp-paper)', border: '1px solid var(--yp-line)' }}>

                {/* Orange top bar */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0,
                  height: compact ? 16 : 22,
                  background: 'linear-gradient(90deg, var(--yp-orange-deep), var(--yp-orange))',
                  borderRadius: '10px 10px 0 0' }} />

                {/* Floating ad cards */}
                <div style={{ position: 'absolute', inset: 0, top: compact ? 16 : 22 }}>
                  {filteredAds.slice(0, 4).map((ad, idx) => {
                    const positions = [
                      { x: 10, y: 14, rotate: -6, scale: 1 },
                      { x: 50, y: 18, rotate: 8, scale: .94 },
                      { x: 18, y: 50, rotate: -9, scale: .9 },
                      { x: 58, y: 14, rotate: 5, scale: .87 },
                    ];
                    const pos = positions[idx];
                    const [c1, c2] = gradients[idx % 4];
                    return (
                      <div key={ad._id || idx}
                        style={{ position: 'absolute', width: cardW, height: cardH,
                          left: `${pos.x}%`, top: `${pos.y}%`,
                          transform: `rotate(${pos.rotate}deg) scale(${pos.scale})`,
                          zIndex: 4 - idx, transition: 'transform .4s' }}>
                        <div style={{ width: '100%', height: '100%', borderRadius: 7,
                          background: '#fff', boxShadow: '0 8px 20px rgba(11,27,43,.14)',
                          overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                          <div style={{ height: compact ? 4 : 6,
                            background: `linear-gradient(90deg, ${c1}, ${c2})` }} />
                          <div style={{ flex: 1, padding: compact ? 3 : 5,
                            display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <div style={{ height: imgH, borderRadius: 3, overflow: 'hidden',
                              background: 'var(--yp-paper)' }}>
                              {ad.videoUrl ? (
                                <video muted style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                                  <source src={ad.videoUrl} type="video/mp4" />
                                </video>
                              ) : (
                                <img src={ad.imageUrl} alt={ad.businessName}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              )}
                            </div>
                            <div style={{ height: compact ? 2 : 3, borderRadius: 2,
                              background: 'var(--yp-line)', width: '75%' }} />
                            <div style={{ height: compact ? 2 : 2, borderRadius: 2,
                              background: 'var(--yp-line)', width: '50%' }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer label */}
              <div style={{ marginTop: 10, textAlign: 'center' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: compact ? 10 : 11,
                  fontWeight: 600, color: 'var(--yp-ink-soft)', letterSpacing: '.1em',
                  textTransform: 'uppercase' }}>
                  View your campaigns →
                </span>
              </div>
            </div>
          </div>
        </Link>
      ) : (
        <div className="yp-card" style={{ height, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24 }}>
          <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700,
            fontSize: compact ? 15 : 17, color: 'var(--yp-ink)', marginBottom: 6 }}>
            {searchQuery ? 'No campaigns found' : 'No active campaigns yet'}
          </h3>
          <p style={{ color: 'var(--yp-ink-soft)', fontSize: 13, margin: 0 }}>
            {searchQuery ? 'No campaigns match your search.' : 'Start creating your first campaign.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdsCard;
