function switchRobotTab(tab) {
  document.querySelectorAll('.tab-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.robot-tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  document.getElementById('rbtn-' + tab).classList.add('active');
}

function toggleCard(card) {
  card.classList.toggle('open');
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.principle-card').forEach(card => {
    card.querySelector('.card-header').addEventListener('click', () => toggleCard(card));
  });

  // Restore checklist state from localStorage
  document.querySelectorAll('.check-item input[type="checkbox"]').forEach(cb => {
    const key = 'robot-check-' + cb.dataset.key;
    cb.checked = localStorage.getItem(key) === '1';
    cb.addEventListener('change', () => {
      localStorage.setItem(key, cb.checked ? '1' : '0');
    });
  });
});
