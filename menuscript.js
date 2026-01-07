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
  "pLaY kInGd0M hEaRtS 2 . n0w !!",
  "its all your fault.",
  "Echo26x is tAkInG wAy m0Re tImE tHaN eXpEcTeD...",
  "NEED MORE XXXXXX 140mg in my blood rn",
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
   COMMENTS ROTATOR (with Verified / Unverified toggle)
========================= */
(function commentRotator(){
  const crUserEl = $("#crUser");
  const crTextEl = $("#crText");
  const crTimeEl = $("#crTime");
  const crAvatarEl = $("#crAvatar");

  const unverifiedBtn = $("#commentsUnverifiedBtn");
  const verifiedBtn = $("#commentsVerifiedBtn");

  if (!crUserEl || !crTextEl || !crTimeEl || !crAvatarEl) return;

  // --------- LISTS ----------
  const unverifiedComments = [
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
    { user:"120mgInMybloodRN", avatar:"./OST_IMG/pfp/drogues.jpg", text:"ton site est aussi utile que toi dans la vie" },
    { user:"SATAN", avatar:"./OST_IMG/pfp/satan.png", text:"@yanis26x jtais reserver une place en enfer pour toi gros, fait belek ya pas la clim ici" },
    { user:"sarah.privv", avatar:"./OST_IMG/pfp/helloKitty.jpg", text:"jai tjr etait vegan mais la jme demande si on devrait vraiment laisser vivre les animaux sal comme toi!" },
    { user:"1kramm", avatar:"https://i.pravatar.cc/150?img=19", text:"maintenant jcomprend pk il a pas de meuf, quesquil est moche en plus, c pr ca jle regarde tjr mal" },
    { user:"Xxx_friend_xxX", avatar:"https://i.pravatar.cc/150?img=63", text:"HAVARD IS CALLING🔥🔥.... THE WRONG NUMBER 🔥" },
    { user:"yanis26x", avatar:"./OST_IMG/imageCool/CestTriste.jpg", text:"heuuu.. merci?! si vous voulez ajouter un commentaire ecrivez le moi mp et jvais lajouter avec tous seu quils ont deja fait , byee..." },
  ];

  // ✅ verified
  const verifiedComments = [
    { user:"BOT#1", avatar:"./OST_IMG/pfp/bot.png", text:"c̷̖̣̠̏̇̇͑̈́͘͝ŏ̸̢̡̧̨̡̫̭͚͙͓͚̤̲̬̔̈͗̉͌͌͑ö̵̧͖̮̎l̵̠̰͖̪̦͕̗̭̻͐̋̂͐̀͑̔͘ ̸̢̱̲͓̈́̈́̑̐̊̋̓̂̍̈͝w̶̖̠̗̦͍̙̟̘̪͓̑͂̚ȅ̵̙͉̓̄b̷̡̡̞̥͚̣̳͙̹̲̖̜̿̽͋̾̄̊̓̓̍̍ş̵̡̤̟̹̮̦͛̎͛̂̇̓̇̉̈̓̉̑̕ͅḯ̶̤̦͉̣̙̘̝͍̗̠̺͖̇͌̂́̍̄͆ͅͅt̴͙̏̋̓̓̎̽̿̄̋͘e̶͕͍̋͋͠" },
    { user:"BOT#2", avatar:"./OST_IMG/pfp/bot2.png", text:"hhello?!" },
    { user:"BOT#3", avatar:"./OST_IMG/pfp/bot.png", text:"comment_id=8842391 status=OK" },
    { user:"BOT#4", avatar:"./OST_IMG/pfp/bot2.png", text:"never saw a better website!" },
    { user:"BOT#5", avatar:"./OST_IMG/pfp/bot.png", text:"haha yes funny" },
    
  ];

  // --------- STATE ----------
  const MODE_KEY = "comments:mode";
  let mode = localStorage.getItem(MODE_KEY) || "verified";
  let comments = mode === "verified" ? verifiedComments : unverifiedComments;

  let index = 0;
  let start = Date.now();

  let tickTimer = null;
  let nextTimer = null;

  // --------- HELPERS ----------
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

  function safeAvatarFallback(){
    crAvatarEl.onerror = () => {
      crAvatarEl.onerror = null;
      crAvatarEl.src = "./OST_IMG/pfp/user3.png"; // fallback local
    };
  }

  function render(){
    if (!comments.length){
      crUserEl.textContent = "—";
      crTextEl.textContent = "Aucun commentaire.";
      crAvatarEl.src = "./OST_IMG/pfp/user3.png";
      crTimeEl.textContent = "—";
      return;
    }

    const c = comments[index];
    crUserEl.textContent = c.user;
    crTextEl.innerHTML = parseMentions(c.text);
    safeAvatarFallback();
    crAvatarEl.src = c.avatar;

    start = Date.now();
    crTimeEl.textContent = "il y a 0 seconde";
  }

  function next(){
    if (!comments.length) return;
    index = (index + 1) % comments.length;
    render();
  }

  function setMode(newMode){
    mode = newMode === "verified" ? "verified" : "unverified";
    localStorage.setItem(MODE_KEY, mode);

    comments = mode === "verified" ? verifiedComments : unverifiedComments;

    // UI buttons
    if (unverifiedBtn && verifiedBtn){
      const isUnv = mode === "unverified";
      unverifiedBtn.classList.toggle("on", isUnv);
      verifiedBtn.classList.toggle("on", !isUnv);
      unverifiedBtn.setAttribute("aria-selected", String(isUnv));
      verifiedBtn.setAttribute("aria-selected", String(!isUnv));
    }

    // reset rotation
    index = 0;
    render();
  }

  function startTimers(){
    tickTimer = setInterval(() => {
      crTimeEl.textContent = formatAgo(Date.now() - start);
    }, 1000);

    nextTimer = setInterval(next, 8000);
  }

  // --------- INIT ----------
  setMode(mode);      // sets comments + renders
  startTimers();

  // --------- EVENTS ----------
  unverifiedBtn?.addEventListener("click", () => setMode("unverified"));
  verifiedBtn?.addEventListener("click", () => setMode("verified"));
})();



