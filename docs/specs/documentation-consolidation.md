# Storybook 제거 및 README/JSDoc 문서 통합

## 목표

Storybook을 제거하고 README 코드 스니펫 + JSDoc을 유일한 문서 전략으로 확립하여, 유지 비용을 줄이고 문서를 한 곳에 집중시킨다.

## 상세

### 1. Storybook 제거

삭제 대상:

- `.storybook/` 디렉토리 (main.ts, manager.ts, preview.ts)
- `storybook-static/` 디렉토리
- Story 파일 4개
  - `src/components/AudioPlayer/index.stories.tsx`
  - `src/components/Slider/index.stories.tsx`
  - `src/hooks/audio/useAudio.stories.tsx`
  - `src/hooks/playlist/usePlaylist.stories.tsx`
- `package.json` 의존성 (21개)
  - `@chromatic-com/storybook`
  - `@storybook/addon-essentials`
  - `@storybook/addon-interactions`
  - `@storybook/addon-links`
  - `@storybook/addon-onboarding`
  - `@storybook/addon-styling-webpack`
  - `@storybook/addon-themes`
  - `@storybook/addon-webpack5-compiler-swc`
  - `@storybook/blocks`
  - `@storybook/manager-api`
  - `@storybook/react`
  - `@storybook/react-webpack5`
  - `@storybook/test`
  - `@storybook/theming`
  - `chromatic`
  - `storybook`
  - Storybook 전용 의존성 3개: `css-loader`, `postcss-loader`, `style-loader`
- `package.json` 스크립트: `storybook`, `build-storybook`
- `.gitignore`: `storybook-static`, `*storybook.log` 항목
- `.github/workflows/chromatic.yml` 워크플로우
- README Development 섹션: `bun storybook` 항목

삭제하지 않는 의존성: `postcss`, `autoprefixer` (Tailwind/Vite 파이프라인에서 사용)

기존 story의 데모 코드는 보존하지 않는다.

### 2. README 개선

현재 README의 Quick Start 섹션(AudioPlayer, useAudio)은 유지하고, 부족한 API 문서를 보강한다.

#### API Overview 확장

각 공개 API에 한 줄 설명 + 최소 코드 스니펫을 추가한다. 상세 시그니처(params/returns)는 JSDoc에 이미 있으므로 README에서는 중복하지 않는다.

대상 (API별 문서화 깊이를 차등 적용):

- `useAudio`: 한 줄 설명, 현재 Quick Start 스니펫으로 충분
- `usePlaylist`: 한 줄 설명 + 플레이리스트 관리 스니펫
- `useWaveform`: 한 줄 설명 + 웨이브폼 렌더링 스니펫
- `AudioPlayer`: 서브 컴포넌트 전체 목록 (Provider, Playlist, CurrentTime, Duration, ProgressBar, VolumeProgressBar, PlayButton, PauseButton, PlayPauseButton, StopButton, ShiftForwardButton, ShiftBackwardButton, SkipStartButton, SkipEndButton, RepeatButton, VolumeButton)
- `Waveform`: 한 줄 설명 + 기본 사용 스니펫
- `Slider`: 한 줄 설명 + 기본 사용 스니펫
- `fetchAudio`: 한 줄 설명 + 기본 사용 스니펫
- `getAudioFileInformation`: 한 줄 설명만

스니펫 작성 원칙:

- 3~5줄의 최소 동작 코드
- 드래그/DOM 조작 등 애플리케이션 로직을 포함하지 않음
- import 문 포함

### 3. JSDoc 개선

#### @example 추가 (공개 훅/컴포넌트 6개)

- `useAudio`
- `usePlaylist`
- `useWaveform`
- `AudioPlayer` (compound component)
- `Waveform`
- `Slider`

fetchAudio, getAudioFileInformation, 서브 컴포넌트에는 추가하지 않는다.

#### 서브 컴포넌트 JSDoc 추가

`AudioPlayer/_components/` 하위 개별 파일에 JSDoc을 추가한다. 부모(AudioPlayer/index.tsx)에 이미 있는 설명을 반복하지 않되, 각 파일에 최소한의 한 줄 설명은 포함한다.

대상 (16개):

- AudioPlayerCurrentTime, AudioPlayerDuration, AudioPlayerPlaylist
- AudioPlayerProgressBar, AudioPlayerProvider, AudioPlayerVolumeProgressBar
- AudioPlayerPlayButton, AudioPlayerPauseButton, AudioPlayerPlayPauseButton, AudioPlayerStopButton
- AudioPlayerShiftForwardButton, AudioPlayerShiftBackwardButton
- AudioPlayerSkipStartButton, AudioPlayerSkipEndButton
- AudioPlayerRepeatButton, AudioPlayerVolumeButton

제외 (내부 유틸리티 2개): AudioPlayerButtonIcon, AudioPlayerButtonWrapper

### 4. CLAUDE.md Documentation style 보강

추가할 항목:

- `@example` 작성 기준: 공개 훅과 컴포넌트에 추가, 유틸/서브 컴포넌트는 제외
- 서브 컴포넌트 규칙 명확화: "공유 설명은 부모에 한 번만 작성하되, 각 서브 컴포넌트 파일에 고유한 한 줄 설명은 포함한다"

## 경계

- 항상: README 스니펫은 실행 가능한 최소 코드로 작성한다
- 항상: 기존 JSDoc 문체 규칙(동사 시작, "audio" 용어 등)을 따른다
- 항상: 상세 시그니처는 JSDoc에만 작성하고 README에서 중복하지 않는다
- 절대: story 데모 코드를 README에 그대로 옮기지 않는다 (새로 작성)
- 절대: 내부 훅/유틸의 JSDoc은 이 스펙 범위에 포함하지 않는다
- 절대: 내부 유틸리티 컴포넌트(ButtonIcon, ButtonWrapper)에 JSDoc을 추가하지 않는다

## 검증

- `bun install` 후 에러 없음
- `bun run build` 성공
- `bun run lint` 통과
- `bun run test` 통과
- Storybook 관련 파일이 프로젝트에 남아 있지 않음 (`grep -r "storybook" .` 결과 없음, .gitignore 제외)
- README의 모든 코드 스니펫이 현재 API와 일치
- `postcss`, `autoprefixer`가 삭제되지 않았음을 확인
