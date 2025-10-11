// ---- Apparitions / Stagger ----
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const el = entry.target;
    if (entry.isIntersecting){
      el.classList.add('in-view');
      if (el.dataset.animate === 'stagger'){
        el.querySelectorAll('.g-item').forEach(item => item.classList.add('in'));
      }
      io.unobserve(el);
    }
  });
}, {threshold: 0.18});

document.querySelectorAll('[data-animate]').forEach(el => io.observe(el));

// ---- Lightbox ----
const figures = [...document.querySelectorAll('.g-item')];
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImage');
const lbTitle = document.getElementById('lbTitle');
const lbDesc = document.getElementById('lbDesc');
const lbClose = document.getElementById('lbClose');
const lbPrev = document.getElementById('lbPrev');
const lbNext = document.getElementById('lbNext');
const lbBackdrop = document.getElementById('lbBackdrop');

let currentIndex = -1;

function openLightbox(index){
  const fig = figures[index];
  if(!fig) return;
  const img = fig.querySelector('img');
  const caption = fig.querySelector('figcaption')?.textContent || '';
  const desc = fig.dataset.desc || '';

  lbImg.src = img.src;
  lbImg.alt = caption;
  lbTitle.textContent = caption;
  lbDesc.textContent = desc;

  lb.classList.add('open');
  lb.setAttribute('aria-hidden','false');
  currentIndex = index;
}

function closeLightbox(){
  lb.classList.remove('open');
  lb.setAttribute('aria-hidden','true');
  currentIndex = -1;
}

function prevImage(){
  if (currentIndex <= 0) currentIndex = figures.length;
  openLightbox(currentIndex - 1);
}
function nextImage(){
  if (currentIndex >= figures.length - 1) currentIndex = -1;
  openLightbox(currentIndex + 1);
}

// clics sur images
figures.forEach((fig, i) => {
  fig.addEventListener('click', () => openLightbox(i));
});

// boutons
lbClose.addEventListener('click', closeLightbox);
lbBackdrop.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', prevImage);
lbNext.addEventListener('click', nextImage);

// touches clavier
window.addEventListener('keydown', (e) => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') prevImage();
  if (e.key === 'ArrowRight') nextImage();
});
