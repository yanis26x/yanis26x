/* =========================
   HELPERS
========================= */
const root = document.documentElement;
const $ = (q) => document.querySelector(q);

/* =========================
   THEME TOGGLE (Dark=black+blue, Light=white+pink)
========================= */
const THEME_KEY = "menu-theme";
const themeBtn = $("#themeToggle");
const themeLabel = $("#themeLabel");
const themeEmoji = $("#themeEmoji");

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
    themeBtn?.setAttribute("aria-pressed", "false");
    setMetaThemeColor("#000000");
  } else {
    themeLabel.textContent = "Dark";
    themeEmoji.textContent = "☀️";
    themeBtn?.setAttribute("aria-pressed", "true");
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

  const timeEl = $("#time");
  const dateEl = $("#date");
  if (!timeEl || !dateEl) return;

  timeEl.textContent = time;
  dateEl.textContent = date.charAt(0).toUpperCase() + date.slice(1);
}
setInterval(updateDateTime, 1000);
updateDateTime();

/* =========================
   CHANGING TEXT (top headline)
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
const textElement = $("#changing-text");
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
  const audio = $("#son");
  const btn = $("#audioToggle");
  const label = $("#audio-label");
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
   BLOOD OPACITY (persist)
========================= */
(function () {
  const DEFAULT_BLOOD_OPACITY = 0.3;
  const img = $("#bloodImg") || document.querySelector(".bloodOnScreen");
  const range = $("#bloodOpacity");
  const valueEl = $("#bloodOpacityValue");
  const resetBtn = $("#resetOpacity");

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
})();

/* =========================
   MOOD IMAGE (changes every 20s) + background overlay sync
========================= */
const moodImg = $("#moodImg");
const bgOverlay = $("#bgOverlay");
const moodHint = $("#moodHint");
const nextMoodBtn = $("#nextMood");

const moodImages = [
  "./OST_IMG/imageCool/242.g.jpeg",
  "./OST_IMG/imageCool/CestTriste.jpg",
  "./OST_IMG/imageCool/nana_film.jpg",
  "./OST_IMG/imageCool/BloodMask.jpeg",
  "./OST_IMG/imageCool/lamp_cover.jpg",
  "./OST_IMG/imageCool/sora.png",
  "./OST_IMG/imageCool/lisa.jpg",
];

let moodIndex = 0;

function setMood(i){
  if (!moodImg) return;
  moodIndex = (i + moodImages.length) % moodImages.length;

  moodImg.style.opacity = "0";
  setTimeout(() => {
    moodImg.src = moodImages[moodIndex];
    moodImg.style.opacity = "1";
    if (bgOverlay) bgOverlay.src = moodImages[moodIndex];
    if (moodHint) moodHint.textContent = "mhmm…";
  }, 180);
}

function nextMood(){
  setMood(moodIndex + 1);
}

setMood(0);
setInterval(nextMood, 20000);
nextMoodBtn?.addEventListener("click", nextMood);

/* =========================
   MOTD (Message du jour) rotator
========================= */
const motdText = $("#motdText");
const motdDots = $("#motdDots");

const motd = [
  "i dont XXXXXX anymore.",
  "its all your fault.",
  "XXXXXXXXX",
  "XXXXXXXXX",
  "NEED MORE XXXXXX",
  "0kay?!.",
];

let motdIndex = 0;

function renderDots(){
  if (!motdDots) return;
  motdDots.innerHTML = "";
  motd.forEach((_, idx) => {
    const s = document.createElement("span");
    if (idx === motdIndex) s.classList.add("on");
    motdDots.appendChild(s);
  });
}

function setMotd(i){
  if (!motdText) return;
  motdIndex = (i + motd.length) % motd.length;

  motdText.style.transform = "translateY(6px)";
  motdText.style.opacity = "0";
  setTimeout(() => {
    motdText.textContent = motd[motdIndex];
    motdText.style.transform = "translateY(0)";
    motdText.style.opacity = "1";
    renderDots();
  }, 160);
}

