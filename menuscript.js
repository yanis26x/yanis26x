/* =========================
   THEME TOGGLE (BACKGROUND WHITE IN LIGHT)
========================= */
const root = document.documentElement;
const THEME_KEY = "menu-theme";

const themeBtn = document.getElementById("themeToggle");
const themeLabel = document.getElementById("themeLabel");
const themeEmoji = document.getElementById("themeEmoji");

function setMetaThemeColor(hex) {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", hex);
}

function applyTheme(theme) {
  const t = theme === "light" ? "light" : "dark";
  root.setAttribute("data-theme", t);
  localStorage.setItem(THEME_KEY, t);

  if (t === "dark") {
    themeLabel.textContent = "Light";
    themeEmoji.textContent = "🌙";
    themeBtn.setAttribute("aria-pressed", "false");
    setMetaThemeColor("#000000");
  } else {
    themeLabel.textContent = "Dark";
    themeEmoji.textContent = "☀️";
    themeBtn.setAttribute("aria-pressed", "true");
    setMetaThemeColor("#ffffff");
  }
}

(function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  applyTheme(saved || "dark");
})();

themeBtn?.addEventListener("click", () => {
  const current = root.getAttribute("data-theme") === "light" ? "light" : "dark";
  applyTheme(current === "light" ? "dark" : "light");
});

/* =========================
   CARDS REVEAL ON SCROLL (STAGGER)
========================= */
const cards = document.querySelectorAll(".card");
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = [...cards].indexOf(el) * 160;
        el.style.animationDelay = `${delay}ms`;
        el.classList.add("in");
        io.unobserve(el);
      }
    });
  },
  { threshold: 0.15 }
);
cards.forEach((card) => io.observe(card));

/* =========================
   RIPPLE ON ITEMS
========================= */
function attachRipple(el) {
  el.addEventListener("click", (e) => {
    const rect = el.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.className = "ripple";

    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    el.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  });
}
document.querySelectorAll(".item").forEach(attachRipple);

/* =========================
   DATE + TIME
========================= */
function updateDateTime() {
  const now = new Date();

  const time = now.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const date = now.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const timeEl = document.getElementById("time");
  const dateEl = document.getElementById("date");
  if (!timeEl || !dateEl) return;

  timeEl.textContent = time;
  dateEl.textContent = date.charAt(0).toUpperCase() + date.slice(1);
}
setInterval(updateDateTime, 1000);
updateDateTime();

/* =========================
   CHANGING TEXT
========================= */
const texts = [
  "Salut !",
  "By333 By333!",
  "my funds increasing, yours looking chibi",
  "Do—dope sick, I'm having withdrawals, I feel uneasy",
  "Skittles got me feeling tranquil, they're so relieving",
  "Money—money, I gotta have it, its so intriguing",
  "Guap gives me satisfaction, it just completes me",
  "Money—money, I keep it 'round me, I'm very clingy",
  "want sum more ?",
];

const textElement = document.getElementById("changing-text");
let textIndex = 0;

function changeText() {
  if (!textElement) return;
  textElement.textContent = texts[textIndex];
  textIndex = (textIndex + 1) % texts.length;
}
changeText();
setInterval(changeText, 4000);

/* =========================
   AUDIO PLAY/PAUSE (persist)
========================= */
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

  btn.addEventListener("click", async () => {
    if (audio.paused) {
      const ok = await tryPlay();
      if (ok && audio.muted) audio.muted = false;
    } else {
      doPause();
    }
  });

  // Unmute dès le 1er geste user (navigateur)
  const unmute = () => {
    if (!audio.paused) audio.muted = false;
    window.removeEventListener("pointerdown", unmute);
    window.removeEventListener("keydown", unmute);
    window.removeEventListener("touchstart", unmute);
  };
  window.addEventListener("pointerdown", unmute, { once: true });
  window.addEventListener("keydown", unmute, { once: true });
  window.addEventListener("touchstart", unmute, { once: true });

  (async () => {
    const saved = localStorage.getItem(KEY);
    const wantPlay = saved == null ? true : saved === "1";

    if (!wantPlay) return setUI(false);

    audio.muted = true;
    const ok = await tryPlay();
    if (ok) setUI(true);
  })();

  document.addEventListener("visibilitychange", async () => {
    if (!document.hidden && localStorage.getItem(KEY) === "1" && audio.paused) {
      const ok = await tryPlay();
      if (ok && audio.muted) audio.muted = false;
    }
  });
})();

/* =========================
   BLOOD OPACITY (persist) + DYNAMIC BUTTON TEXT
========================= */
(function () {
  const DEFAULT_BLOOD_OPACITY = 0.3;
  const img = document.querySelector(".bloodOnScreen");
  const range = document.getElementById("bloodOpacity");
  const valueEl = document.getElementById("bloodOpacityValue");
  const resetBtn = document.getElementById("resetOpacity");

  if (!img || !range || !valueEl) return;

  const saved = localStorage.getItem("bloodOpacity");
  const initial =
    saved !== null
      ? Math.min(1, Math.max(0, parseFloat(saved)))
      : DEFAULT_BLOOD_OPACITY;

  function render(v) {
    img.style.opacity = String(v);
    range.value = v.toFixed(2);
    valueEl.textContent = Math.round(v * 100) + "%";
  }

  render(initial);

  range.addEventListener("input", (e) => {
    const v = parseFloat(e.target.value);
    render(v);
  });

  range.addEventListener("change", (e) => {
    const v = parseFloat(e.target.value);
    localStorage.setItem("bloodOpacity", String(v));
  });

  resetBtn?.addEventListener("click", () => {
    render(DEFAULT_BLOOD_OPACITY);
    localStorage.setItem("bloodOpacity", String(DEFAULT_BLOOD_OPACITY));
  });

  // Dynamic button text (Need friends?)
  const textEl = document.getElementById("dynamic-text");
  if (!textEl) return;

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
    "I want it right now, lil' bitch, you know I'm ready",
  ];

  let i = 0;

  function updateText() {
    textEl.classList.add("fade-out");
    setTimeout(() => {
      i = (i + 1) % messages.length;
      textEl.textContent = messages[i];
      textEl.classList.remove("fade-out");
    }, 400);
  }

  setInterval(updateText, 1500);
})();
