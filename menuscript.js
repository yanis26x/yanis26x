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
