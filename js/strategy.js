let arrows = [];       // [{from, to}]
let connectFrom = null;

function renderStrategy() {
  const wrapper = document.getElementById('strategy-map');
  if (!wrapper) return;

  wrapper.querySelectorAll('.mission-pin, .flag-pin, .home-base').forEach(el => el.remove());

  // Mission pins
  MISSIONS.forEach(m => {
    const btn = document.createElement('button');
    btn.className = 'mission-pin';
    btn.id = 'strat-pin-' + m.id;
    btn.style.left = m.px + '%';
    btn.style.top  = m.py + '%';
    btn.textContent = String(m.id).padStart(2, '0');
    btn.title = m.name;
    btn.addEventListener('click', () => handleNodeClick(m.id));
    wrapper.appendChild(btn);
  });

  // Flag pins for Mission 15
  FLAG_POSITIONS.forEach((fp, i) => {
    const btn = document.createElement('button');
    btn.className = 'flag-pin';
    btn.id = 'strat-flag-' + i;
    btn.style.left = fp.px + '%';
    btn.style.top  = fp.py + '%';
    btn.textContent = '🚩';
    btn.title = 'Mission 15 — Site Marking';
    btn.addEventListener('click', () => handleNodeClick('flag-' + i));
    wrapper.appendChild(btn);
  });

  // Home bases (clickable in strategy)
  const hbLeft = document.createElement('button');
  hbLeft.className = 'home-base hb-left clickable';
  hbLeft.id = 'strat-hb-left';
  hbLeft.innerHTML = '🔴 Home';
  hbLeft.addEventListener('click', () => handleNodeClick('hb-left'));
  wrapper.appendChild(hbLeft);

  const hbRight = document.createElement('button');
  hbRight.className = 'home-base hb-right clickable';
  hbRight.id = 'strat-hb-right';
  hbRight.innerHTML = '🔵 Home';
  hbRight.addEventListener('click', () => handleNodeClick('hb-right'));
  wrapper.appendChild(hbRight);

  // SVG layer
  let svg = wrapper.querySelector('.arrow-layer');
  if (!svg) {
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('arrow-layer');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.innerHTML = `
      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="6"
                refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#4caf50"/>
        </marker>
      </defs>
    `;
    wrapper.appendChild(svg);
  }

  setTimeout(drawArrows, 60);
  updateInfoBar();
  updateRoute();
}

function getNodeEl(id) {
  if (typeof id === 'number') return document.getElementById('strat-pin-' + id);
  if (id === 'hb-left')  return document.getElementById('strat-hb-left');
  if (id === 'hb-right') return document.getElementById('strat-hb-right');
  if (typeof id === 'string' && id.startsWith('flag-')) {
    return document.getElementById('strat-' + id);
  }
  return null;
}

function getNodeCenter(el, wrapperRect) {
  const r = el.getBoundingClientRect();
  return {
    x: r.left + r.width / 2  - wrapperRect.left,
    y: r.top  + r.height / 2 - wrapperRect.top,
  };
}

function drawArrows() {
  const wrapper = document.getElementById('strategy-map');
  if (!wrapper) return;
  const svg = wrapper.querySelector('.arrow-layer');
  if (!svg) return;

  // Remove old lines/labels (keep defs)
  svg.querySelectorAll('line, g.arrow-label').forEach(el => el.remove());

  const wRect = wrapper.getBoundingClientRect();

  arrows.forEach((arrow, idx) => {
    const fromEl = getNodeEl(arrow.from);
    const toEl   = getNodeEl(arrow.to);
    if (!fromEl || !toEl) return;

    const from = getNodeCenter(fromEl, wRect);
    const to   = getNodeCenter(toEl,   wRect);

    // Shorten line so arrowhead doesn't overlap pin
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    const offset = 14;
    const ratio = dist > 0 ? (dist - offset) / dist : 1;
    const ex = from.x + dx * ratio;
    const ey = from.y + dy * ratio;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', from.x);
    line.setAttribute('y1', from.y);
    line.setAttribute('x2', ex);
    line.setAttribute('y2', ey);
    line.setAttribute('stroke', '#4caf50');
    line.setAttribute('stroke-width', '2.5');
    line.setAttribute('marker-end', 'url(#arrowhead)');
    svg.appendChild(line);

    // Order number label at midpoint
    const mx = (from.x + to.x) / 2;
    const my = (from.y + to.y) / 2;
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.classList.add('arrow-label');

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', mx - 9);
    rect.setAttribute('y', my - 9);
    rect.setAttribute('width', 18);
    rect.setAttribute('height', 18);
    rect.setAttribute('rx', 9);
    rect.setAttribute('fill', '#0f1a0f');
    rect.setAttribute('stroke', '#4caf50');
    rect.setAttribute('stroke-width', 1.2);

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', mx);
    text.setAttribute('y', my + 4.5);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', '#4caf50');
    text.setAttribute('font-size', '10');
    text.setAttribute('font-weight', '700');
    text.setAttribute('font-family', 'Space Grotesk, sans-serif');
    text.textContent = idx + 1;

    g.appendChild(rect);
    g.appendChild(text);
    svg.appendChild(g);
  });
}

