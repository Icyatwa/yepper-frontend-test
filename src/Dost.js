import React, { useEffect } from "react";

/**
 * Yepper — Ad spaces & pricing page (single file, drop-in).
 *
 * Prices shown across the three site tiers the chosen publishers fall into:
 *   Standard  (10K–50K visitors/mo)  · 210K total
 *   Premium   (50K–200K visitors/mo) · 575K total
 *   Elite     (200K+ visitors/mo)    · 1.5M total
 *
 * Each space shows a mockup image. Put the images in your project's public
 * folder at /public/yepper-spaces/<key>.png  (or pass a different `imageBase`).
 *
 * Usage:  import YepperAdSpaces from "./YepperAdSpaces";  <YepperAdSpaces />
 */

const fmt = (n) => n.toLocaleString("en-US");

const SPACES = [
  ["header", "Header", "Highest visibility", "Sits at the very top of every page — the first thing every visitor sees.", 30000, 82000, 220000],
  ["above_the_fold", "Above the Fold", "Very high", "High on the page, visible before anyone scrolls.", 26000, 71000, 190000],
  ["sticky_sidebar", "Sticky Sidebar", "High", "Stays beside the content and follows the reader down the page.", 20000, 55000, 148000],
  ["mobile_interstitial", "Mobile Interstitial", "High", "A full-screen moment on mobile, shown between pages.", 20000, 55000, 148000],
  ["overlay", "Overlay", "High", "A large placement that surfaces over the content, then closes.", 18000, 49000, 132000],
  ["floating", "Floating", "Medium-high", "A small card that rests in the corner and follows the reader.", 16000, 44000, 118000],
  ["modal", "Modal", "Medium-high", "Appears once per visit, centred and easy to dismiss.", 14000, 38000, 102000],
  ["left_rail", "Left Rail", "Medium", "A standard placement in the left-hand column.", 12000, 33000, 88000],
  ["right_rail", "Right Rail", "Medium", "A standard placement in the right-hand column.", 12000, 33000, 88000],
  ["sidebar", "Sidebar", "Medium", "A reliable, familiar placement beside the main content.", 10000, 27000, 73000],
  ["in_feed", "In Feed", "Medium", "A native card that blends into the article feed.", 8000, 22000, 59000],
  ["inline_content", "Inline Content", "Medium", "Sits naturally between paragraphs, mid-article.", 8000, 22000, 59000],
  ["beneath_title", "Beneath Title", "Low-medium", "Right under a headline, where attention peaks.", 7000, 19000, 51000],
  ["pro_footer", "Pro Footer", "Low", "A branded placement in the site footer.", 5000, 14000, 37000],
  ["bottom", "Bottom", "Lowest", "A closing banner at the very end of the page.", 4000, 11000, 29000],
];

