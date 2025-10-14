// Année dynamique
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Reveal on scroll
const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal, .card.reveal').forEach((el) => observer.observe(el));

// Fermer le menu mobile au clic
const navToggle = document.getElementById('nav-toggle');
document.querySelectorAll('.menu a').forEach(a =>
  a.addEventListener('click', () => { if (navToggle) navToggle.checked = false; })
);