/* =========================
   ADD YOUR COMMENT (custom modal)
========================= */
(() => {
  const modal = $("#commentModal");
  const openBtn = $("#addCommentBtn");
  const closeBtn = $("#commentModalClose");
  const okBtn = $("#commentModalOk");

  if (!modal || !openBtn) return;

  const open = () => {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  };

  const close = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  };

  openBtn.addEventListener("click", open);
  closeBtn?.addEventListener("click", close);
  okBtn?.addEventListener("click", close);

  // click outside (overlay)
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });

  // ESC to close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) close();
  });
})();


/* =========================
   MINI SOUND PLAYER (Next + label)
========================= */
(() => {
  const audio = $("#mp3Player");
  const btn = $("#mp3Next");
  const label = $("#mp3Label");

  if (!audio || !btn || !label) return;

  const tracks = [
    { name: "h3llo", src: "./OST_IMG/helloOST.mp3" },
    { name: "NaNa", src: "./OST_IMG/nanaost.mp3" },
    { name: "HahA", src: "./OST_IMG/haha.mp3" },
    { name: "IDK", src: "./OST_IMG/wo.mp3" },
    { name: "goodbye", src: "./OST_IMG/cry.mp3" },
    { name: "laugh!", src: "./OST_IMG/Pain.mp3" },
    { name: "Cest triste", src: "./OST_IMG/bgm.mp3" },
    
  ];

  let index = 0;

  const playNext = async () => {
    try{
      audio.pause();
      const t = tracks[index];
      audio.src = t.src;
      audio.currentTime = 0;
      label.textContent = t.name;
      await audio.play();
      index = (index + 1) % tracks.length;
    } catch {}
  };

  // init label
  label.textContent = tracks[0].name;

  btn.addEventListener("click", playNext);
})();



