# FLL Robot Game Guide — Claude Code 구현 프롬프트

## 프로젝트 개요

FLL(First Lego League) **UNEARTHED™ 2024-25 시즌**을 처음 하는 팀을 위한 **Robot Game 가이드 웹앱**이다.
GitHub Pages로 배포하는 순수 HTML/CSS/JS 정적 사이트 (프레임워크 없음).

---

## 파일 구조

아래 구조로 프로젝트를 만들어라.

```
fll-robot-guide/
├── index.html
├── mission-strategy.html
├── css/
│   ├── base.css           # CSS 변수, reset, 공통 typography
│   ├── nav.css            # 상단 네비게이션
│   └── mission.css        # mission-strategy 페이지 전용 스타일
├── js/
│   ├── data/
│   │   └── missions.js    # 미션 데이터 (MISSIONS 배열, MISSION_15, FLAG_POSITIONS)
│   ├── overview.js        # Overview Mode 렌더링 + 팝업 로직
│   └── strategy.js        # Strategy Mode 화살표, 루트 플래너 로직
└── assets/
    └── mission-map.png    # 미션 맵 이미지 (별도 첨부)
```

---

## 디자인 시스템

### CSS 변수 (`css/base.css`에 정의)

```css
:root {
  --bg: #0f1a0f;
  --surface: #1a2a1a;
  --border: rgba(80,180,80,0.25);
  --green: #4caf50;
  --green-light: #a5d6a7;
  --amber: #f4a261;
  --amber-dim: rgba(244,162,97,0.18);
  --red: #e57373;
  --text-primary: #eaf5ea;
  --text-secondary: #8aaa8a;
  --card-bg: rgba(20,40,20,0.92);
  --font-display: 'Space Grotesk', sans-serif;
  --font-body: 'Inter', sans-serif;
}
```

### Google Fonts

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
```

---

## 페이지 1: `index.html` (홈페이지)

### 디자인 참고

홈페이지는 별도 디자인 시스템을 사용한다 (고고학/흙 느낌의 warm dark theme):

```css
/* index.html 전용 추가 변수 */
--soil:   #1a1208;
--earth:  #241a0a;
--stone:  #2e2416;
--sand:   #c8a96e;
--cream:  #f0e6cc;
--moss:   #4a7c3f;
--rust:   #c0522a;
--muted:  #8a7a62;

/* 폰트: Fraunces (display) + DM Sans (body) + DM Mono (mono) */
```

### 레이아웃

- 상단 고정 네비게이션 (height: 52px)
  - 왼쪽: 로고 `FLL/Robot Game` (클릭 시 index.html)
  - 오른쪽: `Mission Strategy` / `Robot Design` / `Programming` 링크
- Hero 섹션
  - eyebrow: `FLL Challenge 2024–25`
  - 타이틀: `Robot Game` + italic `Guide for beginners`
  - 서브: `Everything a first-year FLL team needs to plan missions, build a robot, and write code — all in one place.`
- 구분선
- 섹션 라벨: `Where do you want to start?`
- **3개 카드** (grid 3열)

### 카드 스펙

| 카드 | 아이콘 | 라벨 | 타이틀 | 설명 | CTA | 링크 | 하단 액센트 색 |
|------|--------|------|--------|------|-----|------|----------------|
| 1 | 🗺️ | Section 01 | Mission Strategy | Explore the mission table, understand scoring, and plan your route with the interactive route planner. | Open → | mission-strategy.html | `#c0522a` |
| 2 | 🔧 | Section 02 | Robot Design | Learn how to build a stable chassis, design attachments, and improve consistency match after match. | Coming soon | # | `#4a7c3f` |
| 3 | 💻 | Section 03 | Programming | Start with SPIKE Prime or EV3 block coding, learn how to drive straight, turn, and complete missions. | Coming soon | # | `#4a6e8a` |

카드 hover 시: `translateY(-3px)` + 하단 2px 컬러 라인 scaleX(0→1) 애니메이션

### 푸터

- 왼쪽: `FLL Robot Game Guide — for first-year teams` (DM Mono, muted)
- 오른쪽: `UNEARTHED™ 2024–25` 뱃지 (rust 색 border)

---

## 페이지 2: `mission-strategy.html`

### 헤더

```html
<header>
  <!-- 왼쪽: 로고 (index.html 링크) + ← Home 버튼 -->
  <!-- 오른쪽: Overview / Strategy 토글 버튼 -->
</header>
```

- 로고 클릭 → `index.html`
- `← Home` 링크 → `index.html`
- 토글: `Overview` (기본 active) / `Strategy`

---

### js/data/missions.js

