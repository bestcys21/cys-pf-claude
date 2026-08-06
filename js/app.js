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
  else      nav.classList.add('is-scrolled');   // 상세페이지: 처음부터 solid nav

  let isScrolled = false;

  function onScroll() {
    if (!hero) return;  // 상세페이지: is-scrolled 항상 유지 (제거 안 함)

    const heroBottom = hero.getBoundingClientRect().bottom;
    const navBottom  = nav.getBoundingClientRect().bottom;
    const scrolled   = window.scrollY > 20;

    if (scrolled !== isScrolled) {
      isScrolled = scrolled;
      nav.classList.toggle('is-scrolled', scrolled);
    }
    // nav가 frosted-white로 바뀌는 순간(is-scrolled) 글자는 dark로 전환 — 흰배경+흰글자 가독성 문제 방지
    nav.classList.toggle('nav--over-dark', !scrolled && heroBottom > navBottom);
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

  // Active link (scroll-based detection)
  const sections = qsa('section[id]');
  const links    = qsa('.nav__link[href^="#"]');

  // 직접 매핑되는 nav 링크가 없는 섹션 → 어느 nav를 활성화시킬지 정의
  const sectionToNav = {
    'other-works': 'works',
    'contact':     'about',
  };

  const updateActive = () => {
    if (!sections.length || !links.length) return;
    const navH = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--nav-height')
    ) || 72;
    const triggerY = navH + 80;
    let activeSection = sections[0];
    for (const s of sections) {
      if (s.getBoundingClientRect().top - triggerY <= 0) activeSection = s;
    }
    const activeId = sectionToNav[activeSection.id] || activeSection.id;
    links.forEach(l => {
      l.classList.toggle('is-active', l.getAttribute('href') === `#${activeId}`);
    });
  };

  let scrollScheduled = false;
  window.addEventListener('scroll', () => {
    if (scrollScheduled) return;
    scrollScheduled = true;
    requestAnimationFrame(() => { updateActive(); scrollScheduled = false; });
  }, { passive: true });

  requestAnimationFrame(() => requestAnimationFrame(updateActive));
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
    const text = el.textContent.trim().replace(/\s+/g, ' ');
    el.setAttribute('aria-label', text);
    let charIndex = 0;
    el.innerHTML = text.split(' ').map(word => {
      const chars = Array.from(word).map(char =>
        `<span class="split-char" aria-hidden="true" style="--char-i:${charIndex++}">${char}</span>`
      ).join('');
      charIndex += 1;
      return `<span class="split-word">${chars}</span>`;
    }).join(' ');
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

        // orbit 배지 순차 등장
        if (e.target.classList.contains('skills__orbital')) {
          qsa('.orbit-chip', e.target).forEach((chip, i) => {
            chip.style.transitionDelay = `${0.1 + i * 0.12}s`;
          });
        }

        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.02, rootMargin: '0px 0px -40px 0px' });

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
    heroContent.style.setProperty('--scroll-y', `${y * 0.15}px`);
    heroContent.style.opacity = `${clamp(1 - pct * 0.45, 0, 1)}`;
    if (heroScroll) heroScroll.style.opacity = `${clamp(1 - y / 240, 0, 1)}`;
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
}

/* ──────────────────────────────────────────
   HERO TITLE LETTER SPLIT — char-by-char entrance
   Splits the h1 into individual letter spans with staggered delays
────────────────────────────────────────── */
function initHeroTitleChars() {
  const title = qs('.hero-dark__title');
  if (!title || title.classList.contains('has-chars')) return;

  // Split text into word wrappers, each containing char spans.
  // Preserve <br> and <strong>. Words wrap as units so they don't break mid-letter.
  const wrapWord = (text, isStrong) => {
    const word = document.createElement('span');
    word.className = 'word';
    for (const ch of text) {
      const sp = document.createElement('span');
      sp.className = 'char';
      if (isStrong) sp.classList.add('char--strong');
      sp.textContent = ch;
      word.appendChild(sp);
    }
    return word;
  };

  const splitNode = (node, isStrong) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const frag = document.createDocumentFragment();
      const parts = node.textContent.split(/(\s+)/);
      parts.forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(' '));
        } else {
          frag.appendChild(wrapWord(part, isStrong));
        }
      });
      node.parentNode.replaceChild(frag, node);
      return;
    }
    // Handle new structure: recursively split children of the solid text part
    if (node.nodeName === 'SPAN' && node.classList.contains('hero-dark__title-solid')) {
      Array.from(node.childNodes).forEach(c => splitNode(c, false));
      return;
    }
    // Handle new structure: recursively split children of the gradient text part
    if (node.nodeName === 'STRONG' && node.classList.contains('hero-dark__title-gradient')) {
      Array.from(node.childNodes).forEach(c => splitNode(c, true));
      return;
    }
    // BR or other: keep as-is
  };

  Array.from(title.childNodes).forEach(n => splitNode(n, false));
  title.classList.add('has-chars');

  // Stagger delays
  const chars = qsa('.char', title);
  chars.forEach((c, i) => {
    c.style.animationDelay = `${0.25 + i * 0.035}s`;
  });
}