/* =========================
   FAKE SYSTEM LOG
========================= */
(() => {
  const logEl = document.getElementById("systemLogList");
  if (!logEl) return;

  const logs = [
    "system is suffering",
    "heartbeat: OK",
    "System alive. Unfortunately.",
    "Warning, disk space almost full",
    "Blood curently moving in veins",
    "New connection from MX64+8XM, Zoige, Ngawa Tibetan and Qiang Autonomous Prefecture, Sichuan, Chine, 624500",
    "subject skin is strarting to burn",
    "a user just died from OD",
    "ERROR: organs missing",
    "subject barely alive",
    "injecting 140mg of XXXXXX",
    "Thinking about a irreversible action...",
    "pain level to high, system shutting down soon",
  ];

  const maxLines = 6;

  const nowTime = () => {
    const d = new Date();
    return d.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const addLog = () => {
    const line = document.createElement("div");
    line.className = "logLine";

    const time = document.createElement("span");
    time.className = "logTime";
    time.textContent = `[${nowTime()}]`;

    const msg = document.createElement("span");
    msg.className = "logMsg";
    msg.textContent = logs[Math.floor(Math.random() * logs.length)];

    line.appendChild(time);
    line.appendChild(msg);

    logEl.prepend(line);

    // limit lines
    while (logEl.children.length > maxLines) {
      logEl.removeChild(logEl.lastChild);
    }
  };

  // initial logs
  for (let i = 0; i < 3; i++) addLog();

  // random activity
  setInterval(addLog, 3500);
})();

/* =========================
   SYSTEM STATUS (mini)
========================= */
(() => {
  const line = $("#statusLine");
  const dot = $("#statusDot");
  if (!line || !dot) return;

  const states = [
    { text: "online · stability: unstable", ok: true },
    { text: "online · bloodflow: normal", ok: true },
    { text: "online · watchers: 1", ok: true },
    { text: "warning · leak detected", ok: false },
    { text: "warning · heartbeat irregular, to fast", ok: false },
    { text: "online · process: bleeding", ok: false },
    { text: "error · blood pressure critical", ok: false },
    { text: "error · internal bleeding", ok: false },
    { text: "error · veins desynchronized", ok: false },
    { text: "process alive · do not terminate", ok: false },
    { text: "background breathing detected", ok: false },
    { text: "unknown presence watching", ok: false },
    { text: "memory soaked in blood", ok: false },
    { text: "flesh integrity compromised", ok: false },
    { text: "eyes opened behind interface", ok: true },
    { text: "pain normalized", ok: true },
    { text: "suffering within acceptable range", ok: true },

    
  ];

  const setDot = (ok) => {
    const color = ok ? "#22c55e" : "#ef4444"; // vert / rouge
    dot.style.background = color;
    dot.style.boxShadow = `0 0 0 0 ${ok ? "rgba(34,197,94,.55)" : "rgba(239,68,68,.55)"}`;
    dot.style.animation = "none";
    // re-trigger animation
    void dot.offsetHeight;
    dot.style.animation = "statusPulse 1.2s ease-in-out infinite";

    // update keyframe glow color by overriding with filter (simple + clean)
    dot.style.filter = ok ? "none" : "saturate(1.2)";
  };

  let i = 0;
  const tick = () => {
    const s = states[i % states.length];
    line.textContent = s.text;
    setDot(s.ok);
    i++;
  };

  tick();
  setInterval(tick, 3500);
})();








/* =========================
   HEARTBEAT MONITOR (ECG canvas)
========================= */
(() => {
  const canvas = document.getElementById("hbCanvas");
  const bpmEl = document.getElementById("hbBpm");
  const statusEl = document.getElementById("hbStatus");
  if (!canvas || !bpmEl || !statusEl) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // DevicePixelRatio for sharp canvas
  const setupCanvas = () => {
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const cssW = canvas.clientWidth || 820;
    const cssH = 180;
    canvas.style.height = cssH + "px";
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  setupCanvas();
  window.addEventListener("resize", setupCanvas);

  // ECG buffer
  const H = () => 180;
  const W = () => (canvas.clientWidth || 820);

  let bpm = 92;
  let targetBpm = 92;
  let lastBpmChange = 0;

  // Rolling signal values (y offsets)
  let x = 0;
  const points = [];
  const maxPoints = 900;

  // Generate one ECG-ish sample for current phase
  let phase = 0; // 0..1 within beat
  const nextSample = (dt) => {
    const beatDur = 60 / Math.max(40, Math.min(180, bpm)); // seconds per beat
    phase += dt / beatDur;
    if (phase >= 1) phase -= 1;

    // baseline noise
    let v = (Math.random() - 0.5) * 0.06;

    // simple ECG shape:
    // P wave
    if (phase > 0.08 && phase < 0.12) v += 0.15 * Math.sin(((phase - 0.08) / 0.04) * Math.PI);
    // Q dip
    if (phase > 0.18 && phase < 0.20) v -= 0.35;
    // R spike
    if (phase > 0.20 && phase < 0.215) v += 1.15;
    // S dip
    if (phase > 0.215 && phase < 0.235) v -= 0.55;
    // T wave
    if (phase > 0.34 && phase < 0.44) v += 0.22 * Math.sin(((phase - 0.34) / 0.10) * Math.PI);

    // occasional “glitch/irregularity”
    if (Math.random() < 0.003) v += (Math.random() < 0.5 ? -1 : 1) * 0.6;

    return v;
  };

  const lerp = (a, b, t) => a + (b - a) * t;

  const drawGrid = (w, h) => {
    ctx.save();
    ctx.clearRect(0, 0, w, h);

    // background subtle
    ctx.globalAlpha = 1;
    ctx.fillStyle = "rgba(255,255,255,.02)";
    ctx.fillRect(0, 0, w, h);

    // grid
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "rgba(255,255,255,.06)";
    ctx.lineWidth = 1;

    const step = 22;
    for (let gx = 0; gx <= w; gx += step) {
      ctx.beginPath();
      ctx.moveTo(gx + 0.5, 0);
      ctx.lineTo(gx + 0.5, h);
      ctx.stroke();
    }
    for (let gy = 0; gy <= h; gy += step) {
      ctx.beginPath();
      ctx.moveTo(0, gy + 0.5);
      ctx.lineTo(w, gy + 0.5);
      ctx.stroke();
    }

    // stronger grid lines
    ctx.strokeStyle = "rgba(255,255,255,.10)";
    const big = step * 5;
    for (let gx = 0; gx <= w; gx += big) {
      ctx.beginPath();
      ctx.moveTo(gx + 0.5, 0);
      ctx.lineTo(gx + 0.5, h);
      ctx.stroke();
    }
    for (let gy = 0; gy <= h; gy += big) {
      ctx.beginPath();
      ctx.moveTo(0, gy + 0.5);
      ctx.lineTo(w, gy + 0.5, h);
      ctx.lineTo(w, gy + 0.5);
      ctx.stroke();
    }
    ctx.restore();
  };

  const drawWave = (w, h) => {
    const mid = h * 0.55;
    const amp = h * 0.34;

    // glow stroke
    ctx.save();
    ctx.lineWidth = 2.2;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#3B82F6";

    // small glow
    ctx.shadowColor = ctx.strokeStyle;
    ctx.shadowBlur = 12;

    ctx.beginPath();
    for (let i = 0; i < points.length; i++) {
      const px = points[i].x;
      const py = mid - points[i].v * amp;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();

    // scan line (right edge)
    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = "rgba(255,255,255,.18)";
    ctx.fillRect(w - 18, 0, 18, h);
    ctx.restore();
  };

  const updateStatus = () => {
    // Make it “scary” but subtle
    const scary = [
      "signal: unstable",
      "signal: contaminated",
      "signal: heartbeat detected",
      "signal: do not panic",
      "signal: someone is here",
      "signal: irregular rhythm",
    ];
    statusEl.textContent = scary[Math.floor(Math.random() * scary.length)];
  };

  // BPM changes slowly to feel alive
  const maybeChangeBpm = (t) => {
    if (t - lastBpmChange < 2200) return;
    lastBpmChange = t;

    // drift target between 70 and 140
    targetBpm = 70 + Math.random() * 70;

    // sometimes spikes
    if (Math.random() < 0.12) targetBpm = 135 + Math.random() * 25;

    updateStatus();
  };

  let last = performance.now();
  const loop = (t) => {
    const dt = Math.min(0.05, (t - last) / 1000);
    last = t;

    maybeChangeBpm(t);
    bpm = lerp(bpm, targetBpm, 0.015);

    const w = W();
    const h = H();

    // advance x and add samples
    const speed = 240 * dt; // px per second (feel free to tweak)
    x += speed;

    // add multiple samples if needed for smoothness
    const samples = Math.max(1, Math.floor(speed / 2));
    for (let i = 0; i < samples; i++) {
      const v = nextSample(dt / samples);
      points.push({ x: x + i * 2, v });
    }

    // normalize to screen: shift points left when x exceeds width
    if (x > w) {
      const shift = x - w;
      for (let p of points) p.x -= shift;
      x = w;

      // drop offscreen points
      while (points.length && points[0].x < -10) points.shift();
    }

    // keep buffer small
    if (points.length > maxPoints) points.splice(0, points.length - maxPoints);

    drawGrid(w, h);
    drawWave(w, h);

    bpmEl.textContent = `${Math.round(bpm)} bpm`;
    requestAnimationFrame(loop);
  };

  requestAnimationFrame(loop);
})();
