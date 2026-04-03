/* ============================================================
   app.js — Portfolio Interactions v2
   ============================================================ */
'use strict';

/* ──────────────────────────────────────────
   UTILITIES
────────────────────────────────────────── */
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch        = () => window.matchMedia('(pointer: coarse)').matches;

/* ──────────────────────────────────────────
   PAGE FADE-IN
────────────────────────────────────────── */
function initPageTransition() {
  document.body.style.opacity    = '0';
  document.body.style.transition = 'opacity 0.45s ease';
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  }));
}

/* ──────────────────────────────────────────
   NAVIGATION
────────────────────────────────────────── */
function initNav() {
  const nav    = qs('.nav');
  const toggle = qs('.nav__toggle');
  const menu   = qs('.nav__menu');
  if (!nav) return;

  const hero = qs('#hero');
  if (hero) nav.classList.add('nav--over-dark');

  let isScrolled = false;

  function onScroll() {
    const heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;
    const scrolled   = window.scrollY > 20;

    if (scrolled !== isScrolled) {
      isScrolled = scrolled;
      nav.classList.toggle('is-scrolled', scrolled);
    }
    if (hero) nav.classList.toggle('nav--over-dark', heroBottom > 80);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = toggle.classList.toggle('is-open');
      menu.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open);
    });
    qsa('.nav__link', menu).forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('is-open');
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Active link
  const sections = qsa('section[id]');
  const links    = qsa('.nav__link[href^="#"]');
  if (sections.length && links.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting)
          links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === `#${e.target.id}`));
      });
    }, { threshold: 0.3 });
    sections.forEach(s => io.observe(s));
  }
}

/* ──────────────────────────────────────────
   SCROLL PROGRESS BAR
────────────────────────────────────────── */
function initScrollProgress() {
  const bar = qs('#scroll-progress');
  if (!bar) return;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = max > 0 ? `${(window.scrollY / max) * 100}%` : '0%';
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ──────────────────────────────────────────
   SPLIT TEXT — word-by-word reveal
   Usage: add data-split to h2.section-title
────────────────────────────────────────── */
function initSplitText() {
  qsa('[data-split]').forEach(el => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(w =>
      `<span class="split-word"><span class="split-word__inner">${w}</span></span>`
    ).join(' ');
  });
}

/* ──────────────────────────────────────────
   SCROLL REVEAL (IntersectionObserver)
────────────────────────────────────────── */
function initScrollReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  qsa('.reveal, .reveal-clip, [data-split]').forEach(el => io.observe(el));
}

/* ──────────────────────────────────────────
   HERO PARALLAX
────────────────────────────────────────── */
function initParallax() {
  const hero        = qs('#hero');
  const heroContent = qs('.hero-dark__content');
  const heroScroll  = qs('.hero-dark__scroll');
  if (!hero || !heroContent || prefersReduced()) return;

  let ticking = false;
  const update = () => {
    const y = window.scrollY;
    if (y > window.innerHeight) { ticking = false; return; }
    const pct = y / window.innerHeight;
    heroContent.style.transform = `translateY(${y * 0.25}px)`;
    heroContent.style.opacity   = `${clamp(1 - pct * 1.4, 0, 1)}`;
    if (heroScroll) heroScroll.style.opacity = `${clamp(1 - y / 160, 0, 1)}`;
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
}

/* ──────────────────────────────────────────
   SCROLL VELOCITY SKEW
   Page content tilts slightly with scroll speed
────────────────────────────────────────── */
function initScrollSkew() {
  if (prefersReduced() || isTouch()) return;

  const targets = qsa('.project-card, .skill-card, .other-work-card');
  let lastY   = 0;
  let velocity = 0;
  let current  = 0;
  let raf;

  const tick = () => {
    const newY = window.scrollY;
    velocity   = clamp((newY - lastY) * 0.06, -3, 3);
    lastY      = newY;
    current    = lerp(current, velocity, 0.1);

    targets.forEach(el => {
      el.style.transform = (el.style.transform || '').replace(/skewY\([^)]+\)/, '')
        + ` skewY(${current.toFixed(3)}deg)`;
    });

    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
}

/* ──────────────────────────────────────────
   MAGNETIC BUTTONS
────────────────────────────────────────── */
function initMagnetic() {
  if (isTouch()) return;

  qsa('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect  = el.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = (e.clientX - cx) * 0.35;
      const dy    = (e.clientY - cy) * 0.35;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

/* ──────────────────────────────────────────
   PROJECT CARD VISUAL — SCROLL PARALLAX
────────────────────────────────────────── */
function initVisualParallax() {
  if (prefersReduced()) return;

  const visuals = qsa('.project-card__visual');
  let ticking   = false;

  const update = () => {
    visuals.forEach(el => {
      const rect   = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      const shift  = center * 0.08;
      el.style.transform = `translateY(${shift.toFixed(2)}px)`;
    });
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
}

/* ──────────────────────────────────────────
   SECTION NUMBER COUNTER (count-up)
────────────────────────────────────────── */
function initCounters() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el     = e.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.countSuffix || '';
      const dur    = 1200;
      const step   = 16;
      const steps  = dur / step;
      let   cur    = 0;

      el.classList.add('counting');
      const timer = setInterval(() => {
        cur += target / steps;
        if (cur >= target) {
          el.textContent = target + suffix;
          el.classList.remove('counting');
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(cur) + suffix;
        }
      }, step);
      io.unobserve(el);
    });
  }, { threshold: 0.6 });

  qsa('[data-count]').forEach(el => io.observe(el));
}

