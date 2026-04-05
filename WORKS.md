# 포트폴리오 구조 정리

## 사이트 개요
정적 HTML/CSS/JS 포트폴리오 사이트 (빌드 시스템 없음)
개발 서버: `npx serve . --listen 3000`

---

## 파일 구조

```
portfolio-web/
├── index.html              ← 메인 (홈, 경력타임라인, Main/Other Works, About, 연락처)
├── css/
│   ├── style.css           ← 공통 스타일 (변수, 레이아웃, 모든 컴포넌트)
│   └── detail.css          ← 상세 페이지 전용 (.sf-*, .anim-enter-*)
├── js/
│   ├── app.js              ← nav, reveal, scroll 인터랙션
│   ├── components.js       ← Web Components (common-header, common-footer)
│   └── head.js             ← 다크모드 초기화 (head 인라인 실행)
└── images/
    ├── logo/               ← 로고
    ├── thumb/              ← Main Works 썸네일
    └── other/
        ├── bodykey/        ← big_bodykey.jpg 등
        ├── inbody/         ← 통합 폴더 (InBody + Bodykey + U-Town)
        │                       home-1~8.jpg   (InBody 홈화면)
        │                       app-1~3.jpg    (InBody 앱)
        │                       bodykey-1~3.jpg
        │                       utown-1~4.jpg
        │                       2.jpg, 3.jpg   (기존 InBody 이미지)
        ├── ionm/
        └── utown/          ← big_utown.jpg 등
```

---

## Main Works (6개)

| # | 프로젝트 | 상세 페이지 | 카드 방향 |
|---|---------|-----------|---------|
| 01 | SyncFlo (B2B SaaS) | detail-syncflo.html | 기본 (이미지 우측) |
| 02 | 일진 (기업 UX 리뉴얼) | detail-iljin.html | reverse (이미지 좌측) |
| 03 | 이도 (브랜드 서비스) | detail-yido.html | 기본 |
| 04 | ClubD Golf (모바일 앱) | detail-golf.html | reverse |
| 05 | ClubD Oasis (웰니스) | detail-oasis.html | 기본 |
| 06 | ClubD 청담 (멤버십) | detail-chuengdam.html | reverse |

- 지그재그: `.project-card--reverse` = `direction: rtl`
- hover 효과: 이미지 zoom `scale(1.04)` (translateY lift/3D tilt 제거됨)

---

## Other Works

| 프로젝트 | 상세 페이지 | 분류 |
|---------|-----------|------|
| Core Value | detail-corevalue.html | 브랜딩 |
| 대보 | detail-daebo.html | 브랜딩 |
| Dashboard UI | detail-dashboard.html | 서비스 UX |
| **InBody · Bodykey · U-Town** | **detail-inbody.html** | 서비스 UX + 브랜딩 (3개 통합) |
| IONM | detail-ionm.html | 서비스 UX |
| Livatd | detail-livatd.html | 서비스 UX |
| Safed | detail-safed.html | 서비스 UX |

> `detail-bodykey.html`, `detail-utown.html` → `detail-inbody.html`로 통합
> index.html 카드 링크: bodykey → `detail-inbody.html#bodykey`, utown → `detail-inbody.html#utown`

---

## CSS 핵심 패턴

| 클래스 / 변수 | 용도 |
|-------------|------|
| `.container` | max-width 레이아웃 래퍼 |
| `body.other-detail .container` | 1000px 제한 (other works 상세) |
| `.nav--over-dark` | 다크 히어로 위 흰 텍스트 nav |
| `.is-scrolled` | 스크롤 후 solid 배경 nav |
| `--dur` | 타임라인 flex-basis (개월 수) |
| `--ic` | 타임라인 아이템 accent 색상 |
| `.tl-h__logo` | 32px 원형 이니셜 뱃지 |
| `.sf-img-grid--2 / --3` | 2/3열 이미지 그리드 |
| `.reveal` | IntersectionObserver 진입 애니메이션 |

---

## JS 동작 요약 (app.js)

| 함수 | 상태 | 설명 |
|------|------|------|
| `initNav()` | ✅ 활성 | `#hero` 유무로 nav 초기 상태 분기 |
| `initReveal()` | ✅ 활성 | `.reveal` 스크롤 진입 애니메이션 |
| `initCardTilt()` | 🚫 비활성 | CSS zoom으로 대체 |
| `initScrollSkew()` | 🚫 비활성 | 어지러움 이슈로 제거 |

---

## 경력 타임라인 비율 (index.html)

총 253개월 기준 (2005.3 ~ 2026.4)

| 항목 | flex | 실제 기간 | 비고 |
|------|------|---------|------|
| 단국대학교 | 22 | 2005.3–2007.0 | |
| 군입대 | 23 | 2007.1–2008.12 | |
| gap | 3 | | 군~복학 |
| 복학 | 23 | 2009.3–2011.2 | |
| gap | 1 | | 복학~경희 |
| 경희대학교 | 23 | 2011.3–2013.2 | |
| **gap** | **8** | | **경희~인바디 (공백기)** |
| 인바디 | 32 | 2013.10–2016.6 | |
| gap | 2 | | 인바디~이도 |
| 이도 | 88 | 2016.8–2023.12 | |
| 일진 | 28 | 2023.12–현재 | |

---

## Gradient 클래스 참고

| 클래스 | 색상 |
|--------|------|
| `gradient-finance` | 보라/파랑 |
| `gradient-health` | 초록/민트 |
| `gradient-edu` | 핑크/레드 |
| `gradient-realty` | 오렌지/앰버 |
| `gradient-medi` | 청록/민트 |
| `gradient-data` | 네이비/다크 |
