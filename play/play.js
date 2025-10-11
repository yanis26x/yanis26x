// Révélation des cartes
const cards = document.querySelectorAll('.card');
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting){
      const el = entry.target;
      const delay = [...cards].indexOf(el) * 160;
      el.style.animationDelay = `${delay}ms`;
      el.classList.add('in');
      io.unobserve(el);
    }
  });
}, { threshold: 0.15 });
cards.forEach(c => io.observe(c));

// Opacité du sang
const blood = document.querySelector('.bloodOnScreen');
const slider = document.getElementById('bloodOpacity');
if (slider && blood){
  slider.addEventListener('input', () => {
    blood.style.opacity = slider.value;
  });
}

// Cycle backgrounds (si tu veux en ajouter)
const bgs = [
  "../OST_IMG/sillentHill.jpg",
  "../OST_IMG/xp.jpg",
  "../OST_IMG/black.jpg" // optionnel si présent
];
let idx = 0;
document.getElementById('cycleBg')?.addEventListener('click', () => {
  idx = (idx + 1) % bgs.length;
  document.body.style.backgroundImage = `url('${bgs[idx]}')`;
});

// (Optionnel) Ripple sur les items
function attachRipple(el){
  el.addEventListener('click', (e) => {
    const rect = el.getBoundingClientRect();
    const r = document.createElement('span');
    r.className = 'ripple';
    const size = Math.max(rect.width, rect.height);
    r.style.width = r.style.height = `${size}px`;
    r.style.left = `${e.clientX - rect.left - size/2}px`;
    r.style.top  = `${e.clientY - rect.top  - size/2}px`;
    el.appendChild(r);
    r.addEventListener('animationend', () => r.remove());
  });
}
document.querySelectorAll('.item').forEach(attachRipple);
