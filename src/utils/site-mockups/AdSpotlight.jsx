import React from "react";

/**
 * Yepper — Ad spaces on real Rwandan sites.
 * Three big site mockups (Igihe / New Times / Agasobanuye) built to feel like
 * the real sites, each with the ad slot(s) rendered on the page and priced.
 * Self-contained. Copy-paste friendly for a proposal / demo page.
 */

export default function AdSpotlight() {
  return (
    <div className="as-root">
      <AsStyle />
      <div className="as-aura as-aura--a" aria-hidden="true" />
      <div className="as-aura as-aura--b" aria-hidden="true" />

      <header className="as-topbar">
        <div className="as-wordmark">yepper<span className="as-dot">.</span></div>
        <div className="as-topbar__meta">Live examples · Real Rwandan sites</div>
      </header>

      {/* HERO */}
      <section className="as-hero">
        <span className="as-chip">See it in place</span>
        <h1 className="as-h1">This is exactly how your ad would look.</h1>
        <p className="as-lede">
          Below are three of Rwanda&rsquo;s most-visited sites, with a Yepper ad running on
          each one. Every space you see is real, live and yours to book — no packages,
          no hidden extras. Pick the ones that fit, and we place them the same week.
        </p>
      </section>

      {/* IGIHE */}
      <SiteBlock
        idx="01"
        siteName="igihe.com"
        siteTag="Rwanda&rsquo;s most-read platform"
        blurb={
          <>
            <strong>igihe.com</strong> is where Rwanda gets its news. On a strong month,
            over <b>1,000,000 people</b> visit — political stories, sports, music,
            business. The kind of numbers that used to make an ad slot here cost a small
            fortune: the site sold high because the sales it delivered had to justify the
            price. Through Yepper, that same audience is now within reach of a normal
            marketing budget.
          </>
        }
        mockup={<IgiheMockup />}
        spaces={[{ name: "Floating ad", price: 57200, tier: "Premium",
          desc: "A small card that appears in a corner of the page and stays visible as the visitor scrolls. It doesn't cover the article — it just travels with them. On a site where people click into three, four, five stories a session, your brand is present for every one of them.",
          pitch: "The most-viewed ad space on igihe.com — always in sight, never interrupting the read." }]}
      />

      {/* NEW TIMES */}
      <SiteBlock
        idx="02"
        siteName="newtimes.co.rw"
        siteTag="Rwanda&rsquo;s English daily"
        blurb={
          <>
            <strong>The New Times</strong> is where the country reads in English —
            professionals, government, business, and everyone following Rwanda from
            abroad. Strong months bring over <b>700,000 visitors</b>. Ad space here used
            to be sold at premium rates for exactly that reason: this is a readership
            that spends real money. Through Yepper, the same slot fits an ordinary
            monthly plan.
          </>
        }
        mockup={<NewTimesMockup />}
        spaces={[{ name: "Floating ad", price: 57200, tier: "Premium",
          desc: "A discreet floating card, always visible in the corner while a reader moves through a story. English-reading professionals spend longer per article than most audiences online — meaning your ad is on their screen for real minutes at a time, not seconds.",
          pitch: "Reach the readers with the biggest wallets in the country, in the moment they're most attentive." }]}
      />

      {/* AGASOBANUYE */}
      <SiteBlock
        idx="03"
        siteName="agasobanuyenow.com"
        siteTag="Kinyarwanda-dubbed movies"
        blurb={
          <>
            <strong>Agasobanuyenow</strong> is where families settle in and watch. Not
            two-minute visits — whole films, sometimes several in a row, often with
            three or four people around one screen. A visit counted here is really a
            household reached. And unlike a news site, viewers spend <b>hours</b> in a
            single session — hours during which your ad has room to breathe and
            actually land. Five different spaces to choose from, so you can match your
            message to the moment.
          </>
        }
        mockup={<AgaMockup />}
        spaces={[
          { name: "Header banner", price: 15000, tier: "Basic",
            desc: "The banner across the very top of the site, visible on every page from the moment someone lands. First thing every visitor sees.",
            pitch: "Own the front door — the highest-visibility spot on the site." },
          { name: "Floating ad", price: 8000, tier: "Basic",
            desc: "A small card that stays in a corner as the visitor browses. Present the whole visit without blocking the content.",
            pitch: "Always in sight, never annoying — the price-per-attention winner." },
          { name: "Pre-roll (video)", price: 18800, tier: "Basic",
            desc: "A short ad that plays right before the film starts — like TV, before your favourite show. Full screen, full attention, no scrolling past.",
            pitch: "You have every viewer's full focus, in the exact moment they've decided to watch." },
          { name: "Mid-roll (video)", price: 22500, tier: "Basic",
            desc: "Plays inside the film, roughly at the middle break. Unskippable, like a commercial in the middle of a TV show — then the movie continues.",
            pitch: "Reach viewers deep into the film, when they're already committed to the platform." },
          { name: "Pause ad", price: 8200, tier: "Basic",
            desc: "Appears the moment the viewer pauses the video — for a snack, for a call, for anything. Right when their eyes come back to the screen.",
            pitch: "Catch attention in the exact instant it's re-focused on the screen." },
        ]}
      />

      {/* CLOSE */}
      <section className="as-close">
        <h2 className="as-close__title">Pick your spaces. We&rsquo;ll take it from here.</h2>
        <p className="as-close__sub">Tell us the sites and the spaces you want. Send your artwork. We go live the same week — and you watch the live traffic in our panel from day one.</p>
        <div className="as-contact">
          <span>yepperads@gmail.com</span>
          <span className="as-sep">·</span>
          <span>+250 792 051 768</span>
        </div>
      </section>

      <footer className="as-foot">
        <span className="as-wordmark as-wordmark--sm">yepper<span className="as-dot">.</span></span>
        <span className="as-foot__meta">All prices RWF, per month, per space</span>
      </footer>
    </div>
  );
}