```js
// 미션 01-14: MISSIONS 배열
// px, py = 맵 이미지 기준 % 위치 (1366×682 원본)
const MISSIONS = [
  { id:1,  name:'Surface Brushing',   pts:30, px:16.5, py:42.5,
    tips:['Soil deposits completely cleared & touching mat: 10 pts each', 'Archaeologist\'s brush not touching dig site: 10 pts', 'Max 30 pts total — clear all 2 soil deposits + brush condition'] },
  { id:2,  name:'Map Reveal',          pts:20, px:20.5, py:16.5,
    tips:['Topsoil sections completely cleared: 10 pts each', '2 topsoil sections = max 20 pts', 'Shift and remove topsoil to reveal the hidden map'] },
  { id:3,  name:'Mineshaft Explorer',  pts:40, px:37.5, py:11.5,
    tips:['Minecart on opposing team\'s field: 30 pts', 'Bonus +10 if opposing team\'s minecart is on your field', 'Cart must pass COMPLETELY through the mineshaft entry', 'Bonus not available in remote competitions'] },
  { id:4,  name:'Careful Recovery',    pts:40, px:33.5, py:22.0,
    tips:['Precious artifact not touching the mine: 30 pts', 'Both support structures standing: 10 pts', 'Slow and precise — rushing causes drops'] },
  { id:5,  name:'Who Lived Here?',     pts:30, px:73.5, py:13.5,
    tips:['Structure floor completely upright: 30 pts', 'One clean push motion usually works', 'Verify floor is fully level after the action'] },
  { id:6,  name:'Forge',               pts:30, px:82.0, py:23.5,
    tips:['Ore blocks NOT touching the forge: 10 pts each', '3 ore blocks = max 30 pts', 'Technicians may open ore blocks by hand at home to reveal fossilized artifact (see M14)'] },
  { id:7,  name:'Heavy Lifting',       pts:30, px:93.0, py:13.5,
    tips:['Millstone no longer touching its base: 30 pts', 'Size and weight make this a real challenge', 'Practice the pickup motion 20+ times'] },
  { id:8,  name:'Silo',                pts:30, px:92.5, py:42.5,
    tips:['Preserved pieces outside the silo: 10 pts each', '3 preserved pieces = max 30 pts', 'Empty the silo completely for full points'] },
  { id:9,  name:"What's on Sale?",     pts:30, px:80.5, py:43.5,
    tips:['Roof completely raised: 20 pts', 'Market wares raised: 10 pts', 'Max 30 pts — raise roof AND wares'] },
  { id:10, name:'Tip the Scales',      pts:30, px:66.5, py:47.5,
    tips:['Scale tipped and touching the mat: 20 pts', 'Scale pan completely removed: 10 pts', 'Max 30 pts — tip scale AND remove pan'] },
  { id:11, name:'Angler Artifacts',    pts:30, px:57.5, py:86.5,
    tips:['Artifacts raised above ground layer: 20 pts', 'Bonus +10 if crane flag is at least partly lowered', 'Use the crane to excavate the site'] },
  { id:12, name:'Salvage Operation',   pts:30, px:44.5, py:84.5,
    tips:['Sand completely cleared: 20 pts (pull activator past the line)', 'Ship completely raised: 10 pts', 'Max 30 pts — clear sand AND raise ship'] },
  { id:13, name:'Statue Rebuild',      pts:30, px:55.0, py:40.0,
    tips:['Statue completely raised: 30 pts', 'Reconstruct statue to help piece together its historic significance', 'Approach from the front of the statue'] },
  { id:14, name:'Forum',               pts:35, px:43.5, py:47.5,
    tips:['5 pts each artifact touching mat and at least partly in the forum', 'Items: Brush, Topsoil, Precious Artifact, Opposing Minecart, Ore w/ Fossilized Artifact, Millstone, Scale Pan', 'Max 35 pts (7 items × 5 pts) — deliver as many as possible'] },
];

// 미션 15: 맵에 🚩 깃발 3개로 표시
const MISSION_15 = {
  id: 15, name: 'Site Marking', pts: 30, img: null,
  tips: [
    'Sites with flag at least partly inside & touching mat: 10 pts each',
    'Sites are outlined on the mat wireframe',
    '3 sites = max 30 pts — place all flags'
  ]
};

// 맵 이미지 기준 깃발 3개 위치 (%)
// 원본 맵에서 빨간 깃발이 실제로 있는 3곳
const FLAG_POSITIONS = [
  { px: 25.5, py: 30.5 }, // 왼쪽 중간
  { px: 58.0, py: 14.5 }, // 위쪽 가운데
  { px: 43.0, py: 83.5 }, // 아래쪽 (M12 근처)
];
```

---

### Overview Mode

**맵 컨테이너 스펙:**

```
- 배경 이미지: assets/mission-map.png
- aspect-ratio: 1366 / 682 (원본 이미지 비율 고정)
- position: relative (핀 absolute 배치용)
```

**미션 핀 (01-14):**

- `position: absolute`, `transform: translate(-50%, -50%)`
- 초록 배경 버튼 (`#1b5e20`), 흰 border, 숫자 표시
- hover: scale(1.12) + green glow
- 클릭 → 팝업 오픈

**Mission 15 깃발 핀:**

- `position: absolute`, `transform: translate(-50%, -100%)` (깃발이 위를 향하도록)
- 🚩 이모지, font-size responsive
- hover: scale(1.25)
- 클릭 → Mission 15 팝업 오픈

**홈베이스 표시 (Overview에서는 표시만, 클릭 불가):**

