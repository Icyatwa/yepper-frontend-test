import React, { useEffect, useState } from "react";

/**
 * Yepper × KT Press/Kigali Today — proposal page (single file, drop-in).
 *
 * - No external UI libraries. Styles are injected once via <style>.
 * - All class names are prefixed `ypr-` to avoid collisions with your project.
 * - Fonts load from Google Fonts via @import.
 * - The hero shows a LIVE KT Press/Kigali Today-style mockup; viewers can preview the
 *   Floating and Modal placements by tapping the toggle. The floating ad
 *   slides in on a gentle loop, exactly like the recording.
 * - Respects prefers-reduced-motion. Responsive down to mobile.
 *
 * Usage:  import YepperProposal from "./YepperProposal";  then render <YepperProposal />
 */

export default function YepperProposal() {
  const [placement, setPlacement] = useState("floating"); // "floating" | "modal"

  // Scroll-reveal. Anything already on screen reveals immediately; the rest
  // reveal as they scroll into view. A timeout guarantees nothing ever stays
  // stuck invisible, so content is never trapped above/below the fold.
  useEffect(() => {
    const els = Array.from(document.querySelectorAll("[data-reveal]"));
    const reveal = (el) => el.classList.add("is-in");

    // turn on the JS-gated hidden state only now that JS can also reveal it
    document.documentElement.classList.add("ypr-js");

    if (!("IntersectionObserver" in window)) {
      els.forEach(reveal);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            reveal(e.target);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    const vh = window.innerHeight || 800;
    els.forEach((el) => {
      // already visible (or just below the fold) → show right away, no wait
      if (el.getBoundingClientRect().top < vh * 0.95) reveal(el);
      else io.observe(el);
    });

    const safety = setTimeout(() => els.forEach(reveal), 1600);
    return () => {
      io.disconnect();
      clearTimeout(safety);
    };
  }, []);

  return (
    <div className="ypr-root">
      <StyleTag />

      {/* ambient backdrop */}
      <div className="ypr-aura ypr-aura--a" aria-hidden="true" />
      <div className="ypr-aura ypr-aura--b" aria-hidden="true" />

      {/* ── top bar ─────────────────────────────────────────────── */}
      <header className="ypr-topbar">
        <div className="ypr-wordmark">
          yepper<span className="ypr-dot">.</span>
        </div>
        <div className="ypr-topbar__meta">Prepared for KT Press/Kigali Today</div>
      </header>

      {/* ── hero ────────────────────────────────────────────────── */}
      <section className="ypr-hero">
        <div className="ypr-hero__copy" data-reveal>
          <span className="ypr-eyebrow">
            <i className="ypr-pulse" /> A proposal for KT Press/Kigali Today
          </span>
          <h1 className="ypr-h1">
            The ad space KT Press/Kigali Today
            <br />
            isn&rsquo;t selling&nbsp;yet.
          </h1>
          <p className="ypr-lede">
            Yepper adds a floating and a modal placement to your site, brings the
            advertisers, and runs everything end&#8209;to&#8209;end. Your current
            ad sales stay exactly as they are — this is revenue from inventory
            that doesn&rsquo;t exist on Kigali Today.
          </p>
          <div className="ypr-hero__actions">
            <a className="ypr-btn ypr-btn--solid" href="#proposal">
              See how it works
            </a>
            <a className="ypr-btn ypr-btn--ghost" href="#who">
              Who is Yepper
            </a>
          </div>
        </div>

        {/* live mockup */}
        <div className="ypr-hero__stage" data-reveal>
          <KTPressMock placement={placement} />
          <div className="ypr-toggle" role="tablist" aria-label="Preview placement">
            <button
              role="tab"
              aria-selected={placement === "floating"}
              className={`ypr-toggle__btn ${placement === "floating" ? "is-on" : ""}`}
              onClick={() => setPlacement("floating")}
            >
              Floating ad
            </button>
            <button
              role="tab"
              aria-selected={placement === "modal"}
              className={`ypr-toggle__btn ${placement === "modal" ? "is-on" : ""}`}
              onClick={() => setPlacement("modal")}
            >
              Modal ad
            </button>
          </div>
          <p className="ypr-stage__caption">Live preview — tap to switch placement</p>
        </div>
      </section>

      {/* ── who we are ──────────────────────────────────────────── */}
      <section className="ypr-section" id="who">
        <div className="ypr-band" data-reveal>
          <span className="ypr-kicker">Who we are</span>
          <p className="ypr-band__lead">
            Yepper is a Rwandan advertising platform. We connect local brands to
            the sites and creators their audiences already trust — and handle the
            contracts, the placement, and the payments, so publishers never have
            to chase a single advertiser.
          </p>
        </div>
      </section>

      {/* ── the proposal ────────────────────────────────────────── */}
      <section className="ypr-section ypr-section--soft" id="proposal">
        <div className="ypr-head" data-reveal>
          <span className="ypr-kicker">What we&rsquo;re proposing</span>
          <h2 className="ypr-h2">Two placements you don&rsquo;t run today</h2>
          <p className="ypr-sub">
            Both are built and managed by Yepper. Both sit alongside your existing
            banners without touching them.
          </p>
        </div>

        <div className="ypr-cards">
          <article className="ypr-card" data-reveal>
            <span className="ypr-card__no">Placement 01</span>
            <h3 className="ypr-card__title">The floating ad</h3>
            <p className="ypr-card__body">
              A small card that rests in the corner and follows the reader as they
              scroll. It never blocks an article and can be dismissed in one tap —
              present, but never in the way.
            </p>
            <Hairline />
            <span className="ypr-card__tag">Recommended first step</span>
          </article>

          <article className="ypr-card" data-reveal>
            <span className="ypr-card__no">Placement 02</span>
            <h3 className="ypr-card__title">The modal ad</h3>
            <p className="ypr-card__body">
              A centred placement that appears once, briefly, then closes itself.
              Reserved for premium campaigns, introduced only after the floating
              ad has proven it leaves your reader experience untouched.
            </p>
            <Hairline />
            <span className="ypr-card__tag">Phase two</span>
          </article>
        </div>
      </section>

      {/* ── why it works for Kigali Today ──────────────────────────────── */}
      <section className="ypr-section" id="benefits">
        <div className="ypr-head" data-reveal>
          <span className="ypr-kicker">Why it works for Kigali Today</span>
          <h2 className="ypr-h2">New revenue, none of the friction</h2>
        </div>

        <div className="ypr-benefits">
          {BENEFITS.map((b, i) => (
            <div className="ypr-benefit" data-reveal key={b.title} style={{ "--d": `${i * 90}ms` }}>
              <div className="ypr-benefit__mark" aria-hidden="true">
                {b.mark}
              </div>
              <h4 className="ypr-benefit__title">{b.title}</h4>
              <p className="ypr-benefit__body">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── closing ─────────────────────────────────────────────── */}
      <section className="ypr-close" data-reveal>
        <h2 className="ypr-close__title">
          We bring the advertisers.
          <br />
          You keep doing what you do best.
        </h2>
        <p className="ypr-close__sub">
          A short pilot, one placement, removable any time. If your readers
          don&rsquo;t notice the difference, we keep going — and the space earns
          more with every advertiser we add.
        </p>
      </section>

      <footer className="ypr-foot">
        <span className="ypr-wordmark ypr-wordmark--sm">
          yepper<span className="ypr-dot">.</span>
        </span>
        <span className="ypr-foot__meta">Yepper Ltd · Kigali, Rwanda</span>
      </footer>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   KT Press/Kigali Today-style mockup with live floating / modal ad
   ──────────────────────────────────────────────────────────────── */
function KTPressMock({ placement }) {
  return (
    <div className="ypr-browser">
      <div className="ypr-browser__bar">
        <span className="ypr-dotbtn" />
        <span className="ypr-dotbtn" />
        <span className="ypr-dotbtn" />
        <div className="ypr-browser__url">KT Press/Kigali Today</div>
      </div>

      <div className="ypr-site">
        {/* red header */}
        <div className="ypr-site__header">
          <div className="ypr-site__logo">KT Press</div>
          <div className="ypr-site__nav">
            {Array.from({ length: 7 }).map((_, i) => (
              <span key={i} style={{ width: 22 + ((i * 7) % 18) }} />
            ))}
          </div>
        </div>
        {/* breaking strip */}
        <div className="ypr-site__strip">
          <em>AMAKURU</em>
          <span className="ypr-tick">
            <span />
            <span />
            <span />
          </span>
        </div>

        {/* body grid */}
        <div className="ypr-site__grid">
          {/* left rail */}
          <div className="ypr-col ypr-col--left">
            {Array.from({ length: 4 }).map((_, i) => (
              <div className="ypr-mini" key={i}>
                <div className="ypr-thumb" />
                <div className="ypr-lines">
                  <b />
                  <b />
                </div>
              </div>
            ))}
          </div>

          {/* center */}
          <div className="ypr-col ypr-col--mid">
            <div className="ypr-feature" />
            <div className="ypr-feature__title">
              <b />
              <b />
            </div>
            <div className="ypr-tiles">
              {Array.from({ length: 4 }).map((_, i) => (
                <div className="ypr-tile" key={i}>
                  <div className="ypr-tile__img" />
                  <span />
                  <span />
                </div>
              ))}
            </div>
          </div>

          {/* right rail */}
          <div className="ypr-col ypr-col--right">
            <div className="ypr-most">IBISOMWA CYANE</div>
            {Array.from({ length: 4 }).map((_, i) => (
              <div className="ypr-rank" key={i}>
                <i>{i + 1}</i>
                <div className="ypr-lines">
                  <b />
                  <b />
                </div>
              </div>
            ))}
            <div className="ypr-block" />
          </div>
        </div>

        {/* floating ad */}
        <div className={`ypr-float ${placement === "floating" ? "is-live" : "is-idle"}`}>
          <span className="ypr-float__chip">Ad</span>
          <span className="ypr-float__x" aria-hidden="true">×</span>
          <div className="ypr-float__art">
            <span className="ypr-float__brand">your brand here</span>
          </div>
        </div>

        {/* modal ad */}
        <div className={`ypr-modalwrap ${placement === "modal" ? "is-live" : ""}`}>
          <div className="ypr-modal">
            <span className="ypr-float__chip">Ad</span>
            <span className="ypr-float__x" aria-hidden="true">×</span>
            <div className="ypr-modal__art">
              <span className="ypr-float__brand">your brand here</span>
            </div>
            <div className="ypr-modal__timer">
              <i />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hairline() {
  return <span className="ypr-hairline" aria-hidden="true" />;
}

/* simple, non-decorative marks (thin strokes, no emoji) */
const BENEFITS = [
  {
    mark: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 3v18M3 12h18" strokeLinecap="round" />
      </svg>
    ),
    title: "Net&#8209;new inventory",
    body:
      "The floating and modal formats need custom development most sites never build. Yepper ships them as a single script — a space you simply don't have today.",
  },
  {
    mark: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M5 12l4 4 10-10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Nothing changes for your team",
    body:
      "No selling, no booking, no invoicing on your side. Your existing banner sales continue untouched while Yepper handles every advertiser end to end.",
  },
  {
    mark: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M4 19V9M10 19V5M16 19v-6M22 19H2" strokeLinecap="round" />
      </svg>
    ),
    title: "Revenue that compounds",
    body:
      "Each space rotates several advertisers over time. As we add more, the same placement earns more — without KT Press/Kigali Today lifting a finger.",
  },
];

/* fix HTML entities used in BENEFITS titles */
BENEFITS.forEach((b) => {
  b.title = b.title.replace(/&#8209;/g, "\u2011");
});

/* ────────────────────────────────────────────────────────────────
   Styles
   ──────────────────────────────────────────────────────────────── */
function StyleTag() {
  return (
    <style>{`
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700;12..96,800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;600&display=swap');

.ypr-root{
  --white:#ffffff;
  --paper:#f5f8fc;
  --ink:#0b1b2b;
  --ink-soft:#54677c;
  --orange:#ff6a1a;
  --orange-deep:#ee5704;
  --sky:#1f93e6;
  --sky-soft:#e9f4fe;
  --line:rgba(11,27,43,.09);
  --igihe:#e2122b;
  --shadow:0 24px 60px -28px rgba(11,27,43,.32);
  position:relative; overflow:hidden;
  background:var(--white); color:var(--ink);
  font-family:'Inter',system-ui,sans-serif;
  -webkit-font-smoothing:antialiased;
  line-height:1.5;
}
.ypr-root *{box-sizing:border-box;}

/* ambient glow */
.ypr-aura{position:absolute; z-index:0; border-radius:50%; filter:blur(90px); opacity:.5; pointer-events:none;}
.ypr-aura--a{width:620px;height:620px; top:-220px; right:-160px;
  background:radial-gradient(circle, rgba(255,106,26,.34), transparent 65%);}
.ypr-aura--b{width:680px;height:680px; top:380px; left:-260px;
  background:radial-gradient(circle, rgba(31,147,230,.30), transparent 65%);}

.ypr-root > *{position:relative; z-index:1;}
/* keep the ambient glows out of the layout (higher specificity than the rule
   above, so they stay absolutely positioned behind the content) */
.ypr-root > .ypr-aura{position:absolute; z-index:0;}

/* wordmark */
.ypr-wordmark{font-family:'Bricolage Grotesque',sans-serif; font-weight:800;
  font-size:22px; letter-spacing:-.02em;}
.ypr-wordmark--sm{font-size:18px;}
.ypr-dot{color:var(--orange);}

/* topbar */
.ypr-topbar{display:flex; align-items:center; justify-content:space-between;
  padding:22px 6vw; max-width:1240px; margin:0 auto;}
.ypr-topbar__meta{font-family:'JetBrains Mono',monospace; font-size:11px;
  letter-spacing:.14em; text-transform:uppercase; color:var(--ink-soft);}

/* hero */
.ypr-hero{display:grid; grid-template-columns:1.02fr 1.18fr; gap:54px;
  align-items:center; max-width:1240px; margin:0 auto; padding:48px 6vw 96px;}
.ypr-eyebrow{display:inline-flex; align-items:center; gap:9px;
  font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:.12em;
  text-transform:uppercase; color:var(--orange-deep);
  background:rgba(255,106,26,.08); border:1px solid rgba(255,106,26,.2);
  padding:7px 13px; border-radius:999px;}
.ypr-pulse{width:7px;height:7px;border-radius:50%;background:var(--orange);
  box-shadow:0 0 0 0 rgba(255,106,26,.55); animation:ypr-pulse 2.4s infinite;}
@keyframes ypr-pulse{0%{box-shadow:0 0 0 0 rgba(255,106,26,.5);}
  70%{box-shadow:0 0 0 9px rgba(255,106,26,0);} 100%{box-shadow:0 0 0 0 rgba(255,106,26,0);}}

.ypr-h1{font-family:'Bricolage Grotesque',sans-serif; font-weight:700;
  font-size:clamp(38px,5.4vw,68px); line-height:1.02; letter-spacing:-.03em;
  margin:22px 0 18px;}
.ypr-lede{font-size:clamp(16px,1.25vw,18px); color:var(--ink-soft);
  max-width:34ch;}
.ypr-hero__actions{display:flex; gap:14px; margin-top:30px; flex-wrap:wrap;}

/* buttons */
.ypr-btn{display:inline-flex; align-items:center; justify-content:center;
  font-weight:600; font-size:15px; padding:13px 22px; border-radius:999px;
  text-decoration:none; transition:transform .2s ease, box-shadow .25s ease, background .2s ease;
  border:1px solid transparent; cursor:pointer;}
.ypr-btn--solid{background:var(--ink); color:#fff;}
.ypr-btn--solid:hover{transform:translateY(-2px);
  box-shadow:0 16px 30px -16px rgba(11,27,43,.6);}
.ypr-btn--ghost{background:transparent; color:var(--ink); border-color:var(--line);}
.ypr-btn--ghost:hover{border-color:var(--ink); transform:translateY(-2px);}
.ypr-btn--lg{padding:16px 30px; font-size:16px;}

/* ── stage / browser ── */
.ypr-hero__stage{position:relative;}
.ypr-browser{position:relative; border-radius:18px; overflow:hidden;
  background:#fff; border:1px solid var(--line); box-shadow:var(--shadow);
  animation:ypr-bob 7s ease-in-out infinite;}
@keyframes ypr-bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
.ypr-browser__bar{display:flex; align-items:center; gap:7px;
  padding:11px 14px; background:#f3f5f8; border-bottom:1px solid var(--line);}
.ypr-dotbtn{width:10px;height:10px;border-radius:50%;background:#d4dae1;}
.ypr-dotbtn:nth-child(1){background:#ff5f57;}
.ypr-dotbtn:nth-child(2){background:#febc2e;}
.ypr-dotbtn:nth-child(3){background:#28c840;}
.ypr-browser__url{margin-left:10px; flex:1; height:22px; border-radius:6px;
  background:#fff; border:1px solid var(--line); font-size:11px; color:var(--ink-soft);
  display:flex; align-items:center; padding:0 12px;}

.ypr-site{position:relative; background:#fff; height:430px; overflow:hidden;}
.ypr-site__header{display:flex; align-items:center; gap:18px;
  background:var(--igihe); padding:10px 16px;}
.ypr-site__logo{color:#fff; font-family:'Bricolage Grotesque',sans-serif;
  font-weight:800; font-size:18px; letter-spacing:.02em;}
.ypr-site__nav{display:flex; gap:11px;}
.ypr-site__nav span{height:7px; border-radius:4px; background:rgba(255,255,255,.55);}
.ypr-site__strip{display:flex; align-items:center; gap:10px;
  background:var(--sky); padding:6px 16px;}
.ypr-site__strip em{font-style:normal; font-family:'JetBrains Mono',monospace;
  font-size:9px; letter-spacing:.1em; color:#fff; background:rgba(0,0,0,.18);
  padding:2px 7px; border-radius:3px;}
.ypr-tick{display:flex; gap:14px; flex:1;}
.ypr-tick span{height:6px; border-radius:3px; background:rgba(255,255,255,.6); flex:1;}

.ypr-site__grid{display:grid; grid-template-columns:.8fr 1.6fr .9fr; gap:12px;
  padding:14px 16px;}
.ypr-col{display:flex; flex-direction:column; gap:10px;}
.ypr-mini{display:flex; gap:8px; align-items:center;}
.ypr-thumb{width:34px;height:26px;border-radius:4px;background:#fbdfe3; flex:none;}
.ypr-lines{display:flex; flex-direction:column; gap:4px; flex:1;}
.ypr-lines b{height:5px; border-radius:3px; background:#e7ebf0; display:block;}
.ypr-lines b:last-child{width:62%;}
.ypr-feature{height:96px; border-radius:7px; background:#fbdfe3;}
.ypr-feature__title{display:flex; flex-direction:column; gap:5px; margin-top:8px;}
.ypr-feature__title b{height:8px;border-radius:4px;background:#dfe4ea;}
.ypr-feature__title b:last-child{width:55%;}
.ypr-tiles{display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:6px;}
.ypr-tile{display:flex; flex-direction:column; gap:5px;}
.ypr-tile__img{height:46px; border-radius:6px; background:#fbdfe3;}
.ypr-tile span{height:5px;border-radius:3px;background:#e7ebf0;}
.ypr-tile span:last-child{width:60%;}
.ypr-most{font-family:'JetBrains Mono',monospace; font-size:8px;
  letter-spacing:.08em; color:#fff; background:var(--ink); padding:5px 8px;
  border-radius:4px;}
.ypr-rank{display:flex; gap:8px; align-items:center;}
.ypr-rank i{font-style:normal; font-family:'Bricolage Grotesque',sans-serif;
  font-weight:800; color:var(--sky); font-size:15px; width:14px;}
.ypr-block{height:74px; border-radius:7px; background:#eef2f6; margin-top:4px;}

/* floating ad */
.ypr-float{position:absolute; right:14px; bottom:14px; width:148px;
  background:linear-gradient(150deg,var(--orange),var(--orange-deep));
  border-radius:14px; padding:11px; box-shadow:0 16px 30px -12px rgba(238,87,4,.6);
  color:#fff;}
.ypr-float.is-idle{opacity:0; transform:translateY(150%); pointer-events:none;}
.ypr-float.is-live{animation:ypr-floatcycle 6.4s ease-in-out infinite;}
@keyframes ypr-floatcycle{
  0%{opacity:0; transform:translateY(160%) scale(.96);}
  9%{opacity:1; transform:translateY(-6px) scale(1.01);}
  14%{transform:translateY(0) scale(1);}
  84%{opacity:1; transform:translateY(0) scale(1);}
  93%{opacity:0; transform:translateY(160%) scale(.97);}
  100%{opacity:0; transform:translateY(160%) scale(.97);}
}
.ypr-float__chip{font-family:'JetBrains Mono',monospace; font-size:8px;
  letter-spacing:.1em; text-transform:uppercase; background:rgba(255,255,255,.22);
  padding:2px 7px; border-radius:4px;}
.ypr-float__x{position:absolute; top:8px; right:10px; font-size:14px;
  opacity:.85; line-height:1;}
.ypr-float__art{height:74px; margin-top:9px; border-radius:9px;
  background:rgba(255,255,255,.16);
  border:1px dashed rgba(255,255,255,.45);
  display:flex; align-items:center; justify-content:center;}
.ypr-float__brand{font-family:'JetBrains Mono',monospace; font-size:9px;
  letter-spacing:.06em; color:rgba(255,255,255,.92);}

/* modal ad */
.ypr-modalwrap{position:absolute; inset:0; display:flex; align-items:center;
  justify-content:center; background:rgba(11,27,43,.42);
  backdrop-filter:blur(2px); opacity:0; pointer-events:none; transition:opacity .4s ease;}
.ypr-modalwrap.is-live{opacity:1;}
.ypr-modal{position:relative; width:236px;
  background:linear-gradient(150deg,var(--sky),#1573c2); border-radius:16px;
  padding:14px; color:#fff; box-shadow:0 26px 50px -18px rgba(0,0,0,.5);
  transform:scale(.9); opacity:0;}
.ypr-modalwrap.is-live .ypr-modal{animation:ypr-modalin .5s cubic-bezier(.2,.9,.3,1.2) forwards;}
@keyframes ypr-modalin{to{transform:scale(1); opacity:1;}}
.ypr-modal__art{height:120px; margin-top:10px; border-radius:11px;
  background:rgba(255,255,255,.16); border:1px dashed rgba(255,255,255,.45);
  display:flex; align-items:center; justify-content:center;}
.ypr-modal__timer{height:4px; border-radius:3px; background:rgba(255,255,255,.25);
  margin-top:11px; overflow:hidden;}
.ypr-modal__timer i{display:block; height:100%; width:100%;
  background:#fff; transform-origin:left;}
.ypr-modalwrap.is-live .ypr-modal__timer i{animation:ypr-timer 5s linear forwards;}
@keyframes ypr-timer{from{transform:scaleX(1);}to{transform:scaleX(0);}}

/* toggle */
.ypr-toggle{display:inline-flex; gap:4px; margin:22px auto 0; padding:4px;
  background:#eef2f6; border-radius:999px; position:relative; left:50%;
  transform:translateX(-50%);}
.ypr-toggle__btn{border:none; background:transparent; cursor:pointer;
  font-family:'Inter',sans-serif; font-weight:600; font-size:13px; color:var(--ink-soft);
  padding:8px 18px; border-radius:999px; transition:all .22s ease;}
.ypr-toggle__btn.is-on{background:#fff; color:var(--ink);
  box-shadow:0 4px 10px -4px rgba(11,27,43,.25);}
.ypr-stage__caption{text-align:center; margin-top:10px;
  font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:.06em;
  color:var(--ink-soft);}

/* sections */
.ypr-section{max-width:1240px; margin:0 auto; padding:90px 6vw;}
.ypr-section--soft{background:var(--paper); max-width:none; padding-left:0; padding-right:0;}
.ypr-section--soft > *{max-width:1240px; margin-left:auto; margin-right:auto;
  padding-left:6vw; padding-right:6vw;}
.ypr-kicker{font-family:'JetBrains Mono',monospace; font-size:12px;
  letter-spacing:.14em; text-transform:uppercase; color:var(--orange-deep);}
.ypr-h2{font-family:'Bricolage Grotesque',sans-serif; font-weight:700;
  font-size:clamp(28px,3.6vw,44px); letter-spacing:-.025em; line-height:1.06;
  margin:14px 0 0;}
.ypr-sub{color:var(--ink-soft); margin-top:14px; max-width:48ch; font-size:17px;}
.ypr-head{margin-bottom:44px;}

/* who band */
.ypr-band{border-left:3px solid var(--orange); padding:6px 0 6px 26px;}
.ypr-band__lead{font-family:'Bricolage Grotesque',sans-serif; font-weight:500;
  font-size:clamp(20px,2.4vw,30px); line-height:1.32; letter-spacing:-.015em;
  margin-top:16px; max-width:30ch;}

/* proposal cards */
.ypr-cards{display:grid; grid-template-columns:1fr 1fr; gap:22px;}
.ypr-card{background:#fff; border:1px solid var(--line); border-radius:18px;
  padding:30px; transition:transform .3s ease, box-shadow .3s ease;}
.ypr-card:hover{transform:translateY(-4px); box-shadow:var(--shadow);}
.ypr-card__no{font-family:'JetBrains Mono',monospace; font-size:11px;
  letter-spacing:.14em; text-transform:uppercase; color:var(--sky);}
.ypr-card__title{font-family:'Bricolage Grotesque',sans-serif; font-weight:700;
  font-size:24px; letter-spacing:-.02em; margin:12px 0 10px;}
.ypr-card__body{color:var(--ink-soft); font-size:16px;}
.ypr-hairline{display:block; height:1px; margin:22px 0 14px;
  background:linear-gradient(90deg,var(--line),transparent);}
.ypr-card__tag{font-family:'JetBrains Mono',monospace; font-size:11px;
  letter-spacing:.08em; color:var(--orange-deep);}

/* benefits */
.ypr-benefits{display:grid; grid-template-columns:repeat(3,1fr); gap:30px;}
.ypr-benefit__mark{width:46px;height:46px;border-radius:13px;
  display:flex; align-items:center; justify-content:center; color:var(--orange-deep);
  background:rgba(255,106,26,.09); border:1px solid rgba(255,106,26,.18);}
.ypr-benefit__title{font-family:'Bricolage Grotesque',sans-serif; font-weight:700;
  font-size:19px; letter-spacing:-.015em; margin:18px 0 8px;}
.ypr-benefit__body{color:var(--ink-soft); font-size:15.5px;}

/* close */
.ypr-close{max-width:1000px; margin:0 auto; padding:110px 6vw 90px; text-align:center;}
.ypr-close__title{font-family:'Bricolage Grotesque',sans-serif; font-weight:700;
  font-size:clamp(30px,4.2vw,52px); line-height:1.08; letter-spacing:-.03em;}
.ypr-close__sub{color:var(--ink-soft); font-size:18px; max-width:52ch;
  margin:22px auto 34px;}

/* footer */
.ypr-foot{display:flex; align-items:center; justify-content:space-between;
  max-width:1240px; margin:0 auto; padding:34px 6vw; border-top:1px solid var(--line);}
.ypr-foot__meta{font-family:'JetBrains Mono',monospace; font-size:11px;
  letter-spacing:.1em; color:var(--ink-soft);}

/* reveal — hidden state only applies once JS is active (.ypr-js on <html>),
   so content is always visible if the observer never runs */
[data-reveal]{opacity:1; transform:none;}
.ypr-js [data-reveal]{opacity:0; transform:translateY(26px);
  transition:opacity .7s ease, transform .7s cubic-bezier(.2,.7,.2,1);
  transition-delay:var(--d,0ms);}
.ypr-js [data-reveal].is-in{opacity:1; transform:none;}

/* responsive */
@media (max-width:900px){
  .ypr-hero{grid-template-columns:1fr; gap:40px; padding-bottom:64px;}
  .ypr-cards{grid-template-columns:1fr;}
  .ypr-benefits{grid-template-columns:1fr;}
  .ypr-lede{max-width:none;}
  .ypr-band__lead{max-width:none;}
}
@media (max-width:520px){
  .ypr-site{height:380px;}
  .ypr-h1{font-size:36px;}
}

/* reduced motion */
@media (prefers-reduced-motion:reduce){
  .ypr-browser, .ypr-pulse{animation:none !important;}
  .ypr-float.is-live{animation:none; opacity:1; transform:none;}
  .ypr-modalwrap.is-live .ypr-modal{animation:none; transform:none; opacity:1;}
  .ypr-modalwrap.is-live .ypr-modal__timer i{animation:none;}
  [data-reveal]{transition:none; opacity:1; transform:none;}
}
`}</style>
  );
}