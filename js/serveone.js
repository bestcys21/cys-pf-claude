(function initServeonePresentation() {
  const deck = document.querySelector('.serveone-deck');
  document.querySelectorAll('[data-move-after]').forEach((section) => {
    const target = document.getElementById(section.dataset.moveAfter);
    if (target) target.insertAdjacentElement('afterend', section);
  });
  const syncfloLabels = {
    'syncflo-problem': '01 · 문제 정의',
    'syncflo-direction': '02 · 제품 방향 설정',
    'syncflo-flow': '03 · 프로세스 설계',
    'syncflo-pc': '04 · PC 핵심 UX',
    'syncflo-system': '05 · 모바일과 개발 협업',
    'syncflo-quality': '06 · 디자인 시스템과 QA'
  };
  Object.entries(syncfloLabels).forEach(([id, label]) => {
    const eyebrow = document.querySelector(`#${id} .eyebrow`);
    if (eyebrow) eyebrow.textContent = label;
  });
  const mobileSection = document.getElementById('syncflo-system');
  if (mobileSection) {
    mobileSection.querySelector('.section-title').innerHTML = '외근 중에도 전표 흐름이<br />이어지도록 설계했습니다';
    mobileSection.querySelector('.serveone-heading > p:last-child').textContent = 'PC의 모든 기능을 옮기지 않고 현장에서 필요한 작성·증빙·알림·승인 기능을 중심으로 모바일 흐름을 다시 구성했습니다.';
    const images = mobileSection.querySelectorAll('.serveone-system-images img');
    if (images[1]) {
      images[1].src = 'images/main/syncflo/18.jpg';
      images[1].alt = 'SyncFlo 모바일 전표 작성과 승인 화면';
    }
    mobileSection.querySelector('.serveone-system-layout ol').innerHTML = '<li><strong>개인경비 입력</strong><span>영수증 · 법인카드 · 유류대 전표 간소화</span></li><li><strong>증빙 연결</strong><span>촬영한 영수증을 PC에서도 이어서 사용</span></li><li><strong>알림과 승인</strong><span>결재 요청을 확인하고 모바일에서 처리</span></li><li><strong>모바일 기준</strong><span>작은 화면에서는 필수 행동에 집중</span></li>';
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
        ['17.jpg', '모바일 홈', '외근 중 필요한 전표 업무와 승인 요청을 모았습니다.'],
        ['18.jpg', '전표 작성과 승인', '작은 화면에서는 필수 입력과 행동에 집중했습니다.'],
        ['19.jpg', '알림', '결재 요청과 처리 결과를 바로 확인하도록 구성했습니다.'],
        ['20.jpg', '모바일 전체 흐름', '증빙 등록부터 상신·승인까지 PC와 이어지게 설계했습니다.']
      ]
    },
    'syncflo-quality': {
      target: '.serveone-quality-layout',
      images: [
        ['21.jpg', 'Figma 컴포넌트', '반복되는 화면 요소와 상태를 공통 기준으로 정리했습니다.'],
        ['22.jpg', '디자인 토큰', '색상과 화면 규칙을 문서화해 일관성을 맞췄습니다.'],
        ['23.jpg', '최종 화면', '공통 기준을 실제 제품 화면에 적용했습니다.'],
        ['24.jpg', '프로토타입', '개발 전 주요 흐름과 예외 상황을 확인했습니다.'],
        ['25.jpg', 'UI UX QA', '개발 화면의 구현 차이와 사용성 문제를 검수했습니다.'],
        ['26.jpg', '개선 전후', '검수 결과를 바탕으로 화면 품질을 개선했습니다.'],
        ['27.jpg', '제품 고도화', '구축 이후에도 개선 항목을 정리하고 품질을 관리했습니다.']
      ]
    },
    'yido-dashboard': {
      base: 'images/other/dashboard',
      target: '.serveone-dashboard-case figure',
      images: [
        ['1.jpg', '통합 경영 대시보드', '여러 사업장의 매출·이익·원가 지표를 한 화면에 모았습니다.'],
        ['2.jpg', '사업장 실적 비교', '목표와 실적, 전년 대비 흐름을 빠르게 비교하도록 구성했습니다.'],
        ['3.png', '상세 데이터 조회', '요약 지표에서 세부 실적과 통계로 이어지는 탐색 구조를 설계했습니다.']
      ]
    },
    'clubd-service': {
      base: 'images',
      target: '.serveone-clubd-grid',
      images: [
        ['main/golf/1.jpg', 'ClubD 골프', '골프장 브랜드와 예약 서비스를 PC와 모바일 환경으로 연결했습니다.'],
        ['main/golf/clubd_1.jpg', '골프장 탐색', '지역과 골프장 정보를 비교하고 원하는 서비스를 찾도록 구성했습니다.'],
        ['main/golf/clubd_3.jpg', '골프 예약', '티타임과 옵션을 확인하고 예약을 완료하는 화면입니다.'],
        ['main/oasis/1.jpg', 'ClubD 오아시스', '이용권 탐색부터 예약·결제까지 이어지는 서비스를 설계했습니다.'],
        ['main/oasis/5.jpg', '이용권 선택', '상품 구성과 옵션을 비교한 뒤 필요한 이용권을 고르도록 했습니다.'],
        ['main/oasis/7.jpg', '오아시스 예약', '선택한 상품을 확인하고 결제까지 이어지는 흐름입니다.'],
        ['main/chuengdam/clubd-chungdam-2.png', 'ClubD 청담', '공간과 프로그램을 살펴보는 프리미엄 서비스 화면입니다.'],
        ['main/chuengdam/clubd-chungdam-3.png', '프로그램 탐색', '프로그램 정보와 이용 조건을 확인하고 선택하도록 구성했습니다.'],
        ['main/chuengdam/clubd-chungdam-4.jpg', '신청과 확인', '선택한 서비스를 신청하고 결과를 확인하는 흐름입니다.']
      ]
    }
  };

  const imageViewer = document.createElement('dialog');
  imageViewer.className = 'serveone-viewer';
  imageViewer.setAttribute('aria-labelledby', 'serveone-viewer-title');
  imageViewer.innerHTML = `
    <button class="serveone-viewer__close" type="button" aria-label="확대 이미지 닫기">닫기</button>
    <figure>
      <img src="" alt="" />
      <figcaption><strong id="serveone-viewer-title"></strong><span></span></figcaption>
    </figure>`;
  document.body.appendChild(imageViewer);

  const viewerImage = imageViewer.querySelector('img');
  const viewerTitle = imageViewer.querySelector('figcaption strong');
  const viewerDescription = imageViewer.querySelector('figcaption span');
  let viewerTrigger = null;

  function openImageViewer(src, title, description, trigger) {
    viewerImage.src = src;
    viewerImage.alt = title;
    viewerTitle.textContent = title;
    viewerDescription.textContent = description;
    viewerTrigger = trigger;
    imageViewer.showModal();
    imageViewer.querySelector('.serveone-viewer__close').focus();
  }

  function closeImageViewer() {
    imageViewer.close();
    viewerTrigger?.focus();
  }

  imageViewer.querySelector('.serveone-viewer__close').addEventListener('click', closeImageViewer);
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
        <img src="${imagePath(config.images[0][0])}" alt="${config.images[0][1]}" />
        <figcaption><strong>${config.images[0][1]}</strong><span>${config.images[0][2]}</span></figcaption>
      </figure>
      <div class="serveone-gallery__thumbs" role="tablist" aria-label="이미지 선택"></div>`;

    const mainImage = gallery.querySelector('.serveone-gallery__stage img');
    const stage = gallery.querySelector('.serveone-gallery__stage');
    const captionTitle = gallery.querySelector('figcaption strong');
    const captionBody = gallery.querySelector('figcaption span');
    const thumbs = gallery.querySelector('.serveone-gallery__thumbs');

    stage.tabIndex = 0;
    stage.setAttribute('role', 'button');
    stage.setAttribute('aria-label', '현재 이미지 크게 보기');
    stage.addEventListener('click', () => openImageViewer(mainImage.src, captionTitle.textContent, captionBody.textContent, stage));
    stage.addEventListener('keydown', (event) => {
      if (!['Enter', ' '].includes(event.key)) return;
      event.preventDefault();
      event.stopPropagation();
      openImageViewer(mainImage.src, captionTitle.textContent, captionBody.textContent, stage);
    });

    function selectImage(index, focus = false) {
      const [file, title, description] = config.images[index];
      mainImage.src = imagePath(file);
      mainImage.alt = title;
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
    logo.src = 'images/logo/logo-serveone-transparent.png';
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
    slides.forEach((slide, slideIndex) => slide.classList.toggle('is-active', slideIndex === activeIndex));
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