/* ---------- SITE BLOCK ---------- */
function SiteBlock({ idx, siteName, siteTag, blurb, mockup, spaces }) {
  const fmt = (n) => n.toLocaleString("en-US");
  return (
    <section className="as-block">
      <div className="as-block__head">
        <span className="as-idx">{idx}</span>
        <div>
          <h2 className="as-block__site">{siteName}</h2>
          <span className="as-block__tag" dangerouslySetInnerHTML={{ __html: siteTag }} />
        </div>
      </div>
      <p className="as-block__blurb">{blurb}</p>

      <div className="as-block__mockup">{mockup}</div>

      <div className="as-block__spaces">
        {spaces.map((s) => (
          <div className="as-space" key={s.name}>
            <div className="as-space__head">
              <h3 className="as-space__name">{s.name}</h3>
              <div className="as-space__price">
                <b>{fmt(s.price)}</b><em> RWF / month</em>
                <span className="as-space__tier">{s.tier} tier</span>
              </div>
            </div>
            <p className="as-space__desc">{s.desc}</p>
            <p className="as-space__pitch">{s.pitch}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- IGIHE MOCKUP ---------- */
function IgiheMockup() {
  return (
    <div className="mk">
      <Chrome host="igihe.com" />
      <div className="mk-body">
        {/* red masthead + green underline (igihe brand cues) */}
        <div className="mk-igihe__top">
          <div className="mk-igihe__brand">
            <div className="mk-igihe__logo">IGIHE</div>
            <span className="mk-igihe__slog">Amakuru mashya kuri interineti</span>
          </div>
          <div className="mk-igihe__meta">Kuwa Kabiri · {new Date().toLocaleDateString("en-GB")}</div>
        </div>
        <div className="mk-igihe__nav">
          {["Amakuru","Politiki","Ubukungu","Imikino","Umuco","Amashusho"].map((n)=>(
            <span className="mk-igihe__navi" key={n}>{n}</span>
          ))}
        </div>

        <div className="mk-igihe__hero">
          <div className="mk-igihe__heroimg" />
          <div className="mk-igihe__herotitle">Guverinoma yatangaje ibikorwa bishya bigamije iterambere ry&rsquo;abaturage</div>
          <div className="mk-igihe__herolead">Ibi bikorwa bizatangira gushyirwa mu bikorwa mu byumweru bike biri imbere...</div>
        </div>

        <div className="mk-igihe__grid">
          {[1,2,3,4].map(i=>(
            <div className="mk-card" key={i}>
              <div className="mk-card__img" />
              <div className="mk-card__title">Ihuriro ry&rsquo;abakoresha bito na binini rigiye guhabwa ubufasha</div>
              <div className="mk-card__meta">Ubukungu · Isaha 3 zishize</div>
            </div>
          ))}
        </div>

        {/* Floating ad slot — bottom right, follows scroll */}
        <FloatingAd label="Your ad here" corner="br" />
      </div>
    </div>
  );
}

/* ---------- NEW TIMES MOCKUP ---------- */
function NewTimesMockup() {
  return (
    <div className="mk">
      <Chrome host="newtimes.co.rw" />
      <div className="mk-body">
        {/* blue masthead */}
        <div className="mk-nt__top">
          <div className="mk-nt__brand">
            <span className="mk-nt__the">THE</span>
            <span className="mk-nt__nt">NEW TIMES</span>
            <span className="mk-nt__slog">Rwanda&rsquo;s Leading English Daily</span>
          </div>
        </div>
        <div className="mk-nt__nav">
          {["News","Business","Sports","Opinion","Culture","Africa"].map((n)=>(
            <span className="mk-nt__navi" key={n}>{n}</span>
          ))}
          <span className="mk-nt__sub">Subscribe</span>
        </div>

        <div className="mk-nt__hero">
          <div className="mk-nt__lead">
            <div className="mk-nt__crumb">POLITICS</div>
            <div className="mk-nt__title">Rwanda deepens regional trade ties as new agreements take shape</div>
            <div className="mk-nt__deck">The latest round of talks signals a broader strategy for East African integration, officials say, with commitments spanning trade, energy and infrastructure.</div>
            <div className="mk-nt__byline">By Staff Reporter · Published 08:14</div>
          </div>
          <div className="mk-nt__aside">
            <div className="mk-nt__asidetitle">Most read</div>
            {["Economy expands 8.2% year-on-year, driven by services","Kigali announces new housing initiative for young workers","Rwanda tops African index for digital public services","Debate over regional currency intensifies at summit"].map((t,i)=>(
              <div className="mk-nt__aitem" key={i}>
                <span className="mk-nt__num">{i+1}</span>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>

        <FloatingAd label="Your ad here" corner="br" />
      </div>
    </div>
  );
}

/* ---------- AGASOBANUYE MOCKUP ---------- */
function AgaMockup() {
  return (
    <div className="mk">
      <Chrome host="agasobanuyenow.com" />
      <div className="mk-body mk-body--dark">
        {/* HEADER BANNER SLOT */}
        <div className="mk-ag__headerad">
          <span className="mk-adchip mk-adchip--onDark">Header banner</span>
          <span className="mk-adcopy">Your brand — first thing every visitor sees</span>
        </div>

        <div className="mk-ag__nav">
          <div className="mk-ag__logo">Agasobanuyenow<span>.</span></div>
          <div className="mk-ag__navlinks">
            <span>Films</span><span>Series</span><span>Kinyarwanda</span><span>Search</span>
          </div>
        </div>

        {/* Featured player with pre/mid/pause slots */}
        <div className="mk-ag__player">
          <div className="mk-ag__scene">
            <div className="mk-ag__sky" />
            <div className="mk-ag__sun" />
            <div className="mk-ag__mountBack" />
            <div className="mk-ag__mountFront" />
            {/* pause overlay */}
            <div className="mk-ag__pauseOverlay">
              <div className="mk-ag__pauseIcon"><span/><span/></div>
              <div className="mk-ag__pauseAd">
                <span className="mk-adchip mk-adchip--onDark">Pause ad</span>
                <span className="mk-adcopy">Right when their eyes come back to the screen</span>
              </div>
            </div>
          </div>
          <div className="mk-ag__controls">
            <div className="mk-ag__playbar"><div className="mk-ag__played" /></div>
            <div className="mk-ag__time">01:24:30 / 02:10:00</div>
          </div>

          {/* Pre + Mid roll labels beneath the player */}
          <div className="mk-ag__rolls">
            <div className="mk-ag__roll">
              <div className="mk-ag__rollIcon">▶</div>
              <div>
                <div className="mk-ag__rollT"><span className="mk-adchip">Pre-roll</span> plays before the film</div>
                <div className="mk-ag__rollS">Full screen · full attention · like TV</div>
              </div>
            </div>
            <div className="mk-ag__roll">
              <div className="mk-ag__rollIcon">⏸</div>
              <div>
                <div className="mk-ag__rollT"><span className="mk-adchip">Mid-roll</span> plays inside the film</div>
                <div className="mk-ag__rollS">Unskippable · movie continues after</div>
              </div>
            </div>
          </div>
        </div>

        {/* Film thumbs row */}
        <div className="mk-ag__row">
          <div className="mk-ag__rowT">Continue watching</div>
          <div className="mk-ag__thumbs">
            {[1,2,3,4,5].map(i=>(
              <div className="mk-ag__thumb" key={i}>
                <div className="mk-ag__thumbImg" />
                <div className="mk-ag__thumbT">Umuryango wanjye {i}</div>
                <div className="mk-ag__thumbS">Igitaramo · 1h 48m</div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating ad on the movie site too */}
        <FloatingAd label="Floating ad" corner="br" />
      </div>
    </div>
  );
}

/* ---------- CHROME (browser bar) ---------- */
function Chrome({ host }) {
  return (
    <div className="mk-chrome">
      <div className="mk-chrome__dots"><span/><span/><span/></div>
      <div className="mk-chrome__url">https://{host}/</div>
    </div>
  );
}

/* ---------- FLOATING AD (reusable) ---------- */
function FloatingAd({ label, corner="br" }) {
  return (
    <div className={`mk-float mk-float--${corner}`}>
      <div className="mk-float__badge">Ad</div>
      <div className="mk-float__body">
        <div className="mk-float__title">{label}</div>
        <div className="mk-float__sub">Follows the visitor as they scroll</div>
      </div>
      <div className="mk-float__x">×</div>
    </div>
  );
}

/* ---------- STYLES ---------- */
function AsStyle() {
  return (
    <style>{`
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&family=Playfair+Display:wght@700;900&display=swap');
.as-root{--white:#fff;--paper:#f5f8fc;--ink:#0b1b2b;--ink-soft:#54677c;--orange:#ff6a1a;--orange-deep:#ee5704;--sky:#1f93e6;--green:#1f9d55;--line:rgba(11,27,43,.09);--shadow:0 30px 70px -32px rgba(11,27,43,.35);position:relative;overflow:hidden;background:var(--white);color:var(--ink);font-family:'Inter',system-ui,sans-serif;-webkit-font-smoothing:antialiased;line-height:1.5;}
.as-root *{box-sizing:border-box;}
.as-aura{position:absolute;border-radius:50%;filter:blur(90px);opacity:.35;pointer-events:none;z-index:0;}
.as-aura--a{width:640px;height:640px;top:-240px;right:-180px;background:radial-gradient(circle,rgba(255,106,26,.32),transparent 65%);}
.as-aura--b{width:720px;height:720px;top:1200px;left:-300px;background:radial-gradient(circle,rgba(31,147,230,.24),transparent 65%);}
.as-root>*{position:relative;z-index:1;}.as-root>.as-aura{position:absolute;z-index:0;}
.as-wordmark{font-family:'Bricolage Grotesque',sans-serif;font-weight:800;font-size:22px;letter-spacing:-.02em;}.as-wordmark--sm{font-size:18px;}.as-dot{color:var(--orange);}
.as-topbar{display:flex;align-items:center;justify-content:space-between;max-width:1160px;margin:0 auto;padding:22px 6vw;}
.as-topbar__meta{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-soft);}
.as-hero{max-width:880px;margin:0 auto;padding:36px 6vw 20px;text-align:center;}
.as-chip{display:inline-block;font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--orange-deep);background:rgba(255,106,26,.08);border:1px solid rgba(255,106,26,.2);padding:7px 13px;border-radius:999px;}
.as-h1{font-family:'Bricolage Grotesque',sans-serif;font-weight:700;font-size:clamp(34px,5vw,60px);line-height:1.03;letter-spacing:-.03em;margin:20px 0 16px;}
.as-lede{font-size:clamp(16px,1.3vw,19px);color:var(--ink-soft);max-width:60ch;margin:0 auto;}

.as-block{max-width:1160px;margin:0 auto;padding:70px 6vw 20px;}
.as-block__head{display:flex;align-items:center;gap:18px;margin-bottom:10px;}
.as-idx{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:600;padding:6px 10px;border-radius:6px;background:var(--ink);color:#fff;letter-spacing:.1em;}
.as-block__site{font-family:'Bricolage Grotesque',sans-serif;font-weight:800;font-size:clamp(26px,3.4vw,38px);letter-spacing:-.025em;margin:0;}
.as-block__tag{color:var(--ink-soft);font-size:14px;font-weight:500;}
.as-block__blurb{color:var(--ink);font-size:16.5px;max-width:80ch;margin:6px 0 26px;}
.as-block__blurb b, .as-block__blurb strong{color:var(--ink);}
.as-block__mockup{border-radius:22px;box-shadow:var(--shadow);overflow:hidden;background:#fff;}

.as-block__spaces{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:26px;}
.as-space{background:#fff;border:1px solid var(--line);border-radius:16px;padding:22px 24px;box-shadow:0 12px 30px -22px rgba(11,27,43,.2);}
.as-space__head{display:flex;justify-content:space-between;align-items:flex-start;gap:14px;border-bottom:1px solid var(--line);padding-bottom:12px;margin-bottom:12px;}
.as-space__name{font-family:'Bricolage Grotesque',sans-serif;font-weight:700;font-size:20px;margin:0;letter-spacing:-.01em;}
.as-space__price{text-align:right;}
.as-space__price b{font-family:'Bricolage Grotesque',sans-serif;font-weight:800;font-size:24px;letter-spacing:-.02em;color:var(--green);}
.as-space__price em{font-style:normal;color:var(--ink-soft);font-size:13px;font-weight:600;margin-left:2px;}
.as-space__tier{display:block;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--orange-deep);margin-top:4px;}
.as-space__desc{color:var(--ink-soft);font-size:14.5px;margin:0 0 10px;}
.as-space__pitch{color:var(--ink);font-size:14.5px;font-weight:600;margin:0;padding:10px 12px;background:var(--paper);border-left:3px solid var(--orange);border-radius:6px;}

/* -------- MOCKUP CHROME -------- */
.mk{width:100%;border-radius:22px;overflow:hidden;background:#fff;}
.mk-chrome{display:flex;align-items:center;gap:14px;background:#e8ecf1;padding:10px 14px;border-bottom:1px solid #d5dce3;}
.mk-chrome__dots{display:flex;gap:6px;}
.mk-chrome__dots span{width:11px;height:11px;border-radius:50%;background:#c8ced6;}
.mk-chrome__dots span:nth-child(1){background:#ff5f57;}.mk-chrome__dots span:nth-child(2){background:#febc2e;}.mk-chrome__dots span:nth-child(3){background:#28c840;}
.mk-chrome__url{flex:1;background:#fff;border-radius:8px;padding:7px 14px;font-family:'JetBrains Mono',monospace;font-size:12.5px;color:#333;border:1px solid #d5dce3;}
.mk-body{position:relative;padding:0;min-height:520px;}

/* -------- IGIHE -------- */
.mk-igihe__top{background:#c8102e;padding:14px 22px;display:flex;align-items:center;justify-content:space-between;border-bottom:4px solid #1f9d3a;}
.mk-igihe__brand{display:flex;align-items:baseline;gap:14px;}
.mk-igihe__logo{font-family:'Playfair Display',serif;font-weight:900;color:#fff;font-size:34px;letter-spacing:-.02em;}
.mk-igihe__slog{color:rgba(255,255,255,.85);font-size:12px;letter-spacing:.02em;}
.mk-igihe__meta{color:rgba(255,255,255,.9);font-size:12px;font-family:'JetBrains Mono',monospace;}
.mk-igihe__nav{display:flex;gap:0;background:#0b1b2b;padding:0 22px;flex-wrap:wrap;}
.mk-igihe__navi{color:#fff;font-size:13px;font-weight:600;padding:12px 16px;letter-spacing:.02em;}
.mk-igihe__navi:hover{background:rgba(255,255,255,.06);}

.mk-igihe__hero{padding:22px;}
.mk-igihe__heroimg{width:100%;height:280px;background:linear-gradient(135deg,#3a5f7a,#8ba9c2 60%,#c9a084);border-radius:6px;position:relative;overflow:hidden;}
.mk-igihe__heroimg::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.6),transparent 50%);}
.mk-igihe__herotitle{font-family:'Playfair Display',serif;font-weight:900;font-size:26px;line-height:1.2;color:#0b1b2b;margin:14px 0 8px;}
.mk-igihe__herolead{color:#54677c;font-size:14.5px;line-height:1.55;}

.mk-igihe__grid{padding:0 22px 40px;display:grid;grid-template-columns:1fr 1fr;gap:18px;}
.mk-card{border-top:1px solid #e0e5eb;padding-top:14px;}
.mk-card__img{width:100%;height:120px;background:linear-gradient(135deg,#e8ecf1,#c8ced6);border-radius:4px;margin-bottom:10px;}
.mk-card__title{font-family:'Playfair Display',serif;font-weight:700;font-size:16px;line-height:1.3;color:#0b1b2b;margin-bottom:6px;}
.mk-card__meta{font-family:'JetBrains Mono',monospace;font-size:10.5px;color:#54677c;letter-spacing:.05em;text-transform:uppercase;}

/* -------- NEW TIMES -------- */
.mk-nt__top{background:#0a2540;padding:20px 24px;color:#fff;text-align:center;}
.mk-nt__brand{display:flex;align-items:baseline;justify-content:center;gap:12px;flex-wrap:wrap;}
.mk-nt__the{font-family:'Playfair Display',serif;font-weight:700;font-size:16px;letter-spacing:.2em;color:#e8b923;}
.mk-nt__nt{font-family:'Playfair Display',serif;font-weight:900;font-size:36px;letter-spacing:-.01em;}
.mk-nt__slog{color:rgba(255,255,255,.7);font-size:12px;font-style:italic;letter-spacing:.05em;width:100%;margin-top:4px;}
.mk-nt__nav{background:#fff;padding:0 24px;display:flex;gap:0;border-bottom:2px solid #0a2540;flex-wrap:wrap;align-items:center;}
.mk-nt__navi{color:#0a2540;font-weight:700;font-size:13.5px;padding:14px 18px;letter-spacing:.02em;text-transform:uppercase;}
.mk-nt__sub{margin-left:auto;background:#e8b923;color:#0a2540;padding:8px 18px;border-radius:4px;font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;}

.mk-nt__hero{padding:26px 24px;display:grid;grid-template-columns:1.6fr 1fr;gap:32px;}
.mk-nt__crumb{font-family:'JetBrains Mono',monospace;font-size:11px;color:#c8102e;letter-spacing:.15em;font-weight:700;}
.mk-nt__title{font-family:'Playfair Display',serif;font-weight:900;font-size:30px;line-height:1.15;color:#0a2540;margin:10px 0 12px;letter-spacing:-.01em;}
.mk-nt__deck{color:#54677c;font-size:15.5px;line-height:1.55;margin-bottom:14px;}
.mk-nt__byline{font-family:'JetBrains Mono',monospace;font-size:11px;color:#8b98a8;letter-spacing:.05em;text-transform:uppercase;}
.mk-nt__aside{background:#f5f8fc;padding:18px 20px;border-radius:4px;border-top:3px solid #0a2540;}
.mk-nt__asidetitle{font-family:'Playfair Display',serif;font-weight:900;font-size:16px;color:#0a2540;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid #d5dce3;text-transform:uppercase;letter-spacing:.05em;}
.mk-nt__aitem{display:flex;gap:12px;padding:10px 0;border-bottom:1px solid #e0e5eb;font-size:13.5px;line-height:1.35;color:#0a2540;font-weight:500;}
.mk-nt__aitem:last-child{border-bottom:none;}
.mk-nt__num{font-family:'Playfair Display',serif;font-weight:900;font-size:20px;color:#c8102e;line-height:1;min-width:20px;}

/* -------- AGASOBANUYE -------- */
.mk-body--dark{background:#0d0f14;color:#fff;padding-bottom:30px;}
.mk-ag__headerad{background:linear-gradient(90deg,#ff6a1a,#ee5704);color:#fff;padding:14px 24px;display:flex;align-items:center;gap:14px;justify-content:center;}
.mk-adchip{display:inline-block;background:#fff;color:#ee5704;font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px;letter-spacing:.05em;text-transform:uppercase;}
.mk-adchip--onDark{background:#fff;color:#ee5704;}
.mk-adcopy{font-size:14px;font-weight:600;color:#fff;}

.mk-ag__nav{padding:16px 24px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,.08);}
.mk-ag__logo{font-family:'Bricolage Grotesque',sans-serif;font-weight:800;font-size:22px;letter-spacing:-.02em;color:#fff;}
.mk-ag__logo span{color:#ff6a1a;}
.mk-ag__navlinks{display:flex;gap:22px;color:rgba(255,255,255,.7);font-size:14px;font-weight:500;}

.mk-ag__player{margin:24px;border-radius:12px;overflow:hidden;background:#000;box-shadow:0 20px 50px -20px rgba(0,0,0,.7);}
.mk-ag__scene{position:relative;height:300px;overflow:hidden;}
.mk-ag__sky{position:absolute;inset:0;background:linear-gradient(to bottom,#1a2942,#4a3a5a 55%,#c47d5a);}
.mk-ag__sun{position:absolute;top:50px;right:80px;width:60px;height:60px;border-radius:50%;background:radial-gradient(circle,#ffd28a,#ff9d4a);box-shadow:0 0 40px rgba(255,157,74,.4);}
.mk-ag__mountBack{position:absolute;bottom:0;left:0;right:0;height:60%;background:linear-gradient(to top,#1a1520,#2a2035);clip-path:polygon(0 100%,0 45%,25% 20%,55% 55%,80% 30%,100% 55%,100% 100%);}
.mk-ag__mountFront{position:absolute;bottom:0;left:0;right:0;height:35%;background:#0d0810;clip-path:polygon(0 100%,0 70%,20% 40%,45% 65%,70% 45%,100% 70%,100% 100%);}
.mk-ag__pauseOverlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.1),rgba(0,0,0,.6));display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px;}
.mk-ag__pauseIcon{display:flex;gap:10px;}
.mk-ag__pauseIcon span{width:16px;height:52px;background:rgba(255,255,255,.95);border-radius:3px;}
.mk-ag__pauseAd{background:linear-gradient(90deg,#ff6a1a,#ee5704);padding:14px 22px;border-radius:12px;display:flex;align-items:center;gap:14px;box-shadow:0 12px 30px -8px rgba(0,0,0,.5);}
.mk-ag__controls{background:linear-gradient(to top,rgba(0,0,0,.9),rgba(0,0,0,.7));padding:10px 16px;display:flex;align-items:center;gap:14px;}
.mk-ag__playbar{flex:1;height:4px;background:rgba(255,255,255,.2);border-radius:2px;position:relative;}
.mk-ag__played{position:absolute;left:0;top:0;bottom:0;width:65%;background:#ff6a1a;border-radius:2px;}
.mk-ag__played::after{content:'';position:absolute;right:-6px;top:-4px;width:12px;height:12px;background:#ff6a1a;border-radius:50%;box-shadow:0 0 0 3px rgba(255,106,26,.3);}
.mk-ag__time{font-family:'JetBrains Mono',monospace;font-size:12px;color:rgba(255,255,255,.85);}

.mk-ag__rolls{padding:14px 20px;background:#141821;display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.mk-ag__roll{display:flex;gap:14px;align-items:center;background:rgba(255,255,255,.04);padding:12px 14px;border-radius:8px;border-left:3px solid #ff6a1a;}
.mk-ag__rollIcon{width:36px;height:36px;background:rgba(255,106,26,.15);color:#ff6a1a;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;flex:none;}
.mk-ag__rollT{font-size:13.5px;color:#fff;font-weight:600;margin-bottom:2px;}
.mk-ag__rollS{font-size:12px;color:rgba(255,255,255,.6);}

.mk-ag__row{padding:14px 24px 20px;}
.mk-ag__rowT{font-family:'Bricolage Grotesque',sans-serif;font-weight:700;font-size:18px;margin-bottom:14px;color:#fff;}
.mk-ag__thumbs{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;}
.mk-ag__thumb{background:transparent;}
.mk-ag__thumbImg{width:100%;aspect-ratio:16/10;background:linear-gradient(135deg,#2a3548,#4a5568);border-radius:6px;margin-bottom:6px;}
.mk-ag__thumbT{font-size:12.5px;color:#fff;font-weight:600;line-height:1.25;margin-bottom:2px;}
.mk-ag__thumbS{font-size:10.5px;color:rgba(255,255,255,.55);font-family:'JetBrains Mono',monospace;}

/* -------- FLOATING AD -------- */
.mk-float{position:absolute;background:#fff;border:1px solid var(--line);border-radius:12px;padding:12px 14px;display:flex;align-items:center;gap:10px;box-shadow:0 20px 40px -12px rgba(0,0,0,.4);max-width:260px;z-index:5;}
.mk-float--br{bottom:20px;right:20px;}
.mk-float__badge{background:linear-gradient(135deg,#ff6a1a,#ee5704);color:#fff;font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;padding:4px 8px;border-radius:6px;letter-spacing:.05em;text-transform:uppercase;flex:none;}
.mk-float__body{flex:1;}
.mk-float__title{font-weight:700;font-size:13.5px;color:var(--ink);line-height:1.2;}
.mk-float__sub{font-size:11.5px;color:var(--ink-soft);margin-top:2px;}
.mk-float__x{width:20px;height:20px;border-radius:50%;background:var(--paper);color:var(--ink-soft);display:flex;align-items:center;justify-content:center;font-size:14px;flex:none;cursor:pointer;}

/* -------- CLOSE -------- */
.as-close{max-width:820px;margin:0 auto;padding:80px 6vw 50px;text-align:center;}
.as-close__title{font-family:'Bricolage Grotesque',sans-serif;font-weight:700;font-size:clamp(28px,3.6vw,44px);line-height:1.07;letter-spacing:-.03em;margin:0 0 14px;}
.as-close__sub{color:var(--ink-soft);font-size:17.5px;max-width:56ch;margin:0 auto 22px;}
.as-contact{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;font-weight:600;font-size:16px;}
.as-sep{color:var(--ink-soft);}
.as-foot{display:flex;align-items:center;justify-content:space-between;max-width:1160px;margin:0 auto;padding:28px 6vw;border-top:1px solid var(--line);gap:16px;flex-wrap:wrap;}
.as-foot__meta{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.08em;color:var(--ink-soft);}

@media (max-width:880px){
  .as-block__spaces{grid-template-columns:1fr;}
  .mk-nt__hero{grid-template-columns:1fr;}
  .mk-igihe__grid{grid-template-columns:1fr;}
  .mk-ag__rolls{grid-template-columns:1fr;}
  .mk-ag__thumbs{grid-template-columns:repeat(3,1fr);}
  .mk-float{max-width:200px;}
}
`}</style>
  );
}
