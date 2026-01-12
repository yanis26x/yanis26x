// --- Theme handling (persist + toggle) ---
const root = document.documentElement;
const THEME_KEY = "contact-theme";

function applyTheme(theme){
  if (theme !== "light" && theme !== "dark") return;
  root.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);

  const label = document.querySelector(".toggle-label");
  if (label) label.textContent = theme === "light" ? "Dark" : "Light";

  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) metaTheme.setAttribute("content", theme === "light" ? "#ffffff" : "#0a2472");
}

// init theme (LS -> OS -> default dark)
(function initTheme(){
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light" || saved === "dark") {
    applyTheme(saved);
    return;
  }
  const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  applyTheme(prefersLight ? "light" : "dark");
})();

document.getElementById("themeToggle")?.addEventListener("click", () => {
  const current = root.getAttribute("data-theme") === "light" ? "light" : "dark";
  applyTheme(current === "light" ? "dark" : "light");
});


// ---- Toast helper ----
const toast = document.getElementById("toast");
let toastTimer = null;

function showToast(text = "Copié ✅"){
  if (!toast) return;
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1300);
}


// ---- Copy email ----
const EMAIL = "yanis26x@gmail.com"; // <-- change si besoin

async function copyEmail(){
  try{
    await navigator.clipboard.writeText(EMAIL);
    showToast(i18n[currentLang].toastEmailCopied);
  }catch(e){
    showToast(i18n[currentLang].toastCopyFail);
  }
}

document.getElementById("copyEmailBtn")?.addEventListener("click", copyEmail);
document.getElementById("copyEmailCard")?.addEventListener("click", copyEmail);


// ---- Language toggle (FR <-> EN) ----
const LANG_KEY = "contact-lang";

const i18n = {
  fr: {
    back: "Retour",
    contactTitle: "Contact",
    heroText: "<b>@yanis26x</b> on all social",
    followMe: "Me suivre",
    copyEmailBtn: "Copier mon email",
    followTitle: "Follow",
    followSub: "Tout est ici",
    igSub: "@yanis26x",
    liSub: "Yanis Djenadi",
    emailSub: "Cliquer pour copier",
    musicTitle: "Music",
    musicSub: "Playlist du moment",
    toastEmailCopied: "Email copié ✅",
    toastCopyFail: "Impossible de copier",
    langLabel: "EN",
    docLang: "fr",
    ariaLang: "Changer la langue",
    presenceTitle: "En ligne"
  },
  en: {
    back: "Back",
    contactTitle: "Contact",
    heroText: "<b>@yanis26x</b> on all social",
    followMe: "Follow me",
    copyEmailBtn: "Copy my email",
    followTitle: "Follow",
    followSub: "Everything is here",
    igSub: "@yanis26x",
    liSub: "Yanis Djenadi",
    emailSub: "Click to copy",
    musicTitle: "Music",
    musicSub: "Current playlist",
    toastEmailCopied: "Email copied ✅",
    toastCopyFail: "Couldn’t copy",
    langLabel: "FR",
    docLang: "en",
    ariaLang: "Switch language",
    presenceTitle: "Online"
  }
};

let currentLang = "fr";

function setLang(lang){
  if (!i18n[lang]) return;
  currentLang = lang;

  root.setAttribute("data-lang", lang);
  document.documentElement.lang = i18n[lang].docLang;
  localStorage.setItem(LANG_KEY, lang);

  // update lang button label
  const langLabel = document.querySelector(".lang-label");
  if (langLabel) langLabel.textContent = i18n[lang].langLabel;

  // update aria-label
  const langBtn = document.getElementById("langToggle");
  if (langBtn) langBtn.setAttribute("aria-label", i18n[lang].ariaLang);

  // update all i18n nodes
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const val = i18n[lang][key];
    if (val == null) return;

    // allow HTML for heroText
    if (key === "heroText") el.innerHTML = val;
    else el.textContent = val;
  });

  // presence dot tooltip
  const presence = document.querySelector(".presence");
  if (presence) presence.setAttribute("title", i18n[lang].presenceTitle);
}

// init lang
(function initLang(){
  const saved = localStorage.getItem(LANG_KEY);
  setLang(saved === "en" ? "en" : "fr");
})();

document.getElementById("langToggle")?.addEventListener("click", () => {
  setLang(currentLang === "fr" ? "en" : "fr");
});


// ---- Tiny parallax on background glows ----
const g1 = document.querySelector(".g1");
const g2 = document.querySelector(".g2");
const g3 = document.querySelector(".g3");

window.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth) - 0.5;
  const y = (e.clientY / window.innerHeight) - 0.5;

  if (g1) g1.style.transform = `translate(${x * 18}px, ${y * 18}px)`;
  if (g2) g2.style.transform = `translate(${x * -14}px, ${y * 14}px)`;
  if (g3) g3.style.transform = `translate(${x * 10}px, ${y * -10}px)`;
});