export default function YepperAdSpaces({ imageBase = "/yepper-spaces" }) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll("[data-reveal]"));
    const reveal = (el) => el.classList.add("is-in");
    document.documentElement.classList.add("yas-js");
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

  return (
    <div className="yas-root">
      <StyleTag />
      <div className="yas-aura yas-aura--a" aria-hidden="true" />
      <div className="yas-aura yas-aura--b" aria-hidden="true" />

      <header className="yas-topbar">
        <div className="yas-wordmark">yepper<span className="yas-dot">.</span></div>
        <div className="yas-topbar__meta">Ad spaces &amp; pricing</div>
      </header>

      <section className="yas-hero" data-reveal>
        <span className="yas-eyebrow"><i className="yas-pulse" /> Ad spaces &amp; pricing</span>
        <h1 className="yas-h1">Every ad space, and what it costs.</h1>
        <p className="yas-lede">
          Fifteen placements, priced by the size of the site they run on. Each
          price below is per advertiser, per month — and a single space can hold
          several advertisers in rotation, so it earns more than one direct deal.
        </p>
      </section>

      {/* tier legend */}
      <section className="yas-tiers" data-reveal>
        {[
          ["Standard", "10K–50K visitors / mo", "up to 210,000 / mo total"],
          ["Premium", "50K–200K visitors / mo", "up to 575,000 / mo total"],
          ["Elite", "200K+ visitors / mo", "up to 1.5M / mo total"],
        ].map(([t, r, tot]) => (
          <div className="yas-tier" key={t}>
            <span className="yas-tier__name">{t}</span>
            <span className="yas-tier__range">{r}</span>
            <span className="yas-tier__total">{tot}</span>
          </div>
        ))}
      </section>

      {/* spaces */}
      <section className="yas-list">
        {SPACES.map(([key, name, vis, desc, std, prem, elite], i) => (
          <article className={`yas-row ${i % 2 ? "yas-row--flip" : ""}`} data-reveal key={key}>
            <div className="yas-shot">
              <img src={`${imageBase}/${key}.png`} alt={`${name} ad placement`} loading="lazy" />
            </div>
            <div className="yas-info">
              <span className="yas-vis">{vis}</span>
              <h3 className="yas-name">{name}</h3>
              <p className="yas-desc">{desc}</p>
              <div className="yas-range">
                {fmt(std)} <span>–</span> {fmt(elite)} <em>RWF / mo</em>
              </div>
              <div className="yas-chips">
                <span className="yas-chip"><b>Standard</b> {fmt(std)}</span>
                <span className="yas-chip"><b>Premium</b> {fmt(prem)}</span>
                <span className="yas-chip yas-chip--elite"><b>Elite</b> {fmt(elite)}</span>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="yas-close" data-reveal>
        <h2 className="yas-close__title">Pick a space. We bring the advertisers.</h2>
        <p className="yas-close__sub">
          Prices scale with verified traffic, so every site pays its fair rate —
          and you only ever pay for the space you choose.
        </p>
        <p className="yas-close__note">Yepper Ltd · Kigali, Rwanda · yepper.cc</p>
      </section>

      <footer className="yas-foot">
        <span className="yas-wordmark yas-wordmark--sm">yepper<span className="yas-dot">.</span></span>
        <span className="yas-foot__meta">All prices in RWF, VAT exclusive · per advertiser / month</span>
      </footer>
    </div>
  );
}

function StyleTag() {
  return (
    <style>{`
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700;12..96,800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;600&display=swap');

.yas-root{
  --white:#fff; --paper:#f5f8fc; --ink:#0b1b2b; --ink-soft:#54677c;
  --orange:#ff6a1a; --orange-deep:#ee5704; --sky:#1f93e6; --line:rgba(11,27,43,.09);
  --shadow:0 24px 60px -28px rgba(11,27,43,.3);
  position:relative; overflow:hidden; background:var(--white); color:var(--ink);
  font-family:'Inter',system-ui,sans-serif; -webkit-font-smoothing:antialiased; line-height:1.5;
}
.yas-root *{box-sizing:border-box;}
.yas-aura{position:absolute; border-radius:50%; filter:blur(90px); opacity:.45; pointer-events:none;}
.yas-aura--a{width:600px;height:600px;top:-220px;right:-160px;
  background:radial-gradient(circle, rgba(255,106,26,.34), transparent 65%);}
.yas-aura--b{width:660px;height:660px;top:560px;left:-260px;
  background:radial-gradient(circle, rgba(31,147,230,.28), transparent 65%);}
.yas-root > *{position:relative; z-index:1;}
.yas-root > .yas-aura{position:absolute; z-index:0;}

.yas-wordmark{font-family:'Bricolage Grotesque',sans-serif; font-weight:800; font-size:22px; letter-spacing:-.02em;}
.yas-wordmark--sm{font-size:18px;}
.yas-dot{color:var(--orange);}
.yas-topbar{display:flex; align-items:center; justify-content:space-between; max-width:1200px; margin:0 auto; padding:22px 6vw;}
.yas-topbar__meta{font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:.14em; text-transform:uppercase; color:var(--ink-soft);}

.yas-hero{max-width:1200px; margin:0 auto; padding:40px 6vw 30px;}
.yas-eyebrow{display:inline-flex; align-items:center; gap:9px; font-family:'JetBrains Mono',monospace;
  font-size:12px; letter-spacing:.12em; text-transform:uppercase; color:var(--orange-deep);
  background:rgba(255,106,26,.08); border:1px solid rgba(255,106,26,.2); padding:7px 13px; border-radius:999px;}
.yas-pulse{width:7px;height:7px;border-radius:50%;background:var(--orange); animation:yas-pulse 2.4s infinite;}
@keyframes yas-pulse{0%{box-shadow:0 0 0 0 rgba(255,106,26,.5);}70%{box-shadow:0 0 0 9px rgba(255,106,26,0);}100%{box-shadow:0 0 0 0 rgba(255,106,26,0);}}
.yas-h1{font-family:'Bricolage Grotesque',sans-serif; font-weight:700; font-size:clamp(34px,5vw,60px);
  line-height:1.03; letter-spacing:-.03em; margin:20px 0 16px;}
.yas-lede{font-size:clamp(16px,1.2vw,18px); color:var(--ink-soft); max-width:60ch;}

.yas-tiers{display:grid; grid-template-columns:repeat(3,1fr); gap:16px; max-width:1200px;
  margin:0 auto 40px; padding:14px 6vw 0;}
.yas-tier{background:var(--paper); border:1px solid var(--line); border-radius:14px; padding:18px 20px;
  display:flex; flex-direction:column; gap:4px;}
.yas-tier__name{font-family:'Bricolage Grotesque',sans-serif; font-weight:700; font-size:18px;}
.yas-tier__range{font-size:14px; color:var(--ink-soft);}
.yas-tier__total{font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--orange-deep); margin-top:2px;}

.yas-list{max-width:1200px; margin:0 auto; padding:10px 6vw;}
.yas-row{display:grid; grid-template-columns:1.1fr .9fr; gap:46px; align-items:center;
  padding:46px 0; border-top:1px solid var(--line);}
.yas-row--flip .yas-shot{order:2;}
.yas-shot{border-radius:16px; overflow:hidden; background:var(--paper); border:1px solid var(--line);
  box-shadow:var(--shadow);}
.yas-shot img{display:block; width:100%; height:auto;}
.yas-vis{font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:var(--sky);}
.yas-name{font-family:'Bricolage Grotesque',sans-serif; font-weight:700; font-size:clamp(24px,2.6vw,32px);
  letter-spacing:-.02em; margin:10px 0 8px;}
.yas-desc{color:var(--ink-soft); font-size:16px; max-width:42ch;}
.yas-range{font-family:'Bricolage Grotesque',sans-serif; font-weight:700; font-size:26px; letter-spacing:-.02em;
  margin:18px 0 12px; display:flex; align-items:baseline; gap:8px;}
.yas-range span{color:var(--ink-soft); font-weight:500;}
.yas-range em{font-style:normal; font-family:'Inter',sans-serif; font-size:13px; font-weight:600; color:var(--ink-soft); letter-spacing:0;}
.yas-chips{display:flex; flex-wrap:wrap; gap:8px;}
.yas-chip{font-size:13px; color:var(--ink-soft); background:var(--paper); border:1px solid var(--line);
  padding:6px 12px; border-radius:999px;}
.yas-chip b{color:var(--ink); font-weight:600; margin-right:4px;}
.yas-chip--elite{background:rgba(255,106,26,.08); border-color:rgba(255,106,26,.25);}
.yas-chip--elite b{color:var(--orange-deep);}

.yas-close{max-width:840px; margin:0 auto; padding:90px 6vw 70px; text-align:center;}
.yas-close__title{font-family:'Bricolage Grotesque',sans-serif; font-weight:700; font-size:clamp(28px,3.8vw,46px);
  line-height:1.07; letter-spacing:-.03em;}
.yas-close__sub{color:var(--ink-soft); font-size:18px; max-width:52ch; margin:20px auto 14px;}
.yas-close__note{font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:.08em; color:var(--ink-soft);}

.yas-foot{display:flex; align-items:center; justify-content:space-between; max-width:1200px; margin:0 auto;
  padding:32px 6vw; border-top:1px solid var(--line); gap:16px; flex-wrap:wrap;}
.yas-foot__meta{font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:.08em; color:var(--ink-soft);}

[data-reveal]{opacity:1; transform:none;}
.yas-js [data-reveal]{opacity:0; transform:translateY(24px);
  transition:opacity .7s ease, transform .7s cubic-bezier(.2,.7,.2,1);}
.yas-js [data-reveal].is-in{opacity:1; transform:none;}

@media (max-width:860px){
  .yas-tiers{grid-template-columns:1fr;}
  .yas-row{grid-template-columns:1fr; gap:22px; padding:34px 0;}
  .yas-row--flip .yas-shot{order:0;}
  .yas-desc{max-width:none;}
}
@media (prefers-reduced-motion:reduce){
  .yas-pulse{animation:none;}
  [data-reveal]{transition:none; opacity:1; transform:none;}
}
`}</style>
  );
}