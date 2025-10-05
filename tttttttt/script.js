// burger menu
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");
burger?.addEventListener("click", () => nav.classList.toggle("open"));

// année dynamique footer
document.getElementById("year").textContent = new Date().getFullYear();

// smooth scroll (petit plus)
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener("click", e=>{
    const id = a.getAttribute("href");
    if(!id || id === "#") return;
    const el = document.querySelector(id);
    if(!el) return;
    e.preventDefault();
    nav?.classList.remove("open");
    el.scrollIntoView({ behavior:"smooth", block:"start" });
  })
});