setMotd(0);
setInterval(() => setMotd(motdIndex + 1), 5000);

/* =========================
   RANDOM BUTTON (force new mood + new texts + new motd)
========================= */
$("#randomBtn")?.addEventListener("click", () => {
  nextMood();
  changeText();
  setMotd(motdIndex + 1);
});

/* =========================
   COMMENTS ROTATOR (same logic)
========================= */
(function commentRotator(){
  const crUserEl = $("#crUser");
  const crTextEl = $("#crText");
  const crTimeEl = $("#crTime");
  const crAvatarEl = $("#crAvatar");

  if (!crUserEl || !crTextEl || !crTimeEl || !crAvatarEl) return;

  const comments = [
    { user:"karim_92", avatar:"https://i.pravatar.cc/150?img=14", text:"T’as voulu faire le mec original mais t juste gênant fdp" },
    { user:"riyad", avatar:"./OST_IMG/pfp/riyad.jpg", text:"Hak rabi tu va finir en enfer avec moi sal fdp" },
    { user:"Glody", avatar:"./OST_IMG/pfp/glody.jpg", text:"écoute les haters ❤️" },
    { user:"TuCritiqueMaisTuClique44", avatar:"https://i.pravatar.cc/150?img=4", text:"ta dla chance tes pas devant moi sinnon jtaurais deja cracher a la geule toccard!" },
    { user:"yousshayat", avatar:"./OST_IMG/pfp/youssef.jpg", text:"le site crée pour le mossad, supprime connard!!" },
    { user:"nadinee__", avatar:"./OST_IMG/pfp/user3.png", text:"jespere que ce mec meurt bientot tellement son site est degueulasse" },
    { user:"00aya", avatar:"https://i.pravatar.cc/150?img=5", text:"y croit il a dead ca en + mdrrrr, jcomprend pk il a pas damis loll" },
    { user:"ines.dz", avatar:"./OST_IMG/pfp/ines.jpg", text:"tes pas le couteaux le plus tranchant du tiroir toi! mdr tyra pas loin dans la vie avec ton site de connard" },
    { user:"nassim25x", avatar:"./OST_IMG/pfp/nassim.jpg", text:" @ines.dz jsuis daccord avec toi !! c'esst une merde ce type" },
    { user:"ines.dz", avatar:"./OST_IMG/pfp/ines.jpg", text:"@nassim25x ferme ta gueule toi personne ta demander ton avis, imbecile" },
    { user:"mahdi", avatar:"./OST_IMG/pfp/mahdi.jpg", text:"AJOUTER MOI SUR SNAP QUE LES MEUFS Kouachi_smk" },
    { user:"aLaRechercheDuBonheur", avatar:"./OST_IMG/pfp/drogues.jpg", text:"ton site est aussi utile que toi dans la vie" },
    { user:"SATAN", avatar:"./OST_IMG/pfp/satan.png", text:"@yanis26x jtais reserver une place en enfer pour toi gros, fait belek ya pas la clim ici" },
    { user:"sarah.privv", avatar:"./OST_IMG/pfp/helloKitty.jpg", text:"jai tjr etait vegan mais la jme demande si on devrait vraiment laisser vivre les animaux sal comme toi!" },
    { user:"1kramm", avatar:"https://i.pravatar.cc/150?img=19", text:"maintenant jcomprend pk il a pas de meuf, quesquil est moche en plus, c pr ca jle regarde tjr mal" },
    { user:"Xxx_friend_xxX", avatar:"https://i.pravatar.cc/150?img=63", text:"HAVARD IS CALLING🔥🔥.... THE WRONG NUMBER 🔥" },
    { user:"yanis26x", avatar:"./OST_IMG/imageCool/CestTriste.jpg", text:"heuuu.. merci?! si vous voulez ajouter un commentaire ecrivez le moi mp et jvais lajouter avec tous seu quils ont deja fait , byee..." },
    
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

  setInterval(() => {
    crTimeEl.textContent = formatAgo(Date.now() - start);
  }, 1000);

  setInterval(next, 8000);
})();
