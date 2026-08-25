(function initServeonePresentation() {
  const deck = document.querySelector('.serveone-deck');
  document.querySelectorAll('[data-move-after]').forEach((section) => {
    const target = document.getElementById(section.dataset.moveAfter);
    if (target) target.insertAdjacentElement('afterend', section);
  });
  ['clubd-brand', 'clubd-service'].reduce((previousId, id) => {
    const section = document.getElementById(id);
    const previous = document.getElementById(previousId);
    if (section && previous) previous.insertAdjacentElement('afterend', section);
    return id;
  }, 'syncflo-quality');
  const headingHierarchy = {
    'syncflo-problem': ['01', '문제 정의'],
    'syncflo-direction': ['02', '제품 방향 설정'],
    'syncflo-flow': ['03', '프로세스 설계'],
    'syncflo-pc': ['04', 'PC 핵심 UX'],
    'syncflo-system': ['05', '모바일 서비스 설계'],
    'syncflo-quality': ['06', '브랜딩과 디자인 시스템'],
    'clubd-brand': ['Main Work · ClubD', 'ClubD 레저 서비스 구축'],
    'yido-dashboard': ['Main Work · Dashboard', '경영 대시보드'],
    'clubd-service': ['ClubD Services', '서비스 화면'],
    'other-leadership': ['Other Works', '서브 프로젝트']
  };
  Object.entries(headingHierarchy).forEach(([id, [kicker, title]]) => {
    const heading = document.querySelector(`#${id} .serveone-heading`);
    if (!heading) return;
    const eyebrow = heading.querySelector('.eyebrow');
    const sectionTitle = heading.querySelector('.section-title');
    if (!eyebrow || !sectionTitle) return;
    const existingMessage = heading.querySelector(':scope > .serveone-heading__message');
    const message = existingMessage || document.createElement('p');
    if (!existingMessage) {
      message.className = 'serveone-heading__message';
      message.innerHTML = sectionTitle.innerHTML;
    }
    eyebrow.textContent = kicker;
    sectionTitle.textContent = title;
    sectionTitle.setAttribute('data-split', '');
    if (!existingMessage) sectionTitle.insertAdjacentElement('afterend', message);
  });
  document.querySelectorAll('.serveone-heading').forEach((heading) => {
    const eyebrow = heading.querySelector(':scope > .eyebrow');
    const sectionTitle = heading.querySelector(':scope > .section-title');
    if (!eyebrow || !sectionTitle) return;
    sectionTitle.setAttribute('data-split', '');
    const titleGroup = document.createElement('div');
    titleGroup.className = 'section-header serveone-heading__title';
    eyebrow.before(titleGroup);
    titleGroup.append(eyebrow, sectionTitle);
  });
  const mobileSection = document.getElementById('syncflo-system');
  if (mobileSection) {
    mobileSection.querySelector('.serveone-heading__message').innerHTML = '외근 중에도 전표를 작성하고<br />상신할 수 있도록 설계했습니다';
    mobileSection.querySelector('.serveone-heading > p:last-child').textContent = '사용자에게 꼭 필요한 작성·증빙·알림·승인 기능만 모바일에 담았습니다.';
    const images = mobileSection.querySelectorAll('.serveone-system-images img');
    if (images[1]) {
      images[1].src = 'images/main/syncflo/18.jpg';
      images[1].alt = 'SyncFlo 모바일 전표 작성과 승인 화면';
    }
    mobileSection.querySelector('.serveone-system-layout ol').innerHTML = '<li><strong>경비 입력</strong><span>영수증 · 법인카드 · 유류대</span></li><li><strong>증빙 연결</strong><span>촬영 후 PC에서 이어서 사용</span></li><li><strong>알림</strong><span>요청 확인과 히스토리 관리</span></li><li><strong>빠른 승인</strong><span>문서 승인/반려</span></li>';
  }

  const galleryData = {
    'syncflo-problem': {
      target: '.serveone-case-images',
      images: [
        ['2.jpg', '문제 정의', '기존 시스템의 불편과 개선 과제를 정리했습니다.'],
        ['3.jpg', '리서치', '사용자와 업무 환경을 기준으로 필요한 기능을 확인했습니다.'],
        ['4.jpg', '사용자 인터뷰', '회계 담당자와 일반 사용자의 요구를 역할별로 구분했습니다.']
      ]
    },
    'syncflo-direction': {
      target: '.serveone-media',
      images: [
        ['5.jpg', '경쟁 제품 분석', '유사 솔루션을 직접 사용하며 장단점과 처리 흐름을 비교했습니다.'],
        ['6.jpg', '제품 구성', 'PC·모바일·관리자 서비스의 역할과 구축 범위를 정했습니다.'],
        ['7.jpg', '핵심 화면 방향', '자주 하는 업무와 확인해야 할 정보를 먼저 배치했습니다.']
      ]
    },
    'syncflo-flow': {
      target: '.serveone-flow-visual',
      images: [
        ['8.jpg', '요구사항과 IA', '메뉴 구조와 역할별 접근 범위를 정의했습니다.'],
        ['9.jpg', '권한 설계', '페이지 접근·작성·조회 조건을 사용자 역할에 맞게 구분했습니다.'],
        ['10.jpg', '전표 처리 흐름', '작성부터 승인·반려·확정·ERP 연동까지 연결했습니다.'],
        ['11.jpg', '프로토타입', '핵심 행동과 예외 상황을 화면으로 빠르게 합의했습니다.']
      ]
    },
    'syncflo-pc': {
      target: '.serveone-screen',
      images: [
        ['12.jpg', 'PC 주요 화면', '개인화 대시보드와 전표 업무를 하나의 흐름으로 구성했습니다.'],
        ['13.jpg', '전표 작성', '작성·수정·상신을 한 화면에서 처리하도록 정리했습니다.'],
        ['14.jpg', '결재와 상태', '승인·반려 상태와 다음 행동을 명확하게 표시했습니다.'],
        ['15.jpg', '알림과 조회', '처리해야 할 업무와 진행 결과를 빠르게 확인하도록 했습니다.'],
        ['16.jpg', 'PC 결과 화면', '일반 사용자와 관리자의 서로 다른 업무를 제품 안에서 연결했습니다.']
      ]
    },
    'syncflo-system': {
      target: '.serveone-system-images',
      images: [
        ['19.jpg', '모바일 서비스', 'PC의 전표 작성과 결재 업무를 모바일로 확장했습니다.'],
        ['20.jpg', '기존 앱 분석', '기존 화면의 문제와 모바일 개선 범위를 정리했습니다.'],
        ['21.jpg', '전표 작성', '개인경비 작성부터 결재까지 하나의 흐름으로 연결했습니다.'],
        ['22.jpg', '알림과 편의 기능', '알림·사진 저장함·퀵 메뉴를 업무 흐름에 맞게 구성했습니다.'],
        ['23.jpg', '업무 흐름', '문서 선택부터 상신과 알림까지 처리 과정을 정리했습니다.'],
        ['24.jpg', '온보딩', '주요 기능과 사용 방법을 처음 화면에서 안내했습니다.']
      ]
    },
    'syncflo-quality': {
      target: '.serveone-quality-layout',
      images: [
        ['25.jpg', 'SyncFlo 브랜딩', '제품의 연결성과 자동화 방향을 시각 언어와 로고로 정리했습니다.'],
        ['26.jpg', '디자인 가이드', '프론트엔드 개발자와 공유할 컴포넌트 기준을 문서화했습니다.'],
        ['27.jpg', '디자인 시스템', '타이포그래피·색상·디자인 토큰을 공통 기준으로 정리했습니다.']
      ]
    },
    'yido-dashboard': {
      base: 'images/other/dashboard',
      target: '.serveone-dashboard-case figure',
      images: [
        ['1.jpg', '통합 경영 대시보드', '여러 사업장의 매출·이익·원가 지표를 한 화면에 모았습니다.'],
        ['4.png', '경영 현황 시각화', '회사의 성장 목표와 사업 현황을 대형 화면에서 한눈에 확인하도록 구성했습니다.', 'dashboard-pair'],
        ['3.png', '상세 데이터 조회', '요약 지표에서 세부 실적과 통계로 이어지는 탐색 구조를 설계했습니다.']
      ]
    },
    'clubd-service': {
      base: 'images',
      target: '.serveone-clubd-grid',
      images: [
        ['main/golf/1.jpg', 'ClubD 골프', '골프장 브랜드와 예약 서비스를 PC와 모바일 환경으로 연결했습니다.'],
        ['main/golf/4.jpg', '골프 서비스 구축', '골프장 브랜드와 예약 웹사이트가 확장되는 과정을 정리했습니다.'],
        ['main/golf/5.jpg', 'PC 디자인', '브랜드 정보와 코스·예약 정보를 가로 화면에 맞게 구성했습니다.'],
        ['main/oasis/1.jpg', 'ClubD 오아시스', '이용권 탐색부터 예약·결제까지 이어지는 서비스를 설계했습니다.'],
        ['main/oasis/5.jpg', '이용권 선택', '상품 구성과 옵션을 비교한 뒤 필요한 이용권을 고르도록 했습니다.'],
        ['main/oasis/7.jpg', '오아시스 예약', '선택한 상품을 확인하고 결제까지 이어지는 흐름입니다.'],
        ['thumb/thumb-screen.png', 'ClubD 청담', 'PC는 브랜드 경험, 모바일은 스크린골프·다이닝 예약에 집중했습니다.']
      ]
    }
  };

  const imageViewer = document.createElement('dialog');
  imageViewer.className = 'serveone-viewer';
  imageViewer.setAttribute('aria-labelledby', 'serveone-viewer-title');
  imageViewer.innerHTML = `
    <button class="serveone-viewer__close" type="button" aria-label="확대 이미지 닫기">닫기</button>
    <button class="serveone-viewer__nav serveone-viewer__nav--prev" type="button" aria-label="이전 이미지">‹</button>
    <button class="serveone-viewer__nav serveone-viewer__nav--next" type="button" aria-label="다음 이미지">›</button>
    <figure>
      <img src="" alt="" draggable="false" />
      <figcaption><strong id="serveone-viewer-title"></strong><span></span></figcaption>
    </figure>`;
  document.body.appendChild(imageViewer);

  const viewerImage = imageViewer.querySelector('img');
  const viewerTitle = imageViewer.querySelector('figcaption strong');
  const viewerDescription = imageViewer.querySelector('figcaption span');
  let viewerTrigger = null;
  let viewerItems = [];
  let viewerIndex = 0;
  let viewerDragStartX = null;

  function showViewerImage(index) {
    if (!viewerItems.length) return;
    viewerIndex = (index + viewerItems.length) % viewerItems.length;
    const [src, title, description, displayMode] = viewerItems[viewerIndex];
    viewerImage.src = src;
    viewerImage.alt = title;
    viewerImage.classList.toggle('is-dashboard-focus', displayMode === 'dashboard-focus');
    viewerImage.classList.toggle('is-dashboard-pair', displayMode === 'dashboard-pair');
    viewerTitle.textContent = title;
    viewerDescription.textContent = description;
  }

  function openImageViewer(items, index, trigger) {
    viewerItems = items;
    viewerTrigger = trigger;
    showViewerImage(index);
    imageViewer.showModal();
    imageViewer.querySelector('.serveone-viewer__close').focus();
  }

  function closeImageViewer() {
    imageViewer.close();
    viewerTrigger?.focus();
  }

  imageViewer.querySelector('.serveone-viewer__close').addEventListener('click', closeImageViewer);
  imageViewer.querySelector('.serveone-viewer__nav--prev').addEventListener('click', () => showViewerImage(viewerIndex - 1));
  imageViewer.querySelector('.serveone-viewer__nav--next').addEventListener('click', () => showViewerImage(viewerIndex + 1));
  imageViewer.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') showViewerImage(viewerIndex - 1);
    if (event.key === 'ArrowRight') showViewerImage(viewerIndex + 1);
  });
  viewerImage.addEventListener('pointerdown', (event) => {
    viewerDragStartX = event.clientX;
    viewerImage.setPointerCapture?.(event.pointerId);
  });
  viewerImage.addEventListener('pointerup', (event) => {
    if (viewerDragStartX === null) return;
    const distance = event.clientX - viewerDragStartX;
    viewerDragStartX = null;
    if (Math.abs(distance) < 50) return;
    showViewerImage(viewerIndex + (distance < 0 ? 1 : -1));
  });
  viewerImage.addEventListener('pointercancel', () => { viewerDragStartX = null; });
  imageViewer.addEventListener('click', (event) => {
    if (event.target === imageViewer) closeImageViewer();
  });

  function createGallery(sectionId, config) {
    const section = document.getElementById(sectionId);
    const target = section?.querySelector(config.target);
    if (!section || !target) return;

    const gallery = document.createElement('div');
    const basePath = config.base || 'images/main/syncflo';
    const imagePath = (file) => `${basePath}/${file}`;
    gallery.className = 'serveone-gallery';
    gallery.setAttribute('aria-label', `${section.dataset.label} 이미지 갤러리`);
    gallery.innerHTML = `
      <figure class="serveone-gallery__stage">
        <img src="${imagePath(config.images[0][0])}" alt="${config.images[0][1]}" draggable="false" />
        <figcaption><strong>${config.images[0][1]}</strong><span>${config.images[0][2]}</span></figcaption>
      </figure>
      <div class="serveone-gallery__thumbs" role="tablist" aria-label="이미지 선택"></div>`;

    const mainImage = gallery.querySelector('.serveone-gallery__stage img');
    const stage = gallery.querySelector('.serveone-gallery__stage');
    const captionTitle = gallery.querySelector('figcaption strong');
    const captionBody = gallery.querySelector('figcaption span');
    const thumbs = gallery.querySelector('.serveone-gallery__thumbs');
    const viewerGalleryItems = config.images.map(([file, title, description, displayMode]) => [imagePath(file), title, description, displayMode]);
    let selectedIndex = 0;
    let stageDragStartX = null;
    let stageWasDragged = false;

    stage.tabIndex = 0;
    stage.setAttribute('role', 'button');
    stage.setAttribute('aria-label', '현재 이미지 크게 보기');
    stage.addEventListener('click', () => {
      if (stageWasDragged) {
        stageWasDragged = false;
        return;
      }
      openImageViewer(viewerGalleryItems, selectedIndex, stage);
    });
    stage.addEventListener('keydown', (event) => {
      if (!['Enter', ' '].includes(event.key)) return;
      event.preventDefault();
      event.stopPropagation();
      openImageViewer(viewerGalleryItems, selectedIndex, stage);
    });

    function selectImage(index, focus = false) {
      const [file, title, description, displayMode] = config.images[index];
      selectedIndex = index;
      mainImage.src = imagePath(file);
      mainImage.alt = title;
      mainImage.classList.toggle('is-dashboard-focus', displayMode === 'dashboard-focus');
      mainImage.classList.toggle('is-dashboard-pair', displayMode === 'dashboard-pair');
      captionTitle.textContent = title;
      captionBody.textContent = description;
      thumbs.querySelectorAll('button').forEach((button, buttonIndex) => {
        const selected = buttonIndex === index;
        button.classList.toggle('is-active', selected);
        button.setAttribute('aria-selected', String(selected));
        button.tabIndex = selected ? 0 : -1;
      });
      if (focus) thumbs.children[index].focus();
    }

    stage.addEventListener('pointerdown', (event) => {
      if (event.button !== undefined && event.button !== 0) return;
      stageDragStartX = event.clientX;
      stageWasDragged = false;
      stage.setPointerCapture?.(event.pointerId);
    });
    stage.addEventListener('pointerup', (event) => {
      if (stageDragStartX === null) return;
      const distance = event.clientX - stageDragStartX;
      stageDragStartX = null;
      if (Math.abs(distance) < 50) return;
      stageWasDragged = true;
      const direction = distance < 0 ? 1 : -1;
      selectImage((selectedIndex + direction + config.images.length) % config.images.length);
    });
    stage.addEventListener('pointercancel', () => { stageDragStartX = null; });

    config.images.forEach(([file, title], index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-label', `${index + 1}. ${title}`);
      button.innerHTML = `<img src="${imagePath(file)}" alt="" /><span>${String(index + 1).padStart(2, '0')}</span>`;
      button.addEventListener('click', () => selectImage(index));
      thumbs.appendChild(button);
    });

    gallery.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      event.stopPropagation();
      const current = Array.from(thumbs.children).findIndex((button) => button.classList.contains('is-active'));
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      selectImage((current + direction + config.images.length) % config.images.length, true);
    });

    target.replaceWith(gallery);
    selectImage(0);
  }

  Object.entries(galleryData).forEach(([sectionId, config]) => createGallery(sectionId, config));

  const serveoneCenter = document.querySelector('.serveone-convergence__center');
  if (serveoneCenter) {
    const label = serveoneCenter.querySelector('small');
    if (label) label.hidden = true;
    const logo = document.createElement('img');
    logo.className = 'serveone-convergence__logo';
    logo.src = 'images/logo/logo-serveone-transparent2.png';
    logo.alt = 'SERVEONE';
    serveoneCenter.prepend(logo);
  }
  const slides = Array.from(document.querySelectorAll('.serveone-slide'));
  const dots = document.querySelector('.serveone-dots');
  const counter = document.querySelector('.serveone-counter span');
  const total = document.querySelector('.serveone-counter em');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let activeIndex = 0;
  let inputLocked = false;

  if (!deck || !slides.length || !dots) return;
  if (total) total.textContent = String(slides.length).padStart(2, '0');

  document.querySelectorAll('.nav__menu a').forEach((link) => {
    const target = link.getAttribute('href');
    if (target && target.startsWith('#')) link.setAttribute('href', `index.html${target}`);
  });

  const buttons = slides.map((slide, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', `${index + 1}. ${slide.dataset.label}`);
    button.addEventListener('click', () => goTo(index));
    dots.appendChild(button);
    return button;
  });

  function setActive(index) {
    activeIndex = Math.max(0, Math.min(index, slides.length - 1));
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === activeIndex;
      slide.classList.toggle('is-active', active);
      slide.querySelector('.serveone-heading__title')?.classList.toggle('is-visible', active);
    });
    buttons.forEach((button, buttonIndex) => {
      const active = buttonIndex === activeIndex;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-current', active ? 'step' : 'false');
    });
    counter.textContent = String(activeIndex + 1).padStart(2, '0');
  }

  function goTo(index, immediate = false) {
    const nextIndex = Math.max(0, Math.min(index, slides.length - 1));
    slides[nextIndex].scrollIntoView({ behavior: immediate || reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
    setActive(nextIndex);
  }

  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) setActive(slides.indexOf(visible.target));
  }, { root: window.innerWidth > 900 ? deck : null, threshold: [.45, .6, .75] });

  slides.forEach((slide) => observer.observe(slide));

  window.addEventListener('keydown', (event) => {
    if (imageViewer.open) return;
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const forward = ['ArrowDown', 'ArrowRight', ' ', 'PageDown'];
    const backward = ['ArrowUp', 'ArrowLeft', 'PageUp'];
    if (!forward.includes(event.key) && !backward.includes(event.key)) return;
    event.preventDefault();
    goTo(activeIndex + (forward.includes(event.key) ? 1 : -1));
  });

  deck.addEventListener('wheel', (event) => {
    if (window.innerWidth <= 900 || Math.abs(event.deltaY) < 12 || inputLocked) return;
    event.preventDefault();
    inputLocked = true;
    goTo(activeIndex + (event.deltaY > 0 ? 1 : -1));
    window.setTimeout(() => { inputLocked = false; }, reducedMotion.matches ? 250 : 720);
  }, { passive: false });

  const requestedSlide = new URLSearchParams(window.location.search).get('slide');
  const initialIndex = slides.findIndex((slide) => `#${slide.id}` === window.location.hash || slide.id === requestedSlide);
  if (initialIndex >= 0) {
    window.setTimeout(() => goTo(initialIndex, true), 50);
  } else {
    setActive(0);
  }
})();
