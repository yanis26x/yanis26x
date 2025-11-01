/* app.js — affichage instantané (pas de reveal), switch FR/EN, titre dynamique, UX */
(function () {
  const $  = (s, r = document) => r.querySelector(s);

  const sectionFr = $('#section-fr');
  const sectionEn = $('#section-en');
  const heroFr    = $('#hero-fr');
  const heroEn    = $('#hero-en');
  const backToTop = $('#back-to-top');
  const yearEl    = $('#year');

  // Footer year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Motion pref (pour scroll-to-top)
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Lang init
  const saved    = localStorage.getItem('qibla_privacy_lang');
  const fromHash = location.hash.replace('#','');
  const initial  = (fromHash === 'fr' || fromHash === 'en') ? fromHash : (saved || 'fr');
  setLang(initial);

  // ---- Events
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-lang]');
    if (!btn) return;
    const lang = btn.getAttribute('data-lang');
    if (lang === 'fr' || lang === 'en') setLang(lang);
  });

  backToTop?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  window.addEventListener('hashchange', () => {
    const l = location.hash.replace('#','');
    if (l === 'fr' || l === 'en') setLang(l);
  });

  /**
   * LANGUAGE (affichage instantané)
   */
  function setLang(lang) {
    const isFr = lang === 'fr';

    // Toggle sections + heroes
    if (sectionFr) sectionFr.hidden = !isFr;
    if (heroFr)    heroFr.hidden    = !isFr;
    if (sectionEn) sectionEn.hidden =  isFr;
    if (heroEn)    heroEn.hidden    =  isFr;

    // Boutons
    const btnFr = $('#btn-fr'); const btnEn = $('#btn-en');
    btnFr?.setAttribute('data-lang','fr');
    btnEn?.setAttribute('data-lang','en');
    btnFr?.setAttribute('aria-pressed', String(isFr));
    btnEn?.setAttribute('aria-pressed', String(!isFr));

    // Titre d'onglet dynamique
    document.title = isFr
      ? 'Politique de Confidentialité — Qibla+'
      : 'Privacy Policy — Qibla+';

    // Persist & hash
    document.documentElement.lang = lang;
    localStorage.setItem('qibla_privacy_lang', lang);
    if (location.hash.replace('#','') !== lang) {
      history.replaceState(null, '', `#${lang}`);
    }

    // Afficher instantané (on nettoie les éventuelles classes d'anim)
    showInstant(isFr ? heroFr : heroEn);
    showInstant(isFr ? sectionFr : sectionEn);
  }

  /**
   * Affiche immédiatement tous les éléments potentiellement marqués .fade-in / .fade-up
   */
  function showInstant(root) {
    if (!root) return;
    root.querySelectorAll('.fade-in, .fade-up, [data-fade]').forEach(el => {
      el.classList.remove('fade-in', 'fade-up', 'delay-1', 'delay-2', 'delay-3', 'delay-4');
      el.removeAttribute('data-fade');
      el.removeAttribute('data-delay');
      el.style.opacity = '';
      el.style.transform = '';
      el.style.animation = 'none'; // coupe toute anim CSS résiduelle
      // Force reflow puis retire pour ne pas bloquer d'autres anims (sheen)
      // eslint-disable-next-line no-unused-expressions
      el.offsetWidth;
      el.style.animation = '';
    });
  }

  // Affichage instantané dès le premier rendu (aucun reveal)
  showInstant(document);

})();
