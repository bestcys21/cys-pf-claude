/* 
   Common Components 
   - <common-header>
   - <common-footer>
*/

class CommonHeader extends HTMLElement {
  connectedCallback() {
    // Use relative hash links on index page, full path on other pages
    const isIndex = ['/', '/index.html', ''].some(p =>
      window.location.pathname.endsWith(p)
    ) || window.location.pathname === '/';
    const base = isIndex ? '' : 'index.html';

    this.innerHTML = `
      <nav class="nav" role="navigation" aria-label="메인 네비게이션">
        <div class="nav__inner">
          <a href="index.html" class="nav__logo">logo<span>.</span></a>
          <div class="nav__menu" id="nav-menu">
            <a href="${base}#hero"    class="nav__link">홈</a>
            <a href="${base}#works"   class="nav__link">작업물</a>
            <a href="${base}#skills"  class="nav__link">스킬</a>
            <a href="${base}#about"   class="nav__link">소개</a>
            <a href="${base}#contact" class="nav__link">연락</a>
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
      <footer class="footer">
        <div class="container">
          <div class="footer__inner">
            <a href="index.html" class="footer__logo">수<span>진</span></a>
            <p class="footer__copy">© 2025 차윤수. All rights reserved.</p>
            <nav class="footer__links" aria-label="푸터 링크">
              <a href="index.html#works" class="footer__link">작업물</a>
              <a href="index.html#skills" class="footer__link">스킬</a>
              <a href="index.html#about" class="footer__link">소개</a>
              <a href="index.html#contact" class="footer__link">연락</a>
            </nav>
          </div>
        </div>
      </footer>
    `;
  }
}

customElements.define('common-header', CommonHeader);
customElements.define('common-footer', CommonFooter);