/* ──────────────────────────────────────────
   ABOUT PHOTO PULSE
────────────────────────────────────────── */
function initAboutPulse() {
  const photo = qs('.about__photo');
  if (!photo) return;

  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      photo.classList.add('is-pulsing');
      setTimeout(() => photo.classList.remove('is-pulsing'), 1500);
    }
  }, { threshold: 0.5 }).observe(photo);
}

/* ──────────────────────────────────────────
   FLOAT BADGE (hero)
────────────────────────────────────────── */
function initFloatElements() {
  const badge = qs('.hero-dark__badge');
  if (badge) badge.classList.add('float-badge');

  const emoji = qs('.about__photo-emoji');
  if (emoji) emoji.classList.add('float-emoji');
}

/* ──────────────────────────────────────────
   CURSOR GLOW (desktop)
────────────────────────────────────────── */
function initCursorGlow() {
  if (isTouch()) return;
  const glow = document.createElement('div');
  glow.id = 'cursor-glow';
  Object.assign(glow.style, {
    position: 'fixed', pointerEvents: 'none', zIndex: '9999',
    width: '320px', height: '320px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(100,60,220,0.07) 0%, transparent 70%)',
    transform: 'translate(-50%, -50%)',
    transition: 'opacity 0.3s ease',
    mixBlendMode: 'multiply',
  });
  document.body.appendChild(glow);

  let mx = -999, my = -999;
  const tick = () => {
    glow.style.left = `${mx}px`;
    glow.style.top  = `${my}px`;
    requestAnimationFrame(tick);
  };
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { glow.style.opacity = '1'; });
  requestAnimationFrame(tick);
}

/* ──────────────────────────────────────────
   CARD 3D TILT (desktop)
────────────────────────────────────────── */
function initCardTilt() {
  if (isTouch()) return;
  const MAX = 4;
  qsa('[data-tilt]').forEach(card => {
    card.addEventListener('mouseenter', e => {
      const r  = card.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
      const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
      card.style.transform  = `translateY(-4px) perspective(900px) rotateY(${dx*MAX}deg) rotateX(${-dy*MAX}deg)`;
      card.style.transition = 'transform 0.3s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'transform 0.55s cubic-bezier(0.34,1.56,0.64,1)';
    });
  });
}