function handleNodeClick(id) {
  if (connectFrom === null) {
    connectFrom = id;
    markSelected(id, true);
    return;
  }

  if (connectFrom === id) {
    // Deselect
    markSelected(id, false);
    connectFrom = null;
    return;
  }

  const duplicate = arrows.some(a => a.from === connectFrom && a.to === id);
  if (!duplicate) {
    arrows.push({ from: connectFrom, to: id });
  }

  markSelected(connectFrom, false);
  connectFrom = null;
  markSelected(id, false);

  drawArrows();
  updateInfoBar();
  updateRoute();
}

function markSelected(id, selected) {
  const el = getNodeEl(id);
  if (!el) return;
  el.classList.toggle('selected', selected);
}

function isHomeBase(id) {
  return id === 'hb-left' || id === 'hb-right';
}

function getNodeLabel(id) {
  if (typeof id === 'number') {
    const m = MISSIONS.find(m => m.id === id);
    return m ? `M${String(m.id).padStart(2,'0')} ${m.name}` : `M${id}`;
  }
  if (id === 'hb-left')  return '🔴 Home';
  if (id === 'hb-right') return '🔵 Home';
  if (typeof id === 'string' && id.startsWith('flag-')) return '🚩 Flag';
  return String(id);
}

function buildChain() {
  if (arrows.length === 0) return [];

  // Build adjacency from arrows
  const usedArrows = new Set();
  const chain = [];

  // Find start: a node that has no incoming edge (excluding homeBases which can repeat)
  const allFroms = arrows.map(a => a.from);
  const allTos   = arrows.map(a => a.to);

  // Determine starting node
  let startNode = null;
  for (const a of arrows) {
    const fromId = a.from;
    if (isHomeBase(fromId) || !allTos.includes(fromId)) {
      startNode = fromId;
      break;
    }
  }
  if (startNode === null) startNode = arrows[0].from;

  chain.push(startNode);

  let safeGuard = 0;
  while (safeGuard < 200) {
    safeGuard++;
    const last = chain[chain.length - 1];
    const nextArrowIdx = arrows.findIndex((a, i) => a.from === last && !usedArrows.has(i));
    if (nextArrowIdx === -1) break;
    usedArrows.add(nextArrowIdx);
    chain.push(arrows[nextArrowIdx].to);
  }

  return chain;
}

