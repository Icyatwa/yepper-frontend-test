// WebsiteCard.js — restyled to match Yepper design system
import React from 'react';
import { Link } from 'react-router-dom';

const WebsiteCard = ({ filteredWebsites, searchQuery, compact = false }) => {
  const height     = compact ? 200 : 280;
  const titleSize  = compact ? 8    : 9;
  const cardW      = compact ? 64   : 88;
  const cardH      = compact ? 52   : 72;
  const imgH       = compact ? 20   : 28;

  const gradients = [
    ['#34d399','#10b981'], // teal
    ['#60a5fa','#3b82f6'], // blue
    ['#a78bfa','#7c3aed'], // purple
    ['#fb923c','#ea580c'], // orange
  ];

  return (
    <div style={{ width: '100%' }}>
      {filteredWebsites.length > 0 ? (
        <Link to="/websites" style={{ textDecoration: 'none' }}>
          <div style={{ position: 'relative', cursor: 'pointer' }}
            className="group">
            <div className="yp-card" style={{ height, display: 'flex', flexDirection: 'column',
              padding: 16, overflow: 'hidden', transition: 'transform .3s, box-shadow .3s' }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)';
                e.currentTarget.style.boxShadow='0 32px 64px -28px rgba(11,27,43,.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='';
                e.currentTarget.style.boxShadow=''; }}>

              {/* Preview canvas */}
              <div style={{ flex: 1, position: 'relative', overflow: 'hidden', borderRadius: 10,
                background: 'var(--yp-paper)', border: '1px solid var(--yp-line)' }}>

                {/* Browser chrome bar */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0,
                  height: compact ? 16 : 22,
                  background: 'var(--yp-ink)', borderRadius: '10px 10px 0 0',
                  display: 'flex', alignItems: 'center', paddingLeft: 8, gap: 4 }}>
                  {['#ef4444','#f59e0b','#22c55e'].map(c => (
                    <div key={c} style={{ width: compact ? 5 : 7, height: compact ? 5 : 7,
                      borderRadius: '50%', background: c }} />
                  ))}
                </div>

                {/* Floating site cards */}
                <div style={{ position: 'absolute', inset: 0, top: compact ? 16 : 22 }}>
                  {filteredWebsites.slice(0, 4).map((website, idx) => {
                    const positions = [
                      { x: 8, y: 12, rotate: -4, scale: 1 },
                      { x: 52, y: 10, rotate: 5, scale: .94 },
                      { x: 10, y: 52, rotate: -3, scale: .9 },
                      { x: 56, y: 50, rotate: 4, scale: .87 },
                    ];
                    const pos = positions[idx];
                    const [c1, c2] = gradients[idx % 4];
                    return (
                      <div key={website._id || idx}
                        style={{ position: 'absolute', width: cardW, height: cardH,
                          left: `${pos.x}%`, top: `${pos.y}%`,
                          transform: `rotate(${pos.rotate}deg) scale(${pos.scale})`,
                          zIndex: 4 - idx, transition: 'transform .4s' }}>
                        <div style={{ width: '100%', height: '100%', borderRadius: 8,
                          background: '#fff', boxShadow: '0 8px 20px rgba(11,27,43,.14)',
                          overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                          <div style={{ height: compact ? 5 : 7,
                            background: `linear-gradient(90deg, ${c1}, ${c2})` }} />
                          <div style={{ flex: 1, padding: compact ? 4 : 6,
                            display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <div style={{ height: imgH, borderRadius: 4, overflow: 'hidden',
                              background: 'var(--yp-paper)' }}>
                              {website.imageUrl && (
                                <img src={website.imageUrl} alt={website.websiteName}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              )}
                            </div>
                            <div style={{ fontSize: titleSize, fontWeight: 600,
                              color: 'var(--yp-ink)', textAlign: 'center', lineHeight: 1.2,
                              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                              fontFamily: "'JetBrains Mono', monospace" }}>
                              {website.websiteName || 'Website'}
                            </div>
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
                  View your websites →
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
            {searchQuery ? 'No websites found' : 'No websites yet'}
          </h3>
          <p style={{ color: 'var(--yp-ink-soft)', fontSize: 13, margin: 0 }}>
            {searchQuery ? 'No websites match your search.' : 'Start by adding your first website.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default WebsiteCard;