- 🔴 Home Base → 왼쪽 하단 모서리 (`left: 1.5%, bottom: 2%`)
- 🔵 Home Base → 오른쪽 하단 모서리 (`right: 1.5%, bottom: 2%`)

**팝업:**

- 오버레이 클릭으로 닫힘, X 버튼으로도 닫힘
- 표시 내용:
  - `Mission 01` (태그)
  - 미션 이름
  - `⭐ Max XX pts` 뱃지
  - 이미지 영역: `m.img`가 있으면 `<img>` 표시, 없으면 placeholder (`📷 Add screenshot: set img: 'assets/screenshots/m01.png'`)
  - Strategy Tips 리스트 (`→` 불릿)

---

### Strategy Mode

**맵 + Info Bar 구조:**

```
.strat-map-group
  ├── .map-wrapper (맵 + SVG 화살표 레이어 + 핀들 + 홈베이스)
  └── .info-bar (맵 바깥 아래에 붙음 — 홈베이스 가리지 않도록)
```

**홈베이스 (Strategy에서는 클릭 가능):**

- 🔴 Home Base → 왼쪽 하단 모서리, 클릭 가능
- 🔵 Home Base → 오른쪽 하단 모서리, 클릭 가능
- 선택 시 amber 색 glow (`box-shadow: 0 0 0 3px rgba(244,162,97,0.6)`)

**연결 로직:**

1. 첫 번째 클릭 → `connectFrom` 저장, 해당 버튼 selected 표시
2. 두 번째 클릭 (다른 노드) → 화살표 추가 (`arrows` 배열에 `{from, to}` push)
3. 같은 노드 다시 클릭 → 선택 해제
4. 중복 연결 방지

**노드 ID 타입:**
- 미션: `number` (1-14)
- 홈베이스: `string` (`'hb-left'`, `'hb-right'`)
- 깃발: `string` (`'flag-0'`, `'flag-1'`, `'flag-2'`)

**SVG 화살표:**

- 초록색 (`#4caf50`), stroke-width: 2.5
- arrowhead marker
- 중간에 순서 번호 표시 (어두운 배경 rect + 초록 텍스트)
- 핀 중심 좌표는 `getBoundingClientRect()` 기준으로 계산

**Info Bar (맵 아래):**

```
In route: N   Connections: N   Est. pts: N   |   Click ① then ② to connect
```

**Your Route 섹션:**

Run 분리 로직:
```
chain 빌드: usedArrows Set으로 화살표 추적 (홈베이스 중복 허용)

홈베이스가 없으면: 1. M01 → 2. M02 → ... (flat 리스트)

홈베이스가 있으면 Run으로 분리:
  - 홈베이스에서 시작 → 다음 홈베이스(포함)까지 = 1개 Run
  - Run N 라벨 + mission 개수 표시
  - 각 Run: 🔴 Home → 1. M01 Surface Brushing → 2. M02 Map Reveal → 🔴 Home

예시:
Run 1  (2 missions)
🔴 Home → 1. M01 Surface Brushing → 2. M02 Map Reveal → 🔴 Home

Run 2  (3 missions)
🔴 Home → 1. M05 Who Lived Here? → 2. M07 Heavy Lifting → 3. M13 Statue Rebuild
```

**툴바 버튼:**
- `✕ Clear arrows` → 화살표만 제거
- `⊘ Reset all` → 화살표 + 선택 상태 모두 초기화

---

## 구현 시 주의사항

1. **핀 위치**: `px`, `py`는 맵 이미지 전체 크기 기준 % — `left: m.px+'%', top: m.py+'%'`로 설정. 맵이 리사이즈돼도 핀이 비율로 따라가야 함.

2. **홈베이스 위치**: `position: absolute`로 맵 모서리에 고정. Overview와 Strategy 모두 동일 위치. info-bar는 맵 **바깥** 아래에 위치해야 홈베이스가 가려지지 않음.

3. **화살표 좌표**: `getBoundingClientRect()`으로 핀 중심을 구한 후, wrapper의 rect를 빼서 상대 좌표로 변환. mode switch 후 `setTimeout(drawArrows, 60)` 필요 (DOM 렌더링 대기).

4. **chain 빌드**: `chain.includes()` 대신 `usedArrows Set`으로 화살표 추적 — 홈베이스가 chain에 여러 번 등장할 수 있음 (Run 1 끝 → Run 2 시작).

5. **img 필드**: 각 미션의 `img: null`이 기본값. 나중에 `img: 'assets/screenshots/m01.png'` 형식으로 추가하면 팝업에 이미지 표시.

6. **GitHub Pages**: `index.html`이 루트에 있어야 함. 모든 링크는 상대경로 사용.

7. **반응형**: 맵은 `aspect-ratio: 1366/682` 고정, `width: 100%`. 핀 폰트도 `clamp()` 사용.

---

## 아직 미구현 페이지

- `robot-design.html` — "Coming soon" 상태로 카드만 존재
- `programming.html` — "Coming soon" 상태로 카드만 존재

이 두 페이지는 지금은 구조만 만들어두고 내용은 추후 추가 예정.