function updateRoute() {
  const container = document.getElementById('route-container');
  if (!container) return;

  const chain = buildChain();

  if (chain.length === 0) {
    container.innerHTML = '<p class="route-empty">No connections yet. Click two nodes to connect them.</p>';
    return;
  }

  const hasHomeBase = chain.some(isHomeBase);

  if (!hasHomeBase) {
    // Flat list
    const run = document.createElement('div');
    run.className = 'route-run';
    const label = document.createElement('div');
    label.className = 'run-label';
    label.textContent = `Route  (${chain.filter(n => typeof n === 'number').length} missions)`;
    run.appendChild(label);

    const steps = document.createElement('div');
    steps.className = 'run-steps';
    chain.forEach((node, i) => {
      if (i > 0) {
        const arr = document.createElement('span');
        arr.className = 'run-step-arrow';
        arr.textContent = '→';
        steps.appendChild(arr);
      }
      const step = document.createElement('span');
      step.className = typeof node === 'number' ? 'run-step-mission' : 'run-step-home';
      const missionIdx = chain.slice(0, i).filter(n => typeof n === 'number').length;
      step.textContent = typeof node === 'number'
        ? `${missionIdx + 1}. ${getNodeLabel(node)}`
        : getNodeLabel(node);
      steps.appendChild(step);
    });
    run.appendChild(steps);
    container.innerHTML = '';
    container.appendChild(run);
    return;
  }

  // Split into runs by home base boundaries
  const runs = [];
  let currentRun = [];
  let runStarted = false;

  for (let i = 0; i < chain.length; i++) {
    const node = chain[i];
    if (isHomeBase(node)) {
      if (!runStarted) {
        currentRun.push(node);
        runStarted = true;
      } else {
        currentRun.push(node);
        runs.push(currentRun);
        currentRun = [node];
      }
    } else {
      currentRun.push(node);
      if (!runStarted) runStarted = true;
    }
  }
  if (currentRun.length > 1) runs.push(currentRun);

  container.innerHTML = '';
  runs.forEach((run, ri) => {
    const missionCount = run.filter(n => typeof n === 'number' || (typeof n === 'string' && n.startsWith('flag-'))).length;
    const div = document.createElement('div');
    div.className = 'route-run';

    const label = document.createElement('div');
    label.className = 'run-label';
    label.textContent = `Run ${ri + 1}  (${missionCount} mission${missionCount !== 1 ? 's' : ''})`;
    div.appendChild(label);

    const steps = document.createElement('div');
    steps.className = 'run-steps';
    let stepNum = 0;
    run.forEach((node, i) => {
      if (i > 0) {
        const arr = document.createElement('span');
        arr.className = 'run-step-arrow';
        arr.textContent = '→';
        steps.appendChild(arr);
      }
      const step = document.createElement('span');
      if (isHomeBase(node)) {
        step.className = 'run-step-home';
        step.textContent = getNodeLabel(node);
      } else {
        stepNum++;
        step.className = 'run-step-mission';
        step.textContent = `${stepNum}. ${getNodeLabel(node)}`;
      }
      steps.appendChild(step);
    });
    div.appendChild(steps);
    container.appendChild(div);
  });
}

function updateInfoBar() {
  const missionNodes = new Set();
  arrows.forEach(a => {
    if (typeof a.from === 'number') missionNodes.add(a.from);
    if (typeof a.to   === 'number') missionNodes.add(a.to);
    if (typeof a.from === 'string' && a.from.startsWith('flag-')) missionNodes.add(a.from);
    if (typeof a.to   === 'string' && a.to.startsWith('flag-'))   missionNodes.add(a.to);
  });

  let estPts = 0;
  missionNodes.forEach(id => {
    if (typeof id === 'number') {
      const m = MISSIONS.find(m => m.id === id);
      if (m) estPts += m.pts;
    } else if (typeof id === 'string' && id.startsWith('flag-')) {
      estPts += Math.round(MISSION_15.pts / FLAG_POSITIONS.length);
    }
  });

  const inRouteEl    = document.getElementById('stat-in-route');
  const connectionsEl = document.getElementById('stat-connections');
  const ptsEl        = document.getElementById('stat-pts');
  if (inRouteEl)     inRouteEl.textContent    = missionNodes.size;
  if (connectionsEl) connectionsEl.textContent = arrows.length;
  if (ptsEl)         ptsEl.textContent         = estPts;
}

function clearArrows() {
  arrows = [];
  connectFrom = null;
  document.querySelectorAll('#strategy-map .selected').forEach(el => el.classList.remove('selected'));
  drawArrows();
  updateInfoBar();
  updateRoute();
}

function resetAll() {
  clearArrows();
}

document.addEventListener('DOMContentLoaded', () => {
  const clearBtn = document.getElementById('btn-clear');
  const resetBtn = document.getElementById('btn-reset');
  if (clearBtn) clearBtn.addEventListener('click', clearArrows);
  if (resetBtn) resetBtn.addEventListener('click', resetAll);

  window.addEventListener('resize', () => {
    if (document.getElementById('strategy-map')?.closest('.mode-section.active')) {
      drawArrows();
    }
  });
});
