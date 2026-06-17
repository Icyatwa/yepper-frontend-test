import React, { useEffect } from "react";

/**
 * Yepper → Ecobank advertiser proposal (single file, drop-in).
 *
 * Offers Ecobank the Floating + Modal placements on Kigali Today, with the
 * live-analytics angle. Reuses the mockup images you already have:
 *   /public/yepper-spaces/floating.png  and  /public/yepper-spaces/modal.png
 * (override the folder with the `imageBase` prop if needed).
 *
 * Usage:  import EcobankProposal from "./EcobankProposal";  <EcobankProposal />
 */

export default function EcobankProposal({ imageBase = "/yepper-spaces" }) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll("[data-reveal]"));
    const reveal = (el) => el.classList.add("is-in");
    document.documentElement.classList.add("eco-js");
    if (!("IntersectionObserver" in window)) return els.forEach(reveal);
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); } }),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    const vh = window.innerHeight || 800;
    els.forEach((el) => (el.getBoundingClientRect().top < vh * 0.95 ? reveal(el) : io.observe(el)));
    const t = setTimeout(() => els.forEach(reveal), 1600);
    return () => { io.disconnect(); clearTimeout(t); };
  }, []);

  const PLACEMENTS = [
    {
      key: "floating",
      name: "The floating ad",
      price: "75,000",
      desc: "A small card that rests in the corner of Kigali Today and follows the reader as they scroll. Always visible, never blocking the article, and easy to dismiss.",
      points: ["Present on every page, throughout the visit", "Works on desktop and mobile", "Your brand, always in view"],
    },
    {
      key: "modal",
      name: "The modal ad",
      price: "60,000",
      desc: "A centred placement that appears once per visit, then closes itself. The most attention-grabbing moment on the page — reserved, clean, and unmissable.",
      points: ["Full attention, once per reader", "Ideal for a launch or a campaign push", "Dismissible, so it never frustrates"],
    },
  ];

  return (
    <div className="eco-root">
      <StyleTag />
      <div className="eco-aura eco-aura--a" aria-hidden="true" />
      <div className="eco-aura eco-aura--b" aria-hidden="true" />

      <header className="eco-topbar">
        <div className="eco-wordmark">yepper<span className="eco-dot">.</span></div>
        <div className="eco-topbar__meta">Prepared for Ecobank</div>
      </header>

      {/* hero */}
      <section className="eco-hero">
        <div className="eco-hero__copy" data-reveal>
          <span className="eco-eyebrow"><i className="eco-pulse" /> A proposal for Ecobank</span>
          <h1 className="eco-h1">Reach Rwanda on Kigali&nbsp;Today &mdash; and see exactly who you reached.</h1>
          <p className="eco-lede">
            Yepper places your ad on Kigali Today, one of the country&rsquo;s
            most-read sites, in two clean placements. And you don&rsquo;t advertise
            blind: you watch the results come in live &mdash; how many people saw
            it, where they are, and the device they used.
          </p>
          <div className="eco-hero__actions">
            <a className="eco-btn eco-btn--solid" href="#placements">See the placements</a>
            <a className="eco-btn eco-btn--ghost" href="#analytics">What you&rsquo;ll track</a>
          </div>
        </div>
        <div className="eco-hero__stage" data-reveal>
          <AnalyticsPanel />
        </div>
      </section>

      {/* placements */}
      <section className="eco-section" id="placements">
        <div className="eco-head" data-reveal>
          <span className="eco-kicker">The placements</span>
          <h2 className="eco-h2">Two ways to reach them on Kigali Today</h2>
          <p className="eco-sub">Run one, or both. Each price is per month.</p>
        </div>

        {PLACEMENTS.map((p, i) => (
          <article className={`eco-row ${i % 2 ? "eco-row--flip" : ""}`} data-reveal key={p.key}>
            <div className="eco-shot">
              <img src={`${imageBase}/${p.key}.png`} alt={`${p.name} on Kigali Today`} loading="lazy" />
            </div>
            <div className="eco-info">
              <h3 className="eco-name">{p.name}</h3>
              <p className="eco-desc">{p.desc}</p>
              <ul className="eco-points">
                {p.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
              <div className="eco-price">
                {p.price} <em>RWF / month</em>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* analytics */}
      <section className="eco-section eco-section--soft" id="analytics">
        <div className="eco-head" data-reveal>
          <span className="eco-kicker">What you&rsquo;ll track</span>
          <h2 className="eco-h2">You&rsquo;ll see exactly who you reached</h2>
          <p className="eco-sub">
            Every campaign comes with a live dashboard. No guessing, no waiting for
            a report at the end of the month.
          </p>
        </div>
        <div className="eco-feature" data-reveal>
          <div className="eco-feature__art"><MapArt /></div>
          <div className="eco-feature__txt">
            <span className="eco-kicker">Where they are</span>
            <h3 className="eco-feature__h">See your reach across Rwanda</h3>
            <p className="eco-feature__p">
              Every view is mapped by city and region &mdash; Kigali, Musanze,
              Rubavu and beyond &mdash; so you know exactly where Ecobank is
              landing, and where to push next.
            </p>
          </div>
        </div>

        <div className="eco-cards3">
          <div className="eco-card" data-reveal>
            <div className="eco-card__art"><ChartArt /></div>
            <h4 className="eco-card__title">Live views</h4>
            <p className="eco-card__body">Watch impressions arrive in real time, as people see your ad &mdash; not days later.</p>
          </div>
          <div className="eco-card" data-reveal style={{ "--d": "90ms" }}>
            <div className="eco-card__art"><AudienceArt /></div>
            <h4 className="eco-card__title">Your audience</h4>
            <p className="eco-card__body">See how many people your ad reached, and how that grows across the campaign.</p>
          </div>
          <div className="eco-card" data-reveal style={{ "--d": "180ms" }}>
            <div className="eco-card__art"><DeviceArt /></div>
            <h4 className="eco-card__title">Which device</h4>
            <p className="eco-card__body">Know whether they viewed it on mobile, desktop, or tablet &mdash; and adjust accordingly.</p>
          </div>
        </div>
      </section>

      {/* why kigali today */}
      <section className="eco-section">
        <div className="eco-band" data-reveal>
          <span className="eco-kicker">Why Kigali Today</span>
          <p className="eco-band__lead">
            Kigali Today is one of Rwanda&rsquo;s most-read news platforms &mdash;
            a daily habit for a wide, local audience. Your ad sits beside the
            stories they already trust, in front of exactly the people Ecobank
            wants to reach.
          </p>
        </div>
      </section>

      {/* close */}
      <section className="eco-close" data-reveal>
        <h2 className="eco-close__title">Let&rsquo;s get Ecobank live on Kigali Today.</h2>
        <p className="eco-close__sub">
          We handle the setup, the placement, and the reporting. You pick the
          placement, and watch the results come in. We&rsquo;d be glad to walk you
          through it whenever suits you.
        </p>
        <a className="eco-btn eco-btn--solid eco-btn--lg" href="#">Start the campaign</a>
        <p className="eco-close__note">Yepper Ltd · Kigali, Rwanda · yepper.cc</p>
      </section>

      <footer className="eco-foot">
        <span className="eco-wordmark eco-wordmark--sm">yepper<span className="eco-dot">.</span></span>
        <span className="eco-foot__meta">Prices in RWF, per month</span>
      </footer>
    </div>
  );
}

/* live-analytics preview widget (illustrative sample) */
function AnalyticsPanel() {
  const devices = [["Mobile", 68], ["Desktop", 27], ["Tablet", 5]];
  const places = [["Kigali", 54], ["Musanze", 18], ["Rubavu", 14], ["Huye", 9]];
  return (
    <div className="eco-panel">
      <div className="eco-panel__head">
        <span className="eco-panel__title">Ecobank · campaign dashboard</span>
        <span className="eco-panel__live"><i /> live · sample</span>
      </div>

      <div className="eco-stat">
        <span className="eco-stat__num">12,480</span>
        <span className="eco-stat__label">views today<b>+8%</b></span>
      </div>

      <svg className="eco-chart" viewBox="0 0 300 70" preserveAspectRatio="none">
        <defs>
          <linearGradient id="eco-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,106,26,.28)" />
            <stop offset="100%" stopColor="rgba(255,106,26,0)" />
          </linearGradient>
        </defs>
        <path d="M0,58 L50,52 L100,55 L150,40 L200,34 L250,20 L300,12 L300,70 L0,70 Z" fill="url(#eco-fill)" />
        <path className="eco-chart__line" d="M0,58 L50,52 L100,55 L150,40 L200,34 L250,20 L300,12"
          fill="none" stroke="#ff6a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      <div className="eco-panel__cols">
        <div className="eco-mini">
          <span className="eco-mini__h">Device</span>
          {devices.map(([d, v]) => (
            <div className="eco-bar" key={d}>
              <span>{d}</span>
              <i><b style={{ width: `${v}%` }} /></i>
              <em>{v}%</em>
            </div>
          ))}
        </div>
        <div className="eco-mini">
          <span className="eco-mini__h">Location</span>
          {places.map(([d, v]) => (
            <div className="eco-bar" key={d}>
              <span>{d}</span>
              <i><b style={{ width: `${v + 20}%` }} className="eco-bar--sky" /></i>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── custom illustrations (hand-drawn SVG, brand colours, no clip-art) ── */
function Pin({ x, y, r = 9, main = false }) {
  const cy = y - (r + 9);
  return (
    <g>
      {main && <circle className="eco-ping" cx={x} cy={y} r={r + 6} fill="none" stroke="#ff6a1a" strokeWidth="2" />}
      <ellipse cx={x} cy={y + 2} rx={r * 0.75} ry="3" fill="rgba(11,27,43,.12)" />
      <path d={`M${x - r * 0.7},${cy + r * 0.55} L${x},${y} L${x + r * 0.7},${cy + r * 0.55} Z`} fill={main ? "#ee5704" : "#ff8a3d"} />
      <circle cx={x} cy={cy} r={r} fill={main ? "#ff6a1a" : "#ff8a3d"} />
      <circle cx={x} cy={cy} r={r * 0.42} fill="#fff" />
    </g>
  );
}

function MapArt() {
  return (
    <svg viewBox="0 0 340 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Reach mapped across Rwanda">
      <path d="M44,74 C44,44 96,32 146,38 C204,44 252,32 292,64 C322,88 312,144 280,172 C240,204 150,210 100,192 C58,176 44,124 44,74 Z"
        fill="#e7f1fb" stroke="#bcdcf5" strokeWidth="2" />
      <path d="M146,38 C156,94 132,146 100,192" stroke="#cfe4f7" strokeWidth="2" fill="none" />
      <path d="M292,64 C246,94 252,154 280,172" stroke="#cfe4f7" strokeWidth="2" fill="none" />
      <path d="M126,128 L214,94 M214,94 L256,152" stroke="#f7a877" strokeWidth="2" strokeDasharray="1 7" strokeLinecap="round" fill="none" />
      <Pin x={214} y={94} r={7} />
      <Pin x={256} y={152} r={7} />
      <Pin x={126} y={128} r={10} main />
      <text x={126} y={150} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="11" fill="#54677c">Kigali</text>
    </svg>
  );
}

function ChartArt() {
  const bars = [[40, 138], [86, 150], [132, 116], [178, 96], [224, 68], [270, 50]];
  return (
    <svg viewBox="0 0 330 195" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Live views climbing">
      <defs>
        <linearGradient id="eco-bar" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ff8a3d" /><stop offset="100%" stopColor="#ff6a1a" />
        </linearGradient>
      </defs>
      <line x1="22" y1="170" x2="306" y2="170" stroke="#e4e9ef" strokeWidth="2" />
      {bars.map(([x, top], i) => (
        <rect key={i} x={x} y={top} width="30" height={170 - top} rx="6" fill="url(#eco-bar)" opacity={0.32 + i * 0.13} />
      ))}
      <path className="eco-chart__line" d="M55,128 L101,138 L147,108 L193,88 L239,60 L285,42"
        fill="none" stroke="#0b1b2b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle className="eco-ping" cx="285" cy="42" r="6" fill="none" stroke="#ff6a1a" strokeWidth="2" />
      <circle cx="285" cy="42" r="5" fill="#ff6a1a" stroke="#fff" strokeWidth="2" />
    </svg>
  );
}

function AudienceArt() {
  const dots = [[92, 58, 5, "#1f93e6"], [248, 66, 6, "#ff6a1a"], [70, 138, 6, "#ff8a3d"],
    [262, 150, 5, "#1f93e6"], [152, 36, 4, "#54677c"], [214, 168, 4, "#54677c"],
    [118, 168, 5, "#1f93e6"], [284, 108, 4, "#ff8a3d"]];
  return (
    <svg viewBox="0 0 340 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Audience reach">
      <circle cx="170" cy="100" r="42" fill="none" stroke="#e4e9ef" strokeWidth="2" />
      <circle cx="170" cy="100" r="68" fill="none" stroke="#eef0f3" strokeWidth="2" />
      <circle cx="170" cy="100" r="94" fill="none" stroke="#f4f6f8" strokeWidth="2" />
      {dots.map(([x, y, r, c], i) => (
        <g key={i}>
          <line x1="170" y1="100" x2={x} y2={y} stroke="#edf0f3" strokeWidth="1.5" />
          <circle cx={x} cy={y} r={r} fill={c} />
        </g>
      ))}
      <circle cx="170" cy="100" r="16" fill="#ff6a1a" />
      <circle cx="170" cy="100" r="6.5" fill="#fff" />
    </svg>
  );
}

function DeviceArt() {
  return (
    <svg viewBox="0 0 340 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mobile, desktop and tablet">
      <rect x="58" y="40" width="150" height="100" rx="10" fill="#fff" stroke="#0b1b2b" strokeWidth="2.5" />
      <rect x="70" y="52" width="126" height="66" rx="5" fill="#f5f8fc" />
      <rect x="78" y="60" width="58" height="9" rx="4" fill="#dde3ea" />
      <rect x="78" y="76" width="40" height="9" rx="4" fill="#e7ebf0" />
      <rect x="150" y="60" width="38" height="40" rx="6" fill="#ff8a3d" />
      <path d="M44,148 L222,148 L210,166 L56,166 Z" fill="#eef3f8" stroke="#0b1b2b" strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="238" y="62" width="58" height="118" rx="13" fill="#fff" stroke="#0b1b2b" strokeWidth="2.5" />
      <rect x="246" y="78" width="42" height="78" rx="6" fill="#f5f8fc" />
      <rect x="252" y="86" width="30" height="8" rx="4" fill="#dde3ea" />
      <rect x="252" y="102" width="30" height="30" rx="6" fill="#ff6a1a" />
      <circle cx="267" cy="70" r="2.6" fill="#0b1b2b" />
    </svg>
  );
}

function StyleTag() {
  return (
    <style>{`
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700;12..96,800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;600&display=swap');

.eco-root{
  --white:#fff; --paper:#f5f8fc; --ink:#0b1b2b; --ink-soft:#54677c;
  --orange:#ff6a1a; --orange-deep:#ee5704; --sky:#1f93e6; --line:rgba(11,27,43,.09);
  --shadow:0 24px 60px -28px rgba(11,27,43,.3);
  position:relative; overflow:hidden; background:var(--white); color:var(--ink);
  font-family:'Inter',system-ui,sans-serif; -webkit-font-smoothing:antialiased; line-height:1.5;
}
.eco-root *{box-sizing:border-box;}
.eco-aura{position:absolute; border-radius:50%; filter:blur(90px); opacity:.45; pointer-events:none;}
.eco-aura--a{width:600px;height:600px;top:-220px;right:-160px; background:radial-gradient(circle, rgba(255,106,26,.34), transparent 65%);}
.eco-aura--b{width:660px;height:660px;top:520px;left:-260px; background:radial-gradient(circle, rgba(31,147,230,.28), transparent 65%);}
.eco-root > *{position:relative; z-index:1;}
.eco-root > .eco-aura{position:absolute; z-index:0;}

.eco-wordmark{font-family:'Bricolage Grotesque',sans-serif; font-weight:800; font-size:22px; letter-spacing:-.02em;}
.eco-wordmark--sm{font-size:18px;}
.eco-dot{color:var(--orange);}
.eco-topbar{display:flex; align-items:center; justify-content:space-between; max-width:1200px; margin:0 auto; padding:22px 6vw;}
.eco-topbar__meta{font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:.14em; text-transform:uppercase; color:var(--ink-soft);}

.eco-hero{display:grid; grid-template-columns:1.05fr 1fr; gap:52px; align-items:center; max-width:1200px; margin:0 auto; padding:44px 6vw 90px;}
.eco-eyebrow{display:inline-flex; align-items:center; gap:9px; font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:.12em; text-transform:uppercase; color:var(--orange-deep); background:rgba(255,106,26,.08); border:1px solid rgba(255,106,26,.2); padding:7px 13px; border-radius:999px;}
.eco-pulse{width:7px;height:7px;border-radius:50%;background:var(--orange); animation:eco-pulse 2.4s infinite;}
@keyframes eco-pulse{0%{box-shadow:0 0 0 0 rgba(255,106,26,.5);}70%{box-shadow:0 0 0 9px rgba(255,106,26,0);}100%{box-shadow:0 0 0 0 rgba(255,106,26,0);}}
.eco-h1{font-family:'Bricolage Grotesque',sans-serif; font-weight:700; font-size:clamp(34px,4.6vw,56px); line-height:1.04; letter-spacing:-.03em; margin:20px 0 16px;}
.eco-lede{font-size:clamp(16px,1.2vw,18px); color:var(--ink-soft); max-width:42ch;}
.eco-hero__actions{display:flex; gap:14px; margin-top:28px; flex-wrap:wrap;}
.eco-btn{display:inline-flex; align-items:center; justify-content:center; font-weight:600; font-size:15px; padding:13px 22px; border-radius:999px; text-decoration:none; cursor:pointer; transition:transform .2s ease, box-shadow .25s ease; border:1px solid transparent;}
.eco-btn--solid{background:var(--ink); color:#fff;}
.eco-btn--solid:hover{transform:translateY(-2px); box-shadow:0 16px 30px -16px rgba(11,27,43,.6);}
.eco-btn--ghost{background:transparent; color:var(--ink); border-color:var(--line);}
.eco-btn--ghost:hover{border-color:var(--ink); transform:translateY(-2px);}
.eco-btn--lg{padding:16px 30px; font-size:16px;}

/* analytics panel */
.eco-hero__stage{position:relative;}
.eco-panel{background:#fff; border:1px solid var(--line); border-radius:18px; box-shadow:var(--shadow); padding:22px; animation:eco-bob 7s ease-in-out infinite;}
@keyframes eco-bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
.eco-panel__head{display:flex; align-items:center; justify-content:space-between;}
.eco-panel__title{font-family:'Bricolage Grotesque',sans-serif; font-weight:700; font-size:15px;}
.eco-panel__live{display:inline-flex; align-items:center; gap:6px; font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.08em; text-transform:uppercase; color:var(--orange-deep);}
.eco-panel__live i{width:7px;height:7px;border-radius:50%;background:var(--orange); animation:eco-pulse 2.4s infinite;}
.eco-stat{display:flex; align-items:baseline; gap:12px; margin:18px 0 6px;}
.eco-stat__num{font-family:'Bricolage Grotesque',sans-serif; font-weight:800; font-size:40px; letter-spacing:-.03em;}
.eco-stat__label{font-size:13px; color:var(--ink-soft); display:flex; gap:8px; align-items:center;}
.eco-stat__label b{color:var(--orange-deep); font-family:'JetBrains Mono',monospace; font-size:12px;}
.eco-chart{width:100%; height:62px; display:block; margin-bottom:14px;}
.eco-chart__line{stroke-dasharray:520; stroke-dashoffset:520; animation:eco-draw 1.8s ease forwards .3s;}
@keyframes eco-draw{to{stroke-dashoffset:0;}}
.eco-panel__cols{display:grid; grid-template-columns:1fr 1fr; gap:18px; border-top:1px solid var(--line); padding-top:16px;}
.eco-mini__h{font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-soft); display:block; margin-bottom:10px;}
.eco-bar{display:grid; grid-template-columns:54px 1fr auto; align-items:center; gap:8px; margin-bottom:9px; font-size:12px;}
.eco-bar > span{color:var(--ink-soft);}
.eco-bar i{display:block; height:7px; background:var(--paper); border-radius:4px; overflow:hidden;}
.eco-bar b{display:block; height:100%; background:var(--orange); border-radius:4px;}
.eco-bar b.eco-bar--sky{background:var(--sky);}
.eco-bar em{font-style:normal; color:var(--ink-soft); font-size:11px;}

/* sections */
.eco-section{max-width:1200px; margin:0 auto; padding:80px 6vw;}
.eco-section--soft{background:var(--paper); max-width:none; padding-left:0; padding-right:0;}
.eco-section--soft > *{max-width:1200px; margin:0 auto; padding-left:6vw; padding-right:6vw;}
.eco-kicker{font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:.14em; text-transform:uppercase; color:var(--orange-deep);}
.eco-h2{font-family:'Bricolage Grotesque',sans-serif; font-weight:700; font-size:clamp(28px,3.6vw,44px); letter-spacing:-.025em; line-height:1.06; margin:14px 0 0;}
.eco-sub{color:var(--ink-soft); margin-top:14px; max-width:48ch; font-size:17px;}
.eco-head{margin-bottom:40px;}

.eco-row{display:grid; grid-template-columns:1.1fr .9fr; gap:46px; align-items:center; padding:34px 0; border-top:1px solid var(--line);}
.eco-row--flip .eco-shot{order:2;}
.eco-shot{border-radius:16px; overflow:hidden; background:var(--paper); border:1px solid var(--line); box-shadow:var(--shadow);}
.eco-shot img{display:block; width:100%; height:auto;}
.eco-name{font-family:'Bricolage Grotesque',sans-serif; font-weight:700; font-size:clamp(24px,2.6vw,32px); letter-spacing:-.02em; margin:0 0 10px;}
.eco-desc{color:var(--ink-soft); font-size:16px; max-width:44ch;}
.eco-points{list-style:none; padding:0; margin:18px 0 0; display:flex; flex-direction:column; gap:9px;}
.eco-points li{position:relative; padding-left:22px; font-size:15px; color:var(--ink);}
.eco-points li::before{content:""; position:absolute; left:0; top:8px; width:9px; height:9px; border-radius:50%; background:var(--orange);}
.eco-price{font-family:'Bricolage Grotesque',sans-serif; font-weight:800; font-size:30px; letter-spacing:-.02em; margin-top:22px;}
.eco-price em{font-style:normal; font-family:'Inter',sans-serif; font-size:14px; font-weight:600; color:var(--ink-soft); margin-left:6px;}

.eco-grid{display:grid; grid-template-columns:repeat(4,1fr); gap:22px;}
.eco-feat{background:#fff; border:1px solid var(--line); border-radius:16px; padding:24px; transition:transform .3s ease, box-shadow .3s ease;}
.eco-feat:hover{transform:translateY(-4px); box-shadow:var(--shadow);}
.eco-feat__title{font-family:'Bricolage Grotesque',sans-serif; font-weight:700; font-size:19px; letter-spacing:-.015em; margin:0 0 8px;}
.eco-feat__body{color:var(--ink-soft); font-size:15px;}

/* illustrated analytics layout */
.eco-feature{display:grid; grid-template-columns:1fr 1fr; gap:44px; align-items:center; margin-bottom:48px;}
.eco-feature__art{background:#fff; border:1px solid var(--line); border-radius:18px; box-shadow:var(--shadow); padding:22px;}
.eco-feature__art svg, .eco-card__art svg{width:100%; height:auto; display:block;}
.eco-feature__h{font-family:'Bricolage Grotesque',sans-serif; font-weight:700; font-size:clamp(22px,2.4vw,30px); letter-spacing:-.02em; margin:12px 0 10px;}
.eco-feature__p{color:var(--ink-soft); font-size:16px; max-width:40ch;}
.eco-cards3{display:grid; grid-template-columns:repeat(3,1fr); gap:22px;}
.eco-card{background:#fff; border:1px solid var(--line); border-radius:16px; padding:18px; transition:transform .3s ease, box-shadow .3s ease;}
.eco-card:hover{transform:translateY(-4px); box-shadow:var(--shadow);}
.eco-card__art{background:var(--paper); border:1px solid var(--line); border-radius:12px; padding:14px 14px 8px; margin-bottom:15px;}
.eco-card__title{font-family:'Bricolage Grotesque',sans-serif; font-weight:700; font-size:19px; letter-spacing:-.015em; margin:0 0 6px;}
.eco-card__body{color:var(--ink-soft); font-size:14.5px;}
.eco-ping{transform-box:fill-box; transform-origin:center; animation:eco-ping 2.6s ease-out infinite;}
@keyframes eco-ping{0%{transform:scale(.45); opacity:.85;}80%,100%{transform:scale(1.9); opacity:0;}}

.eco-band{border-left:3px solid var(--orange); padding:6px 0 6px 26px;}
.eco-band__lead{font-family:'Bricolage Grotesque',sans-serif; font-weight:500; font-size:clamp(20px,2.3vw,29px); line-height:1.32; letter-spacing:-.015em; max-width:34ch;}

.eco-close{max-width:840px; margin:0 auto; padding:90px 6vw 70px; text-align:center;}
.eco-close__title{font-family:'Bricolage Grotesque',sans-serif; font-weight:700; font-size:clamp(28px,3.8vw,46px); line-height:1.07; letter-spacing:-.03em;}
.eco-close__sub{color:var(--ink-soft); font-size:18px; max-width:54ch; margin:20px auto 30px;}
.eco-close__note{margin-top:16px; font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:.08em; color:var(--ink-soft);}

.eco-foot{display:flex; align-items:center; justify-content:space-between; max-width:1200px; margin:0 auto; padding:32px 6vw; border-top:1px solid var(--line); gap:16px; flex-wrap:wrap;}
.eco-foot__meta{font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:.08em; color:var(--ink-soft);}

[data-reveal]{opacity:1; transform:none;}
.eco-js [data-reveal]{opacity:0; transform:translateY(24px); transition:opacity .7s ease, transform .7s cubic-bezier(.2,.7,.2,1); transition-delay:var(--d,0ms);}
.eco-js [data-reveal].is-in{opacity:1; transform:none;}

@media (max-width:900px){
  .eco-hero{grid-template-columns:1fr; gap:38px;}
  .eco-grid{grid-template-columns:1fr 1fr;}
  .eco-feature{grid-template-columns:1fr; gap:24px;}
  .eco-cards3{grid-template-columns:1fr;}
  .eco-row{grid-template-columns:1fr; gap:22px;}
  .eco-row--flip .eco-shot{order:0;}
  .eco-lede,.eco-desc,.eco-band__lead,.eco-feature__p{max-width:none;}
}
@media (max-width:560px){ .eco-grid{grid-template-columns:1fr;} }
@media (prefers-reduced-motion:reduce){
  .eco-panel,.eco-pulse,.eco-panel__live i,.eco-ping{animation:none !important;}
  .eco-chart__line{animation:none; stroke-dashoffset:0;}
  [data-reveal]{transition:none; opacity:1; transform:none;}
}
`}</style>
  );
}