/* ──────────────────────────────────────────
   EYEBROW LETTER SPLIT — char-by-char on viewport entry
────────────────────────────────────────── */
function initEyebrowChars() {
  qsa('.eyebrow').forEach(el => {
    if (el.classList.contains('has-chars')) return;
    const text = el.textContent;
    el.innerHTML = '';
    const parts = text.split(/(\s+)/);
    parts.forEach(part => {
      if (!part) return;
      if (/^\s+$/.test(part)) {
        el.appendChild(document.createTextNode(' '));
        return;
      }
      const word = document.createElement('span');
      word.className = 'word';
      for (const ch of part) {
        const sp = document.createElement('span');
        sp.className = 'char';
        sp.textContent = ch;
        word.appendChild(sp);
      }
      el.appendChild(word);
    });
    if (false) [...text].forEach(ch => {
      const sp = document.createElement('span');
      sp.className = 'char' + ((ch === ' ' || ch === ' ') ? ' char--space' : '');
      if (!sp.classList.contains('char--space')) sp.textContent = ch;
      el.appendChild(sp);
    });
    el.classList.add('has-chars');
    qsa('.char', el).forEach((c, i) => {
      c.style.transitionDelay = `${i * 0.04}s`;
    });
    // Add reveal class so existing IntersectionObserver picks it up
    if (!el.classList.contains('reveal')) el.classList.add('reveal');
  });
}

/* ──────────────────────────────────────────
   HERO CONTENT 3D TILT — subtle mouse follow
────────────────────────────────────────── */
function initHeroTilt() {
  if (prefersReduced() || isTouch()) return;
  const hero = qs('.hero-dark');
  const content = qs('.hero-dark__content');
  if (!hero || !content) return;

  let frame;
  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    if (frame) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      // y axis -> rotateX (inverted for natural tilt)
      // x axis -> rotateY
      content.style.setProperty('--rx', `${(-y * 2).toFixed(2)}deg`);
      content.style.setProperty('--ry', `${(x * 2.5).toFixed(2)}deg`);
    });
  }, { passive: true });

  hero.addEventListener('mouseleave', () => {
    content.style.setProperty('--rx', '0deg');
    content.style.setProperty('--ry', '0deg');
  });
}

/* ──────────────────────────────────────────
   DARK SECTION NOISE — inject grain overlay element
────────────────────────────────────────── */
function initDarkNoise() {
  const hero = qs('.hero-dark');
  if (hero && !qs('.hero-noise', hero)) {
    const noise = document.createElement('div');
    noise.className = 'hero-noise';
    noise.setAttribute('aria-hidden', 'true');
    hero.appendChild(noise);
  }
  const skills = qs('.skills--dark');
  if (skills && !qs('.skills-noise', skills)) {
    const noise = document.createElement('div');
    noise.className = 'skills-noise';
    noise.setAttribute('aria-hidden', 'true');
    skills.appendChild(noise);
  }
}

/* ──────────────────────────────────────────
   HERO MOCKUP MOUSE PARALLAX
   Mockups follow mouse subtly within the hero
────────────────────────────────────────── */
function initHeroMockupParallax() {
  if (prefersReduced() || isTouch()) return;
  const hero    = qs('.hero-dark');
  const mockups = qsa('.hero-dark__mockup');
  if (!hero || !mockups.length) return;

  // Per-mockup sensitivity [px-x, px-y]
  const factors = [
    [14, 8],   // #1 top-left large
    [-14, 8],  // #2 top-right large
    [-8, -6],  // #3 bottom-right medium
    [10, -6],  // #4 bottom-left medium
    [6, 5],    // #5 back-layer small (subtle)
  ];

  let frame;
  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    if (frame) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      mockups.forEach((m, i) => {
        const [fx, fy] = factors[i] || [0, 0];
        m.style.setProperty('--px', `${(x * fx).toFixed(2)}px`);
        m.style.setProperty('--py', `${(y * fy).toFixed(2)}px`);
      });
    });
  }, { passive: true });

  hero.addEventListener('mouseleave', () => {
    mockups.forEach(m => {
      m.style.setProperty('--px', '0px');
      m.style.setProperty('--py', '0px');
    });
  });
}

