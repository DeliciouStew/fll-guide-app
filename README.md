# FLL Robot Game Guide

**FIRST Lego League UNEARTHED™ 2024-25 시즌**을 처음 하는 팀을 위한 Robot Game 가이드 웹앱.

GitHub Pages로 배포하는 순수 HTML/CSS/JS 정적 사이트 (프레임워크 없음).

---

## 목적

FLL 첫 도전 팀이 시합 준비에 필요한 세 가지를 한 곳에서 볼 수 있도록 만든 가이드다:

- **Mission Strategy** — 맵 위 미션 위치 확인, 점수 전략 수립, 루트 계획
- **Robot Design** *(예정)* — 섀시 설계, 어태치먼트, 일관성 향상 팁
- **Programming** *(예정)* — SPIKE Prime / EV3 블록 코딩, 직진/회전/미션 완료

---

## 파일 구조

```
fll-guide-app/
├── index.html              # 홈페이지
├── mission-strategy.html   # 미션 전략 페이지
├── css/
│   ├── base.css            # CSS 변수, reset, 공통 typography
│   ├── nav.css             # 상단 네비게이션
│   └── mission.css         # mission-strategy 페이지 전용 스타일
├── js/
│   ├── data/
│   │   └── missions.js     # 미션 데이터 (MISSIONS, MISSION_15, FLAG_POSITIONS)
│   ├── overview.js         # Overview Mode 렌더링 + 팝업 로직
│   └── strategy.js         # Strategy Mode 화살표, 루트 플래너 로직
└── assets/
    └── mission-map.png     # 미션 맵 이미지 (별도 추가 필요)
```

---

## 페이지 설명

### `index.html` — 홈페이지

고고학/흙 느낌의 warm dark 테마 (`Fraunces` + `DM Sans` 폰트). 세 섹션 카드로 진입점 제공. Mission Strategy만 현재 연결됨.

### `mission-strategy.html` — 미션 전략 페이지

헤더의 **Overview / Strategy** 토글로 두 모드를 전환한다.

#### Overview Mode
- 맵 위에 미션 핀(01–14)과 🚩 깃발(Mission 15) 배치
- 핀 클릭 → 팝업: 미션명, 최대 점수, 전략 팁
- 🔴 🔵 홈베이스 위치 표시 (클릭 불가)

#### Strategy Mode
- 핀과 홈베이스 모두 클릭 가능
- **클릭 두 번으로 연결**: 첫 번째 노드 선택 → 두 번째 노드 클릭 → SVG 화살표 생성
- 화살표 중간에 연결 순서 번호 표시
- **Info Bar**: 루트 내 미션 수 / 연결 수 / 예상 점수
- **Your Route**: 홈베이스 기준으로 Run 단위 자동 분리
- `✕ Clear arrows` / `⊘ Reset all` 툴바

---

## 미션 데이터

`js/data/missions.js`에서 관리한다.

| 상수 | 설명 |
|------|------|
| `MISSIONS` | 미션 01–14 배열. `id`, `name`, `pts`, `px`, `py`, `img`, `tips` 포함 |
| `MISSION_15` | Site Marking (깃발 3개) |
| `FLAG_POSITIONS` | 맵 기준 깃발 3개 위치 (%) |

`px`, `py`는 원본 맵 이미지(1366×682) 기준 % 좌표 — 맵 리사이즈 시 핀이 비율로 따라간다.

### 미션 스크린샷 추가 방법

팝업에 이미지를 넣으려면 `missions.js`에서 `img` 필드를 수정한다:

```js
// 변경 전
{ id:1, name:'Surface Brushing', ..., img: null }

// 변경 후
{ id:1, name:'Surface Brushing', ..., img: 'assets/screenshots/m01.png' }
```

---

## 맵 이미지 추가

`assets/mission-map.png`에 FLL UNEARTHED 공식 미션 맵 이미지를 넣으면 된다.

- 원본 비율 **1366 × 682** 권장
- 없으면 녹색 배경 위에 핀만 표시됨

---

## 배포 (GitHub Pages)

`main` 브랜치의 루트(`/`)에 `index.html`이 있으므로 GitHub Pages 설정만 하면 바로 배포된다.

1. GitHub 저장소 생성 후 push
2. Settings → Pages → Source: `main` 브랜치 `/` (root)
3. 자동 배포

모든 링크는 상대경로를 사용하므로 별도 설정 불필요.

---

## 디자인 시스템

### 홈페이지 (`index.html` 인라인)
```
배경: #1a1208 (soil)   텍스트: #f0e6cc (cream)
포인트: #c8a96e (sand)  강조: #c0522a (rust)
폰트: Fraunces (제목) / DM Sans (본문) / DM Mono (모노)
```

### 미션 페이지 (`css/base.css`)
```
배경: #0f1a0f           표면: #1a2a1a
녹색: #4caf50           앰버: #f4a261
폰트: Space Grotesk (제목) / Inter (본문)
```
