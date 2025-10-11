// Apparition des cartes
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

// Audio
const son = document.getElementById('son');
document.getElementById('playSoundBtn')?.addEventListener('click', ()=> son?.play());
window.addEventListener('DOMContentLoaded', () => {
  son?.play().catch(()=>{}); // autoplay si autorisé
});

// Générateur
const input = document.getElementById('inputText');
const btn = document.getElementById('confirmBtn');
const out = document.getElementById('output');

const mapBase = {
  b:'B', d:'D', e:'3', f:'F', g:'6', h:'H', i:'1', j:'J',
  k:'k', l:'L', m:'M', n:'N', o:'0', p:'p', q:'q', r:'r',
  s:'S', t:'T', u:'u', v:'V', w:'w', x:'x', y:'y', z:'z'
};

function transform(){
  const convertA = document.getElementById('convertA').checked;
  const convertC = document.getElementById('convertC').checked;
  const raw = input.value || '';

  const res = raw.split('').map(ch => {
    const low = ch.toLowerCase();
    if (low === 'a') return convertA ? '4' : ch;
    if (low === 'c') return convertC ? '(' : ch;
    return mapBase[low] ?? ch;
  }).join('');

  out.textContent = res || '…';
}

btn?.addEventListener('click', transform);
input?.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ transform(); }});
