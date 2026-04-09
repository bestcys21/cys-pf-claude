# 포트폴리오 작업 가이드

## 경로 (PC마다 다름)
- 집 PC: `C:\Users\bestc\Downloads\portfolio-web`
- 회사 PC: `C:\Users\IJMAIL\Downloads\pf-claude`

## 배포 (회사 PC)
```
vercel --token [VERCEL_TOKEN] --prod --yes --scope bestcys-9902s-projects
```
- Vercel CLI 한글 유저명 버그로 로그인 불가 → 토큰 방식 사용
- 프로젝트: `pf-claude` / URL: https://pf-claude-indol.vercel.app

## 배포 (집 PC)
```
vercel --prod --yes
```
- 처음 한 번은 `vercel link` 실행 → 기존 프로젝트 `pf-claude` 선택
- 이후부터는 위 명령으로 바로 배포

## Git (회사 PC)
- remote URL에 개인 PAT 포함 (회사 git과 분리)
- user.name: bestcys21 / user.email: bestcys21@naver.com
- push 가능 상태

## 로컬 서버
```
npx serve .  →  localhost:3000
```
