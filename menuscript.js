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





//     {
//     user: "nassim25x",
//     text: " @ines.dz jsuis daccord avec toi !! c'esst une merde ce type"
//   },
//     {
//     user: "ines.dz",
//     text: "@ferme ta gueule toi personne ta demander ton avis, imbecile"
//   },
//   {
//     user: "aLaRechercheDuBonheur",
//     text: "Ce site est aussi utile que toi dans la vie"
//   },
//   {
//     user: "SATAN",
//     text: "@yanis26x jtais reserver une place en enfer pour toi gros, fait belek ya pas la clim ici"
//   },
//   {
//     user: "sarah.privv",
//     text: "jai tjr etait vegan mais la jme demande si on devrait vraiment laisser vivre les chien sal comme toi!"
//   },
//   {
//     user: "1kramm",
//     text: "maintenant jcomprend pk personne veut etre son ami mdrrr, quesquil est moche en plus, il a pas compris haloween c 1 jour dans lannée mdrrrr"
//   },
//     {
//     user: "Xxx_manassé_xxX",
//     text: "HAVARD IS CALLING🔥🔥.... THE WRONG NUMBER 🔥"
//   }
// ];


// --- Rotating comments (one at a time) ---
// Avatars locaux: ./OST_IMG/pfp/

(function commentRotator(){
  const crUserEl = document.getElementById("crUser");
  const crTextEl = document.getElementById("crText");
  const crTimeEl = document.getElementById("crTime");
  const crAvatarEl = document.getElementById("crAvatar");

  if (!crUserEl || !crTextEl || !crTimeEl || !crAvatarEl) return;

  // Commentaires toxiques / négatifs (sans menaces)
  const comments = [
    {
      user: "karim_92",
      avatar: "https://i.pravatar.cc/150?img=14",
      text: "T’as voulu faire le mec original mais t juste gênant fdp"
    },
    {
      user: "TuCritiqueMaisTuClique44",
      avatar: "https://i.pravatar.cc/150?img=4",
      text: "ta dla chance tes pas devant moi sinnon jtaurais deja cracher a la geule toccard!"
    },
    {
      user: "nadinee__",
      avatar: "./OST_IMG/pfp/user3.png",
      text: "jespere que ce mec meurt bientot tellement son site est degueulasse"
    },
    {
      user: "00aya",
      avatar: "./OST_IMG/pfp/aya.jpg",
      text: "y croit il a dead ca en + mdrrrr, jcomprend pk il a pas damis loll"
    },
    {
      user: "ines.dz",
      avatar: "./OST_IMG/pfp/ines.jpg",
      text: "tes pas le couteaux le plus tranchant du tiroir toi! mdr tyra pas loin dans la vie avec ton site de connard"
    },
    {
      user: "nassim25x",
      avatar: "./OST_IMG/pfp/user6.png",
      text: " @ines.dz jsuis daccord avec toi !! c'esst une merde ce type"
    },
         {
     user: "ines.dz",
     avatar: "./OST_IMG/pfp/ines.jpg",
     text: "@nassim25x ferme ta gueule toi personne ta demander ton avis, imbecile"
   },
    {
      user: "aLaRechercheDuBonheur",
      avatar: "./OST_IMG/pfp/drogues.jpg",
      text: "Ce site est aussi utile que toi dans la vie"
    },
    {
      user: "SATAN",
      avatar: "./OST_IMG/pfp/satan.png",
      text: "@yanis26x jtais reserver une place en enfer pour toi gros, fait belek ya pas la clim ici"
    },
    {
      user: "sarah.privv",
      avatar: "./OST_IMG/pfp/helloKitty.jpg",
      text: "jai tjr etait vegan mais la jme demande si on devrait vraiment laisser vivre les chien sal comme toi!"
    },
    {
      user: "1kramm",
      avatar: "https://i.pravatar.cc/150?img=19",
      text: "maintenant jcomprend pk personne veut etre son ami mdrrr, quesquil est moche en plus, il a pas compris haloween c 1 jour dans lannée mdrrrr"
    },
    {
      user: "Xxx_manasse_xxX",
      avatar: "https://i.pravatar.cc/150?img=65",
      text: "HAVARD IS CALLING🔥🔥.... THE WRONG NUMBER 🔥"
    },
    {
      user: "yanis26x (mec genant)",
      avatar: "./OST_IMG/imageCool/CestTriste.jpg",
      text: "heuuu.. si vous voulez votre propre commentaire, dites le moi..."
    },
    {
      user: "yousshayat",
      avatar: "./OST_IMG/imageCool/youssef.jpg",
      text: "le site crée pour le mossad, supprime connard!!"
    }
  ];

  let index = 0;
  let start = Date.now();

  function formatAgo(ms){
    const totalSec = Math.max(0, Math.floor(ms / 1000));
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;

    if (min <= 0) return `il y a ${sec} seconde${sec > 1 ? "s" : ""}`;
    return `il y a ${min} minute${min > 1 ? "s" : ""} et ${sec} seconde${sec > 1 ? "s" : ""}`;
  }

  // Transforme @username en mention bleue
  function parseMentions(text){
    return text.replace(/@([a-zA-Z0-9_.]+)/g, '<span class="mention">@$1</span>');
  }

  function render(){
    const c = comments[index];

    crUserEl.textContent = c.user;
    crTextEl.innerHTML = parseMentions(c.text);
    crAvatarEl.src = c.avatar;

    start = Date.now();
    crTimeEl.textContent = "il y a 0 seconde";
  }

  function next(){
    index = (index + 1) % comments.length;
    render();
  }

  render();

  // timer
  setInterval(() => {
    crTimeEl.textContent = formatAgo(Date.now() - start);
  }, 1000);

  // rotation
  setInterval(next, 8000);
})();