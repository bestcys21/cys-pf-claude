/* =========================================================
   SyncFlo AX — 포트폴리오 섹션 인터랙션 (외부 라이브러리 없음)
   · .axp 루트 안에서만 동작, 전역 변수 없음
   · 화면에 보일 때만 재생, prefers-reduced-motion 이면 정적 표시
   ========================================================= */
(function () {
  'use strict';
  var root = document.querySelector('.axp');
  if (!root) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;
  if (reduce || !hasIO) root.classList.add('no-motion');

  /* 움직임 줄이기 설정에서는 영상을 불러오지 않습니다. */
  if (!reduce) {
    var heroVideo = root.querySelector('.axp-hero__video');
    if (heroVideo) {
      heroVideo.src = heroVideo.dataset.src;
      heroVideo.addEventListener('loadeddata', function () {
        heroVideo.closest('.axp-hero').classList.add('has-video');
      }, { once: true });
      heroVideo.play().catch(function () {});
    }
  }

  function $(s, el) { return (el || root).querySelector(s); }
  function $$(s, el) { return Array.prototype.slice.call((el || root).querySelectorAll(s)); }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function onView(el, cb, th) {
    if (!el) return;
    if (!hasIO) { cb(true); return; }
    new IntersectionObserver(function (en) { cb(en[0].isIntersecting); }, { threshold: th == null ? 0.3 : th }).observe(el);
  }
  function once(el, cb, th) {
    if (!el) return;
    if (!hasIO) { cb(); return; }
    var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { cb(); io.disconnect(); } }, { threshold: th == null ? 0.25 : th });
    io.observe(el);
  }
  function countUp(el, to, dur) {
    if (!el) return;
    var t0 = performance.now(), fmt = to >= 1000;
    (function tick(t) {
      var k = Math.min(1, (t - t0) / dur), v = Math.round(to * (1 - Math.pow(1 - k, 3)));
      el.textContent = fmt ? v.toLocaleString('ko-KR') : v;
      if (k < 1) requestAnimationFrame(tick);
    })(t0);
  }

  /* ---------- 공통: 등장 효과 ---------- */
  function initReveal() {
    var els = $$('.axp-rv');
    if (reduce || !hasIO) { els.forEach(function (e) { e.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- 0. 히어로: 대화가 실제처럼 진행되는 대표 화면 ---------- */
  function initHero() {
    var app = $('#axpApp');
    if (!app) return;
    if (reduce || !hasIO || !window.Promise) { $$('.axp-tools li', app).forEach(function (li) { li.classList.add('is-done'); }); return; }
    var scroller = $('.axp-app__scroll', app), input = $('.axp-app__input', app), typed = $('.axp-app__typed', app);
    var steps = $$('.axp-step', app);
    var visible = false, running = false, token = 0;

    function reset() {
      app.classList.remove('is-conversing');
      steps.forEach(function (s) { s.classList.remove('is-in'); });
      var history = $('[data-s="hist1"]', app);
      if (history) history.classList.remove('is-on');
      $$('.axp-tools li', app).forEach(function (li) { li.classList.remove('is-done'); });
      $$('.axp-a', app).forEach(function (a) { a.classList.remove('is-thinking'); });
      input.classList.remove('is-typing', 'is-focus', 'is-zoom', 'is-sending'); typed.textContent = '';
      scroller.style.scrollBehavior = 'auto'; scroller.scrollTop = 0; scroller.style.scrollBehavior = '';
    }
    function follow() { requestAnimationFrame(function () { scroller.scrollTop = scroller.scrollHeight; }); }
    function show(el) { el.classList.add('is-in'); follow(); }
    function type(text, my) {
      input.classList.add('is-focus', 'is-typing', 'is-zoom');
      var i = 0;
      return new Promise(function (res) {
        (function next() {
          if (my !== token) return res();
          typed.textContent = text.slice(0, ++i);
          if (i < text.length) setTimeout(next, 30); else setTimeout(res, 260);
        })();
      });
    }
    function send(my) {
      if (my !== token) return Promise.resolve();
      input.classList.remove('is-typing');
      input.classList.add('is-sending');
      return wait(360).then(function () {
        input.classList.remove('is-focus', 'is-zoom', 'is-sending');
        typed.textContent = '';
      });
    }
    function stream(p, my) {
      var html = p.innerHTML, text = p.textContent, i = 0;
      p.textContent = ''; p.classList.add('is-stream'); show(p);
      return new Promise(function (res) {
        (function next() {
          if (my !== token) { p.innerHTML = html; return res(); }
          i += 2; p.textContent = text.slice(0, i); follow();
          if (i < text.length) setTimeout(next, 22); else { p.innerHTML = html; p.classList.remove('is-stream'); res(); }
        })();
      });
    }
    function answer(a, my) {
      var tools = $$('.axp-tools li', a), text = $('.axp-a__text', a), rest = $$('.axp-rcard, .axp-a__note', a);
      a.classList.add('is-thinking'); show(a);
      var p = wait(400);
      tools.forEach(function (li) {
        p = p.then(function () { if (my !== token) return; show(li); return wait(650); })
             .then(function () { li.classList.add('is-done'); return wait(120); });
      });
      return p.then(function () { a.classList.remove('is-thinking'); if (my !== token) return; return stream(text, my); })
        .then(function () {
          var c = Promise.resolve();
          rest.forEach(function (r) {
            c = c.then(function () {
              if (my !== token) return;
              show(r);
              $$('[data-count]', r).forEach(function (n) { countUp(n, +n.getAttribute('data-count'), 900); });
              return wait(700);
            });
          });
          return c;
        });
    }
    function loop() {
      var my = ++token; running = true; reset();
      var history = $('[data-s="hist1"]', app), q1 = $('[data-s="q1"]', app), a1 = $('[data-s="a1"]', app);
      wait(220)
        .then(function () { app.classList.add('is-conversing'); return type(q1.textContent.trim(), my); })
        .then(function () { return send(my); })
        .then(function () {
          if (my !== token) return;
          if (history) { show(history); history.classList.add('is-on'); }
          show(q1);
          return wait(360);
        })
        .then(function () { return answer(a1, my); })
        .then(function () { return wait(8000); })
        .then(function () {
          running = false;
          if (visible && my === token) loop();
        });
    }
    onView(input, function (v) {
      visible = v;
      if (v && !running) loop();
    }, 0.5);
  }

  /* ---------- 1. 문장: 스크롤하면 단어가 채워짐 ---------- */
  function initStatement() {
    var p = $('#axpStatement');
    if (!p) return;
    (function wrap(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var f = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (t) {
            if (!t) return;
            if (/^\s+$/.test(t)) f.appendChild(document.createTextNode(t));
            else { var s = document.createElement('span'); s.className = 'w'; s.textContent = t; f.appendChild(s); }
          });
          node.replaceChild(f, n);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') wrap(n);
      });
    })(p);
    var words = $$('.w', p);
    if (reduce) { words.forEach(function (w) { w.classList.add('on'); }); return; }
    var ticking = false;
    function update() {
      ticking = false;
      var r = p.getBoundingClientRect(), vh = window.innerHeight;
      // 문장 윗부분이 화면 82% 지점에 올 때 시작, 아래가 45% 지점에 올 때 끝
      var start = vh * 0.82, end = vh * 0.45;
      var prog = (start - r.top) / ((start - end) + r.height);
      prog = Math.max(0, Math.min(1, prog));
      var k = Math.round(prog * words.length);
      words.forEach(function (w, i) { w.classList.toggle('on', i < k); });
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------- 2. 연결 다이어그램 ---------- */
  function initConnect() {
    var dia = $('#axpDia');
    if (!dia) return;
    var items = $$('.axp-dia__sys li', dia), hub = $('.axp-dia__hub', dia);
    var NS = 'http://www.w3.org/2000/svg';
    var gBase = $('.axp-dia__base', dia), gLine = $('.axp-dia__line', dia), gFlow = $('.axp-dia__flow', dia);
    var lines = [];
    // 왼쪽 카드 6개(높이 54, 간격 12)의 가운데 → 오른쪽 허브 가운데(192)로 곡선
    items.forEach(function (_, i) {
      var y = 27 + i * 66, d = 'M0 ' + y + ' C 300 ' + y + ', 300 192, 600 192';
      [gBase, gLine, gFlow].forEach(function (g) {
        var p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); g.appendChild(p);
        if (g === gLine) lines.push(p);
      });
    });
    var bases = $$('path', gBase);
    function setDash(p, hidden) { var L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = hidden ? L : 0; }
    if (reduce || !hasIO) {
      items.forEach(function (li) { li.classList.add('is-in', 'is-linked'); });
      hub.classList.add('is-in'); dia.classList.add('is-live');
      return;
    }
    bases.concat(lines).forEach(function (p) { setDash(p, true); });
    once(dia, function () {
      items.forEach(function (li, i) { setTimeout(function () { li.classList.add('is-in'); }, i * 100); });
      bases.forEach(function (p, i) {
        setTimeout(function () { p.style.transition = 'stroke-dashoffset 1s cubic-bezier(.65,0,.35,1)'; p.style.strokeDashoffset = 0; }, 350 + i * 70);
      });
      setTimeout(function () { hub.classList.add('is-in'); }, 750);
      lines.forEach(function (p, i) {
        setTimeout(function () {
          p.style.transition = 'stroke-dashoffset 1s cubic-bezier(.65,0,.35,1)'; p.style.strokeDashoffset = 0;
          items[i].classList.add('is-linked');
        }, 1400 + i * 250);
      });
      setTimeout(function () { dia.classList.add('is-live'); }, 1400 + lines.length * 250 + 800);
    }, 0.3);
  }

  /* ---------- 3. 핵심 기능 데모 ---------- */
  // 화면에 보이는 동안: 재생 → 약 4초 멈춤 → 잠깐 사라졌다가 처음부터 다시 (반복)
  function initFeatures() {
    var CYCLE = 7500;
    $$('.axp-feat').forEach(function (f) {
      var kind = f.getAttribute('data-demo'), timers = [], loop = null, visible = false, played = false;
      var rows = $$('.axp-slipcard dl div', f), save = $('.axp-save', f), em = $('[data-to]', f);
      function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
      function play() {
        f.classList.add('is-run');
        if (kind === 'ocr') {
          rows.forEach(function (r, i) { later(function () { r.classList.add('is-in'); }, reduce ? 0 : 1300 + i * 260); });
          later(function () { save && save.classList.add('is-in'); }, reduce ? 0 : 1300 + rows.length * 260 + 200);
        }
        if (kind === 'rec' && em) { if (reduce) em.textContent = em.getAttribute('data-to'); else countUp(em, +em.getAttribute('data-to'), 1200); }
      }
      function replay() {
        timers.forEach(clearTimeout); timers = [];
        f.classList.add('is-fade');
        later(function () {
          f.classList.add('is-reset');
          f.classList.remove('is-run');
          rows.forEach(function (r) { r.classList.remove('is-in'); });
          save && save.classList.remove('is-in');
          if (em) em.textContent = '0';
          void f.offsetWidth;
          f.classList.remove('is-reset');
          void f.offsetWidth;
          f.classList.remove('is-fade');
          later(play, 350);
        }, 500);
      }
      onView(f, function (v) {
        visible = v;
        clearInterval(loop);
        if (!v) return;
        if (!played) { played = true; play(); }
        if (!reduce) loop = setInterval(function () { if (visible) replay(); }, CYCLE);
      }, 0.4);
    });
  }

  /* ---------- 공통: 탭/질문 자동 전환 (게이지) ---------- */
  function autoTabs(box, btns, onSelect, DUR) {
    var idx = 0, timer = null, inView = false;
    box.style.setProperty('--axp-dur', DUR + 'ms');
    function go(i) {
      idx = i;
      btns.forEach(function (b, k) { b.classList.toggle('is-on', k === i); b.classList.remove('is-run'); b.setAttribute('aria-selected', k === i); });
      onSelect(i);
      if (inView && !reduce) { void btns[i].offsetWidth; btns[i].classList.add('is-run'); }
    }
    function auto() { clearInterval(timer); if (inView && !reduce) timer = setInterval(function () { go((idx + 1) % btns.length); }, DUR); }
    btns.forEach(function (b, k) { b.addEventListener('click', function () { go(k); auto(); }); });
    go(0);
    onView(box, function (v) {
      var was = inView; inView = v;
      if (v && !was) { go(idx); auto(); }
      if (!v) { clearInterval(timer); btns.forEach(function (b) { b.classList.remove('is-run'); }); }
    }, 0.35);
  }
  function playChat(chat, timers) {
    var msgs = $$('.axp-msg', chat);
    timers.forEach(clearTimeout); timers.length = 0;
    if (reduce) { msgs.forEach(function (m) { m.classList.add('is-in'); }); return; }
    msgs.forEach(function (m) { m.classList.remove('is-in'); });
    var me = msgs[0], ai = msgs[1], extra = msgs.slice(2);
    var html = ai ? ai.innerHTML : '';
    timers.push(setTimeout(function () { me && me.classList.add('is-in'); }, 200));
    if (!ai) return;
    timers.push(setTimeout(function () { ai.innerHTML = '<span class="axp-typing"><i></i><i></i><i></i></span>'; ai.classList.add('is-in'); }, 800));
    timers.push(setTimeout(function () { ai.innerHTML = html; }, 1800));
    extra.forEach(function (m, i) { timers.push(setTimeout(function () { m.classList.add('is-in'); }, 2300 + i * 300)); });
  }

  /* ---------- 4. 직접 물어보기 ---------- */
  function initAsk() {
    var box = $('#axpAsk');
    if (!box) return;
    var btns = $$('.axp-ask__list button', box), chat = $('.axp-demo__chat', box), tpls = $$('template', box), timers = [];
    autoTabs(box, btns, function (i) {
      chat.innerHTML = '';
      chat.appendChild(document.importNode(tpls[i].content, true));
      playChat(chat, timers);
    }, 7000);
  }

  /* ---------- 5. 활용 범위 ---------- */
  function initFields() {
    var box = $('#axpFields');
    if (!box) return;
    var btns = $$('.axp-fields__nav button', box), panels = $$('.axp-fields__panel', box), timers = [];
    autoTabs(box, btns, function (i) {
      panels.forEach(function (p, k) { p.classList.toggle('is-on', k === i); });
      playChat($('.axp-demo__chat', panels[i]), timers);
    }, 6500);
  }

  /* ---------- 실제 화면: 탭 자동 전환 + 크게 보기 ---------- */
  function initReal() {
    var box = $('#axpReal'), lb = $('#axpLb');
    if (!box) return;
    var btns = $$('.axp-real__tabs button', box), shots = $$('.axp-real__shot', box);
    var label = $('.axp-real__label', box), desc = $('.axp-real__desc', box);
    var cur = 0;
    autoTabs(box, btns, function (i) {
      cur = i;
      shots.forEach(function (s, k) { s.classList.toggle('is-on', k === i); });
      if (label) label.textContent = 'SyncFlo AX · ' + $('span', btns[i]).textContent;
      if (desc) desc.textContent = btns[i].getAttribute('data-desc');
    }, 6500);
    if (!lb) return;
    var big = $('img', lb), lastFocus = null;
    function open() {
      var img = $('img', shots[cur]);
      big.src = img.currentSrc || img.src; big.alt = img.alt;
      lastFocus = document.activeElement;
      lb.hidden = false; document.documentElement.style.overflow = 'hidden';
      $('.axp-lb__close', lb).focus();
    }
    function close() { lb.hidden = true; document.documentElement.style.overflow = ''; if (lastFocus) lastFocus.focus(); }
    $('.axp-real__zoom', box).addEventListener('click', open);
    shots.forEach(function (s) { s.addEventListener('click', open); });
    lb.addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !lb.hidden) close(); });
  }

  /* ---------- 6. 결재 흐름 (반복) ---------- */
  function initFlow() {
    var flow = $('#axpFlow');
    if (!flow) return;
    var items = $$('li', flow), line = $('.axp-flow__line i', flow);
    if (reduce) { items.forEach(function (i) { i.classList.add('is-on'); }); if (line) line.style.width = '100%'; return; }
    var k = -1, timer = null;
    function step() {
      k = (k + 1) % (items.length + 2); // 마지막 두 박자는 다 켜진 상태로 잠시 유지
      if (k >= items.length) return;
      if (k === 0) items.forEach(function (i) { i.classList.remove('is-on'); });
      items[k].classList.add('is-on');
      if (line) line.style.width = (k / (items.length - 1) * 100) + '%';
    }
    onView(flow, function (v) { clearInterval(timer); if (v) { step(); timer = setInterval(step, 1100); } }, 0.4);
  }

  function start() { initReveal(); initHero(); initStatement(); initConnect(); initFeatures(); initReal(); initAsk(); initFields(); initFlow(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
