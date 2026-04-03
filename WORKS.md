# Works 관리

## 파일 구조

```
index.html          ← 메인 (Main Works + Other Works)
detail-{slug}.html  ← 각 프로젝트 케이스 스터디 페이지
css/detail-{slug}.css ← 해당 페이지 전용 스타일
```

---

## Main Works

| # | 프로젝트 | 슬러그 | 상태 | index 카드 | detail 페이지 |
|---|----------|--------|------|-----------|--------------|
| 01 | SyncFlo — 구매정보 통합 관리 플랫폼 | `syncflo` | ✅ 완료 | gradient-data | detail-syncflo.html |
| 02 | 하모니 — 정신 건강 플랫폼 | `harmoni` | 🔲 예시 | gradient-health | — |
| 03 | 캠퍼스+ — 대학생 학습 플랫폼 | `campus` | 🔲 예시 | gradient-edu | — |
| 04 | 홈즈 — AI 부동산 탐색 앱 | `homz` | 🔲 예시 | gradient-realty | — |
| 05 | 메디링크 — 통합 의료 예약 | `medilink` | 🔲 예시 | gradient-medi | — |
| 06 | 데이터허브 — B2B SaaS 분석 | `datahub` | 🔲 예시 | gradient-data | — |

## Other Works

| 이름 | 타입 | 링크 |
|------|------|------|
| 브레이크 브랜딩 | 브랜드 아이덴티티 | — |
| 소셜미디어 키트 | 그래픽 디자인 | — |
| 이커머스 랜딩 | 웹 디자인 | — |
| 여행 앱 UI | 모바일 UI 디자인 | — |
| 커피 브랜드 패키징 | 패키지 디자인 | — |
| 푸드 앱 디자인 | 모바일 UI 디자인 | — |

---

## 새 프로젝트 추가 방법

### 1. detail 페이지 생성
```
detail-{slug}.html  ← detail-syncflo.html 복사 후 수정
css/detail-{slug}.css ← 페이지 전용 스타일
```

### 2. index.html 카드 업데이트
`index.html`의 해당 예시 카드(# 번호 기준)에서:
- `project-card__name`, `project-card__sub`, `project-card__desc` 수정
- `badge` 태그 수정
- `href`를 `detail-{slug}.html`로 변경
- `project-card__visual` 안의 mockup 교체 또는 gradient 클래스 변경

### 3. WORKS.md 이 표 업데이트
위 표의 상태를 🔲 예시 → ✅ 완료로 변경

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
