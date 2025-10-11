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

// Calcul
const $ = (id) => document.getElementById(id);
const currentAvg = $('currentAvg');
const finalWeight = $('finalWeight');
const goal = $('goal');
const resultBox = $('resultBox');
const resultText = $('resultText');

$('computeBtn')?.addEventListener('click', () => {
  const avg = parseFloat(currentAvg.value);
  const w = parseFloat(finalWeight.value);
  const g = parseFloat(goal.value || '60');

  // validations simples
  if (isNaN(avg) || avg < 0 || avg > 100){ show("Entre une moyenne entre 0 et 100."); return; }
  if (isNaN(w) || w < 0 || w > 100){ show("Entre un poids d'examen entre 0 et 100."); return; }
  if (isNaN(g) || g <= 0 || g > 100){ show("Objectif global invalide (1–100)."); return; }

  const weight = w/100;
  if (weight === 0){
    // pas d'examen final
    if (avg >= g){ show(`T'as déjà ${avg}%, objectif ${g}% atteint!`); }
    else { show(`Pas d'examen final : impossible d'atteindre ${g}% avec ${avg}%.`); }
    return;
  }

  // besoin = round((g − avg*(1−weight)) / weight)
  const needRaw = (g - (avg * (1 - weight))) / weight;
  const need = Math.round(needRaw);

  // messages friendly
  if (need <= 0){
    show(`Okkkkk....  tas besoin de ${Math.max(0, need)}% à l'examen pour atteindre ${g}%.`);
  } else if (need > 100){
    show(`garde la peche, change de reve gamin`);
  } else {
    show(`Tas besoin de <b>${need}%</b> à l'examen pour atteindre <b>${g}%</b> au final.`);
  }
});

$('resetBtn')?.addEventListener('click', () => {
  currentAvg.value = '';
  finalWeight.value = '';
  goal.value = 60;
  resultBox.hidden = true;
  resultText.innerHTML = '';
  currentAvg.focus();
});

function show(msg){
  resultText.innerHTML = msg;
  resultBox.hidden = false;
}
