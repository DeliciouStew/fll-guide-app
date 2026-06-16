function renderOverview() {
  const wrapper = document.getElementById('overview-map');
  if (!wrapper) return;

  // Clear existing pins (keep img)
  wrapper.querySelectorAll('.mission-pin, .flag-pin, .home-base').forEach(el => el.remove());

  // Mission pins 01-14
  MISSIONS.forEach(m => {
    const btn = document.createElement('button');
    btn.className = 'mission-pin';
    btn.style.left = m.px + '%';
    btn.style.top  = m.py + '%';
    btn.textContent = String(m.id).padStart(2, '0');
    btn.title = m.name;
    btn.addEventListener('click', () => openPopup(m));
    wrapper.appendChild(btn);
  });

  // Flag pins for Mission 15
  FLAG_POSITIONS.forEach((fp, i) => {
    const btn = document.createElement('button');
    btn.className = 'flag-pin';
    btn.style.left = fp.px + '%';
    btn.style.top  = fp.py + '%';
    btn.textContent = '🚩';
    btn.title = 'Mission 15 — Site Marking';
    btn.addEventListener('click', () => openPopup(MISSION_15));
    wrapper.appendChild(btn);
  });

  // Home base markers (display only in overview)
  const hbLeft = document.createElement('div');
  hbLeft.className = 'home-base hb-left';
  hbLeft.innerHTML = '🔴 Home Base';
  wrapper.appendChild(hbLeft);

  const hbRight = document.createElement('div');
  hbRight.className = 'home-base hb-right';
  hbRight.innerHTML = '🔵 Home Base';
  wrapper.appendChild(hbRight);
}

function openPopup(mission) {
  const overlay = document.getElementById('popup-overlay');
  const tag     = document.getElementById('popup-tag');
  const title   = document.getElementById('popup-title');
  const pts     = document.getElementById('popup-pts');
  const imgBox  = document.getElementById('popup-img-box');
  const tipsList = document.getElementById('popup-tips');

  tag.textContent   = 'Mission ' + String(mission.id).padStart(2, '0');
  title.textContent = mission.name;
  pts.textContent   = '⭐ Max ' + mission.pts + ' pts';

  imgBox.innerHTML = '';
  if (mission.img) {
    const img = document.createElement('img');
    img.src = mission.img;
    img.alt = mission.name;
    imgBox.appendChild(img);
  } else {
    const ph = document.createElement('p');
    ph.className = 'popup-img-placeholder';
    ph.textContent = `📷 Add screenshot: set img: 'assets/screenshots/m${String(mission.id).padStart(2,'0')}.png'`;
    imgBox.appendChild(ph);
  }

  tipsList.innerHTML = '';
  mission.tips.forEach(tip => {
    const li = document.createElement('li');
    li.textContent = tip;
    tipsList.appendChild(li);
  });

  overlay.classList.add('open');
}

function closePopup() {
  document.getElementById('popup-overlay').classList.remove('open');
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('popup-overlay')
    .addEventListener('click', e => { if (e.target === e.currentTarget) closePopup(); });
  document.getElementById('popup-close')
    .addEventListener('click', closePopup);
});
