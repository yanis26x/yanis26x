// Theme toggle (persist)
const root = document.documentElement;
const THEME_KEY = "menu-theme";

function applyTheme(theme){
  if (theme !== "light" && theme !== "dark") return;
  root.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
  const label = document.querySelector(".toggle-label");
  if (label) label.textContent = theme === "light" ? "Dark" : "Light";
  // meta theme-color (fond noir conservé)
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", "#000000");
}

// Audio
const son = document.getElementById('son');
document.getElementById('playSoundBtn')?.addEventListener('click', ()=> son?.play());
window.addEventListener('DOMContentLoaded', () => {
  son?.play().catch(()=>{}); // autoplay si autorisé
});

(function initTheme(){
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light" || saved === "dark") applyTheme(saved);
  else applyTheme("dark");
})();

document.getElementById("themeToggle")?.addEventListener("click", () => {
  const current = root.getAttribute("data-theme") === "light" ? "light" : "dark";
  applyTheme(current === "light" ? "dark" : "light");
});

// Cards reveal on scroll (stagger)
const cards = document.querySelectorAll('.card');
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = [...cards].indexOf(el) * 160;
      el.style.animationDelay = `${delay}ms`;
      el.classList.add('in');
      io.unobserve(el);
    }
  });
}, { threshold: 0.15 });
cards.forEach(card => io.observe(card));

// Ripple on items
function attachRipple(el) {
  el.addEventListener('click', (e) => {
    const rect = el.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size/2;
    const y = e.clientY - rect.top - size/2;
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    el.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
}
document.querySelectorAll('.item').forEach(attachRipple);


function updateDateTime() {
  const now = new Date();

  // Format heure
  const time = now.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // Format date
  const date = now.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  document.getElementById("time").textContent = time;
  document.getElementById("date").textContent = date.charAt(0).toUpperCase() + date.slice(1);
}

// met à jour chaque seconde
setInterval(updateDateTime, 1000);
updateDateTime();

//pour changer le texte Salut ! 

  const texts = [
    "Salut !",
    "By333 By333!",
    "my funds increasing, yours looking chibi",
    "Do—dope sick, I'm having withdrawals, I feel uneasy",
    "Skittles got me feeling tranquil, they're so relieving",
    "Money—money, I gotta have it, its so intriguing",
    "Guap gives me satisfaction, it just completes me",
    "Money—money, I keep it 'round me, I'm very clingy",
    "want sum more ?"
  ];

    const textElement = document.getElementById("changing-text");
  let index = 0;

  function changeText() {
    textElement.textContent = texts[index];
    index = (index + 1) % texts.length;
  }

  changeText();
  setInterval(changeText, 4000); //5000




  // pour la music du menu 
// === Musique en boucle + bouton Play/Pause (autoplay béton) ===
(() => {
  const audio = document.getElementById("son");
  const btn = document.getElementById("audioToggle");
  const label = document.getElementById("audio-label");
  if (!audio || !btn || !label) return;

  audio.loop = true;
  audio.volume = 0.35;

  const KEY = "audio:playing"; // "1" play, "0" pause

  const setUI = (isPlaying) => {
    label.textContent = isPlaying ? "Pause" : "Play";
    btn.setAttribute("aria-pressed", String(isPlaying));
  };

  const tryPlay = async () => {
    try {
      await audio.play();
      localStorage.setItem(KEY, "1");
      setUI(true);
      return true;
    } catch {
      setUI(false);
      return false;
    }
  };

  const doPause = () => {
    audio.pause();
    localStorage.setItem(KEY, "0");
    setUI(false);
  };

  // Bouton Play/Pause
  btn.addEventListener("click", async () => {
    if (audio.paused) {
      const ok = await tryPlay();
      if (ok && audio.muted) audio.muted = false;
    } else {
      doPause();
    }
  });

  // 🔊 Unmute dès le 1er geste (clic/touche/touch)
  const unmute = () => {
    if (!audio.paused) audio.muted = false;
    window.removeEventListener("pointerdown", unmute);
    window.removeEventListener("keydown", unmute);
    window.removeEventListener("touchstart", unmute);
  };
  window.addEventListener("pointerdown", unmute, { once: true });
  window.addEventListener("keydown", unmute, { once: true });
  window.addEventListener("touchstart", unmute, { once: true });

  // ---- INIT ----
  (async () => {
    // Par défaut → play (sauf si l’utilisateur avait mis pause)
    const saved = localStorage.getItem(KEY);
    const wantPlay = saved == null ? true : saved === "1";
    if (!wantPlay) return setUI(false);

    // Autoplay autorisé car muted dans le HTML
    const ok = await tryPlay();
    // (si jamais ça échoue, le clic sur Play lancera quand même)
  })();

  // Si on revient sur l’onglet et qu’on voulait “play”, relance si besoin
  document.addEventListener("visibilitychange", async () => {
    if (!document.hidden && localStorage.getItem(KEY) === "1" && audio.paused) {
      const ok = await tryPlay();
      if (ok && audio.muted) audio.muted = false;
    }
  });
})();

// === Opacité du sang ===
(function(){
  const DEFAULT_BLOOD_OPACITY = 0.30;
  const img = document.querySelector('.bloodOnScreen');
  const range = document.getElementById('bloodOpacity');
  const valueEl = document.getElementById('bloodOpacityValue');
  const resetBtn = document.getElementById('resetOpacity');
  if(!img || !range || !valueEl) return;

  // charger valeur sauvegardée ou CSS courante
  const saved = localStorage.getItem('bloodOpacity');
  const initial = saved !== null
    ? Math.min(1, Math.max(0, parseFloat(saved)))
    : (parseFloat(getComputedStyle(img).opacity) || DEFAULT_BLOOD_OPACITY);

  function render(v){
    img.style.opacity = String(v);
    range.value = v.toFixed(2);
    valueEl.textContent = Math.round(v*100) + '%';
  }

  render(initial);

  range.addEventListener('input', (e)=>{
    const v = parseFloat(e.target.value);
    render(v);
  });

  range.addEventListener('change', (e)=>{
    const v = parseFloat(e.target.value);
    localStorage.setItem('bloodOpacity', String(v));
  });

  resetBtn?.addEventListener('click', ()=>{
    render(DEFAULT_BLOOD_OPACITY);
    localStorage.setItem('bloodOpacity', String(DEFAULT_BLOOD_OPACITY));
  });

    const textEl = document.getElementById("dynamic-text");

  const messages = [
    "Need friends ?",
    "Feeling alone ?",
    "Want me 2 help u ?",
    "need someone to talk 2 ?",
    "im here 4 u, Come talk 2 me",
    "Click me !",
    "Need friends ?",
    "Feeling alone ?",
    "Want me 2 help u ?",
    "need someone to talk 2 ?",
    "Ok i guess u dont need friends",
    "......",
    "me 2 then!",
    "Got more swag than u",
    "run me yo blood",
    "@#!$%&*",
    ".....",
    "When them vamps outside, lil' bitch, you better be ready",
    "When the stars align, lil' bitch, you better be ready",
    "I won't take my time, lil' bitch, you know I'm ready",
    "I want it right now, lil' bitch, you know I'm ready"

  ];

  let index = 0;

  function updateText() {
    textEl.classList.add("fade-out");

    setTimeout(() => {
      index = (index + 1) % messages.length;
      textEl.textContent = messages[index];
      textEl.classList.remove("fade-out");
    }, 400); // temps du fade-out / fade-in
  }

  setInterval(updateText, 1500);
})();
