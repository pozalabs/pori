# 오픈소스 공개 준비

## 목표

비공개 npm 패키지(`@pozalabs/pori`)를 오픈소스로 공개하기 위해 GitHub 설정 정리, 코드 정리, 문서 작성을 수행한다

## 진행 상황

- [ ] 1. GitHub 설정 정리 (CODEOWNERS 제거만 완료)
- [ ] 2. 기타 코드 정리
- [ ] 3. CONTRIBUTING.md + PR/Issue 템플릿

## 상세

### 1. GitHub 설정 정리

**삭제**

- `.github/release-drafter-config.yml` (내부 릴리즈 프로세스)
- `.github/workflows/release-drafter.yml` (위 config를 참조하는 workflow)

**수정**

- `.github/PULL_REQUEST_TEMPLATE.md` - 내부 팀 참조("Followers", "팀원" 등) 제거, 오픈소스에 맞게 업데이트
- `.github/workflows/publish.yml` - 내부 npm 레지스트리 설정(`@pozalabs` 스코프의 `npm.pkg.github.com`) 제거 (단, 배포 대상 변경은 이번 범위 밖)
- `.github/workflows/vitest.yml` - 내부 npm 레지스트리 설정 제거
- `.github/workflows/type-lint-check.yml` - 내부 npm 레지스트리 설정 제거

### 2. 기타 코드 정리

- `src/app.tsx`의 개발용 NOTE 주석 제거

### 3. CONTRIBUTING.md + PR/Issue 템플릿

**CONTRIBUTING.md**

- 개발 환경 설정 (clone, install, dev, test)
- PR 프로세스
- 코드 스타일 가이드 (ESLint, Prettier 설정 활용)

**Issue 템플릿** (`.github/ISSUE_TEMPLATE/`)

- Bug report
- Feature request

**PR 템플릿** - 기존 템플릿을 오픈소스에 맞게 수정 (1번 항목에 포함)

## 경계

- 항상: MIT 라이선스 호환성을 유지한다
- 절대: 배포 대상(npm 레지스트리) 변경은 하지 않는다. 패키지명(@pozalabs/pori)을 변경하지 않는다

## 검증

- `yarn build` 성공
- `yarn test` 통과
- `yarn tsc` 타입 체크 통과
- `yarn lint` 통과
