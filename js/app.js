/* ============================================================
   app.js — Portfolio Interactions & Animations
   ============================================================ */

'use strict';

/* ──────────────────────────────────────────
   NAVIGATION
────────────────────────────────────────── */
function initNav() {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.querySelector('.nav__menu');

  if (!nav) return;

  // Scroll state
  const SCROLL_THRESHOLD = 20;
  let isScrolled = false;

  function onScroll() {
    const shouldBeScrolled = window.scrollY > SCROLL_THRESHOLD;
    if (shouldBeScrolled !== isScrolled) {
      isScrolled = shouldBeScrolled;
      nav.classList.toggle('is-scrolled', isScrolled);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // initial call

  // Mobile toggle
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = toggle.classList.toggle('is-open');
      menu.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
    });

    // Close on link click
    menu.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('is-open');
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Active link highlight on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link[href^="#"]');

  if (sections.length && navLinks.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => {
              link.classList.toggle(
                'is-active',
                link.getAttribute('href') === `#${id}`
              );
            });
          }
        });
      },
      { threshold: 0.35 }
    );
    sections.forEach(s => observer.observe(s));
  }
}

/* ──────────────────────────────────────────
   SCROLL REVEAL
────────────────────────────────────────── */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

/* ──────────────────────────────────────────
   HERO WebGL SHADER ANIMATION
   ── Modular: fully encapsulated ──
────────────────────────────────────────── */
function initHeroWebGL() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const scene    = new THREE.Scene();
  const camera   = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, -1);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(new THREE.Color(0x06061A));

  const uniforms = {
    resolution:  { value: [window.innerWidth, window.innerHeight] },
    time:        { value: 0.0 },
    xScale:      { value: 1.1 },
    yScale:      { value: 0.42 },
    distortion:  { value: 0.07 },
  };

  const vertexShader = `
    attribute vec3 position;
    void main() {
      gl_Position = vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    precision highp float;
    uniform vec2  resolution;
    uniform float time;
    uniform float xScale;
    uniform float yScale;
    uniform float distortion;

    void main() {
      vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

      float d  = length(p) * distortion;
      float rx = p.x * (1.0 + d);
      float gx = p.x;
      float bx = p.x * (1.0 - d);

      float r = 0.05 / abs(p.y + sin((rx + time) * xScale) * yScale);
      float g = 0.05 / abs(p.y + sin((gx + time) * xScale) * yScale);
      float b = 0.05 / abs(p.y + sin((bx + time) * xScale) * yScale);

      gl_FragColor = vec4(r, g, b, 1.0);
    }
  `;

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
    -1, -1, 0,   1, -1, 0,  -1, 1, 0,
     1, -1, 0,  -1,  1, 0,   1, 1, 0,
  ]), 3));

  const mat  = new THREE.RawShaderMaterial({ vertexShader, fragmentShader, uniforms });
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);

  function onResize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    uniforms.resolution.value = [w, h];
  }
  onResize();
  window.addEventListener('resize', onResize, { passive: true });

  let rafId;
  function animate() {
    uniforms.time.value += 0.008;
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(animate);
  }
  animate();

  // Pause when tab is hidden (performance)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      animate();
    }
  });
}

/* ──────────────────────────────────────────
   ORBITAL ANIMATION (Skills section)
   ── Modular: fully encapsulated ──
────────────────────────────────────────── */
function initOrbitalAnimation() {
  const system = document.querySelector('.orbit-system');
  if (!system) return;

  // Read CSS variables for radii
  const style = getComputedStyle(document.documentElement);
  const parseVar = (name) => parseFloat(style.getPropertyValue(name)) || 0;

  const rings = [
    {
      selector: '[data-ring="1"]',
      radius: parseVar('--orbit-r1') || 115,
      duration: parseVar('--orbit-dur-1') || 18,
    },
    {
      selector: '[data-ring="2"]',
      radius: parseVar('--orbit-r2') || 178,
      duration: parseVar('--orbit-dur-2') || 28,
    },
    {
      selector: '[data-ring="3"]',
      radius: parseVar('--orbit-r3') || 238,
      duration: parseVar('--orbit-dur-3') || 42,
    },
  ];

  rings.forEach(ring => {
    const chips = system.querySelectorAll(ring.selector);
    if (!chips.length) return;

    chips.forEach((chip, i) => {
      const startAngleDeg = (i / chips.length) * 360;
      // negative delay = start animation partway through = offset position
      const delay = -(ring.duration * startAngleDeg / 360);

      chip.style.setProperty('--orbit-r', `${ring.radius}px`);
      chip.style.setProperty('--orbit-dur', `${ring.duration}s`);
      chip.style.setProperty('--orbit-delay', `${delay}s`);
    });
  });

  // Pause on reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    system.style.setProperty('--orbit-dur-1', '0s');
    system.style.setProperty('--orbit-dur-2', '0s');
    system.style.setProperty('--orbit-dur-3', '0s');
    system.querySelectorAll('.orbit-chip').forEach(chip => {
      chip.style.animationPlayState = 'paused';
    });
  }
}

/* ──────────────────────────────────────────
   CURSOR GLOW EFFECT (desktop only)
────────────────────────────────────────── */
function initCursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const glow = document.createElement('div');
  glow.id = 'cursor-glow';
  glow.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9999;
    width: 300px; height: 300px; border-radius: 50%;
    background: radial-gradient(circle, rgba(255,59,59,0.06) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
    mix-blend-mode: multiply;
  `;
  document.body.appendChild(glow);

  let mx = -999, my = -999;
  let raf;

  function update() {
    glow.style.left = `${mx}px`;
    glow.style.top  = `${my}px`;
    raf = requestAnimationFrame(update);
  }

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    glow.style.opacity = '1';
  });

  raf = requestAnimationFrame(update);
}

/* ──────────────────────────────────────────
   CARD TILT EFFECT (subtle 3D hover)
────────────────────────────────────────── */
function initCardTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cards = document.querySelectorAll('[data-tilt]');
  const MAX_TILT = 4; // degrees

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) / (rect.width  / 2);
      const dy   = (e.clientY - cy) / (rect.height / 2);

      card.style.transform = `
        translateY(-4px)
        perspective(800px)
        rotateY(${dx * MAX_TILT}deg)
        rotateX(${-dy * MAX_TILT}deg)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  });
}

/* ──────────────────────────────────────────
   COUNTER ANIMATION (numbers count up)
────────────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const duration = 1200;
        const step = 16;
        const steps = duration / step;
        let current = 0;

        const timer = setInterval(() => {
          current += target / steps;
          if (current >= target) {
            el.textContent = target + (el.dataset.countSuffix || '');
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(current) + (el.dataset.countSuffix || '');
          }
        }, step);

        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
}

/* ──────────────────────────────────────────
   SMOOTH ANCHOR SCROLL
────────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const navH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-height'),
        10
      ) || 72;

      const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ──────────────────────────────────────────
   PAGE TRANSITION FADE IN
────────────────────────────────────────── */
function initPageTransition() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });
}

/* ──────────────────────────────────────────
   INIT ALL
────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initPageTransition();
  initNav();
  initScrollReveal();
  initHeroWebGL();
  initOrbitalAnimation();
  initCursorGlow();
  initCardTilt();
  initCounters();
  initSmoothScroll();
});
