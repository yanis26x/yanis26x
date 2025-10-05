/* ===========================
   Portfolio Yanis — script.js
   =========================== */

/* 1) Année dynamique (footer) */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* 2) Burger menu + fermeture au clic lien */
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");

if (burger && nav) {
  const toggleNav = () => {
    const open = !nav.classList.contains("open");
    nav.classList.toggle("open");
    burger.setAttribute("aria-expanded", String(open));
  };
  burger.addEventListener("click", toggleNav);

  // Ferme le menu sur clic d'un lien
  nav.querySelectorAll("[data-link]").forEach(a => {
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    });
  });
}

/* 3) Smooth scroll pour liens internes */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    const id = a.getAttribute("href");
    if (!id || id === "#") return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

/* 4) Observer d’apparition (sections + stagger) */
const io = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");

        // Remplissage des barres quand la section Compétences devient visible
        if (entry.target.id === "skills") {
          document.querySelectorAll(".bar-fill[data-progress]").forEach(fill => {
            const pct = parseInt(fill.getAttribute("data-progress"), 10) || 0;
            fill.style.width = pct + "%";
          });
        }
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll("[data-animate]").forEach(el => io.observe(el));

/* 5) Nav active + indicateur animé sous l’onglet */
const navLinks = document.querySelectorAll(".nav [data-link]");
const indicator = document.querySelector(".nav-indicator");

function setActiveLink(hash) {
  let active = null;
  navLinks.forEach(link => {
    if (link.getAttribute("href") === hash) {
      link.classList.add("is-active");
      active = link;
    } else {
      link.classList.remove("is-active");
    }
  });

  if (indicator && active) {
    const { left, width } = active.getBoundingClientRect();
    const navLeft = active.parentElement.getBoundingClientRect().left;
    indicator.style.width = `${width}px`;
    indicator.style.transform = `translateX(${left - navLeft}px)`;
    indicator.style.opacity = "1";
  }
}

// Observer pour savoir quelle section est dans le viewport
const sections = [...document.querySelectorAll("section[id]")];
const sectionIO = new IntersectionObserver(
  entries => {
    // On choisit l’entrée la plus visible
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) setActiveLink(`#${visible.target.id}`);
  },
  { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] }
);
sections.forEach(s => sectionIO.observe(s));

// Recalcule la position de l’indicateur au resize
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const current = document.querySelector(".nav a.is-active");
    if (current) setActiveLink(current.getAttribute("href"));
  }, 120);
});

/* 6) Effet tilt léger sur .fx-tilt (cartes projets) + halo de souris */
const tiltCards = document.querySelectorAll(".fx-tilt");
tiltCards.forEach(card => {
  const damp = 10; // plus grand = tilt plus doux
  card.addEventListener("mousemove", e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // position dans la carte
    const y = e.clientY - rect.top;

    // Pour l’effet halo (CSS :after utilise --mx/--my)
    const mx = (x / rect.width) * 100;
    const my = (y / rect.height) * 100;
    card.style.setProperty("--mx", `${mx}%`);
    card.style.setProperty("--my", `${my}%`);

    // Tilt (rotation légère)
    const ry = ((x - rect.width / 2) / rect.width) * (damp * -1);
    const rx = ((y - rect.height / 2) / rect.height) * (damp * 1);
    card.style.setProperty("--rx", `${rx}deg`);
    card.style.setProperty("--ry", `${ry}deg`);
  }, { passive: true });

  card.addEventListener("mouseleave", () => {
    card.style.setProperty("--rx", `0deg`);
    card.style.setProperty("--ry", `0deg`);
    card.style.setProperty("--mx", `50%`);
    card.style.setProperty("--my", `50%`);
  });
});

/* 7) Effet “magnetic” sur boutons (.fx-magnetic) */
document.querySelectorAll(".fx-magnetic").forEach(el => {
  el.addEventListener("mousemove", e => {
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--mx", `${x}%`);
    el.style.setProperty("--my", `${y}%`);
  }, { passive: true });

  el.addEventListener("mouseleave", () => {
    el.style.setProperty("--mx", `50%`);
    el.style.setProperty("--my", `50%`);
  });
});

/* 8) Spotlight sur .project cards (déjà piloté par --mx/--my via :after) */
document.querySelectorAll(".project").forEach(card => {
  card.addEventListener("mousemove", e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    card.style.setProperty("--mx", `${x}%`);
    card.style.setProperty("--my", `${y}%`);
  }, { passive: true });

  card.addEventListener("mouseleave", () => {
    card.style.setProperty("--mx", `50%`);
    card.style.setProperty("--my", `50%`);
  });
});

/* 9) Accessibilité : si prefers-reduced-motion, désactive quelques trucs JS */
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (prefersReduced) {
  // remplir directement les barres
  document.querySelectorAll(".bar-fill[data-progress]").forEach(fill => {
    const pct = parseInt(fill.getAttribute("data-progress"), 10) || 0;
    fill.style.width = pct + "%";
  });
  // tout rendre visible sans observers
  document.querySelectorAll("[data-animate]").forEach(el => el.classList.add("in-view"));
}
