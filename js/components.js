/* 
   Common Components 
   - <common-header>
   - <common-footer>
*/

class CommonHeader extends HTMLElement {
  connectedCallback() {
    // 상세 페이지에서는 index.html#섹션 으로, 메인에서는 #섹션 으로
    const filename = window.location.pathname.split('/').pop();
    const isIndex = filename === 'index.html' || filename === '' || filename === '/';
    const base = isIndex ? '' : 'index.html';

    this.innerHTML = `
      <nav class="nav" role="navigation" aria-label="메인 네비게이션">
        <div class="nav__inner">
          <a href="index.html" class="nav__logo">CYS <span>Portfolio</span></a>
          <div class="nav__menu" id="nav-menu">
            <a href="${base}#hero"    class="nav__link">HOME</a>
            <a href="${base}#works"   class="nav__link">WORKS</a>
            <a href="${base}#skills"  class="nav__link">SKILLS</a>
            <a href="${base}#about"   class="nav__link">ABOUT</a>
          </div>
          <button class="nav__toggle" id="nav-toggle" aria-expanded="false" aria-controls="nav-menu" aria-label="메뉴 열기">
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>
    `;
  }
}

class CommonFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
   
    `;
  }
}

customElements.define('common-header', CommonHeader);
customElements.define('common-footer', CommonFooter);

/* ── Top Button ── */
(function initTopButton() {
  // 버튼 생성
  const btn = document.createElement('button');
  btn.id = 'top-btn';
  btn.setAttribute('aria-label', '맨 위로');
  btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 14V6M10 6L6 10M10 6l4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
  btn.style.cssText = `
    position: fixed;
    bottom: 32px;
    right: 32px;
    z-index: 900;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 1.5px solid var(--color-border-strong);
    background: var(--color-surface-primary);
    color: var(--color-text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    transform: translateY(8px);
    transition: opacity 0.25s ease, transform 0.25s ease, background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
    pointer-events: none;
    box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  `;
  document.body.appendChild(btn);

  // 스크롤에 따라 표시/숨김
  const onScroll = () => {
    const show = window.scrollY > 400;
    btn.style.opacity = show ? '1' : '0';
    btn.style.transform = show ? 'translateY(0)' : 'translateY(8px)';
    btn.style.pointerEvents = show ? 'auto' : 'none';
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // hover
  btn.addEventListener('mouseenter', () => {
    btn.style.background = 'var(--color-accent)';
    btn.style.color = '#fff';
    btn.style.borderColor = 'var(--color-accent)';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.background = 'var(--color-surface-primary)';
    btn.style.color = 'var(--color-text-secondary)';
    btn.style.borderColor = 'var(--color-border-strong)';
  });

  // 클릭 → 맨 위로
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
