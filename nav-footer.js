/**
 * nav-footer.js  — Boss Connect shared Navbar + Footer
 *
 * Works in TWO environments:
 *  1. Local  — file:///path/to/index.html  (links use .html filenames)
 *  2. Server — https://bossconnect.com.au/ (links use clean paths)
 *
 * Drop ALL pages + this file in the SAME folder.
 * Each page just needs: <script src="nav-footer.js"></script>
 */
(function () {
  "use strict";

  /* ─── 1. DETECT ENVIRONMENT ─────────────────────────────────── */
  const isLocal = window.location.protocol === "file:";

  // Detect if running on a local dev server (localhost / 127.0.0.1)
  const isLocalServer = !isLocal && (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === ""
  );

  // Use .html relative links when:
  // 1. Opening as file:// locally
  // 2. Running on localhost dev server
  // 3. OR deployed to a subfolder (not the root of the domain)
  //    e.g. https://bossconnect.com.au/web1_v1/ → basePath = "/web1_v1/"
  const useRelative = isLocal || isLocalServer;

  /* ─── 1b. DETECT IF INSIDE A SUBFOLDER ──────────────────────── */
  // Read the script src to determine depth.
  // Root pages:              <script src="nav-footer.js">      → prefix ""
  // capabilities/ pages:    <script src="../nav-footer.js">   → prefix "../"
  // gallery/ pages:         <script src="../nav-footer.js">   → prefix "../"
  var _scriptSrc = "";
  var _scripts = document.getElementsByTagName("script");
  for (var _i = 0; _i < _scripts.length; _i++) {
    if (_scripts[_i].src && _scripts[_i].src.indexOf("nav-footer") !== -1) {
      _scriptSrc = _scripts[_i].getAttribute("src") || "";
      break;
    }
  }

  var depth = 0;
  var _tmp = _scriptSrc;
  while (_tmp.indexOf("../") === 0) {
    depth++;
    _tmp = _tmp.slice(3);
  }

  // On live server, also check the URL path depth
  // e.g. /website_v4/capabilities/consulting.html → we're 1 level deep inside capabilities/
  if (!isLocal && depth === 0) {
    var pathParts = window.location.pathname.split("/").filter(Boolean);

    // Remove filename
    pathParts.pop();
    // Check if last segment is a known subfolder
    var lastFolder = pathParts[pathParts.length - 1] || "";
    console.log(lastFolder)
    if (lastFolder === "capabilities" || lastFolder === "gallery") {
      depth = 1;
    }
  }

  const prefix = "../".repeat(depth);

  /* ─── 2. LINK RESOLVER ──────────────────────────────────────── */
  const L = {
    home        : prefix + "index.html",
    about       : prefix + "about.html",
    contact     : prefix + "contact.html",
    consulting  : prefix + "capabilities/consulting.html",
    events      : prefix + "capabilities/events.html",
    coaching    : prefix + "capabilities/coaching.html",
    creative    : prefix + "capabilities/creative.html",
    clicks      : prefix + "capabilities/clicks.html",
    publications: prefix + "capabilities/publications.html",
    champions   : prefix + "capabilities/champions.html",
    pyob        : prefix + "capabilities/pyob.html",
    media       : prefix + "capabilities/media.html",
    galleryWsi        : prefix + "gallery/wsi.html",
    galleryAmazon     : prefix + "gallery/amazon.html",
    galleryDoltone    : prefix + "gallery/doltone_house.html",
    galleryExpos      : prefix + "gallery/expos.html",
  };

  /* ─── 3. ACTIVE PAGE DETECTION ──────────────────────────────── */
  // Get just the filename — works on file://, localhost, and any server subfolder
  const rawPath = window.location.pathname.split("/").pop() || "index.html";

  const ACTIVE_MAP = {
    // ── Root pages ──
    "index.html"      : "home",
    ""                : "home",
    "about.html"      : "about",
    "contact.html"    : "contact",
    // ── Capability pages (inside capabilities/ folder) ──
    "consulting.html" : "consulting",
    "events.html"     : "events",
    "coaching.html"   : "coaching",
    "creative.html"   : "creative",
    "clicks.html"     : "clicks",
    "publications.html" : "publications",
    "champions.html"  : "champions",
    "pyob.html"       : "pyob",
    "media.html"      : "media",
    // ── PDF / magazine pages — no active class ──
    "museum-magazine.html"       : null,
    "view-pdf.html"              : null,
    "just-corporate.html"        : null,
    "just-visit.html"            : null,
    "boss-connect-magazine.html" : null,
    // ── Gallery pages — no active class ──
    "wsi.html"                   : null,
    "amazon.html"                : null,
    "doltone_house.html"         : null,
    "expos.html"                 : null,
  };

  // null  = page exists but should have NO active highlight
  // undefined = unknown page → fall back to "home"
  const activePage =
    rawPath in ACTIVE_MAP
      ? ACTIVE_MAP[rawPath] // could be a string or null
      : "home"; // truly unknown page

  // noActive = true means this page should have zero highlighting
  const noActive = activePage === null;

  const isCapability =
    !noActive &&
    [
      "consulting",
      "events",
      "coaching",
      "creative",
      "clicks",
      "publications",
      "champions",
      "pyob",
      "media",
    ].includes(activePage);

  // Only return active class when activePage matches AND is not null
  function ac(key) {
    return !noActive && activePage === key ? ' class="bc-active"' : "";
  }
  function acHref(key) {
    return !noActive && activePage === key ? ' class="bc-active"' : "";
  }

  /* ─── 4. CSS ─────────────────────────────────────────────────── */
  const css = document.createElement("style");
  css.textContent = `
    :root { --brand:#C5A059; --brand-dark:#A27940; }
    ::selection { background:var(--brand); color:#000; }

    /* ══ NAVBAR ══ */
    .bc-navbar-wrap {
      background:#000; width:100%;
      position:sticky; top:0; z-index:1000;
      border-bottom:1px solid rgba(255,255,255,.06);
    }
    .bc-navbar {
      max-width:1400px; width:100%; margin:0 auto;
      display:flex; align-items:center; justify-content:space-between;
      height:3.75rem; padding:0 .75rem; position:relative;
    }
    @media(min-width:768px){ .bc-navbar{height:4.5rem;} }

    .bc-nav-logo img { width:160px; height:auto; display:block; }
    @media(min-width:768px){ .bc-nav-logo img{width:220px;} }

    .bc-nav-right { display:flex; align-items:center; gap:.5rem; }
    @media(min-width:640px){ .bc-nav-right{gap:1rem;} }
    @media(min-width:1024px){ .bc-nav-right{gap:1.5rem;} }

    /* Desktop nav list */
    .bc-nav-links {
      display:none; list-style:none;
      align-items:center; gap:2rem;
      position:relative; font-weight:500;
      margin:0; padding:0;
    }
    @media(min-width:768px){ .bc-nav-links{display:flex;} }

    /* All top-level nav items */
    .bc-nav-links li a,
    .bc-nav-links li .bc-cap-toggle {
      padding:.5rem 0;
      color:rgba(255,255,255,.78);
      text-decoration:none;
      transition:color .2s;
      background:none; border:none;
      font-family:inherit; font-size:1rem; font-weight:500;
      cursor:pointer;
      display:flex; align-items:center; gap:.3rem;
      white-space:nowrap;
    }
    .bc-nav-links li a:hover,
    .bc-nav-links li .bc-cap-toggle:hover { color:#fff; }

    /* Active page link */
    .bc-nav-links li a.bc-active { color:#fff; font-weight:700; }

    /* ── Gold underline indicator ── */
    .bc-nav-indicator {
      position:absolute; bottom:0; left:0; width:0;
      height:2px; border-radius:9999px;
      background:linear-gradient(to right,#A27940,#d6b16a,#A27940);
      opacity:.9;
      transition:left .28s ease, width .28s ease;
      pointer-events:none;
    }

    /* Chevron inside Capabilities button */
    .bc-cap-toggle svg {
      width:1em; height:1em; fill:currentColor;
      transition:transform .25s ease; flex-shrink:0;
    }

    /* ── CAPABILITIES DROPDOWN — opens on CSS hover ── */
    .bc-cap-li { position:relative; }

    .bc-cap-dropdown {
      position:absolute;
      top:100%; left:50%;
      transform:translateX(-50%) translateY(8px);
      background:#000;
      border:1px solid rgba(255,255,255,.12);
      border-radius:8px;
      padding:.5rem 0;
      min-width:200px;
      z-index:500;
      box-shadow:0 16px 48px rgba(0,0,0,.8);
      opacity:0;
      pointer-events:none;
      transition:opacity .2s ease, transform .2s ease;
    }

    /* Invisible bridge — keeps dropdown open when mouse moves from button to menu */
    .bc-cap-dropdown::before {
      content:'';
      position:absolute;
      top:-10px; left:0; right:0;
      height:10px;
    }

    /* HOVER — show dropdown */
    @media(min-width:768px){
      .bc-cap-li:hover .bc-cap-dropdown {
        opacity:1;
        pointer-events:all;
        transform:translateX(-50%) translateY(0);
      }
      /* Rotate chevron on hover */
      .bc-cap-li:hover .bc-cap-toggle svg {
        transform:rotate(180deg);
      }
    }

    /* Dropdown items */
    .bc-cap-dropdown a {
      display:block;
      padding:.65rem 1.4rem !important;
      font-size:.9rem !important; font-weight:300;
      color:rgba(255,255,255,.78);
      text-decoration:none;
      transition:color .15s, background .15s;
    }
    .bc-cap-dropdown a:hover {
      color:#fff;
      background: #A27940;
    }
    .bc-cap-dropdown a.bc-active {
      color:var(--brand); font-weight:600;
    }

    /* Divider */
    .bc-nav-divider {
      display:none; color:#374151;
      font-size:1.2rem; padding:0 .25rem;
      user-select:none; margin-top:.4rem;
    }
    @media(min-width:768px){ .bc-nav-divider{display:block;} }

    /* Phone */
    .bc-nav-phone {
      display:flex; align-items:center; gap:.4rem;
      color:#fff; text-decoration:none;
      transition:color .2s; white-space:nowrap;
    }
    .bc-nav-phone:hover { color:#d6b16a; }
    .bc-nav-phone svg { width:1.4rem; height:1.4rem; fill:currentColor; flex-shrink:0; }
    .bc-nav-phone span { display:none; font-size:.875rem; font-weight:700; }
    @media(min-width:1024px){ .bc-nav-phone span{display:inline;} }

    /* Hamburger */
    .bc-hamburger {
      display:flex; align-items:center; justify-content:center;
      font-size:1.875rem; color:#fff; cursor:pointer;
      background:none; border:none; padding:.25rem; line-height:1;
    }
    @media(min-width:768px){ .bc-hamburger{display:none;} }

    /* ══ MOBILE DRAWER ══ */
    .bc-drawer-overlay {
      position:fixed; inset:0; background:rgba(0,0,0,.6);
      z-index:998; opacity:0; pointer-events:none; transition:opacity .3s;
    }
    .bc-drawer-overlay.open { opacity:1; pointer-events:all; }

    .bc-mobile-drawer {
      position:fixed; top:0; left:0;
      height:100vh; width:72%; max-width:320px;
      background:#0a0a0a;
      border-right:1px solid rgba(255,255,255,.06);
      z-index:999; padding:1rem;
      transform:translateX(-100%);
      transition:transform .3s ease-in-out;
      display:flex; flex-direction:column;
      overflow-y:auto;
    }
    .bc-mobile-drawer.open { transform:translateX(0); }

    .bc-drawer-close-row { display:flex; justify-content:flex-end; margin-bottom:1.5rem; }
    .bc-drawer-close { background:none; border:none; color:#fff; cursor:pointer; padding:.25rem; }
    .bc-drawer-close svg { width:1.75rem; height:1.75rem; fill:currentColor; display:block; }

    .bc-drawer-nav ul {
      list-style:none; display:flex; flex-direction:column;
      gap:1rem; font-size:1.125rem; padding:0 .5rem;
    }
    .bc-drawer-nav ul li a {
      color:rgba(255,255,255,.85); text-decoration:none;
      display:block; padding:.35rem 0; transition:color .2s;
    }
    .bc-drawer-nav ul li a:hover { color:#fff; }
    .bc-drawer-nav ul li a.bc-active { color:var(--brand); font-weight:600; }

    .bc-drawer-cap-btn {
      background:none; border:none;
      color:rgba(255,255,255,.85);
      font-size:1.125rem; font-family:inherit; cursor:pointer;
      display:flex; align-items:center; justify-content:space-between;
      width:100%; padding:.35rem 0;
    }
    .bc-drawer-cap-btn svg { width:1em; height:1em; fill:currentColor; transition:transform .25s; }
    .bc-drawer-cap-btn.open svg { transform:rotate(180deg); }

    .bc-drawer-sub { display:none; flex-direction:column; gap:.5rem; padding:.5rem 0 .25rem 1.25rem; }
    .bc-drawer-sub.open { display:flex; }
    .bc-drawer-sub a {
      font-size:1rem; color:rgba(255,255,255,.65);
      text-decoration:none; padding:.25rem 0; transition:color .2s;
    }
    .bc-drawer-sub a:hover { color:#fff; }
    .bc-drawer-sub a.bc-active { color:var(--brand); font-weight:600; }

    .bc-drawer-phone-li { margin-top:1.25rem; padding-top:1.25rem; border-top:1px solid rgba(255,255,255,.08); }
    .bc-drawer-phone-li a {
      display:flex; align-items:center; gap:.5rem;
      color:#d6b16a !important; font-size:1.125rem;
      text-decoration:none; font-weight:600;
    }
    .bc-drawer-phone-li svg { width:1em; height:1em; fill:currentColor; }

    /* ══ FOOTER ══ */
    .bc-footer { position:relative; width:100%; padding:3rem 1rem; color:#fff; font-family:inherit; }
    @media(min-width:768px){ .bc-footer{padding:3rem 2rem;} }
    .bc-footer-bg { position:absolute; inset:0; overflow:hidden; }
    .bc-footer-bg img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; display:block; }
    .bc-footer-overlay { position:absolute; inset:0; background:rgba(0,0,0,.72); }
    .bc-footer-inner { position:relative; z-index:20; max-width:1200px; margin:0 auto; }
    .bc-footer-cols { display:flex; flex-direction:column; justify-content:space-between; gap:3rem; }
    @media(min-width:768px){ .bc-footer-cols{flex-direction:row; gap:2rem;} }
    .bc-footer-brand { display:flex; flex-direction:column; gap:1rem; min-width:180px; }
    .bc-footer-brand img { display:block; max-width:180px; }
    .bc-footer-brand p { font-size:.875rem; color:rgba(255,255,255,.55); max-width:220px; margin-left:.25rem; font-weight:300; line-height:1.6; }
    .bc-footer-col h3 { font-weight:700; font-size:1.125rem; margin-bottom:1.5rem; }
    .bc-footer-col ul { list-style:none; display:flex; flex-direction:column; gap:.75rem; margin-left:.25rem; }
    .bc-footer-col ul li a { color:rgba(255,255,255,.65); font-size:.875rem; font-weight:300; text-decoration:none; transition:color .2s; }
    .bc-footer-col ul li a:hover { color:var(--brand); }
    .bc-footer-connect { display:flex; flex-direction:column; gap:1rem; margin-left:.25rem; }
    .bc-footer-email { color:rgba(255,255,255,.65); font-size:.875rem; font-weight:300; text-decoration:none; transition:color .2s; }
    .bc-footer-email:hover { color:var(--brand); }
    .bc-footer-socials { display:flex; gap:1rem; }
    .bc-footer-socials a { color:rgba(255,255,255,.65); display:flex; align-items:center; text-decoration:none; transition:color .2s, transform .2s; }
    .bc-footer-socials a:hover { color:var(--brand); transform:scale(1.12); }
    .bc-footer-socials svg { width:1.25rem; height:1.25rem; fill:currentColor; stroke:currentColor; display:block; }
    .bc-footer-bottom { margin-top:3rem; padding-top:2rem; border-top:1px solid rgba(255,255,255,.08); }
    .bc-footer-bottom p { text-align:center; color:rgba(255,255,255,.40); font-size:.875rem; font-weight:300; }
  `;
  document.head.appendChild(css);

  /* ─── 5. NAVBAR HTML ────────────────────────────────────────── */
  const PHONE_SVG = `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M426.666 330.667a250.385 250.385 0 0 1-75.729-11.729c-7.469-2.136-16-1.073-21.332 5.333l-46.939 46.928c-60.802-30.928-109.864-80-140.802-140.803l46.939-46.927c5.332-5.333 7.462-13.864 5.332-21.333-8.537-24.531-12.802-50.136-12.802-76.803C181.333 73.604 171.734 64 160 64H85.333C73.599 64 64 73.604 64 85.333 64 285.864 226.136 448 426.666 448c11.73 0 21.334-9.604 21.334-21.333V352c0-11.729-9.604-21.333-21.334-21.333z"/></svg>`;
  const CHEV_SVG = `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M256 294.1L383 167c9.4-9.4 24.6-9.4 33.9 0s9.3 24.6 0 34L273 345c-9.1 9.1-23.7 9.3-33.1.7L95 201.1c-4.7-4.7-7-10.9-7-17s2.3-12.3 7-17c9.4-9.4 24.6-9.4 33.9 0l127.1 127z"/></svg>`;
  const CLOSE_SVG = `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M52.47 16.94L16.95 52.45 71.3 106.6h22.59L215 227.7v56.5L93.84 405.4H71.28l-54.26 54.2 35.34 35.5 54.24-54.4v-22.5L227.8 297h56.4l121.2 121.2v22.5l54.2 54.3 35.4-35.4-54.3-54.2h-22.5L297 284.2v-56.5l121.1-121.1h22.6L495 52.36 459.7 17l-54.3 54.25v22.57L284.2 215h-56.4L106.6 93.86V71.28L52.47 16.94z"/></svg>`;

  const navbarEl = document.createElement("div");
  navbarEl.innerHTML = `
  <div class="bc-navbar-wrap">
    <nav class="bc-navbar">

      <a class="bc-nav-logo" href="${L.home}">
        <img src="${prefix}images/connect/connect_2.png" alt="Boss Connect" width="160" height="50"/>
      </a>

      <div class="bc-nav-right">

        <ul class="bc-nav-links" id="bcNavLinks">
          <li><a href="${L.home}"${ac("home")}>Home</a></li>
          <li><a href="${L.about}"${ac("about")}>About</a></li>
          <li><a href="${L.contact}"${ac("contact")}>Contact</a></li>

          <!-- Capabilities: hover via CSS, no JS needed -->
          <li class="bc-cap-li">
            <button class="bc-cap-toggle" id="bcCapToggle" aria-haspopup="true">
              Capabilities ${CHEV_SVG}
            </button>
            <div class="bc-cap-dropdown" id="bcCapDropdown" role="menu">
              <a href="${L.consulting}"${acHref("consulting")} role="menuitem">Consulting</a>
              <a href="${L.events}"${acHref("events")} role="menuitem">Events</a>
              <a href="${L.coaching}"${acHref("coaching")} role="menuitem">Coaching</a>
              <a href="${L.creative}"${acHref("creative")} role="menuitem">Creative</a>
              <a href="${L.clicks}"${acHref("clicks")} role="menuitem">Clicks</a>
              <a href="${L.publications}"${acHref("publications")} role="menuitem">Publications</a>
              <a href="${L.champions}"${acHref("champions")} role="menuitem">Champions</a>
              <a href="${L.pyob}"${acHref("pyob")} role="menuitem">PYOB</a>
              <a href="${L.media}"${acHref("media")} role="menuitem">Media</a>
            </div>
          </li>

          <span class="bc-nav-indicator" id="bcNavIndicator"></span>
        </ul>

        <div class="bc-nav-divider">|</div>

        <a class="bc-nav-phone" href="tel:0421121985">
          ${PHONE_SVG}<span>0421 121 985</span>
        </a>

        <button class="bc-hamburger" id="bcHamburger" aria-label="Open menu">☰</button>

      </div>
    </nav>
  </div>

  <div class="bc-drawer-overlay" id="bcDrawerOverlay"></div>

  <aside class="bc-mobile-drawer" id="bcMobileDrawer">
    <div class="bc-drawer-close-row">
      <button class="bc-drawer-close" id="bcDrawerClose" aria-label="Close">${CLOSE_SVG}</button>
    </div>
    <nav class="bc-drawer-nav">
      <ul>
        <li><a href="${L.home}"${ac("home")}>Home</a></li>
        <li><a href="${L.about}"${ac("about")}>About</a></li>
        <li><a href="${L.contact}"${ac("contact")}>Contact</a></li>
        <li>
          <button class="bc-drawer-cap-btn${isCapability ? " open" : ""}" id="bcDrawerCapBtn">
            Capabilities ${CHEV_SVG}
          </button>
          <div class="bc-drawer-sub${isCapability ? " open" : ""}" id="bcDrawerSub">
            <a href="${L.consulting}"${acHref("consulting")}>Consulting</a>
            <a href="${L.events}"${acHref("events")}>Events</a>
            <a href="${L.coaching}"${acHref("coaching")}>Coaching</a>
            <a href="${L.creative}"${acHref("creative")}>Creative</a>
            <a href="${L.clicks}"${acHref("clicks")}>Clicks</a>
            <a href="${L.publications}"${acHref("publications")}>Publications</a>
            <a href="${L.champions}"${acHref("champions")}>Champions</a>
            <a href="${L.pyob}"${acHref("pyob")}>PYOB</a>
            <a href="${L.media}"${acHref("media")}>Media</a>
          </div>
        </li>
        <li class="bc-drawer-phone-li">
          <a href="tel:0421121985">${PHONE_SVG} 0421 121 985</a>
        </li>
      </ul>
    </nav>
  </aside>`;

  document.body.insertBefore(navbarEl, document.body.firstChild);

  /* ─── 6. FOOTER HTML ────────────────────────────────────────── */
  const year = new Date().getFullYear();
  const footerEl = document.createElement("div");
  footerEl.innerHTML = `
  <footer class="bc-footer">
    <div class="bc-footer-inner">
      <div class="bc-footer-cols">
        <div class="bc-footer-brand">
          <a href="${L.home}"><img src="${prefix}images/connect/connect_2.png" alt="Boss Connect" /></a>
          <p>Empowering businesses with strategic connections for growth.</p>
        </div>
        <div class="bc-footer-col">
          <h3>Company</h3>
          <ul>
            <li><a href="${L.about}">About</a></li>
            <li><a href="${L.contact}">Contact</a></li>
          </ul>
        </div>
        <div class="bc-footer-col">
          <h3>Capabilities</h3>
          <ul>
            <li><a href="${L.consulting}">Consulting</a></li>
            <li><a href="${L.events}">Events</a></li>
            <li><a href="${L.coaching}">Coaching</a></li>
            <li><a href="${L.creative}">Creative</a></li>
            <li><a href="${L.clicks}">Clicks</a></li>
            <li><a href="${L.publications}">Publications</a></li>
            <li><a href="${L.champions}">Champions</a></li>
            <li><a href="${L.pyob}">PYOB</a></li>
            <li><a href="${L.media}">Media</a></li>
          </ul>
        </div>
        <div class="bc-footer-col">
          <h3>Connect</h3>
          <div class="bc-footer-connect">
            <a href="mailto:info@bossconnect.com.au" class="bc-footer-email">info@bossconnect.com.au</a>
            <div class="bc-footer-socials">
              <a href="https://www.linkedin.com/company/boss-connect-aus" target="_blank" rel="noopener" aria-label="LinkedIn">
                <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="bc-footer-bottom">
        <p>© ${year} Boss Connect. All rights reserved.</p>
      </div>
    </div>
  </footer>`;

  document.body.appendChild(footerEl);

  /* ─── 7. INTERACTIVITY ──────────────────────────────────────── */
  const hamburger = document.getElementById("bcHamburger");
  const drawer = document.getElementById("bcMobileDrawer");
  const drawerOvl = document.getElementById("bcDrawerOverlay");
  const drawerClose = document.getElementById("bcDrawerClose");
  const drawerCapBtn = document.getElementById("bcDrawerCapBtn");
  const drawerSub = document.getElementById("bcDrawerSub");
  const navLinks = document.getElementById("bcNavLinks");
  const indicator = document.getElementById("bcNavIndicator");
  const capToggle = document.getElementById("bcCapToggle");

  /* ── Mobile drawer ── */
  function openDrawer() {
    drawer.classList.add("open");
    drawerOvl.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeDrawer() {
    drawer.classList.remove("open");
    drawerOvl.classList.remove("open");
    document.body.style.overflow = "";
  }
  hamburger.addEventListener("click", openDrawer);
  drawerClose.addEventListener("click", closeDrawer);
  drawerOvl.addEventListener("click", closeDrawer);

  /* ── Mobile capabilities accordion (tap to expand) ── */
  drawerCapBtn.addEventListener("click", function () {
    const open = drawerSub.classList.toggle("open");
    drawerCapBtn.classList.toggle("open", open);
  });

  /* ── Gold underline indicator ── */
  function moveIndicatorTo(el) {
    if (!el || !navLinks) return;
    const navRect = navLinks.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    indicator.style.left = elRect.left - navRect.left + "px";
    indicator.style.width = elRect.width + "px";
  }

  const topLinks = navLinks.querySelectorAll("li > a");
  let activeEl = null;

  // If this page should have NO highlight, skip everything
  if (!noActive) {
    // Find the active anchor
    topLinks.forEach(function (a) {
      if (a.classList.contains("bc-active")) activeEl = a;
      a.addEventListener("mouseenter", function () {
        moveIndicatorTo(a);
      });
    });

    // On capability pages → indicator sits under the Capabilities toggle
    if (isCapability) activeEl = capToggle;

    // Hover on toggle
    capToggle.addEventListener("mouseenter", function () {
      moveIndicatorTo(capToggle);
    });

    // Mouse leaves nav → snap indicator back to active item
    navLinks.addEventListener("mouseleave", function () {
      if (activeEl) moveIndicatorTo(activeEl);
      else indicator.style.width = "0";
    });

    // Initial indicator position on page load
    requestAnimationFrame(function () {
      if (activeEl) moveIndicatorTo(activeEl);
    });
  } else {
    // noActive page — hover still moves indicator but snaps back to nothing
    topLinks.forEach(function (a) {
      a.addEventListener("mouseenter", function () {
        moveIndicatorTo(a);
      });
    });
    capToggle.addEventListener("mouseenter", function () {
      moveIndicatorTo(capToggle);
    });
    navLinks.addEventListener("mouseleave", function () {
      indicator.style.width = "0";
    });
  }
})();