/* ──────────────────────────────────────────
   HERO WebGL — PURPLE SHADER
────────────────────────────────────────── */
function initHeroWebGL() {
  const canvas = qs('#hero-canvas');
  if (!canvas || typeof THREE === 'undefined' || prefersReduced()) return;

  const scene    = new THREE.Scene();
  const camera   = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, -1);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(new THREE.Color(0x06061A));

  const uniforms = {
    resolution: { value: [window.innerWidth, window.innerHeight] },
    time:       { value: 0.0 },
    xScale:     { value: 1.05 },
    yScale:     { value: 0.38 },
    distortion: { value: 0.09 },
  };

  const vert = `attribute vec3 position; void main(){gl_Position=vec4(position,1.0);}`;

  /* Purple / violet wave — chromatic aberration in violet palette */
  const frag = `
    precision highp float;
    uniform vec2  resolution;
    uniform float time;
    uniform float xScale;
    uniform float yScale;
    uniform float distortion;

    void main() {
      vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

      /* Chromatic aberration offsets */
      float d  = length(p) * distortion;
      float rx = p.x * (1.0 + d * 1.2);
      float gx = p.x * (1.0 - d * 0.3);
      float bx = p.x * (1.0 - d * 0.8);

      float ri = 0.04 / abs(p.y + sin((rx + time) * xScale) * yScale);
      float gi = 0.04 / abs(p.y + sin((gx + time + 0.15) * xScale) * yScale);
      float bi = 0.06 / abs(p.y + sin((bx + time - 0.1 ) * xScale) * yScale);

      /* Tint to purple/violet: r*0.4, g*0.05, b*1.0 */
      float r = ri * 0.42 + bi * 0.12;
      float g = gi * 0.06 + ri * 0.02;
      float b = bi * 1.00 + ri * 0.28;

      gl_FragColor = vec4(r, g, b, 1.0);
    }
  `;

  /* Full-screen triangle — no diagonal seam */
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(
    new Float32Array([-1,-1,0, 3,-1,0, -1,3,0]), 3
  ));
  scene.add(new THREE.Mesh(geo, new THREE.RawShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms })));

  function onResize() {
    const w = canvas.clientWidth  || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    uniforms.resolution.value = [w, h];
  }
  onResize();
  window.addEventListener('resize', onResize, { passive: true });

  let rafId;
  const animate = () => {
    uniforms.time.value += 0.007;
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(animate);
  };
  animate();
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(rafId); else animate();
  });
}

/* ──────────────────────────────────────────
   ORBITAL ANIMATION (skills)
────────────────────────────────────────── */
function initOrbitalAnimation() {
  const system = qs('.orbit-system');
  if (!system) return;

  const css = getComputedStyle(document.documentElement);
  const pv  = (n) => parseFloat(css.getPropertyValue(n)) || 0;

  [
    { sel: '[data-ring="1"]', r: pv('--orbit-r1') || 115, dur: 18 },
    { sel: '[data-ring="2"]', r: pv('--orbit-r2') || 178, dur: 28 },
    { sel: '[data-ring="3"]', r: pv('--orbit-r3') || 238, dur: 42 },
  ].forEach(({ sel, r, dur }) => {
    const chips = qsa(sel, system);
    chips.forEach((chip, i) => {
      const delay = -(dur * (i / chips.length));
      chip.style.setProperty('--orbit-r',     `${r}px`);
      chip.style.setProperty('--orbit-dur',   `${dur}s`);
      chip.style.setProperty('--orbit-delay', `${delay}s`);
    });
  });

  if (prefersReduced())
    qsa('.orbit-chip', system).forEach(c => { c.style.animationPlayState = 'paused'; });
}

/* ──────────────────────────────────────────
   SMOOTH ANCHOR SCROLL
────────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = qs(href);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10
      ) || 72;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH - 16, behavior: 'smooth' });
    });
  });
}

/* ──────────────────────────────────────────
   SECTION LINE DRAW
────────────────────────────────────────── */
function initSectionLines() {
  qsa('.section-header').forEach(header => {
    header.classList.add('reveal');
  });
}

/* ──────────────────────────────────────────
   INIT ALL
────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initPageTransition();
  initSplitText();          // must run before initScrollReveal
  initSectionLines();
  initNav();
  initScrollProgress();
  initScrollReveal();
  initParallax();
  initVisualParallax();
  initScrollSkew();
  initMagnetic();
  initCursorGlow();
  initCardTilt();
  initHeroWebGL();
  initOrbitalAnimation();
  initCounters();
  initAboutPulse();
  initFloatElements();
  initSmoothScroll();
});

/* bfcache 복원 시 재초기화 (뒤로가기 후 진입 시 이미지 안 보이는 문제 방지) */
window.addEventListener('pageshow', e => {
  if (!e.persisted) return;
  initPageTransition();
  initScrollReveal();
  initNav();
  initScrollProgress();
});
