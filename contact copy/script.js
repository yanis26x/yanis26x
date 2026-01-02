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

// ---- Copy actions ----
// Mets ton vrai email ici :
const EMAIL = "yanis26x@gmail.com"; // <-- change si tu veux

// Mets ton vrai pseudo discord ici :
const DISCORD = "yanis26x"; // <-- change si besoin

document.getElementById("copyEmailBtn")?.addEventListener("click", async () => {
  try{
    await navigator.clipboard.writeText(EMAIL);
    showToast("Email copié ✅");
  }catch(e){
    showToast("Impossible de copier");
  }
});

document.getElementById("copyDiscordBtn")?.addEventListener("click", async () => {
  try{
    await navigator.clipboard.writeText(DISCORD);
    showToast("Discord copié ✅");
  }catch(e){
    showToast("Impossible de copier");
  }
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