/* ──────────────────────────────────────────
   SCROLL VELOCITY SKEW
   Page content tilts slightly with scroll speed
────────────────────────────────────────── */
function initScrollSkew() {
  return; // 스크롤 skew 효과 제거
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

  const cards = qsa('.project-card');
  let ticking   = false;

  const update = () => {
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const viewportRange = window.innerHeight + rect.height;
      const progress = clamp((window.innerHeight - rect.top) / viewportRange, 0, 1);
      card.style.setProperty('--scroll-progress', progress.toFixed(3));
      card.classList.toggle('is-scroll-active', progress > 0.2 && progress < 0.8);
    });
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
}

/* ──────────────────────────────────────────
   SKILLS SPOTLIGHT
────────────────────────────────────────── */
function initSkillsExpand() {
  const skills = qs('.skills--dark');
  if (!skills) return;

  if (prefersReduced() || window.matchMedia('(max-width: 768px)').matches) {
    skills.style.setProperty('--skills-inset', '0px');
    skills.style.setProperty('--skills-inset-y', '0px');
    skills.style.setProperty('--skills-radius', '0px');
    return;
  }

  let ticking = false;

  const update = () => {
    const rect = skills.getBoundingClientRect();
    const viewport = window.innerHeight;
    const start = viewport * 0.92;
    const raw = Math.max(0, Math.min(1, (start - rect.top) / (viewport * 0.78)));
    const progress = raw * raw * (3 - 2 * raw);
    const maxInset = Math.min(window.innerWidth * 0.18, 300);

    skills.style.setProperty('--skills-inset', `${maxInset * (1 - progress)}px`);
    skills.style.setProperty('--skills-inset-y', `${64 * (1 - progress)}px`);
    skills.style.setProperty('--skills-radius', `${38 * (1 - progress)}px`);
    ticking = false;
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  update();
}

function initSkillsSpotlight() {
  if (prefersReduced() || isTouch()) return;
  const skills = qs('.skills--dark');
  if (!skills) return;

  skills.addEventListener('pointermove', e => {
    const rect = skills.getBoundingClientRect();
    skills.style.setProperty('--skills-x', `${e.clientX - rect.left}px`);
    skills.style.setProperty('--skills-y', `${e.clientY - rect.top}px`);
  }, { passive: true });

  skills.addEventListener('pointerleave', () => {
    skills.style.setProperty('--skills-x', '72%');
    skills.style.setProperty('--skills-y', '42%');
  });
}

/* ──────────────────────────────────────────
   DETAIL PAGE — image depth and section focus
────────────────────────────────────────── */
function initDetailMotion() {
  const detailRoot = qs('.sf-hero, .other-detail');
  if (!detailRoot) return;

  document.body.classList.add('is-detail-page');
  if (prefersReduced()) return;

  const images = qsa('.sf-img-block, .sf-cover');
  const sections = qsa('.sf-section');
  let ticking = false;

  const update = () => {
    images.forEach(block => {
      const rect = block.getBoundingClientRect();
      const range = window.innerHeight + rect.height;
      const progress = clamp((window.innerHeight - rect.top) / range, 0, 1);
      block.style.setProperty('--detail-progress', progress.toFixed(3));
    });

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const active = rect.top < window.innerHeight * 0.62 && rect.bottom > window.innerHeight * 0.28;
      section.classList.toggle('is-section-active', active);
    });
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });
  window.addEventListener('resize', update, { passive: true });
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
   CARD 3D TILT (desktop)
────────────────────────────────────────── */
function initCardTilt() {
  // tilt 효과 제거 — 이미지 zoom으로 대체 (CSS)
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
    { sel: '[data-ring="4"]', r: pv('--orbit-r4') || 300, dur: 58 },
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

/* Keep direct section links aligned after web components and fonts settle */
function initHashPosition() {
  if (!window.location.hash) return;
  const target = qs(window.location.hash);
  if (!target) return;

  window.setTimeout(() => {
    const navH = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10
    ) || 72;
    const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
    window.scrollTo({ top, behavior: 'auto' });
  }, 180);
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
  initHeroTitleChars();     // must run before initScrollReveal
  initEyebrowChars();       // must run before initScrollReveal
  initSplitText();          // must run before initScrollReveal
  initSectionLines();
  initDarkNoise();
  initSkillsExpand();
  initSkillsSpotlight();
  initNav();
  initScrollProgress();
  initScrollReveal();
  initParallax();
  initHeroMockupParallax();
  initHeroTilt();
  initVisualParallax();
  initDetailMotion();
  initScrollSkew();
  initMagnetic();
  initCardTilt();
  initHeroWebGL();
  initOrbitalAnimation();
  initCounters();
  initAboutPulse();
  initFloatElements();
  initSmoothScroll();
  initHashPosition();
});

/* bfcache 복원 시 재초기화 (뒤로가기 후 진입 시 이미지 안 보이는 문제 방지) */
window.addEventListener('pageshow', e => {
  if (!e.persisted) return;
  initPageTransition();
  initScrollReveal();
  initNav();
  initScrollProgress();
});
