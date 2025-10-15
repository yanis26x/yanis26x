// Expand / collapse des projets
document.querySelectorAll('.project.card.collapsible').forEach(card => {
  const btn = card.querySelector('.expand-btn');
  const content = card.querySelector('.collapsible-content');
  if (!btn || !content) return;

  btn.addEventListener('click', () => {
    const isOpen = card.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(isOpen));

    // Animation douce (auto height)
    if (isOpen) {
      content.style.maxHeight = content.scrollHeight + 'px';
      content.style.opacity = '1';
      setTimeout(() => (content.style.maxHeight = ''), 500);
    } else {
      content.style.maxHeight = content.scrollHeight + 'px';
      requestAnimationFrame(() => {
        content.style.maxHeight = '0px';
        content.style.opacity = '0';
      });
    }
  });
});

// Smooth scroll pour "Comment installer"
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
